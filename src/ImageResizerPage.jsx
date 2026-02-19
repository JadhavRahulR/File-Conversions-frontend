import { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import * as UTIF from "utif";
import "./ImageResizer.css";
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";
import DropboxFileInput from "./DropboxFileInput";
import DriveFileInput from "./DriveFileInput";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";


export default function ImageResizerPage() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState("dimension");
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  const [percent, setPercent] = useState(50);
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.9);
  const [dpi, setDpi] = useState(92);
  const [bg, setBg] = useState("#ffffff");
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState("");

  const [convertedFile, setConvertedFile] = useState(null);



  // ✅ INTERNAL PIXEL STORAGE (IMPORTANT)
  const pxRef = useRef({ w: 400, h: 400 });

  /* ================== unit helpers ================== */
  const pxToCm = (px) => +(px * 2.54 / dpi).toFixed(2);
  const pxToIn = (px) => +(px / dpi).toFixed(2);
  const cmToPx = (cm) => Math.round((cm * dpi) / 2.54);
  const inToPx = (inch) => Math.round(inch * dpi);

  /* ================= files ================= */
  const handleDropzoneFile = (file) => {
    setFiles((prev) => [...prev, file]);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...(Array.isArray(prev) ? prev : []), ...selected]);
  };


  /* ================= image loader (TIFF supported) ================= */
  const loadImageSource = async (file) => {
    if (/\.(tif|tiff)$/i.test(file.name)) {
      const buffer = await file.arrayBuffer();
      const ifds = UTIF.decode(buffer);
      const ifd = ifds[0];
      UTIF.decodeImage(buffer, ifd);

      const rgba = UTIF.toRGBA8(ifd);
      const canvas = document.createElement("canvas");
      canvas.width = ifd.width;
      canvas.height = ifd.height;

      const ctx = canvas.getContext("2d");
      ctx.putImageData(
        new ImageData(new Uint8ClampedArray(rgba), ifd.width, ifd.height),
        0,
        0
      );
      return canvas;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  /* ================= resize ================= */
  const resizeImages = async () => {
    if (!files.length) return;
    setProcessing(true);

    const processOne = async (file, zip = null) => {
      const source = await loadImageSource(file);

      let newW = pxRef.current.w;
      let newH = pxRef.current.h;

      if (mode === "percent") {
        newW = Math.round((source.width * percent) / 100);
        newH = Math.round((source.height * percent) / 100);
      }

      const canvas = document.createElement("canvas");
      canvas.width = newW;
      canvas.height = newH;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, newW, newH);
      ctx.drawImage(source, 0, 0, newW, newH);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const ext = format.split("/")[1];
          const name = file.name.replace(/\.[^/.]+$/, "");
          if (zip) zip.file(`${name}-resized.${ext}`, blob);
          else {
            const outFile = new File(
              [blob],
              `${name}-resized.${ext}`,
              { type: format }
            );

            // ✅ store single resized image for Drive / Dropbox
            setConvertedFile(outFile);

            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = outFile.name;
            a.click();
          }
          resolve();
        }, format, quality);
      });
    };

    if (files.length === 1) {
      await processOne(files[0]);
      setProcessing(false);
      return;
    }

    const zip = new JSZip();
    for (const f of files) await processOne(f, zip);

    const zipBlob = await zip.generateAsync({ type: "blob" });

const zipFile = new File(
  [zipBlob],
  "resized-images.zip",
  { type: "application/zip" }
);

// ✅ store ZIP file for Drive / Dropbox
setConvertedFile(zipFile);

