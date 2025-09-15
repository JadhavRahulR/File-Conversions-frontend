import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL
const OdpCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(70);
  const [outputType, setOutputType] = useState("odp");
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
    if (dropped && dropped.name.endsWith('.odp')) {
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
    formData.append("outputType", outputType);

    try {
      const response = await axios.post( `${BASE_URL}/compress-odp`, formData, {
        responseType: 'blob',
        onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(Math.min(percent, 90));
                },
      });

      const blob = new Blob([response.data]);
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = file.name.replace('.odp', `_compressed.${outputType === 'odp' ? 'odp' : 'odp.7z'}`);
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
      <title>Compress ODP | Reduce OpenDocument Presentation File Size</title>
<meta name="description" content="Compress your ODP (OpenDocument Presentation) files online to minimize size while keeping layout intact. Free, fast, and secure ODP compressor." />
<link rel="canonical" href="https://fileunivers.in/odpcompressor" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="compress odp, odp compressor, reduce odp file size, compress presentation, shrink opendocument presentation, odp file compression online" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
    <ScrollToTop/>
    <div
      className="compressor-container drop-area"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      >
      <h1>ODP Compressor</h1>

      <p
        className="file-label"
        onClick={() => fileInputRef.current.click()}
        >
        {file ? `✅ Selected: ${file.name}` : '📂 Drag & drop a .odp file here, or click to select'}
      </p>
      <input
        type="file"
        accept=".odp"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden-input"
        />
   <div className="fileuploadcontainer">
        <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.odp']} />
        <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.odp']} />
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
            name="odpOutputType"
            value="odp"
            checked={outputType === 'odp'}
            onChange={() => setOutputType("odp")}
            />
          Export as .odp
        </label>
        <label>
          <input
            type="radio"
            name="odpOutputType"
            value="7z"
            checked={outputType === '7z'}
            onChange={() => setOutputType("7z")}
            />
          Export as .odp.7z
        </label>
      </div>

      <button onClick={handleCompress} disabled={!file || status === "uploading"}>
        {status === "uploading" ?`Compressing... (${progress}%)` : "🔽 Compress"}
      </button>

      {status === "done" && <p className="success-msg">✅ File compressed and downloaded!</p>}
      {status === "error" && <p className="error-msg">❌ Compression failed</p>}
    </div>
    <section>
      <div className="compressor-page">
  <h2 className="compressor-heading">Compress ODP File Online</h2>
  <p className="compressor-description">
    Reduce the size of your OpenDocument Presentation (.odp) files by optimizing embedded images and media without affecting slide layout or content.
  </p>

  <h2 className="compressor-subheading">How to Compress an ODP File?</h2>
  <ol className="compressor-steps">
    <li>📂 Upload or drag & drop your <code>.odp</code> file</li>
    <li>🎚️ Select your desired image compression quality</li>
    <li>🚀 Click <strong>Compress</strong> to begin the process</li>
    <li>⬇️ Your compressed <code>.odp</code> will auto-download once it's ready</li>
  </ol>

  <h2 className="compressor-subheading">Why Use Our ODP Compressor?</h2>
  <ul className="compressor-benefits">
    <li>📽️ Keeps your slides, animations, and content intact</li>
    <li>📉 Reduces size for faster sharing and uploading</li>
    <li>🔐 Private and secure — no files stored</li>
    <li>⚡ Quick compression with automatic download</li>
    <h2 style={{ marginBottom: '6px' }}>Also check other features Related to PDF and odp file  </h2>
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
                <li><Link to="/tiff-to-pdf" className='btn' > tiff to pdf Converter </Link></li>
                <li><Link to="/pdf-to-odt" className='btn' > pdf to odt Converter </Link></li>
                <li><Link to="/pdf-to-txt" className='btn' > pdf to txt Converter </Link></li>
                <li><Link to="/pdf-to-pptx" className='btn' > pdf to pptx Converter </Link></li>
                <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
                <li><Link to="/img-compressor" className='btn' > Compress Image  </Link></li>
  </ul>
</div>
      <section>
  <div className="compressor-article">
    <h2>Everything You Need to Know About ODP Compression</h2>

    <h3>📽️ What is an ODP File?</h3>
    <p>
      ODP stands for Open Document Presentation, the default format used by LibreOffice Impress and other open-source presentation tools. It supports slides with text, images, charts, and multimedia.
    </p>

    <h3>📦 Why Compress an ODP File?</h3>
    <p>
      ODP files often contain large images, videos, and graphics that increase the file size. Compressing these files helps with easier sharing, uploading, and storage.
    </p>

    <h3>💡 Benefits of Compressing ODP Files</h3>
    <ul>
      <li><strong>📉 Smaller Size</strong> – Optimize embedded content without losing slide quality</li>
      <li><strong>🚀 Quicker Sharing</strong> – Share your presentation faster via email or cloud</li>
      <li><strong>📁 Save Disk Space</strong> – Reduce clutter from large presentation decks</li>
      <li><strong>📱 Smooth Loading</strong> – Present on mobile or web with better performance</li>
    </ul>

    <h3>⚙️ How Our ODP Compressor Works</h3>
    <p>
      Our tool compresses your ODP file by optimizing embedded media (like images), removing unnecessary metadata, and preserving the layout of your slides.
    </p>

    <h3>🔐 Is It Safe to Use This ODP Compressor?</h3>
    <p>
      Absolutely. Your file is processed in a secure environment. We never store your files or access your content beyond compression.
    </p>
    <ul>
      <li>🔒 Secure & private processing</li>
      <li>🗑️ Temporary file deletion</li>
      <li>🌐 Cross-platform compatibility</li>
    </ul>

    <h3>📌 Final Tip</h3>
    <p>
      Compress your ODP files before submitting slides, uploading to learning portals, or sharing with colleagues to ensure a smooth and professional experience.
    </p>

    <h2>📚 Frequently Asked Questions</h2>

    <h3>❓ Will my slide design be changed?</h3>
    <p>
      No. The compression tool keeps your slide content and formatting intact. Only media files and metadata are optimized.
    </p>

    <h3>❓ Can I compress large presentations with images?</h3>
    <p>
      Yes. The tool works especially well for presentations with many images or embedded charts.
    </p>

    <h3>❓ What are the output options?</h3>
    <p>
      You can choose to download the compressed `.odp` file directly or get a `.odp.7z` archive for maximum size reduction.
    </p>
  </div>
</section>

    </section>
</>
  );
};

export default OdpCompressor;
