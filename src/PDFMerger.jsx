import React, { useState } from "react";
import axios from "axios";
import "./PDFMerger.css";
import "./compressor.css"
import ScrollToTop from "./ScrollToTop";

const BASE_URL = import.meta.env.VITE_BASE_URL
const PDFMerger = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...newFiles.filter(f => !existing.has(f.name))];
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...droppedFiles.filter(f => !existing.has(f.name))];
    });
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => setSelectedFiles([]);

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      alert("Please select at least two PDF files to merge.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    setIsMerging(true);
    try {
      const response = await axios.post(`${BASE_URL}/merge-pdf`, formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Merge failed", err);
      alert("Merge failed. Try again.");
    }
    setIsMerging(false);
  };

  return (
    <>
    <ScrollToTop/>
      <div className="pdf-merger">
        <h2>📎 Merge PDF Files</h2>

        <div
          className="drop-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p>Drag & Drop your PDF files here</p>
          <p>or</p>
          <input type="file" multiple accept=".pdf" onChange={handleFileChange} />
        </div>

        {selectedFiles.length > 0 && (
          <>
            <ul className="file-list">
              {selectedFiles.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(index)}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
            <button className="clear-btn" onClick={handleClearAll}>
              🗑️ Clear All
            </button>
          </>
        )}

        <button className="mergebtn" onClick={handleMerge} disabled={isMerging || selectedFiles.length < 2}>
          {isMerging ? "Merging..." : "Merge PDFs"}
        </button>
      </div>
      <section>
        <div className="compressor-page">
  <h1 className="compressor-heading">Merge PDF Files Online</h1>
  <p className="compressor-description">
    Combine multiple PDF documents into a single file in just a few clicks. Upload, reorder, or remove PDFs as needed and generate a clean merged result instantly.
  </p>

  <h2 className="compressor-subheading">How to Merge PDF Files?</h2>
  <ol className="compressor-steps">
    <li>📂 Upload or drag & drop multiple PDF files</li>
    <li>🧩 Reorder the files if needed</li>
    <li>🗑️ Remove a specific PDF or clear all files from the list</li>
    <li>🔗 Click <strong>Merge</strong> to combine the files into one</li>
    <li>⬇️ Download your final merged PDF instantly</li>
  </ol>

  <h2 className="compressor-subheading">Why Use Our PDF Merger?</h2>
  <ul className="compressor-benefits">
    <li>✅ Supports multiple file uploads</li>
    <li>🧠 Simple drag & drop interface</li>
    <li>🔒 Your files stay private and are never stored</li>
    <li>⚡ Fast merging with auto-download</li>
    <li>🗂️ Rearrangement and removal options for full control</li>
  </ul>
</div>

      </section>
    </>
  );
};

export default PDFMerger;