// optional auto-download (keep UX same)
const a = document.createElement("a");
a.href = URL.createObjectURL(zipBlob);
a.download = zipFile.name;
a.click();


    setProcessing(false);
  };

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);



  const handleExternalFilePick = async (picked) => {
    // If picker sends an array, loop it
    const pickedFiles = Array.isArray(picked) ? picked : [picked];

    const normalized = [];

    for (const item of pickedFiles) {
      // Already a real File
      if (item instanceof File) {
        normalized.push(item);
        continue;
      }

      // Drive file metadata
      if (item?.url || item?.downloadUrl) {
        const res = await fetch(item.url || item.downloadUrl);
        const blob = await res.blob();

        const file = new File([blob], item.name || "image", {
          type: blob.type || item.mimeType || "image/jpeg",
        });

        normalized.push(file);
      }
    }

    if (!normalized.length) return;

    setFiles((prev) => Array.isArray(prev) ? [...prev, ...normalized] : [...normalized]);

    const url = URL.createObjectURL(normalized[0]);
    setPreviewUrl(url);
  };

  // 🔥 normalize Drive / Dropbox / local files into real File objects
  const normalizeFile = async (pickedFile) => {
    // already a real File (Dropbox / input / dropzone)
    if (pickedFile instanceof File) {
      return pickedFile;
    }

    // Drive file (metadata object)
    if (pickedFile?.url || pickedFile?.downloadUrl) {
      const downloadUrl = pickedFile.url || pickedFile.downloadUrl;

      const res = await fetch(downloadUrl);
      const blob = await res.blob();

      return new File([blob], pickedFile.name || "image", {
        type: blob.type || pickedFile.mimeType || "image/jpeg",
      });
    }

    // fallback (ignore unsupported object)
    return null;
  };

  /* ================= UI ================= */
  return (
    <>

      <Helmet>
        <title>Image Resizer  | Resize Images Free Online</title>

        <meta
          name="description"
          content="Resize images online for free without losing quality. Easily change image dimensions, resize photos by pixels or percentage, and download instantly. No signup or installation required." />

        <link
          rel="canonical"
          href="https://fileunivers.com/imageresizer" />
        <meta name="robots" content="index, follow" />

        <meta
          name="keywords"
          content="image resizer, resize images online, image resizer free, resize image without losing quality, photo resizer, resize photos, image size reducer, online image resizer"
        />
      </Helmet>

      <ScrollToTop />

      <div className="pagetitle">
        <h1>Image Resizer Online – Resize Multiple Images Free </h1>

        <p className="intro-paragraph">
          Image Resizer Online is a fast, free, and easy-to-use tool that lets you resize
          images. Whether you need to change image dimensions,
          reduce image size, or resize photos for websites, social media, or mobile
          apps, this tool works directly in your browser. No software installation or
          sign-up is required, and all image resizing is done securely on your device.

        </p>
      </div>
      <div className="resizer-container">
        <h2>Image Resizer</h2>

        <input type="file" multiple accept="image/*" onChange={handleFiles} />

        <div className="drivefileuploader">

          <div className="fileuploadcontainer">
            <DriveFileInput
              onFilePicked={handleExternalFilePick}
              setStatus={setStatus}
              allowedTypes={[".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp", ".gif"]}
            />

            <DropboxFileInput
              onFilePicked={handleExternalFilePick}
              setStatus={setStatus}
              extensions={[".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp", ".gif"]}
            />
          </div>
        </div>

        {previewUrl && (
          <div className="image-preview-box">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}

        <DropzoneInput
          acceptedType={["jpg", "jpeg", "png", "webp", "bmp", "tiff", "gif"]}
          onFileAccepted={handleDropzoneFile}
          file={files[0]}
        />

        <div className="section">
          <label>
            <input type="radio" checked={mode === "percent"} onChange={() => setMode("percent")} />
            Percent (%)
          </label>

          <label>
            <input
              type="radio"
              checked={mode === "dimension"}
              onChange={() => {
                setWidth(pxRef.current.w);
                setHeight(pxRef.current.h);
                setMode("dimension");
              }}
            />
            Pixels (px)
          </label>

          <label>
            <input
              type="radio"
              checked={mode === "cm"}
              onChange={() => {
                setWidth(pxToCm(pxRef.current.w));
                setHeight(pxToCm(pxRef.current.h));
                setMode("cm");
              }}
            />
            Centimeter (cm)
          </label>

          <label>
            <input
              type="radio"
              checked={mode === "inch"}
              onChange={() => {
                setWidth(pxToIn(pxRef.current.w));
                setHeight(pxToIn(pxRef.current.h));
                setMode("inch");
              }}
            />
            Inch (in)
          </label>

          {mode === "percent" ? (
            <input type="number" value={percent} onChange={(e) => setPercent(+e.target.value)} />
          ) : (
            <>
              <label>Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => {
                  const v = +e.target.value;
                  setWidth(v);
                  pxRef.current.w =
                    mode === "cm" ? cmToPx(v) : mode === "inch" ? inToPx(v) : v;
                }}
              />

              <label>Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => {
                  const v = +e.target.value;
                  setHeight(v);
                  pxRef.current.h =
                    mode === "cm" ? cmToPx(v) : mode === "inch" ? inToPx(v) : v;
                }}
              />
            </>
          )}
        </div>

        <div className="section">
          <label>DPI
            <input type="number" value={dpi} onChange={e => setDpi(+e.target.value)} />
          </label>

          <label>Format
            <select value={format} onChange={e => setFormat(e.target.value)}>
              <option value="image/jpeg">JPG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
              <option value="image/tiff">TIFF</option>
              <option value="image/bmp">BMP</option>
              <option value="image/gif">GIF</option>
            </select>
          </label>

          {(format === "image/jpeg" || format === "image/webp") && (
            <label>
              Quality ({Math.round(quality * 100)})
              <input type="range" min="0.1" max="1" step="0.1"
                value={quality} onChange={e => setQuality(+e.target.value)} />
            </label>
          )}

        </div>

        <div className="resizeimager">
          <button onClick={resizeImages} disabled={processing}>
            {processing ? "Processing..." : "Resize Images"}
          </button>
        </div>

        {convertedFile && (
  <>
    <p style={{ color: "white", marginTop: "20px",textAlign:'center' }}>
      Save To . . .
    </p>
    <div className="saveTo">
      <SaveToGoogleDrive file={convertedFile} />
      <SaveToDropbox file={convertedFile} />
    </div>
  </>
)}

      </div>

      <section className="image-resizer-content">
        <h2>Image Resizer – Resize Images Online Easily</h2>

        <p>
          Our Image Resizer tool is a fast, simple, and reliable solution for
          resizing images . Whether you are a designer, developer, student, content creator, or casual user, this
          tool helps you resize images instantly using your browser. No software
          installation is required, and your images remain completely private.
        </p>

        <div className="resizeimg-img" >
          <img src="img.png" alt="img Img" className='ConverterImgtwo' />
          <p style={{ textAlign: "center" }}>IMAGES</p>
        </div>

        <p>
          Built with modern web technologies, this image resizer provides a smooth
          and responsive experience on all devices. You can resize images by
          custom width and height or scale them proportionally using percentage
          values. The tool supports multiple image formats and batch processing,
          making it ideal for both personal and professional use.
        </p>

        <h2>Why Use Our Image Resizer?</h2>

        <p>
          Large images can slow down websites, increase loading times, and take up
          unnecessary storage space. Our Image Resizer helps optimize images while
          maintaining their original clarity. It is designed to work efficiently
          without compromising visual quality.
        </p>

        <ul>
          <li>Resize images without distortion</li>
          <li>Maintain original image quality</li>
          <li>Fast browser-based processing</li>
          <li>No uploads or server storage</li>
          <li>Supports multiple image formats</li>
        </ul>

        <h2>Resize Images by Custom Dimensions</h2>

        <p>
          The custom dimension feature allows you to resize images by entering
          exact width and height values in pixels. This is especially useful for
          developers and designers who need images to fit specific layouts or
          design systems.
        </p>

        <p>
          You can lock or unlock the aspect ratio depending on your requirements.
          When the aspect ratio is locked, the image scales proportionally to
          prevent stretching or distortion. This ensures professional-quality
          results every time.
        </p>

        <h2>Resize Images by Percentage</h2>

        <p>
          Percentage-based resizing allows you to scale images evenly by a chosen
          percentage value. For example, resizing an image to 50% reduces both the
          width and height while keeping the same proportions.
        </p>

        <p>
          This option is ideal when you want to quickly reduce file size without
          worrying about exact dimensions. It is commonly used for preparing
          images for websites, emails, and online uploads.
        </p>

        <h2>Drag & Drop Image Upload</h2>

        <p>
          Uploading images is easy with our drag-and-drop interface. Simply drag
          your images into the upload area or click to browse files from your
          device. The tool supports uploading multiple images at once.
        </p>

        <p>
          Once uploaded, each image is displayed with a preview so you can review
          them before resizing. This helps ensure accuracy and avoids mistakes.
        </p>

        <h2>Batch Image Resizing</h2>

        <p>
          Batch resizing allows you to resize multiple images at the same time.
          This feature saves significant time when working with large image
          collections such as product photos, gallery images, or marketing assets.
        </p>

        <p>
          After processing, all resized images can be downloaded together in a ZIP
          file, making file management simple and efficient.
        </p>

        <h2>High Quality Output</h2>

        <p>
          The Image Resizer uses optimized resizing techniques to ensure high
          visual quality. Even after resizing, images remain sharp, clear, and
          accurate. This makes the tool suitable for both web and print purposes.
        </p>

        <p>
          Reduced file sizes help improve website performance and reduce bandwidth
          usage without noticeable quality loss.
        </p>

        <h2>Secure and Privacy-Friendly</h2>

        <p>
          All image processing happens directly in your browser. Your images are
          never uploaded to a server or stored online. Once you close the page,
          your files are automatically removed.
        </p>

        <p>
          This makes the tool safe for personal photos, confidential documents,
          and professional projects.
        </p>

        <h2>Responsive & Mobile-Friendly</h2>

        <p>
          The Image Resizer is fully responsive and works smoothly on desktops,
          tablets, and smartphones. The layout automatically adjusts to different
          screen sizes, ensuring a consistent experience across all devices.
        </p>

        <h2>Perfect for Multiple Use Cases</h2>

        <ul>
          <li>Website image optimization</li>
          <li>Social media image resizing</li>
          <li>Blog and article images</li>
          <li>App and UI assets</li>
          <li>E-commerce product photos</li>
          <li>Email attachments</li>
        </ul>

        <h2>Final Words ...</h2>

        <p>
          The Image Resizer tool offers a complete solution for resizing images
          online. With support for custom dimensions, percentage scaling, batch
          processing, and multiple formats, it meets all modern image resizing
          needs.
        </p>

        <p>
          Designed with JSX and styled using clean CSS, this tool delivers speed,
          security, and high-quality results. Whether you are optimizing images
          for the web or managing large image collections, the Image Resizer makes
          the process fast and effortless.
        </p>

        <section className="image-resizer-faq">
          <h2>Frequently Asked Questions (FAQ)</h2>

          <div className="faq-item">
            <h3>Is this Image Resizer free to use?</h3>
            <p>
              Yes, the Image Resizer is completely free to use. You can resize
              images without any registration, subscription, or hidden charges.
            </p>
          </div>

          <div className="faq-item">
            <h3>Are my images uploaded to a server?</h3>
            <p>
              No. All image resizing is done directly in your browser. Your images
              are never uploaded, stored, or shared with any server, ensuring full
              privacy and security.
            </p>
          </div>

          <div className="faq-item">
            <h3>Which image formats are supported?</h3>
            <p>
              The Image Resizer supports popular formats such as JPG, JPEG, PNG,
              WEBP, BMP, and TIFF. You can resize images in these formats without
              converting them first.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I resize multiple images at once?</h3>
            <p>
              Yes, batch resizing is supported. You can upload multiple images,
              resize them together, and download all resized files at once in a ZIP
              archive.
            </p>
          </div>

          <div className="faq-item">
            <h3>Will resizing reduce image quality?</h3>
            <p>
              The tool uses optimized resizing techniques to maintain high visual
              quality. In most cases, resized images remain sharp and clear with
              minimal quality loss.
            </p>
          </div>

          <div className="faq-item">
            <h3>What is the difference between pixel and percentage resizing?</h3>
            <p>
              Pixel resizing allows you to set exact width and height values, while
              percentage resizing scales the image proportionally based on a chosen
              percentage. Both options preserve aspect ratio when enabled.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I use this Image Resizer on mobile devices?</h3>
            <p>
              Yes, the Image Resizer is fully responsive and works on mobile phones,
              tablets, and desktop devices without any issues.
            </p>
          </div>

          <div className="faq-item">
            <h3>Do I need to install any software?</h3>
            <p>
              No installation is required. The tool runs entirely in your web
              browser, saving you time and storage space.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is there a limit on image size or number of files?</h3>
            <p>
              There is no strict limit for normal usage. However, very large images
              or too many files may depend on your device memory and browser
              performance.
            </p>
          </div>

          <div className="faq-item">
            <h3>Who can use this Image Resizer?</h3>
            <p>
              Anyone can use this tool, including designers, developers, students,
              photographers, marketers, and everyday users who need quick image
              resizing.
            </p>
          </div>
        </section>
      </section>
    </>
  );
}
