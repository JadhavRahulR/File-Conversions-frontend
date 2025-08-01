import React, { useState } from "react";
import axios from "axios";
import "./ZipExtractor.css";
import "./compressor.css"
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';

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
    <Helmet>
      <title>Extract ZIP File | Unzip Files Online Quickly</title>
<meta name="description" content="Extract files from ZIP archives online. Fast, secure, and free ZIP extractor tool with no signup or installation required." />
<link rel="canonical" href="https://fileunivers.in/zip-extractor" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="extract zip, unzip files, zip extractor, unzip online, open zip file, extract zip folder" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
    <ScrollToTop/>
    <div className="extract-container">
      <h1 >Extract ZIP Archive</h1>

      <input type="file" accept=".zip" onChange={handleFileChange} className="file-input" />

      <button onClick={handleExtract} disabled={loading}>
        {loading ? "Extracting..." : "Extract ZIP"}
      </button>
    </div>
    <section>
      <div className="compressor-page">
  <h2 className="compressor-heading">Extract ZIP File Online</h2>
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
       <div className="tool-container">
      <p className="tool-description">
        Easily extract the contents of your .zip files directly in your browser with our secure and user-friendly ZIP extractor tool. Whether you're working with documents, images, code, or mixed file types, our tool helps you access your compressed files quickly and safely.
      </p>

      <h2 className="tool-subheading">Key Features</h2>
      <ul className="tool-steps">
        <li><strong>Browser-Based:</strong> No installation needed. Works in all modern browsers.</li>
        <li><strong>Secure:</strong> Files are processed locally or deleted after extraction on the server.</li>
        <li><strong>Multi-file Preview:</strong> View file names, sizes, and structure before downloading.</li>
        <li><strong>Fast Performance:</strong> Optimized for small and large ZIP archives.</li>
      </ul>

      <h2 className="tool-subheading">Frequently Asked Questions</h2>
      <div className="faq-list">
        <div className="faq-item">
          <h3 className="faq-question">Is it safe to extract ZIP files here?</h3>
          <p className="faq-answer">Yes. We ensure your data privacy by either processing ZIP files directly in your browser or automatically deleting them after extraction from our servers.</p>
        </div>
        <div className="faq-item">
          <h3 className="faq-question">Can I extract password-protected ZIP files?</h3>
          <p className="faq-answer">Not at the moment. Support for password-protected archives is coming soon.</p>
        </div>
        <div className="faq-item">
          <h3 className="faq-question">What file formats are supported?</h3>
          <p className="faq-answer">We support standard .zip files. Formats like .rar or .7z will be supported in future updates.</p>
        </div>
      </div>
    </div>
    </section>
    </>
  );
};

export default ZipExtractor;
