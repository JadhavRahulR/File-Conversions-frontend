import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';

const BASE_URL = import.meta.env.VITE_BASE_URL
const OdpCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(70);
  const [outputType, setOutputType] = useState("odp");
  const [status, setStatus] = useState("idle");
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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);
    formData.append("outputType", outputType);

    try {
      const response = await axios.post( `${BASE_URL}/compress-odp`, formData, {
        responseType: 'blob',
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
    <div
      className="compressor-container drop-area"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2>ODP Compressor</h2>

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
        {status === "uploading" ? "Compressing..." : "🔽 Compress"}
      </button>

      {status === "done" && <p className="success-msg">✅ File compressed and downloaded!</p>}
      {status === "error" && <p className="error-msg">❌ Compression failed</p>}
    </div>
  );
};

export default OdpCompressor;
