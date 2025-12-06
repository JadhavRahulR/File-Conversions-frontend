import React, { useState, useEffect } from "react";
import { ZipReader, BlobReader, TextWriter, BlobWriter, ZipWriter } from "@zip.js/zip.js";
import axios from "axios";
import "./ZipExtractor.css";
import "./compressor.css";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import DropboxFileInput from "./DropboxFileInput";
import DriveFileInput from "./DriveFileInput";
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to extract zip file.mp4";
import IntroPoster from "../src/assets/images/zip extract poster.png";

// import { ZipReader, BlobReader, BlobWriter } from "@zip.js/zip.js";

const ZipExtractor = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (file) handleExtract();
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

  const handleDragLeave = () => setIsDragging(false);

  // ✅ NEW UPDATED FAST FRONTEND ZIP EXTRACTION
  const handleExtract = async () => {
  if (!file) return alert("Please upload a .zip file");

  try {
    setLoading(true);
    setProgress(10);
    setExtractedFiles([]);

    // Create ZIP reader (central directory only)
    const zipReader = new ZipReader(new BlobReader(file), {
      readEntries: false,    // 🔥 SUPER IMPORTANT → instant listing
      useWebWorkers: false,  // faster for metadata-only operations
    });

    // Only reads central directory
    const entries = await zipReader.getEntries();
    setProgress(40);

    if (!entries.length) {
      alert("No files found in ZIP");
      return;
    }

    // Create list WITHOUT extracting anything
    const list = entries.map((entry) => ({
      name: entry.filename,
      isDirectory: entry.directory,
      size: entry.uncompressedSize,
      compressedSize: entry.compressedSize,
      entry: entry, // store entry so we can extract later
    }));

    setFolderName(file.name.replace(/\.zip$/i, ""));
    setExtractedFiles(list);
    setProgress(100);

    await zipReader.close();
  } catch (err) {
    console.error("ZIP listing error:", err);
    alert("Failed to read zip file.");
  } finally {
    setLoading(false);
  }

  };
  const extractSingleFile = async (entry) => {
    try {
      const blob = await entry.getData(new BlobWriter());
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = entry.filename;
      a.click();
    } catch (err) {
      console.error("Extract error:", err);
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
          Extract ZIP files online and access all your compressed files in seconds — no software download or installation needed. This free online ZIP extractor lets you quickly unzip folders, view their contents, and download the extracted files instantly.
        </p>
      </div>

      <div
        className={`extract-container ${isDragging ? "dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <h2>Drag and Drop Your Files Here</h2>
        <input type="file" accept=".zip" onChange={handleFileChange} className="file-input" />

        <div className="fileuploadcontainer">
          <DriveFileInput onFilePicked={setFile} allowedTypes={[".zip"]} />
          <DropboxFileInput onFilePicked={setFile} extensions={[".zip"]} />
        </div>

        {file && (
          <div className="file-preview">
            <p>
              <strong>Selected File:</strong> {file.name}{" "}
              <span style={{ color: "#777" }}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </p>
          </div>
        )}

        <button onClick={handleExtract} disabled={loading}>
          {loading ? `Extracting... (${progress}%)` : "Extract ZIP"}
        </button>
      </div>

      {/* Extracted Files List */}
      {extractedFiles.length > 0 && (
  <div className="extracted-list">
    <h2>Files in ZIP ({extractedFiles.length})</h2>
    <ul>
      {extractedFiles.map((file, index) => (
        <li key={index}>
          <span>
            {file.isDirectory ? "📁" : "📄"} {file.name}
          </span>

          {/* Only show download button for files */}
          {!file.isDirectory && (
            <button
              className="download-link"
              onClick={() => extractSingleFile(file.entry)}
            >
              Download
            </button>
          )}
        </li>
      ))}
    </ul>
  </div>
)}


      {/* 🔥 Entire page content kept SAME below */}
      <section>
        <div className="compressor-page">
          <h2 className="compressor-heading">Extract ZIP File Online</h2>
          <p className="compressor-description">
            Quickly extract the contents of any ZIP (.zip) archive directly in your browser...
          </p>

          <div className="converterImg">
            <div>
              <img src="unzip.png" alt="pdf Img" className="ConverterImgtwo" />
              <p style={{ textAlign: "center" }}>UNZIP</p>
            </div>
          </div>

          <h2 className="compressor-subheading">How to Extract a ZIP File?</h2>
          <ol className="compressor-steps">
            <li>📂 Upload or drag & drop your .zip file</li>
            <li>📄 View the list of files inside</li>
            <li>✅ Select specific files or extract all</li>
            <li>⬇️ The extracted content will auto-download.</li>
          </ol>

          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster} title="How to extract zip file ? " />
          </section>

          <h2 className="compressor-subheading">Why Use Our ZIP Extractor?</h2>
          <ul className="compressor-benefits">
            <li>🗂️ Supports all standard ZIP files</li>
            <li>🔍 Preview file names before extraction</li>
            <li>🔐 Fully private – processed in your browser</li>
            <li>⚡ Fast extraction</li>

            {/* Same internal links preserved */}
            <h2 style={{ marginBottom: "6px" }}>Also check other tools</h2>
            <li><Link to="/word-to-pdf" className="btn">WORD To PDF Converter</Link></li>
            <li><Link to="/odt-to-pdf" className="btn">ODT To PDF Converter</Link></li>
            <li><Link to="/pdf-to-odt" className="btn">PDF To ODT Converter</Link></li>
            <li><Link to="/text-to-pdf" className="btn">TEXT To PDF Converter</Link></li>
            <li><Link to="/pptx-to-pdf" className="btn">PPTX To PDF Converter</Link></li>
            <li><Link to="/rtf-to-pdf" className="btn">RTF To PDF Converter</Link></li>
            <li><Link to="/md-to-pdf" className="btn">MD To PDF Converter</Link></li>
            <li><Link to="/xlsx-to-pdf" className="btn">XLSX To PDF Converter</Link></li>
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
