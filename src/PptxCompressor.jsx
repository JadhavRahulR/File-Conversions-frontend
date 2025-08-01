import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import "./compressor.css"
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';

const BASE_URL = import.meta.env.VITE_BASE_URL
const PptxCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(30);
  const [outputType, setOutputType] = useState('pptx');
  const [status, setStatus] = useState('idle');
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.pptx')) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.pptx')) {
      setFile(selected);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);
    formData.append('outputType', outputType);

    try {
      const response = await axios.post(`${BASE_URL}/compress-pptx`, formData, {
        responseType: 'blob',
      });

      const ext = outputType === '7z' ? '.pptx.7z' : '_compressed.pptx';
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name.replace('.pptx', ext));
      document.body.appendChild(link);
      link.click();
      link.remove();

      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
    <Helmet>
      <title>Compress PPTX | Reduce PowerPoint File Size Online</title>
<meta name="description" content="Compress your PowerPoint (.pptx) presentations online to reduce file size without losing quality. Free and secure PPTX compressor tool." />
<link rel="canonical" href="https://fileunivers.in/pptxcompress" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="compress pptx, pptx compressor, reduce powerpoint file size, shrink pptx, compress presentation, free pptx compression online" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
      <ScrollToTop />
      <div
        className="compressor-container drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h1>PPTX Compressor</h1>

        <p className="file-label clickable-label"
          onClick={() => fileInputRef.current.click()}>
          {file ? `✅ Selected: ${file.name}` : '📂 Drag & drop a .pptx file here, or click to select'}
        </p>
        <input type="file" accept=".pptx" onChange={handleFileChange} ref={fileInputRef} className="hidden-input" />
        <div className="fileuploadcontainer">
          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pptx']} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pptx']} />
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
              name="pptxOutputType"
              value="pptx"
              checked={outputType === 'pptx'}
              onChange={() => setOutputType('pptx')}
            />
            Export as .pptx
          </label>
          <label>
            <input
              type="radio"
              name="pptxOutputType"
              value="7z"
              checked={outputType === '7z'}
              onChange={() => setOutputType('7z')}
            />
            Export as .pptx.7z
          </label>
        </div>

        <button onClick={handleCompress} disabled={!file || status === 'uploading'}>
          {status === 'uploading' ? 'Compressing...' : '🔽 Compress'}
        </button>

        {status === 'done' && <p className="success-msg">✅ File compressed and downloaded!</p>}
        {status === 'error' && <p className="error-msg">❌ Compression failed</p>}
      </div>
      <section>
        <div className="compressor-page">
          <h2 className="compressor-heading">Compress PPTX Online</h2>
          <p className="compressor-description">
            Shrink the size of your PowerPoint (.pptx) presentations without losing quality. This tool optimizes embedded images and removes unnecessary data while keeping your slides intact.
          </p>

          <h2 className="compressor-subheading">How to Compress a PPTX File?</h2>
          <ol className="compressor-steps">
            <li>📂 Upload or drag & drop your .pptx file</li>
            <li>⚙️ Choose your desired image compression quality</li>
            <li>🚀 Click <strong>Compress</strong> to reduce file size</li>
            <li>⬇️ Your compressed PPTX will auto-download once it's ready</li>
          </ol>

          <h2 className="compressor-subheading">Why Use Our PPTX Compressor?</h2>
          <ul className="compressor-benefits">
            <li>✅ No quality loss in text and layout</li>
            <li>⚡ Quick and efficient image optimization</li>
            <li>🔒 Your presentation stays secure and private</li>
            <li>📥 Automatic download after compression completes</li>
          </ul>
        </div>
          <section>
  <div className="compressor-article">
    <h2>Everything You Need to Know About PPTX Compression</h2>

    <h3>📄 What is a PPTX File?</h3>
    <p>
      PPTX is the file extension for Microsoft PowerPoint presentations created using Office 2007 or
      later. These files can contain slides with text, images, charts, animations, and multimedia.
      Although powerful for presentations, PPTX files can quickly become large due to embedded media.
    </p>

    <h3>📦 Why Do PPTX Files Get So Large?</h3>
    <p>
      PPTX files grow in size primarily due to high-resolution images, embedded videos, audio files,
      custom fonts, and slide animations. If you're working with a media-rich deck, even a few slides can
      become tens of megabytes in size.
    </p>

    <h3>💡 Benefits of Compressing PPTX Files</h3>
    <ul>
      <li><strong>🚀 Faster Sharing</strong> – Easily upload to email or cloud without hitting limits</li>
      <li><strong>📥 Reduced Storage</strong> – Save space on your device or team drives</li>
      <li><strong>📊 Smoother Presentations</strong> – Load and transition faster on any system</li>
      <li><strong>📱 Mobile Compatibility</strong> – Compressed files open quicker on mobile devices</li>
    </ul>

    <h3>🛠️ How Our PPTX Compressor Works</h3>
    <p>
      Our tool scans your .pptx presentation and applies smart compression to embedded images, fonts, and
      media without compromising visual quality. You simply upload your file, and within seconds, a
      compressed version will be automatically downloaded.
    </p>

    <h3>🔐 Is it Safe to Compress PPTX Files Online?</h3>
    <p>
      Absolutely. Your PPTX file is processed securely and never stored or shared. We ensure:
    </p>
    <ul>
      <li>🔒 No server-side storage</li>
      <li>🔐 Private and encrypted processing</li>
      <li>♻️ Automatic deletion right after compression</li>
    </ul>

    <h3>🔚 Final Thoughts</h3>
    <p>
      Whether you're preparing for a business meeting or sharing a classroom presentation, compressing
      your PPTX file ensures faster, smoother delivery without sacrificing design. Use our free tool now
      to reduce size, save space, and keep your content impactful and efficient.
    </p>

    <h2>📚 Frequently Asked Questions</h2>

    <h3>❓ Will compressing my PPTX reduce its quality?</h3>
    <p>
      Not noticeably. Our tool compresses embedded media while keeping slide design and readability
      intact.
    </p>

    <h3>❓ How much size can I expect to save?</h3>
    <p>
      You can often reduce file size by 50–80%, depending on how many images, fonts are used.
    </p>

    <h3>❓ Do I need to install anything?</h3>
    <p>
      No installation needed. Everything works directly in your browser—fast, simple, and secure.
    </p>
  </div>
</section>

      </section>
    </>
  );
};

export default PptxCompressor;
