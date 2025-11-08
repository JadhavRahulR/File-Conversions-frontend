import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./ZipCompressor.css";
import "./compressor.css";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import DropboxFileInput from "./DropboxFileInput";
import DriveFileInput from "./DriveFileInput";
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to create zip file.mp4";
import IntroPoster from "../src/assets/images/zip file poster.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ZipCompressor = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipName, setZipName] = useState(""); // ✅ New state for rename

  // 🔹 Handle drag & drop
  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  // 🔹 Handle Dropbox or Drive file select
  const handleExternalFile = (file) => {
    if (!file) return;
    setFiles((prevFiles) => [...prevFiles, file]);
    setStatus("file-added");
  };

  // ✅ Sanitize filename (remove invalid characters)
  const sanitizeFileName = (name) => {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").trim();
  };

  // 🔹 Handle compression request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one file.");
    setProgress(10);

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

      // ✅ Use custom rename if provided, otherwise fallback
      const safeName = sanitizeFileName(zipName || "compressed_files");
      a.href = url;
      a.download = `${safeName}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      alert("ZIP creation failed.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      <Helmet>
        <title>Folder to ZIP Converter | Compress Folder to ZIP Online</title>
        <meta
          name="description"
          content="Convert any folder to a ZIP file online with ease. Secure and fast folder-to-ZIP compression tool. No installation or signup needed."
        />
        <link rel="canonical" href="https://fileunivers.in/zip-compressor" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="folder to zip, zip folder online, compress folder, convert folder to zip, folder zip converter, zip compression"
        />
      </Helmet>

      <ScrollToTop />
      <div className="pagetitle">
        <h1>Compress Files to ZIP Online – Create ZIP Archives Instantly</h1>
        <p className="intro-paragraph">
          Quickly compress files to ZIP online and reduce file sizes for easier sharing and storage. Whether you have documents, images, videos, or folders, this free online ZIP compressor lets you bundle multiple files into a single compact ZIP archive — all without installing any software. Just upload your files, compress them, and download your new ZIP in seconds.
        </p>
      </div>

      <div className="zip-container">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""}`}
        >
          <input {...getInputProps()} />
          <p>
            {isDragActive
              ? "Drop your files here..."
              : "Drag & drop files here, or click to browse"}
          </p>
           <div className="fileuploadcontainer">
          <DriveFileInput
            onFilePicked={handleExternalFile}
            setStatus={setStatus}
            allowedTypes={["*"]}
          />
          <DropboxFileInput
            onFilePicked={handleExternalFile}
            setStatus={setStatus}
            extensions={["*"]}
          />
        </div>
        </div>

       

        {/* ✅ Rename input */}
        <div className="rename-container">
          <label htmlFor="zipName">Rename ZIP file (optional):</label>
          <input
            id="zipName"
            type="text"
            value={zipName}
            onChange={(e) => setZipName(e.target.value)}
            placeholder="Enter new file name (e.g. MyProject)"
          />
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
            Easily compress an entire folder into a ZIP archive. Perfect for
            sharing multiple files or backing up projects in one compact package.Our online ZIP compression tool ensures your files are safely compressed without losing quality or data integrity. It’s perfect for students, professionals, and businesses who want to share large files easily via email or cloud storage. With FileUnivers.in, you get a fast, secure, and efficient ZIP compression experience right from your browser — anytime, anywhere.
          </p>
          <div className="converterImg">
            <div >
              <img src="zip.png" alt="zip Img" className='ConverterImgtwo' />
              <p style={{ textAlign: "center" }}>ZIP</p>
            </div>
          </div>

          <h2 className="compressor-subheading">How to Convert a Folder to ZIP?</h2>
          <ol className="compressor-steps">
            <li>
              📁 Upload or drag & drop a folder (containing files and subfolders)
            </li>
            <li>📦 The contents will be packed into a ZIP file</li>
            <li>
              🚀 Click <strong>Convert</strong> to start the compression
            </li>
            <li>⬇️ Your ZIP archive will auto-download once it's ready</li>
          </ol>
          <section>
          <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to create zip file ? "
              description='Shrink your files and folders in seconds! 🗜️⚡ This video shows how to compress files into ZIP format online easily and securely. In this video, you’ll learn: How to upload and compress files into a ZIP ,Combine multiple files into one archive Download your ZIP instantly .'
            />
          </section>

          <h2 className="compressor-subheading">
            Why Use Our Folder to ZIP Converter?
          </h2>
          <ul className="compressor-benefits">
            <li>🗂️ Supports nested folders and multiple files</li>
            <li>📉 Reduces overall file size for faster uploads</li>
            <li>🔐 Your files are processed securely and never stored</li>
            <li>⚡ Fast conversion with automatic download</li>
            <h2 style={{ marginBottom: "6px" }}>
              Also check other some features Related to PDF And Zip File
            </h2>
           <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
                       <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
                       <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
                       <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
                       <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
                       <li><Link to="/rtf-to-pdf" className='btn' > RTf To PDF Converter </Link></li>
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
              <Link to="/zip-extractor" className="btn">
                Extract Zip
              </Link>
            </li>
          </ul>
        </div>

        <section>
          <div className="tool-container">
            <h2 className="tool-subheading">Frequently Asked Questions</h2>

            <div className="faq-list">
              <div className="faq-item">
                <h3 className="faq-question">
                  Can I compress multiple folders at once?
                </h3>
                <p className="faq-answer">
                  Currently, you can compress one folder at a time. For bulk
                  folder compression, repeat the process for each folder.
                </p>
              </div>
              <div className="faq-item">
                <h3 className="faq-question">Is there a size limit for the folder?</h3>
                <p className="faq-answer">
                  Folders up to 500MB are supported. Larger sizes may take longer
                  to process or may not be supported on some browsers.
                </p>
              </div>
              <div className="faq-item">
                <h3 className="faq-question">Are my files safe?</h3>
                <p className="faq-answer">
                  Yes, all processing is done locally or on our secure servers.
                  Files are automatically deleted after compression.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default ZipCompressor;
