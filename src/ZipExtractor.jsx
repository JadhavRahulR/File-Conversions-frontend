import React, { useState } from "react";
import axios from "axios";
import "./ZipExtractor.css";
import "./compressor.css";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import DropboxFileInput from "./DropboxFileInput";
import DriveFileInput from "./DriveFileInput";
import { useEffect } from "react";
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to extract zip file.mp4";
import IntroPoster from "../src/assets/images/zip extract poster.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ZipExtractor = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [folderName, setFolderName] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  // ✅ Auto-extract when file changes
  useEffect(() => {
    if (file) handleExtract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleExtract = async () => {
    if (!file) return alert("Please upload a .zip file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setProgress(10);
      setExtractedFiles([]);

      const response = await axios.post(`${BASE_URL}/extract-zip`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(Math.min(percent, 90));
          }
        },
      });

      const data = response.data;
      if (data && data.files) {
        setExtractedFiles(data.files);
        setFolderName(data.folder);
        setProgress(100);
      } else {
        alert("No files found in the ZIP.");
      }
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
        <meta
          name="description"
          content="Extract files from ZIP archives online. Fast, secure, and free ZIP extractor tool with no signup or installation required."
        />
        <link rel="canonical" href="https://fileunivers.in/zip-extractor" />
      </Helmet>

      <ScrollToTop />
      <div className="pagetitle">
        <h1>Extract ZIP Files Online – Unzip and Access Your Files Instantly </h1>
        <p className="intro-paragraph">
          Extract ZIP files online and access all your compressed files in seconds — no software download or installation needed. This free online ZIP extractor lets you quickly unzip folders, view their contents, and download the extracted files instantly. Whether it’s documents, images, videos, or software, our tool handles all types of ZIP archives effortlessly.
        </p>
      </div>

      <div
        className={`extract-container ${isDragging ? "dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <h2>Drag and Drop Your Files Here</h2>
        <input
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="file-input"
        />

        <div className="fileuploadcontainer">
          <DriveFileInput
            onFilePicked={setFile}
            allowedTypes={[".zip"]}
          />
          <DropboxFileInput
            onFilePicked={setFile}
            extensions={[".zip"]}
          />
        </div>

        {file && (
          <div className="file-preview">
            <p>
              <strong>Selected File:</strong> {file.name}{" "}
              <span style={{ color: "#777" }}>
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </p>
          </div>
        )}

        <button onClick={handleExtract} disabled={loading}>
          {loading ? `Extracting... (${progress}%)` : "Extract ZIP"}
        </button>
      </div>

      {/* ✅ Show Extracted Files List */}
      {extractedFiles.length > 0 && (
        <div className="extracted-list">
          <h2>Extracted Files ({extractedFiles.length})</h2>
          <ul>
            {extractedFiles.map((file, index) => (
              <li key={index}>
                <span>📄 {file.name}</span>
                <button
  className="download-link"
  onClick={async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(file.url, { responseType: "blob" });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download this file.");
    }
  }}
>
  Download
</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <section>
        <div className="compressor-page">
          <h2 className="compressor-heading">Extract ZIP File Online</h2>
          <p className="compressor-description">
            Quickly extract the contents of any ZIP (.zip) archive directly in
            your browser. Browse, preview, and download the extracted files
            instantly.Our online ZIP extractor is designed for speed, security, and simplicity. It safely unpacks even large ZIP files while keeping your original folder structure intact. Ideal for students, professionals, and everyday users who want to open ZIP files directly from their browser. Experience fast, private, and reliable extraction with FileUnivers.in, your one-stop platform for file tools and utilities.
          </p>
          <div className="converterImg">
            <div >
              <img src="unzip.png" alt="pdf Img" className='ConverterImgtwo' />
              <p style={{ textAlign: "center" }}>UNZIP</p>
            </div>
          </div>

          <h2 className="compressor-subheading">How to Extract a ZIP File?</h2>
          <ol className="compressor-steps">
            <li>📂 Upload or drag & drop your <code>.zip</code> file</li>
            <li>📄 View the list of files and folders inside</li>
            <li>✅ Select specific files or extract all</li>
            <li>⬇️ The extracted content will auto-download.</li>
          </ol>
          <section>
          <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to extract zip file ? "
              description='Unzip your files in seconds!. Watch this quick tutorial to learn how to extract ZIP files online easily and securely — no software needed.'
            />
          </section>

          <h2 className="compressor-subheading">Why Use Our ZIP Extractor?</h2>
          <ul className="compressor-benefits">
            <li>🗂️ Supports all standard ZIP files</li>
            <li>🔍 Preview file names before extraction</li>
            <li>🔐 Your archives stay private and secure</li>
            <li>⚡ Fast extraction with automatic download</li>

            <h2 style={{ marginBottom: "6px" }}>
              Also check other some features Related to PDF And Zip File
            </h2>
           <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
                       <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
                       <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
                       <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
                       <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
                       <li><Link to="/rtf-to-pdf" className='btn' > RTF To PDF Converter </Link></li>
                       <li><Link to="/md-to-pdf" className='btn' > MD  To PDF Converter </Link></li>
                       <li><Link to="/xlsx-to-pdf" className='btn' > XLSX  To PDF Converter </Link></li>
                       <li><Link to="/csv-to-pdf" className='btn' > CSV To PDF Converter </Link></li>
                       <li><Link to="/img-to-pdf" className='btn' > IMG To PDF Converter </Link></li>
                       <li><Link to="/tiff-to-pdf" className='btn' > TIFF To PDF Converter </Link></li>
                       <li><Link to="/pdf-to-odt" className='btn' > PDF To ODT Converter </Link></li>
                       <li><Link to="/pdf-to-pptx" className='btn' > PDF To PPTX Converter </Link></li>
                       <li><Link to="/pdf-to-rtf" className='btn' > PDF To RTF Converter </Link></li>
                       <li><Link to="/merge-pdf" className='btn' > Merge PDF  </Link></li>
                       <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
                       <li><Link to="/img-compressor" className='btn' > Compress Image  </Link></li>
            <li>
              <Link to="/zip-compressor" className="btn">
                Compress ZIP
              </Link>
            </li>
          </ul>
        </div>

        <div className="tool-container">
          <p className="tool-description">
            Easily extract the contents of your .zip files directly in your
            browser with our secure and user-friendly ZIP extractor tool.
            Whether you're working with documents, images, code, or mixed file
            types, our tool helps you access your compressed files quickly and
            safely.
          </p>

          <h2 className="tool-subheading">Key Features</h2>
          <ul className="tool-steps">
            <li>
              <strong>Browser-Based:</strong> No installation needed. Works in
              all modern browsers.
            </li>
            <li>
              <strong>Secure:</strong> Files are processed locally or deleted
              after extraction on the server.
            </li>
            <li>
              <strong>Multi-file Preview:</strong> View file names, sizes, and
              structure before downloading.
            </li>
            <li>
              <strong>Fast Performance:</strong> Optimized for small and large
              ZIP archives.
            </li>
          </ul>

          <h2 className="tool-subheading">Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3 className="faq-question">
                Is it safe to extract ZIP files here?
              </h3>
              <p className="faq-answer">
                Yes. We ensure your data privacy by either processing ZIP files
                directly in your browser or automatically deleting them after
                extraction from our servers.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">
                Can I extract password-protected ZIP files?
              </h3>
              <p className="faq-answer">
                Not at the moment. Support for password-protected archives is
                coming soon.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What file formats are supported?</h3>
              <p className="faq-answer">
                We support standard .zip files. Formats like .rar or .7z will be
                supported in future updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ZipExtractor;
