import React, { useState, useRef } from "react";
import axios from "axios";
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';

const BmpCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState("jpg");
  const [export7z, setExport7z] = useState(false);
  const [status, setStatus] = useState("idle");
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
    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);
    formData.append("format", format);
    formData.append("export7z", export7z);

    try {
      const response = await axios.post("http://localhost:5000/compress-bmp", formData, {
        responseType: "blob",
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
    <div
      className="compressor-container drop-area"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2>BMP Compressor</h2>

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
        {status === "uploading" ? "Compressing..." : "🔽 Compress"}
      </button>

      {status === "done" && <p className="success-msg">✅ File compressed and downloaded!</p>}
      {status === "error" && <p className="error-msg">❌ Compression failed</p>}
    </div>
  );
};

export default BmpCompressor;
