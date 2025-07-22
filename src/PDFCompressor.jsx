import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";import axios from "axios";
import "./PDFCompressor.css";
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';


const BASE_URL = import.meta.env.VITE_BASE_URL
const PDFCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(60);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("upload")

  const handleFileDrop = (e) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped && dropped.name.endsWith('.pdf')) {
            setFile(dropped);
        }
    };
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.name.endsWith('.pdf')) {
            setFile(selected);
        }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a PDF.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/convert-compress-pdf`, formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Compression failed:", error);
      alert("Compression failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ScrollToTop/>
      <div className="compressor-container" onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
            <h2>Compress Pdf</h2>
            <form onSubmit={handleSubmit}>
            <label htmlFor="csvInput" className="file-label">
                {file ? `✅ Selected: ${file.name}` : '📂Drag and Drop or  Click here  to select a .pdf file'}
            </label>
            <input id="csvInput"  type="file"  accept=".pdf" onChange={handleFileChange}  className="hidden-input" />
             <div className="fileuploadcontainer">
              <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pdf']} className='hiii'/>
              <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pdf']} />
            </div>

            <div className="slider-container">
              <label htmlFor="quality">Compression Level: {quality}</label>
              <input
                type="range"
                id="quality"
                min="30"
                max="95"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
              />
                <div className="slider-labels">
                    <span>⚡More Compress </span>
                    <span>📦 Less Compress</span>
                </div>
            </div>


           <button type="submit" disabled={loading}>
              {loading ? "Compressing..." : "Compress PDF"}
            </button>

            {status === 'done' && <p className="success-msg">✅ Compression complete. File downloaded.</p>}
            {status === 'error' && <p className="error-msg">❌ Compression failed. Try again.</p>}
            </form>
        </div>
        <section>
        <div className="compressor-page">
          <h1 className="compressor-heading">Compress PDF Online</h1>
          <p className="compressor-description">
            Reduce the file size of your PDF documents quickly and securely. This tool compresses images and removes unnecessary data while keeping your PDF content intact.
          </p>

          <h2 className="compressor-subheading">How to Compress a PDF?</h2>
          <ol className="compressor-steps">
            <li>📂 Upload or drag & drop your PDF file</li>
            <li>⚙️ Choose compression quality (e.g., low, medium, high)</li>
            <li>🚀 Click on <strong>Compress</strong> to reduce the file size</li>
            <li>⬇️ Auto Download the optimized PDF or `.pdf.7z` archive</li>
          </ol>

          <h2 className="compressor-subheading">Why Use Our PDF Compressor?</h2>
          <ul className="compressor-benefits">
            <li>✅ No watermark</li>
            <li>🔒 Your files stay private – processed locally or securely deleted</li>
            <li>⚡ Fast compression powered by Python backend</li>
            <li>📱 Works on mobile and desktop</li>
          </ul>
        </div>

      </section>
    </>
  );
};

export default PDFCompressor;
