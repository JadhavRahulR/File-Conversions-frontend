import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";import axios from "axios";
import "./PDFCompressor.css";
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';

const BASE_URL = import.meta.env.VITE_BASE_URL
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
      const response = await axios.post(`${BASE_URL}/convert-compress-pdf`, formData, {
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
    <Helmet>
      <title>Compress PDF | Reduce PDF File Size Online Free</title>
<meta name="description" content="Compress your PDF files to reduce file size without losing quality. Free online PDF compressor with fast and secure compression." />
<link rel="canonical" href="https://fileunivers.in/pdf-compressor" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="compress pdf, reduce pdf size, pdf compressor, shrink pdf file, compress pdf online, free pdf compression tool" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
    <ScrollToTop/>
      <div className="compressor-container" onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
            <h1>Compress Pdf</h1>
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
        <section>
        <div className="compressor-page">
          <h2 className="compressor-heading">Compress PDF Online</h2>
          <p className="compressor-description">
            Reduce the file size of your PDF documents quickly and securely. This tool compresses images and removes unnecessary data while keeping your PDF content intact.
          </p>

          <h2 className="compressor-subheading">How to Compress a PDF?</h2>
          <ol className="compressor-steps">
            <li>📂 Upload or drag & drop your PDF file</li>
            <li>⚙️ Choose compression quality (e.g., low, medium, high)</li>
            <li>🚀 Click on <strong>Compress</strong> to reduce the file size</li>
            <li>⬇️ Auto Download the optimized PDF or `.pdf.7z` archive</li>
          </ol>

          <h2 className="compressor-subheading">Why Use Our PDF Compressor?</h2>
          <ul className="compressor-benefits">
            <li>✅ No watermark</li>
            <li>🔒 Your files stay private – processed locally or securely deleted</li>
            <li>⚡ Fast compression powered by Python backend</li>
            <li>📱 Works on mobile and desktop</li>
          </ul>
        </div>
        <section className="pdf-compressor-section">
      <div className="pdf-compressor-container">
        <h3 className="pdf-compressor-heading">Compress PDF Online – Reduce File Size Effortlessly</h3>
        <p className="pdf-compressor-intro">
          Want to reduce the size of your PDF files without compromising quality? Our online PDF compressor helps you shrink large PDF documents into smaller, more manageable files within seconds — no software installation needed!
        </p>

        <h2 className="pdf-compressor-subheading">How to Compress a PDF File?</h2>
        <ol className="pdf-compressor-steps">
          <li>📁 Upload or drag & drop your <code>.pdf</code> file into the compressor</li>
          <li>⚙️ Select your desired compression quality (high, medium, or low)</li>
          <li>🚀 Click <strong>Compress</strong> and let our tool do the work</li>
          <li>⬇️ Download the compressed PDF instantly</li>
        </ol>

        <h2 className="pdf-compressor-subheading">Why Should You Compress Your PDF Files?</h2>
        <p className="pdf-compressor-text">
          PDF files are widely used for sharing documents, contracts, reports, and more. However, high-resolution images, embedded fonts, and graphics can make PDFs unnecessarily large. Compressing your PDFs offers several benefits:
        </p>
        <ul className="pdf-compressor-benefits">
          <li>🚀 Faster upload and download speeds</li>
          <li>📱 Easy sharing via email or messaging apps</li>
          <li>💾 Saves disk space and server bandwidth</li>
          <li>🔐 Maintains content quality and layout</li>
        </ul>

        <h2 className="pdf-compressor-subheading">Features of Our Free PDF Compressor Tool</h2>
        <ul className="pdf-compressor-features">
          <li>💡 Smart compression technology for optimal quality retention</li>
          <li>🔒 100% secure – your files are never stored or shared</li>
          <li>🌐 Web-based – works on all devices and browsers</li>
          <li>🕒 Super fast – compression in seconds</li>
        </ul>

        <h2 className="pdf-compressor-subheading">Who Uses Our PDF Compressor?</h2>
        <p className="pdf-compressor-text">
          Our tool is built for everyone — from students submitting assignments to professionals sharing large documents. Whether you're working with eBooks, invoices, design portfolios, or scanned reports, our compressor simplifies your file management.
        </p>

        <h2 className="pdf-compressor-subheading">FAQs About PDF Compression</h2>
        <div className="pdf-compressor-faq">
          <h3>Q: Will compression affect the quality of my PDF?</h3>
          <p>A: Not significantly. We use intelligent compression algorithms to balance quality and size.</p>

          <h3>Q: Is there a file size limit?</h3>
          <p>A: You can upload files up to 100MB for compression. For larger files, upgrade options will be available soon.</p>

          <h3>Q: Are my files secure?</h3>
          <p>A: Absolutely. Files are processed temporarily and automatically deleted after compression.</p>
        </div>

        <h2 className="pdf-compressor-subheading">Start Compressing Your PDFs Today</h2>
        <p className="pdf-compressor-conclusion">
          Don’t let bulky files slow you down. Compress your PDF documents instantly with our simple, secure, and fast online tool. Whether it’s for work, school, or personal use — save space, reduce load times, and improve your sharing experience.
        </p>
      </div>
    </section>
      </section>
    </>
  );
};

export default PDFCompressor;
