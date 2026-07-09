import { useState, useEffect } from "react";
import JSZip from "jszip";
import "./imgtoimg.css";

import DropzoneInput from "./DropzoneInput";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";

import DropboxFileInput from "./DropboxFileInput";
import DriveFileInput from "./DriveFileInput";
import DriveMediaInput from "./DriveMediaInput"
import DropboxMediaFileInput from "./DropboxMediaFileInput";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";
import { Link } from "react-router-dom";
import ProcessSection from "./ProcessSection"

export default function PngToWebpPage() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState("single"); // "single" | "multiple"
  const [quality, setQuality] = useState(0.9);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [status, setStatus] = useState("");

  /* ================= mode switch ================= */

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setFiles([]);
    setPreviewUrl(null);
    setConvertedFile(null);
  };

  /* ================= file handlers ================= */

  const handleDropzoneFile = (input) => {
    // input[type=file]
    if (input?.target?.files) {
      const selectedFiles = Array.from(input.target.files);
      const pngFiles = selectedFiles.filter(
        (file) => file.type === "image/png"
      );

      if (!pngFiles.length) return;

      if (mode === "single") {
        setFiles([pngFiles[0]]);
        setPreviewUrl(URL.createObjectURL(pngFiles[0]));
      } else {
        setFiles((prev) => [...prev, ...pngFiles]);
        setPreviewUrl(URL.createObjectURL(pngFiles[0]));
      }
      return;
    }

    // DropzoneInput
    if (input instanceof File) {
      if (input.type !== "image/png") return;

      if (mode === "single") {
        setFiles([input]);
      } else {
        setFiles((prev) => [...prev, input]);
      }
      setPreviewUrl(URL.createObjectURL(input));
    }
  };

  const handleExternalFilePick = async (picked) => {
    const pickedFiles = Array.isArray(picked) ? picked : [picked];
    const normalized = [];

    for (const item of pickedFiles) {
      if (item instanceof File) {
        if (/\.png$/i.test(item.name)) normalized.push(item);
        continue;
      }

      if (item?.url || item?.downloadUrl) {
        const res = await fetch(item.url || item.downloadUrl);
        const blob = await res.blob();

        if (!blob.type.includes("png")) continue;

        normalized.push(
          new File([blob], item.name || "image.png", { type: "image/png" })
        );
      }
    }

    if (!normalized.length) return;

    if (mode === "single") {
      setFiles([normalized[0]]);
      setPreviewUrl(URL.createObjectURL(normalized[0]));
    } else {
      setFiles((prev) => [...prev, ...normalized]);
      setPreviewUrl(URL.createObjectURL(normalized[0]));
    }
  };

  /* ================= image loader ================= */

  const loadImage = (file) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });

  /* ================= convert ================= */

  const convertImages = async () => {
    if (!files.length) return;
    setProcessing(true);

    const processOne = async (file, zip = null) => {
      const img = await loadImage(file);

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            const name = file.name.replace(/\.[^/.]+$/, "");

            if (zip) {
              zip.file(`${name}.webp`, blob);
            } else {
              const outFile = new File([blob], `${name}.webp`, {
                type: "image/webp",
              });

              setConvertedFile(outFile);

              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = outFile.name;
              a.click();
            }
            resolve();
          },
          "image/webp",
          quality
        );
      });
    };

    // single file
    if (files.length === 1) {
      await processOne(files[0]);
      setProcessing(false);
      return;
    }

    // multiple files → ZIP
    const zip = new JSZip();
    for (const file of files) await processOne(file, zip);

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipFile = new File([zipBlob], "png-to-webp.zip", {
      type: "application/zip",
    });

    setConvertedFile(zipFile);

    const a = document.createElement("a");
    a.href = URL.createObjectURL(zipBlob);
    a.download = zipFile.name;
    a.click();

    setProcessing(false);
  };

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [
    previewUrl,
  ]);

  /* ================= UI ================= */

  return (
    <>
      <Helmet>
        <title>PNG To WEBP | Convert Multiple PNG To WEBP Free Online</title>

        <meta
          name="description"
          content="Convert PNG images to WEBP online for free. Easily change PNG to WEBP with high compression, transparent background support, batch conversion, and instant download. No signup required."
        />

        <link
          rel="canonical"
          href="https://fileunivers.com/pngtowebp"
        />

        <meta name="robots" content="index, follow" />

        <meta
          name="keywords"
          content="png to webp, convert png to webp online, png to webp converter, png to webp free, png image converter, transparent png to webp, batch png to webp, compress png to webp"
        />
      </Helmet>

      <ScrollToTop />

      <div className="pagetitle">
        <h1>PNG To WEBP Converter – Convert Single or Multiple PNG Images To WEBP Free</h1>

        <p className="intro-paragraph">
          FileUnivers now gives you full control over how you convert your images with a simple
          Single / Multiple toggle option. Choose <strong>Single File</strong> mode when you only
          need to convert one PNG image at a time — perfect for quick, one-off conversions.
          Switch to <strong>Multiple Files</strong> mode when you're working with a batch of
          images, allowing you to select and upload several PNG files at once and download them
          together as a single ZIP archive. This flexible toggle makes the tool equally efficient
          for individual users and professionals handling bulk image conversions.
        </p>
      </div>

      <div className="imgtoimgcontainer">
        <div className="tool-container">
          <h2>
            {mode === "single"
              ? "Convert PNG Image To WEBP"
              : "Convert Multiple PNG Images To WEBP"}
          </h2>

          <div className="mode-toggle">
            <button
              type="button"
              className={mode === "single" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => handleModeChange("single")}
            >
              Single File
            </button>
            <button
              type="button"
              className={mode === "multiple" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => handleModeChange("multiple")}
            >
              Multiple Files
            </button>
          </div>

          <input
            type="file"
            multiple={mode === "multiple"}
            accept=".png"
            onChange={handleDropzoneFile}
          />

          <DropzoneInput
            accept="image/png"
            multiple={mode === "multiple"}
            onFileAccepted={handleDropzoneFile}
          />

          <div className="external-inputs">
            {mode === "single" ? (
              <>
                <DriveFileInput onFilePicked={handleExternalFilePick} setStatus={setStatus} allowedTypes={[".png"]} />
                <DropboxFileInput onFilePicked={handleExternalFilePick} setStatus={setStatus} extensions={[".png"]} />
              </>
            ) : (
              <>
                <DriveMediaInput onFilePicked={handleExternalFilePick} setStatus={setStatus} allowedTypes={[".png"]} />
                <DropboxMediaFileInput onFilePicked={handleExternalFilePick} setStatus={setStatus} extensions={[".png"]} />
              </>
            )}
          </div>

          {previewUrl && (
            <div className="pngtojpgimg">
              <img
                src={previewUrl}
                alt="preview"
                className="image-preview-box"
              />
            </div>
          )}

          <div className="controls">
            <label>
              Quality ({Math.round(quality * 100)}%)
              <input
                type="range"
                min="0.6"
                max="1"
                step="0.01"
                value={quality}
                onChange={(e) => setQuality(+e.target.value)}
              />
            </label>
          </div>

          <button
            className="primary-btn"
            onClick={convertImages}
            disabled={processing}
          >
            {processing ? "Converting..." : "Convert PNG to WEBP"}
          </button>

          {convertedFile && (
            <>
              <p>SAVE FILE TO : </p>
              <div className="save-actions">
                <SaveToGoogleDrive file={convertedFile} />
                <SaveToDropbox file={convertedFile} />
              </div>
            </>
          )}
        </div>
      </div>

      <section className="pngtojpg-content">

        <h2 className="pngtojpg-heading">
          Convert WEBP to PNG Online – Fast, Free & Lossless Quality
        </h2>

        <p className="pngtojpg-paragraph">
          FileUnivers’s WEBP to PNG converter is a powerful and reliable online tool that
          allows you to convert WEBP images into high-quality PNG format instantly.
          Whether you are working with website images, downloaded assets, or modern
          compressed graphics, this tool lets you convert files directly in your browser
          without uploading them to any server. The entire conversion process happens
          locally on your device, ensuring maximum privacy, security, and speed.
        </p>

        <div className="resizeimg-img">
          <img src="webp.png" alt="WEBP Image" className="ConverterImgtwo" />
          <p style={{ textAlign: "center" }}>WEBP Image</p>
        </div>

        <p className="pngtojpg-paragraph">
          WEBP is a modern image format developed to reduce image size while maintaining
          good visual quality. It is widely used on websites to improve loading speed and
          performance. However, WEBP is not always supported by older software, image
          editors, or certain platforms. PNG, on the other hand, is a universally supported
          lossless image format that preserves every detail and supports transparent
          backgrounds. By converting WEBP to PNG, you ensure maximum compatibility and
          image quality across all devices and applications.
        </p>

        <ProcessSection />

        <div className="converter-section">

          <h2>Also check other features Related to PDF and Image file  </h2>
          <div className="unzipPagelink">

            <li><Link to="/word-to-pdf" className='btn' >Word to PDF Converter </Link></li>
            <li><Link to="/pdf-to-word" className='btn'>PDF to Word Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >odt to pdf Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >txt to pdf Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > pptx to pdf  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > rtf to pdf Converter </Link></li>
            <li><Link to="/html-to-pdf" className='btn' > html to pdf Converter </Link></li>
            <li><Link to="/md-to-pdf" className='btn' > md  to pdf Converter </Link></li>
            <li><Link to="/xlsx-to-pdf" className='btn' > xlsx  to pdf Converter </Link></li>
            <li><Link to="/csv-to-pdf" className='btn' > csv to pdf Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' > pdf to odt Converter </Link></li>
            <li><Link to="/pdf-to-txt" className='btn' > pdf to txt Converter </Link></li>
            <li><Link to="/pdf-to-pptx" className='btn' > pdf to pptx Converter </Link></li>
             <li><Link to='/favicon-generator' className='btn' >Favicon Generator</Link></li>
            <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
            <li><Link to="/tiffcompressor" className='btn' > Compress Tiff  </Link></li>
            <li><Link to="/merge-pdf" className='btn' > Merge PDF  </Link></li>

            <Link></Link>
          </div>
        </div>
        <h3 className="pngtojpg-subheading">Why Convert WEBP to PNG?</h3>

        <p className="pngtojpg-paragraph">
          There are many practical reasons to convert WEBP images to PNG format. While
          WEBP is excellent for web optimization, it can cause issues when editing images
          in graphic design software or uploading files to platforms that do not fully
          support the WEBP format. PNG is widely accepted across design tools, operating
          systems, and online services, making it the preferred choice for editing,
          printing, and long-term storage.
        </p>

        <p className="pngtojpg-paragraph">
          PNG also supports transparency without any quality loss. If your WEBP image
          contains transparent areas, converting it to PNG ensures that transparency is
          preserved accurately. This makes PNG ideal for logos, icons, UI elements, and
          graphics that require clean edges and precise visual details.
        </p>

        <h3 className="pngtojpg-subheading">Convert Multiple WEBP Files at Once</h3>

        <p className="pngtojpg-paragraph">
          FileUnivers supports batch conversion, allowing you to convert multiple WEBP
          images to PNG in a single process. This feature is especially useful for web
          developers, designers, and content creators who work with large image libraries.
          Instead of converting images one by one, you can upload multiple WEBP files and
          download all converted PNG images together in a single ZIP archive.
        </p>

        <p className="pngtojpg-paragraph">
          Because the WEBP to PNG conversion runs entirely in your browser using modern
          JavaScript and Canvas technology, there is no fixed limit on the number of files
          you can upload. The only limitation depends on your device’s memory and
          performance. For the best experience, we recommend staying within the suggested
          file size limits listed below.
        </p>

        <h3 className="pngtojpg-subheading">Recommended File Size Limits by Device</h3>

        <div className="pngtojpg-table-wrapper">
          <table className="pngtojpg-table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Total WEBP Size (together)</th>
                <th>Approx. Files</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mobile</td>
                <td>50–100 MB</td>
                <td>10–20 images</td>
              </tr>
              <tr>
                <td>Laptop (8 GB RAM)</td>
                <td>200–300 MB</td>
                <td>30–50 images</td>
              </tr>
              <tr>
                <td>Desktop (16 GB RAM)</td>
                <td>400–600 MB</td>
                <td>60–100 images</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="pngtojpg-paragraph">
          These recommendations help prevent browser slowdowns or memory issues during
          conversion. Each WEBP image must be decoded, processed on a canvas, and
          re-encoded as a PNG file, which requires additional memory. Staying within these
          limits ensures smooth and stable performance.
        </p>

        <h3 className="pngtojpg-subheading">
          Safe, Private, and Browser-Based WEBP to PNG Conversion
        </h3>

        <p className="pngtojpg-paragraph">
          One of the biggest advantages of using FileUnivers’s WEBP to PNG converter is
          privacy. Your images are never uploaded to any server. All conversions take
          place locally in your browser, which means your files remain on your device at
          all times. This makes the tool ideal for converting confidential, personal, or
          professional images without any privacy concerns.
        </p>

        <p className="pngtojpg-paragraph">
          Since the tool is fully browser-based, there is no need to install any software
          or create an account. You can use the WEBP to PNG converter on Windows, macOS,
          Linux, Android, and iOS devices. Any modern web browser is sufficient to convert
          images instantly.
        </p>

        <h3 className="pngtojpg-subheading">
          Lossless PNG Output with Maximum Image Quality
        </h3>

        <p className="pngtojpg-paragraph">
          PNG is a lossless image format, which means no image data is discarded during
          conversion. FileUnivers ensures that every pixel from the original WEBP image is
          preserved as accurately as possible in the PNG output. This makes the converted
          PNG files perfect for image editing, printing, archiving, and professional
          design workflows.
        </p>

        <p className="pngtojpg-paragraph">
          Whether you need to convert a single WEBP image to PNG or process dozens of files
          in bulk, FileUnivers provides a fast, reliable, and completely free solution.
          With no limits, no watermarks, and no registration required, it is the perfect
          tool for everyday image conversion needs.
        </p>

        <section className="pngtojpg-faq">

          <h2 className="pngtojpg-faq-heading">
            Frequently Asked Questions (FAQ)
          </h2>

          <div className="pngtojpg-faq-item">
            <h3 className="pngtojpg-faq-question">
              Is this WEBP to PNG converter free to use?
            </h3>
            <p className="pngtojpg-faq-answer">
              Yes, the WEBP to PNG converter is completely free. You can convert unlimited
              WEBP images to PNG without any cost, watermarks, or registration.
            </p>
          </div>

          <div className="pngtojpg-faq-item">
            <h3 className="pngtojpg-faq-question">
              Are my WEBP images uploaded to a server?
            </h3>
            <p className="pngtojpg-faq-answer">
              No. All conversions happen directly in your browser. Your images are never
              uploaded or stored on any server, ensuring full privacy.
            </p>
          </div>

          <div className="pngtojpg-faq-item">
            <h3 className="pngtojpg-faq-question">
              Does PNG support transparency?
            </h3>
            <p className="pngtojpg-faq-answer">
              Yes. PNG fully supports transparent backgrounds. If your WEBP image contains
              transparency, it will be preserved accurately in the PNG output.
            </p>
          </div>

          <div className="pngtojpg-faq-item">
            <h3 className="pngtojpg-faq-question">
              Will image quality change after conversion?
            </h3>
            <p className="pngtojpg-faq-answer">
              PNG is a lossless format, so no additional quality loss occurs during
              conversion. However, details lost in the original WEBP compression cannot be
              restored.
            </p>
          </div>

          <div className="pngtojpg-faq-item">
            <h3 className="pngtojpg-faq-question">
              Can I use this tool on mobile devices?
            </h3>
            <p className="pngtojpg-faq-answer">
              Yes, the WEBP to PNG converter works on mobile phones, tablets, laptops, and
              desktops with any modern web browser.
            </p>
          </div>

        </section>

      </section>
    </>
  );
}