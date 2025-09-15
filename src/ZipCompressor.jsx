import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./ZipCompressor.css"; // 👈 custom styles here
import "./compressor.css"
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL
const ZipCompressor = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);


  const onDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleSubmit = async (e) => {
    setProgress(10);
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one file.");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/convert-to-zip`, formData, {
        responseType: "blob",
        onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(Math.min(percent, 90));
                },
      });

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed_files.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      alert("ZIP creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Helmet>
      <title>Folder to ZIP Converte | Compress Folder to ZIP Online</title>
<meta name="description" content="Convert any folder to a ZIP file online with ease. Secure and fast folder-to-ZIP compression tool. No installation or signup needed." />
<link rel="canonical" href="https://fileunivers.in/zip-compressor" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="folder to zip, zip folder online, compress folder, convert folder to zip, folder zip converter, zip compression" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
    <ScrollToTop/>
    <div className="zip-container">
      <h1>Convert Files to ZIP</h1>

      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        <p>{isDragActive ? "Drop your files here..." : "Drag & drop files here, or click to browse"}</p>
      </div>

      {files.length > 0 && (
        <ul className="file-list">
          {files.map((f, i) => (
            <li key={i}>📄 {f.name}</li>
          ))}
        </ul>
      )}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? `Converting... (${progress}%)` : "Create ZIP"}
      </button>
    </div>
    <section>
      <div className="compressor-page">
  <h2 className="compressor-heading">Convert Folder to ZIP Online</h2>
  <p className="compressor-description">
    Easily compress an entire folder into a ZIP archive. Perfect for sharing multiple files or backing up projects in one compact package.
  </p>

  <h2 className="compressor-subheading">How to Convert a Folder to ZIP?</h2>
  <ol className="compressor-steps">
    <li>📁 Upload or drag & drop a folder (containing files and subfolders)</li>
    <li>📦 The contents will be packed into a ZIP file</li>
    <li>🚀 Click <strong>Convert</strong> to start the compression</li>
    <li>⬇️ Your ZIP archive will auto-download once it's ready</li>
  </ol>

  <h2 className="compressor-subheading">Why Use Our Folder to ZIP Converter?</h2>
  <ul className="compressor-benefits">
    <li>🗂️ Supports nested folders and multiple files</li>
    <li>📉 Reduces overall file size for faster uploads</li>
    <li>🔐 Your files are processed securely and never stored</li>
    <li>⚡ Fast conversion with automatic download</li>
    <h2 style={{ marginBottom: '6px' }}>Also check other some features Related to PDF And Zip File </h2>
                <li><Link to="/word-to-pdf" className='btn' >Word to PDF Converter </Link></li>
                <li><Link to="/pdf-to-word" className='btn'>PDF to Word Converter </Link></li>
                <li><Link to="/odt-to-pdf" className='btn' >odt to pdf Converter </Link></li>
                <li><Link to="/pdf-to-odt" className='btn' > pdf to odt Converter </Link></li>
                <li><Link to="/pdf-to-txt" className='btn' > pdf to txt Converter </Link></li>
                <li><Link to="/pdf-to-pptx" className='btn' > pdf to pptx Converter </Link></li>
                <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
                <li><Link to="/zip-extractor" className='btn' > Extract Zip   </Link></li>
  </ul>
</div>
<section>
  <div className="tool-container">
      <h2 className="tool-subheading">Frequently Asked Questions</h2>

      <div className="faq-list">
        <div className="faq-item">
          <h3 className="faq-question">Can I compress multiple folders at once?</h3>
          <p className="faq-answer">Currently, you can compress one folder at a time. For bulk folder compression, repeat the process for each folder.</p>
        </div>
        <div className="faq-item">
          <h3 className="faq-question">Is there a size limit for the folder?</h3>
          <p className="faq-answer">Folders up to 500MB are supported. Larger sizes may take longer to process or may not be supported on some browsers.</p>
        </div>
        <div className="faq-item">
          <h3 className="faq-question">Are my files safe?</h3>
          <p className="faq-answer">Yes, all processing is done locally or on our secure servers. Files are automatically deleted after compression.</p>
        </div>
      </div>
    </div>
</section>
    </section>
</>
  );
};

export default ZipCompressor;
