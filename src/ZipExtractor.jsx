import React, { useState } from "react";
import axios from "axios";
import "./ZipExtractor.css";
import "./compressor.css"
import ScrollToTop from "./ScrollToTop";

const BASE_URL = import.meta.env.VITE_BASE_URL
const ZipExtractor = () => {
  const [zipFile, setZipFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setZipFile(e.target.files[0]);
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!zipFile) return alert("Please upload a .zip file");

    const formData = new FormData();
    formData.append("file", zipFile);

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/extract-zip`, formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "unzipped_files.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Extraction failed", err);
      alert("Extraction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ScrollToTop/>
    <div className="extract-container">
      <h2>Extract ZIP Archive</h2>

      <input type="file" accept=".zip" onChange={handleFileChange} className="file-input" />

      <button onClick={handleExtract} disabled={loading}>
        {loading ? "Extracting..." : "Extract ZIP"}
      </button>
    </div>
    <section>
      <div className="compressor-page">
  <h1 className="compressor-heading">Extract ZIP File Online</h1>
  <p className="compressor-description">
    Quickly extract the contents of any ZIP (.zip) archive directly in your browser. Browse, preview, and download the extracted files instantly.
  </p>

  <h2 className="compressor-subheading">How to Extract a ZIP File?</h2>
  <ol className="compressor-steps">
    <li>📂 Upload or drag & drop your <code>.zip</code> file</li>
    <li>📄 View the list of files and folders inside</li>
    <li>✅ Select specific files or extract all</li>
    <li>⬇️ The extracted content will auto-download as a folder or set of files</li>
  </ol>

  <h2 className="compressor-subheading">Why Use Our ZIP Extractor?</h2>
  <ul className="compressor-benefits">
    <li>🗂️ Supports all standard ZIP files</li>
    <li>🔍 Preview file names before extraction</li>
    <li>🔐 Your archives stay private and secure</li>
    <li>⚡ Fast extraction with automatic download</li>
  </ul>
</div>

    </section>
    </>
  );
};

export default ZipExtractor;
