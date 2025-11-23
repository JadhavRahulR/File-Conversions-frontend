import React, { useRef, useState } from "react";
import axios from "axios";
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to compress tiff.mp4";
import IntroPoster from "../src/assets/images/tiff compress poster.png";

const BASE_URL = import.meta.env.VITE_BASE_URL
const TiffCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(85);
  const [export7z, setExport7z] = useState(false);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("idle");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.toLowerCase().endsWith(".tiff")) {
      setFile(dropped);
      setStatus("idle");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleCompress = async () => {
    if (!file) return;
    setStatus("uploading");
    setProgress(10);


    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);
    formData.append("export7z", export7z);

    try {
      const response = await axios.post(`${BASE_URL}/compress-tiff`, formData, {
        responseType: "blob",
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(Math.min(percent, 90));
        },
      });

      const blob = new Blob([response.data]);
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = file.name.replace(
        ".tiff",
        export7z ? "_compressed.tiff.7z" : "_compressed.tiff"
      );
      downloadLink.click();
      setStatus("done");
    } catch (err) {
      console.error("❌ Compression failed", err);
      setStatus("error");
    }
  };

  return (
    <>
      <Helmet>
        <title>Compress TIFF | Reduce TIFF Image File Size Online</title>
        <meta name="description" content="Compress TIFF image files online to reduce file size without significant quality loss. Free, secure TIFF compression tool with no signup needed." />
        <link rel="canonical" href="https://fileunivers.in/tiffcompressor" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="compress tiff, tiff compressor, reduce tiff size, tiff image compression, shrink tiff file, compress tiff online" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <div className="pagetitle">
        <h1>Compress TIFF Images Online –Free and Secure Reduce TIFF File Size </h1>
        <p className="intro-paragraph">
          Easily compress TIFF files online and reduce their size while keeping your images crystal clear. Whether you’re working with single or multi-page TIFFs, this free online tool helps you shrink large image files for faster uploads, sharing, and storage. No software installation or account required — simply upload, compress, and download your optimized TIFF in seconds.
        </p>
      </div>
      <div
        className="compressor-container drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
          {/* Remove h1 title from here  */}
        <p
          className="file-label"
          onClick={() => fileInputRef.current.click()}
        >
          {file ? `✅ Selected: ${file.name}` : "📂 Drag & drop a .tiff file here, or click to select"}
        </p>
        <input
          type="file"
          accept=".tiff"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden-input"
        />
        <div className="fileuploadcontainer">
          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.tiff']} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.tiff']} />
        </div>
        <div className="level-slider">
          <label>Image Quality: {quality}</label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
          />
          <div className="slider-labels">
            <span>📉 Smaller</span>
            <span>📸 Clearer</span>
          </div>
        </div>

        <div className="output-select">
          <label>
            <input
              type="radio"
              name="tiffExport"
              value="tiff"
              checked={!export7z}
              onChange={() => setExport7z(false)}
            />
            Export as .tiff
          </label>
          <label>
            <input
              type="radio"
              name="tiffExport"
              value="7z"
              checked={export7z}
              onChange={() => setExport7z(true)}
            />
            Export as .tiff.7z
          </label>
        </div>

        <button onClick={handleCompress} disabled={!file || status === "uploading"}>
          {status === "uploading" ? `Compressing... (${progress}%)` : "🔽 Compress"}
        </button>

        {status === "done" && <p className="success-msg">✅ File compressed and downloaded!</p>}
        {status === "error" && <p className="error-msg">❌ Compression failed</p>}
      </div>
      <section>
        <div className="compressor-page">
          <h2 className="compressor-heading">Compress TIFF File Online</h2>
          <p className="compressor-description">
            Reduce the size of your high-resolution TIFF (.tiff) images without noticeably affecting visual quality. Ideal for archiving or faster uploading.Our advanced TIFF compressor uses smart optimization to reduce image size while maintaining the original resolution and clarity. You can also control image quality and output level for the best balance between compression and detail. Ideal for photographers, designers, and professionals who need lighter, high-quality image files. Experience fast, secure, and reliable compression powered by FileUnivers.in.
          </p>
          <div className="converterImg">
            <div style={{ textAlign: "center" }}>
              <img src="compression.png" alt="Arrow Symbol" className='ConverterArrowImg' />
              <p>Compress</p>
            </div>
            <div >
              <img src="tiff.png" alt="tiff Img" className='ConverterImgtwo' />
              <p style={{ textAlign: "center" }}>TIFF</p>
            </div>
          </div>

          <h2 className="compressor-subheading">How to Compress a TIFF File?</h2>
          <ol className="compressor-steps">
            <li>📂 Upload or drag & drop your <code>.tiff</code> file</li>
            <li>🎚️ Choose your preferred compression level</li>
            <li>🚀 Click <strong>Compress</strong> to begin the optimization</li>
            <li>⬇️ Your compressed <code>.tiff</code> will auto-download once ready</li>
          </ol>
          <section>
          <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Compress TIFF ? "
              description='Reduce your TIFF file size in seconds!. Watch this quick video to learn how to compress TIFF images online without losing quality. Perfect for photographers, designers, and professionals who want smaller but sharp image files. In this video, you’ll learn: How to upload and compress TIFF files easily Maintain image clarity and resolution after compression Download your optimized TIFF instantly'
            />
          </section>

          <h2 className="compressor-subheading">Why Use Our TIFF Compressor?</h2>
          <ul className="compressor-benefits">
            <li>🖼️ Retains image clarity and resolution</li>
            <li>📉 Shrinks file size for quicker transfer and storage</li>
            <li>🔐 Safe and secure — files are not stored</li>
            <li>⚡ Fast image compression with auto-download</li>
            <h2 style={{ marginBottom: '6px' }}>Also check other features Related to PDF and Tiff file  </h2>
            <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > RTf To PDF Converter </Link></li>
            <li><Link to="/md-to-pdf" className='btn' > MD  To PDF Converter </Link></li>
            <li><Link to="/xlsx-to-pdf" className='btn' > XLSX  To PDF Converter </Link></li>
            <li><Link to="/csv-to-pdf" className='btn' > CSV To PDF Converter </Link></li>
            <li><Link to="/img-to-pdf" className='btn' > IMG To PDF Converter </Link></li>
            <li><Link to="/tiff-to-pdf" className='btn' > TIFF To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' > PDF To ODT Converter </Link></li>
            <li><Link to="/pdf-to-pptx" className='btn' > PDF To PPTX Converter </Link></li>
            <li><Link to="/pdf-to-rtf" className='btn' > PDF To RTF Converter </Link></li>
            <li><Link to="/merge-pdf" className='btn' > Merge PDF  </Link></li>
            <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
            <li><Link to="/img-compressor" className='btn' > Compress Image  </Link></li>

          </ul>
        </div>
        <section>
          <div className="compressor-article">
            <h2>All About TIFF Compression</h2>

            <h3>🖼️ What is a TIFF File?</h3>
            <p>
              TIFF (Tagged Image File Format) is a high-quality raster image format used by designers, publishers, and photographers. It preserves image details and supports lossless compression.
            </p>

            <h3>📦 Why Should You Compress TIFF Files?</h3>
            <p>
              TIFF files can be very large due to their high resolution. Compressing them makes storage and sharing easier without significantly reducing image quality.
            </p>

            <h3>🚀 Benefits of TIFF Compression</h3>
            <ul>
              <li><strong>⚡ Faster Uploads</strong> – Share large images online quickly</li>
              <li><strong>💾 Save Space</strong> – Reduce file size on disk or cloud storage</li>
              <li><strong>📤 Easier Sharing</strong> – Attach smaller files via email or apps</li>
              <li><strong>🔧 Adjustable Quality</strong> – Choose the right balance of quality and size</li>
            </ul>

            <h3>🔧 How Our TIFF Compressor Works</h3>
            <p>
              Our tool uses efficient compression techniques to reduce the TIFF file size. You can also control the image quality and choose export options like `.tiff` or `.tiff.7z` for extra compression.
            </p>

            <h3>🔐 Is TIFF Compression Secure?</h3>
            <p>
              Yes, your files are handled safely. We do not store or access any user content beyond compression.
            </p>
            <ul>
              <li>🔒 Safe and encrypted processing</li>
              <li>🗑️ Auto-deletion after download</li>
              <li>🌍 Works on all devices and platforms</li>
            </ul>

            <h2>📚 Frequently Asked Questions</h2>

            <h3>❓ Will compression affect image clarity?</h3>
            <p>
              You can adjust the quality settings to balance size and clarity. Lossless compression is also supported.
            </p>

            <h3>❓ Can I upload multi-page TIFF files?</h3>
            <p>
              Yes, the tool supports multi-page TIFFs and compresses all pages together.
            </p>

            <h3>❓ What are the available export formats?</h3>
            <p>
              You can download the compressed `.tiff` directly or select `.tiff.7z` for a more compact archive.
            </p>
          </div>
        </section>

      </section>
    </>
  );
};

export default TiffCompressor;
