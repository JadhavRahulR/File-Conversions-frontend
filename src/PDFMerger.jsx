import React, { useState } from "react";
import axios from "axios";
import "./PDFMerger.css";
import "./compressor.css"
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';

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
    <Helmet>
      <title>Merge PDF Files | Combine Multiple PDFs into One</title>
<meta name="description" content="Merge multiple PDF files into a single document easily and securely. Use our free online PDF merger with no signup required." />
<link rel="canonical" href="https://fileunivers.in/merge-pdf" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="merge pdf, combine pdf, pdf merger, join pdf files, merge pdf online, free pdf merge tool" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
    <ScrollToTop/>
      <div className="pdf-merger">
        <h1> Merge PDF Files</h1>

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
  <h2 className="compressor-heading">Merge PDF Files Online</h2>
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
        <section>
  <div className="mergepdf-section">
    <h2>🧩 Merge PDF Files Easily</h2>

    <h3>📄 What is PDF Merging?</h3>
    <p>
      Merging PDFs allows you to combine multiple PDF documents into one single file. It’s useful for organizing reports, contracts, or scans into a unified file.
    </p>

    <h3> Why Use Our PDF Merger?</h3>
    <ul>
      <li><strong>✅ Combine Multiple PDFs</strong> – Join 2 or more PDFs into one</li>
      <li><strong>🧹 Remove Extra Pages</strong> – Option to delete pages before merging</li>
      <li><strong>📁 Reorder Easily</strong> – Drag to reorder before final merge</li>
      <li><strong>🔒 Secure</strong> – Files processed locally and auto-deleted</li>
    </ul>

    <h3>🛠️ How to Merge PDFs</h3>
    <ol>
      <li>Upload or drag multiple PDF files</li>
      <li>Reorder or remove any pages if needed</li>
      <li>Click “Merge” to generate a single PDF</li>
      <li>Download your combined document instantly</li>
    </ol>

    <h3>🔐 Your Files Stay Safe</h3>
    <p>
      All file processing is encrypted. We do not keep any files—your PDFs are deleted automatically after download.
    </p>

    <h2>📚 Frequently Asked Questions</h2>

    <h3>❓ Can I remove individual PDFs before merging?</h3>
    <p>Yes! You can remove any file or all files before the merge process.</p>

    <h3>❓ Is there a limit to the number of PDFs?</h3>
    <p>You can upload multiple files—performance may vary based on file size.</p>

    <h3>❓ Does merging change the quality of the PDFs?</h3>
    <p>No, your PDFs retain their original resolution and formatting.</p>
  </div>
</section>

      </section>
    </>
  );
};

export default PDFMerger;
