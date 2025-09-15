import React, { useState, useRef } from "react";
import axios from "axios";
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";


const BASE_URL = import.meta.env.VITE_BASE_URL
const BmpCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState("jpg");
  const [export7z, setExport7z] = useState(false);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("idle");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    setStatus("idle");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCompress = async () => {
    if (!file) return;

    setStatus("uploading");
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);
    formData.append("format", format);
    formData.append("export7z", export7z);

    try {
      const response = await axios.post( `${BASE_URL}/compress-bmp`, formData, {
        responseType: "blob",
        onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(Math.min(percent, 90));
                },
      });

      const blob = new Blob([response.data]);
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = file.name.replace(".bmp", `_compressed.${export7z ? `${format}.7z` : format}`);
      downloadLink.click();

      setStatus("done");
    } catch (err) {
      console.error("Compression failed", err);
      setStatus("error");
    }
  };

  return (
    <>
    <Helmet>
      <title>Compress BMP | Reduce BMP Image File Size Online</title>
<meta name="description" content="Easily compress BMP image files online without losing quality. Reduce BMP file size for faster uploads and sharing. Free, secure BMP compressor." />
<link rel="canonical" href="https://fileunivers.in/bmpcompressor" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="compress bmp, bmp compressor, reduce bmp size, bmp image compression, shrink bmp file, compress bmp online" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
    <ScrollToTop/>
    <div
      className="compressor-container drop-area"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      >
      <h1>BMP Compressor</h1>

      {/* 📂 Only this triggers file explorer */}
      <p
        className="file-label clickable-label"
        onClick={() => fileInputRef.current.click()}
        >
        {file ? `✅ Selected: ${file.name}` : '📂 Drag & drop a .bmp file here, or click to select'}
      </p>

      <input
        type="file"
        accept=".bmp"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden-input"
        />

       <div className="fileuploadcontainer">
        <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.bmp']} />
        <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.bmp']} />
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
        <label><input type="radio" name="format" value="jpg" checked={format === "jpg"} onChange={() => setFormat("jpg")} /> .jpg</label>
        <label><input type="radio" name="format" value="webp" checked={format === "webp"} onChange={() => setFormat("webp")} /> .webp</label>
        <label><input type="radio" name="format" value="bmp" checked={format === "bmp"} onChange={() => setFormat("bmp")} /> .bmp</label>
      </div>

      <label>
        <input type="checkbox" checked={export7z} onChange={(e) => setExport7z(e.target.checked)} />
        Export as .7z
      </label>

      <button onClick={handleCompress} disabled={!file || status === "uploading"}>
        {status === "uploading" ? `Compressing... (${progress}%)` : "🔽 Compress"}
      </button>

      {status === "done" && <p className="success-msg">✅ File compressed and downloaded!</p>}
      {status === "error" && <p className="error-msg">❌ Compression failed</p>}
    </div>
    <section>
      <div className="compressor-page">
  <h2 className="compressor-heading">Compress BMP File Online</h2>
  <p className="compressor-description">
    Reduce the size of your BMP (.bmp) image files while keeping visual quality. Perfect for converting large bitmap images into smaller, more manageable files.
  </p>

  <h2 className="compressor-subheading">How to Compress a BMP File?</h2>
  <ol className="compressor-steps">
    <li>📂 Upload or drag & drop your <code>.bmp</code> file</li>
    <li>🎚️ Select your preferred compression quality</li>
    <li>🚀 Click <strong>Compress</strong> to start the process</li>
    <li>⬇️ The compressed <code>.bmp</code> file will auto-download when ready</li>
  </ol>

  <h2 className="compressor-subheading">Why Use Our BMP Compressor?</h2>
  <ul className="compressor-benefits">
    <li>🖼️ Maintains image clarity while reducing file size</li>
    <li>📉 Optimized for faster uploads and storage savings</li>
    <li>🔐 Your files remain private and are never stored</li>
    <li>⚡ Fast compression with automatic download</li>
    <h2 style={{ marginBottom: '6px' }}>Also check other features Related to PDF and Bmp file  </h2>
                <li><Link to="/word-to-pdf" className='btn' >Word to PDF Converter </Link></li>
                <li><Link to="/pdf-to-word" className='btn'>PDF to Word Converter </Link></li>
                <li><Link to="/pdf-to-txt" className='btn' > pdf to txt Converter </Link></li>
                <li><Link to="/pdf-to-pptx" className='btn' > pdf to pptx Converter </Link></li>
                <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
                <li><Link to="/img-compressor" className='btn' > Compress Image  </Link></li>
  </ul>
</div>
    <div className="compressor-article">
  <h2>Understanding BMP Files and Why You Should Compress Them</h2>

  <h3>📂 What is a BMP File?</h3>
  <p>
    BMP stands for <strong>Bitmap Image File</strong>, a raster graphics format created by Microsoft.
    It stores 2D digital images with high fidelity but no compression, resulting in large file sizes.
  </p>

  <h3>📦 Why Are BMP Files So Large?</h3>
  <p>
    Unlike JPEG or PNG, BMP does not compress image data. Each pixel is stored individually, preserving
    quality but increasing file size. This format is ideal for editing and archiving, but not for web use
    or sharing.
  </p>

  <h3>⚡ Why You Should Compress BMP Files</h3>
  <ul>
    <li><strong>💾 Save Storage Space</strong> – Free up disk or cloud space by reducing file sizes.</li>
    <li><strong>🚀 Faster Upload & Download</strong> – Greatly improves transfer speeds.</li>
    <li><strong>📤 Better for Web & App Use</strong> – Speeds up site load time and SEO ranking.</li>
    <li><strong>📱 Mobile Friendly</strong> – Smaller files load quicker on slow mobile networks.</li>
  </ul>

  <h3>🔍 BMP vs JPEG vs PNG – Which One Should You Use?</h3>
   <div className="table-container">
    <table className="comparison-table">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Without Compression</th>
          <th>With BMP Compression</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>File Size</td>
          <td>15MB</td>
          <td>2.5MB</td>
        </tr>
        <tr>
          <td>Upload Speed</td>
          <td>Slow</td>
          <td>Fast</td>
        </tr>
        <tr>
          <td>Storage Needs</td>
          <td>High</td>
          <td>Low</td>
        </tr>
        <tr>
          <td>Visual Quality</td>
          <td>High</td>
          <td>Almost Identical</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>🛠️ How Does Our BMP Compressor Work?</h3>
  <p>
    Our online tool analyzes your <code>.bmp</code> file and applies optimized compression settings to
    reduce size while maintaining quality. Just upload, choose quality, and let us do the rest. The file
    is compressed and automatically downloaded in seconds.
  </p>

  <h3>🔐 Is it Safe to Compress Files Online?</h3>
  <p>
    Absolutely. Our compression tool runs in your browser. Your files are:
  </p>
  <ul>
    <li>🔒 <strong>Not stored</strong> on our servers</li>
    <li>🔐 <strong>Not accessed</strong> or viewed by anyone</li>
    <li>♻️ <strong>Automatically removed</strong> after processing</li>
  </ul>

  <h3>🧠 Pro Tip: Convert BMP to Other Formats After Compression</h3>
  <p>
    For even smaller files, you can compress and convert BMP to:
  </p>
  <ul>
    <li><strong>JPEG</strong> – for photos</li>
    <li><strong>PNG</strong> – for images with transparency</li>
    <li><strong>.bmp.7z</strong> or <strong>.zip</strong> – for file archiving or email attachments</li>
  </ul>

  <h3>💬 Final Thoughts</h3>
  <p>
    BMP is excellent for quality but inefficient for speed and sharing. Compressing your BMP files
    improves site performance, saves bandwidth, and enhances user experience. Try our tool today and
    experience fast, private, and reliable image compression online.
  </p>
</div>

    </section>
</>
  );
};

export default BmpCompressor;
