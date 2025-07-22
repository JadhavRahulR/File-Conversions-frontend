import React, { useRef, useState } from "react";
import axios from "axios";
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from "./ScrollToTop";

const BASE_URL = import.meta.env.VITE_BASE_URL
const TiffCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(85);
  const [export7z, setExport7z] = useState(false);
  const [status, setStatus] = useState("idle");
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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);
    formData.append("export7z", export7z);

    try {
      const response = await axios.post(`${BASE_URL}/compress-tiff`, formData, {
        responseType: "blob",
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
    <ScrollToTop/>
    <div
      className="compressor-container drop-area"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      >
      <h2>TIFF Compressor</h2>

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
        {status === "uploading" ? "Compressing..." : "🔽 Compress"}
      </button>

      {status === "done" && <p className="success-msg">✅ File compressed and downloaded!</p>}
      {status === "error" && <p className="error-msg">❌ Compression failed</p>}
    </div>
    <section>
      <div className="compressor-page">
  <h1 className="compressor-heading">Compress TIFF File Online</h1>
  <p className="compressor-description">
    Reduce the size of your high-resolution TIFF (.tiff) images without noticeably affecting visual quality. Ideal for archiving or faster uploading.
  </p>

  <h2 className="compressor-subheading">How to Compress a TIFF File?</h2>
  <ol className="compressor-steps">
    <li>📂 Upload or drag & drop your <code>.tiff</code> file</li>
    <li>🎚️ Choose your preferred compression level</li>
    <li>🚀 Click <strong>Compress</strong> to begin the optimization</li>
    <li>⬇️ Your compressed <code>.tiff</code> will auto-download once ready</li>
  </ol>

  <h2 className="compressor-subheading">Why Use Our TIFF Compressor?</h2>
  <ul className="compressor-benefits">
    <li>🖼️ Retains image clarity and resolution</li>
    <li>📉 Shrinks file size for quicker transfer and storage</li>
    <li>🔐 Safe and secure — files are not stored</li>
    <li>⚡ Fast image compression with auto-download</li>
  </ul>
</div>

    </section>
</>
  );
};

export default TiffCompressor;
