import React, { useState } from "react";
import axios from "axios";
import "./ImageCompressor.css";
import DropzoneInput from "./DropzoneInput";
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';

const ImageCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(70);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Upload");

  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith('.jpg' || ".png")) {
      setFile(dropped);
    }
  };
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.jpg' || ".png")) {
      setFile(selected);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Upload an image!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/compress-image", formData, {
        responseType: "blob"
      });
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.jpg";
      a.click();
      URL.revokeObjectURL(url);
       setStatus('done');
    } catch (err) {
      console.error("Compression failed", err);
      alert("Compression failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <div className="image-compressor-container">
      <h2>Compress Image (JPG/PNG)</h2>

      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <div className="slider-section">
        <label>Compression Quality: {quality}</label>
        <input
          type="range"
          min="30"
          max="95"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          />
      </div>
      <DropzoneInput acceptedType={['jpg', 'jpeg', 'png']}file={file} onFileAccepted={setFile} setStatus={setStatus}/>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Compressing..." : "Compress Image"}
      </button>
    </div> */}



      <div className="compressor-container" onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
        <h2>Image  Compressor</h2>
        <label htmlFor="csvInput" className="file-label">
          {file ? `✅ Selected: ${file.name}` : '📂Drag and Drop or  Click here  to select a image file'}
        </label>
        <input id="csvInput" type="file" accept={['.jpg', '.jpeg', '.png']} onChange={handleFileChange} className="hidden-input" />
        <div className="fileuploadcontainer">
          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['jpg', 'jpeg', 'png']} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['jpg', 'jpeg', 'png']} />
        </div>

        <div className="level-slider">
          <div className="slider-section">
            <label>Compression Quality: {quality}</label>
            <input
              type="range"
              min="30"
              max="95"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            />
          </div>
          <div className="slider-labels">
            <span>⚡More Compress</span>
            <span>📦 Less Compress</span>
          </div>
        </div>


        {/* <button
                onClick={handleSubmit}
                disabled={!file || status === 'uploading'}
                className="compress-btn"
            >
                {status === 'uploading' ? 'Compressing...' : '🔽 Compress CSV'}
            </button> */}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Compressing..." : "Compress Image"}
        </button>

        {status === 'done' && <p className="success-msg">✅ Compression complete. File downloaded.</p>}
        {status === 'error' && <p className="error-msg">❌ Compression failed. Try again.</p>}
      </div>
    </>
  );
};

export default ImageCompressor;
