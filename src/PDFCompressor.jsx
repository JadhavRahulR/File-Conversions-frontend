import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";import axios from "axios";
import "./PDFCompressor.css";
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';

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
      const response = await axios.post("http://localhost:5000/convert-compress-pdf", formData, {
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
      {/* <div className="compressorpg">
        <div className="compressor-container">
          <h2>Compress PDF</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input"
            />
            <div className="fileuploadcontainer">
              <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pdf']} />
              <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pdf']} />
            </div>
            <DropzoneInput acceptedType={['pdf']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
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
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Compressing..." : "Compress PDF"}
            </button>
          </form>
        </div>
      </div> */}

      {/* for adding complete div as drag and drop */}
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
    </>
  );
};

export default PDFCompressor;
