import React, { useState } from "react";
import axios from "axios";
import "./PDFMerger.css";

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
      const response = await axios.post("http://localhost:3000/merge-pdf", formData, {
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
  );
};

export default PDFMerger;
