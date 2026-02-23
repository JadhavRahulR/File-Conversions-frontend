import { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import "./imgtoimg.css";

import DropzoneInput from "./DropzoneInput";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";

import DropboxFileInput from "./DropboxFileInput";
import DriveFileInput from "./DriveFileInput";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

export default function PngToAvifPage() {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(35);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [status, setStatus] = useState("");
  // 🔥 disable wasm streaming globally
  if (typeof WebAssembly === "object") {
    WebAssembly.instantiateStreaming = undefined;
  }

  // ✅ encoder ref
  const encodeRef = useRef(null);

  /* ================= LOAD AVIF WASM ================= */

  useEffect(() => {
    let mounted = true;

    // 🔥 force ArrayBuffer wasm loading
    if (typeof WebAssembly === "object") {
      WebAssembly.instantiateStreaming = undefined;
    }

    (async () => {
      const mod = await import("@jsquash/avif");
      if (!mounted) return;

      encodeRef.current = mod.encode;

      // 🔥 WARM-UP (runs once, small cost)
      const dummy = new ImageData(16, 16);
      await encodeRef.current(dummy, {
        cqLevel: 40,
        speed: 8,
      });
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ================= FILE INPUT ================= */

  const handleDropzoneFile = (input) => {
    const picked = input?.target?.files
      ? Array.from(input.target.files)
      : input instanceof File
        ? [input]
        : [];

    const pngs = picked.filter(
      (f) => f.type === "image/png" || /\.png$/i.test(f.name)
    );

    if (!pngs.length) return;

    setFiles((prev) => [...prev, ...pngs]);
    setPreviewUrl(URL.createObjectURL(pngs[0]));
  };

  const handleExternalFilePick = async (picked) => {
    const list = Array.isArray(picked) ? picked : [picked];
    const out = [];

    for (const item of list) {
      // Case 1: Already a File (rare but possible)
      if (item instanceof File) {
        out.push(item);
        continue;
      }

      // Case 2: Google Drive / Dropbox URL
      if (item?.url || item?.downloadUrl) {
        const res = await fetch(item.url || item.downloadUrl);
        const blob = await res.blob();

        if (!blob.type.includes("png")) continue;

        const file = new File(
          [blob],
          item.name || "image.png",
          { type: "image/png" }
        );

        out.push(file);
      }
    }

    if (!out.length) return;

    setFiles((prev) => [...prev, ...out]);

    // 🔥 THIS was missing / broken
    setPreviewUrl(URL.createObjectURL(out[0]));
  };

  /* ================= PNG → AVIF ================= */

  async function convertSingleToAvif(file) {
    if (!encodeRef.current) {
      throw new Error("AVIF encoder not loaded yet");
    }

    const bitmap = await createImageBitmap(file);

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const avifBuffer = await encodeRef.current(imageData, {
      cqLevel: 40, // 0–63 (lower = better)
      speed: 8,
    });

    return new Blob([avifBuffer], { type: "image/avif" });
  }

  /* ================= CONVERT ================= */

  const convertImages = async () => {
    if (!files.length) return;
    setProcessing(true);

    const zip = files.length > 1 ? new JSZip() : null;

    for (const file of files) {
      const blob = await convertSingleToAvif(file);
      const base = file.name.replace(/\.[^/.]+$/, "");

      if (zip) {
        zip.file(`${base}.avif`, blob);
      } else {
        const outFile = new File([blob], `${base}.avif`, {
          type: "image/avif",
        });

        setConvertedFile(outFile);

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = outFile.name;
        a.click();
      }
    }

    if (zip) {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipFile = new File([zipBlob], "png-to-avif.zip", {
        type: "application/zip",
      });

      setConvertedFile(zipFile);

      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipBlob);
      a.download = zipFile.name;
      a.click();
    }

    setProcessing(false);
  };

  useEffect(() => {
    return () => previewUrl && URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  /* ================= UI ================= */

  return (
    <>
      <Helmet>
        <title>PNG To AVIF | Convert Multiple PNG To AVIF Free Online</title>

        <meta
          name="description"
          content="Convert PNG images to AVIF online for free. Easily change PNG to AVIF with ultra-high compression, transparent background support, batch conversion, and instant download. No signup required."
        />

        <link
          rel="canonical"
          href="https://fileunivers.com/pngtoavif"
        />

        <meta name="robots" content="index, follow" />

        <meta
          name="keywords"
          content="png to avif, convert png to avif online, png to avif converter, png to avif free, png image converter, transparent png to avif, batch png to avif, compress png to avif"
        />
      </Helmet>

      <ScrollToTop />

      <div className="pagetitle">
        <h1>PNG To AVIF Converter – Convert Multiple PNG Images To AVIF Free</h1>

        <p className="intro-paragraph">
          Convert PNG images to AVIF format instantly using FileUnivers’s free PNG to AVIF
          converter. This tool allows you to compress PNG images into modern AVIF format
          while maintaining excellent image quality and transparent backgrounds. Upload
          single or multiple PNG files, control compression level, and download optimized
          AVIF images instantly — all processed locally in your browser with no signup,
          no installation, and no limits.
        </p>
      </div>

      <div className="imgtoimgcontainer">
        <div className="tool-container">
           <h2> PNG To AVIF Converter</h2>
          <input type="file" multiple accept=".png" onChange={handleDropzoneFile} />

          <DropzoneInput accept="image/png" multiple onFileAccepted={handleDropzoneFile} />

          <div className="external-inputs">
            <DriveFileInput onFilePicked={handleExternalFilePick} setStatus={setStatus} allowedTypes={[".png"]} />
            <DropboxFileInput onFilePicked={handleExternalFilePick} setStatus={setStatus} extensions={[".png"]} />
          </div>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="PNG preview"
              className="image-preview-box"
            />
          )}

          <label className="quality-slider">
            AVIF Quality ({quality})
            <input
              type="range"
              min="20"
              max="60"
              value={quality}
              onChange={(e) => setQuality(+e.target.value)}
            />
          </label>

          <button onClick={convertImages} disabled={processing} className="primary-btn">
            {processing ? "Converting..." : "Convert PNG to AVIF"}
          </button>

          {convertedFile && (
            <div className="save-actions">
              <SaveToGoogleDrive file={convertedFile} />
              <SaveToDropbox file={convertedFile} />
            </div>
          )}
        </div>
      </div>
      <section className="pngtojpg-content">

        <h2 className="pngtojpg-heading">
          Convert PNG to AVIF Online – High Compression with Superior Image Quality
        </h2>

        <p className="pngtojpg-paragraph">
          FileUnivers’s PNG to AVIF converter is a modern, high-performance online tool
          designed to convert PNG images into AVIF format instantly. AVIF is one of the
          most advanced image formats available today, offering dramatically smaller file
          sizes while preserving excellent image quality and transparency. With this tool,
          you can convert PNG images directly in your browser without uploading files to
          any server, ensuring complete privacy and fast performance.
        </p>

        <div className="resizeimg-img">
          <img src="png.png" alt="PNG Image" className="ConverterImgtwo" />
          <p style={{ textAlign: "center" }}>PNG Image</p>
        </div>

        <p className="pngtojpg-paragraph">
          PNG is a popular lossless image format widely used for graphics, logos, UI
          elements, and images with transparent backgrounds. However, PNG files are often
          very large in size, which can slow down websites and increase bandwidth usage.
          AVIF solves this problem by using advanced compression techniques based on the
          AV1 codec, reducing image size significantly without noticeable quality loss.
        </p>

        <h3 className="pngtojpg-subheading">Why Convert PNG to AVIF?</h3>

        <p className="pngtojpg-paragraph">
          Converting PNG to AVIF is ideal for website optimization, performance
          improvements, and modern web applications. AVIF images can be up to 50–70%
          smaller than PNG while maintaining sharp details, smooth gradients, and accurate
          colors. This makes AVIF perfect for faster page loading, improved SEO rankings,
          and better user experience.
        </p>

        <p className="pngtojpg-paragraph">
          Unlike older formats, AVIF supports transparency, HDR, and wide color gamut.
          This means your transparent PNG images can be converted to AVIF without losing
          alpha channel data. Logos, icons, and design assets remain crisp and clean while
          taking up far less storage space.
        </p>

        <h3 className="pngtojpg-subheading">Batch Convert Multiple PNG Files</h3>

        <p className="pngtojpg-paragraph">
          FileUnivers allows you to convert multiple PNG images to AVIF at once using
          batch conversion. Simply upload multiple files, choose compression settings,
          and download all converted AVIF images together. This feature is extremely
          useful for developers, designers, bloggers, and businesses managing large image
          libraries.
        </p>

        <p className="pngtojpg-paragraph">
          Since the conversion process runs entirely in your browser, there are no
          artificial upload limits. The only limitation depends on your device’s memory
          and performance. For smooth conversion, follow the recommended file size limits
          listed below.
        </p>

        <h3 className="pngtojpg-subheading">Recommended File Size Limits by Device</h3>

        <div className="pngtojpg-table-wrapper">
          <table className="pngtojpg-table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Total PNG Size</th>
                <th>Approx. Files</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mobile</td>
                <td>40–80 MB</td>
                <td>8–15 images</td>
              </tr>
              <tr>
                <td>Laptop (8 GB RAM)</td>
                <td>150–250 MB</td>
                <td>25–40 images</td>
              </tr>
              <tr>
                <td>Desktop (16 GB RAM)</td>
                <td>300–500 MB</td>
                <td>50–80 images</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="pngtojpg-subheading">
          Private, Secure, and Browser-Based PNG to AVIF Conversion
        </h3>

        <p className="pngtojpg-paragraph">
          FileUnivers prioritizes your privacy. Your PNG images are never uploaded to any
          server. All conversions happen locally in your browser using modern image
          processing APIs. This makes the tool safe for converting personal, confidential,
          or professional images without any risk of data leakage.
        </p>

        <p className="pngtojpg-paragraph">
          There is no need to install software or create an account. The PNG to AVIF
          converter works on Windows, macOS, Linux, Android, and iOS using any modern web
          browser.
        </p>

        <h3 className="pngtojpg-subheading">
          High Compression Without Visible Quality Loss
        </h3>

        <p className="pngtojpg-paragraph">
          AVIF is designed to deliver superior compression efficiency. FileUnivers ensures
          that converted AVIF images maintain sharp edges, accurate colors, and smooth
          gradients. While PNG is lossless, AVIF achieves smaller file sizes with visually
          indistinguishable quality for most use cases.
        </p>

        <section className="pngtojpg-faq">

          <h2 className="pngtojpg-faq-heading">
            Frequently Asked Questions (FAQ)
          </h2>

          <div className="pngtojpg-faq-item">
            <h3 className="pngtojpg-faq-question">
              Is PNG to AVIF conversion free?
            </h3>
            <p className="pngtojpg-faq-answer">
              Yes, FileUnivers’s PNG to AVIF converter is completely free with no limits,
              watermarks, or registration.
            </p>
          </div>

          <div className="pngtojpg-faq-item">
            <h3 className="pngtojpg-faq-question">
              Does AVIF support transparency?
            </h3>
            <p className="pngtojpg-faq-answer">
              Yes. AVIF fully supports transparency, and alpha channels from PNG files are
              preserved accurately.
            </p>
          </div>

          <div className="pngtojpg-faq-item">
            <h3 className="pngtojpg-faq-question">
              Are my images uploaded to a server?
            </h3>
            <p className="pngtojpg-faq-answer">
              No. All conversions happen locally in your browser for maximum privacy.
            </p>
          </div>

          <div className="pngtojpg-faq-item">
            <h3 className="pngtojpg-faq-question">
              Can I use AVIF images on websites?
            </h3>
            <p className="pngtojpg-faq-answer">
              Yes. AVIF is supported by most modern browsers and is ideal for website
              performance optimization.
            </p>
          </div>

        </section>

      </section>
    </>
  );
}