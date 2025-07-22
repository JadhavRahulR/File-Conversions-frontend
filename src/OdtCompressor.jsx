import React, { useRef, useState } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';

const BASE_URL = import.meta.env.VITE_BASE_URL
const OdtCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(70);
  const [status, setStatus] = useState('');
  const [outputType, setOutputType] = useState('odt');
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.odt')) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleCompress = async () => {
    if (!file) return;
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);
    formData.append('outputType', outputType);

    try {
      const response = await axios.post(`${BASE_URL}/compress-odt`, formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        file.name.replace('.odt', `_compressed.odt${outputType === '7z' ? '.7z' : ''}`)
      );
      document.body.appendChild(link);
      link.click();
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
    <ScrollToTop/>
    <div
      className="compressor-container drop-area"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      >
      <h2>ODT Compressor</h2>

      <p
        className="file-label"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        style={{ cursor: 'pointer',  }}
        >
        {file ? `✅ Selected: ${file.name}` : '📂 Drag & drop a .odt file here, or click to select'}
      </p>

      <input
        type="file"
        accept=".odt"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ position: 'absolute', left: '-9999px' }}
        tabIndex={-1}
        />
      <div className="fileuploadcontainer">
        <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.odt']} />
        <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.odt']} />
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
            name="odtOutputType"
            value="odt"
            checked={outputType === 'odt'}
            onChange={() => setOutputType('odt')}
            />
          Export as .odt
        </label>
        <label>
          <input
            type="radio"
            name="odtOutputType"
            value="7z"
            checked={outputType === '7z'}
            onChange={() => setOutputType('7z')}
            />
          Export as .odt.7z
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
  <h1 className="compressor-heading">Compress ODT File Online</h1>
  <p className="compressor-description">
    Reduce the size of your OpenDocument Text (.odt) files without affecting formatting or content. Perfect for optimizing documents with images or media.
  </p>

  <h2 className="compressor-subheading">How to Compress an ODT File?</h2>
  <ol className="compressor-steps">
    <li>📂 Upload or drag & drop your <code>.odt</code> file</li>
    <li>🎚️ Select a compression level if available</li>
    <li>🚀 Click <strong>Compress</strong> to start the process</li>
    <li>⬇️ Your compressed <code>.odt</code> file will auto-download when ready</li>
  </ol>

  <h2 className="compressor-subheading">Why Use Our ODT Compressor?</h2>
  <ul className="compressor-benefits">
    <li>📝 Preserves original content and layout</li>
    <li>📉 Reduces file size for easier sharing and storage</li>
    <li>🔐 Secure processing with no data stored</li>
    <li>⚡ Fast compression with automatic download</li>
  </ul>
</div>

    </section>
  </>
  );
};

export default OdtCompressor;
