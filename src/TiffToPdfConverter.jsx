import React, { useState } from "react";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL
const TiffToPdfConverter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");
  const [progress, setProgress] = useState(0);

           
             const handleFileChange = (eOrFile) => {
               const file = eOrFile?.target?.files?.[0] || eOrFile;
               if (file) {
                 setFile(file);
                 setStatus(status === "Done" ? "upload" : "convert");
               }
             };

  const handleConvert = async () => {
    setProgress(10);

    if (!file) return alert("Please upload a TIFF file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-tiff-to-pdf`,
        formData,
        { responseType: "blob",
          onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(Math.min(percent, 90));
                },
         }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
      setStatus("✅ Conversion complete!");
    } catch (error) {
      console.error("❌ Conversion failed", error);
      alert("Conversion failed");
    }
  };

  return (
    <>
    <Helmet>

    <title>TIFF to PDF | Free TIFF Image to PDF Converter</title>
<meta name="description" content="Convert TIFF images to PDF files quickly and securely. Free online TIFF to PDF converter with no email or registration required." />
<link rel="canonical" href="https://fileunivers.in/tiff-to-pdf" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="tiff to pdf, convert tiff to pdf, image to pdf, free tiff to pdf converter, online tiff to pdf, tiff file to pdf" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
    <ScrollToTop/>
    <Tools/>
   <section>
        <div className='converter'>
          <h1>Convert TIFF To Pdf</h1>
          <input type="file" accept=".tiff" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={[".tiff"]} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.tiff']} />
          </div>
          {file && (
            <p className="selected-file ">
              ✅ Selected File: <b>{file.name}</b>
            </p>
          )}
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status === 'Converting...'? `Converting... (${progress}%)` :"Upload"}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert TIFF to PDF – Free, Fast & High-Quality</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert TIFF to PDF</h2>
      <ol>
        <li>📤 Upload your TIFF or TIF file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it into a high-resolution PDF document.</li>
        <li>📥 Auto Download the PDF after conversion is complete.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large or multi-page TIFF files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h1>🔒 Why Use Our TIFF to PDF Converter?</h1>
      <ul>
        <li>✅ Converts single or multi-page TIFF files into clean PDF pages.</li>
        <li>🔐 Secure: Files are auto-deleted after processing.</li>
        <li>⚡ Quick and accurate conversion with preserved image quality.</li>
        <li>🌐 100% online – no software required.</li>
        <li>🆓 Free to use, with unlimited file uploads.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .tiff, .tif</p>
      <p><strong>Output:</strong> .pdf</p>
       <h2>Also check other features Related to PDF and Image file  </h2>
                                    <li><Link to="/word-to-pdf" className='btn' >Word to PDF Converter </Link></li>
                                    <li><Link to="/pdf-to-word" className='btn'>PDF to Word Converter </Link></li>
                                    <li><Link to="/odt-to-pdf" className='btn' >odt to pdf Converter </Link></li>
                                    <li><Link to="/text-to-pdf" className='btn' >txt to pdf Converter </Link></li>
                                    <li><Link to="/pptx-to-pdf" className='btn' > pptx to pdf  Converter </Link></li>
                                    <li><Link to="/rtf-to-pdf" className='btn' > rtf to pdf Converter </Link></li>
                                    <li><Link to="/html-to-pdf" className='btn' > html to pdf Converter </Link></li>
                                    <li><Link to="/md-to-pdf" className='btn' > md  to pdf Converter </Link></li>
                                    <li><Link to="/xlsx-to-pdf" className='btn' > xlsx  to pdf Converter </Link></li>
                                    <li><Link to="/csv-to-pdf" className='btn' > csv to pdf Converter </Link></li>
                                    <li><Link to="/pdf-to-odt" className='btn' > pdf to odt Converter </Link></li>
                                    <li><Link to="/pdf-to-txt" className='btn' > pdf to txt Converter </Link></li>
                                    <li><Link to="/pdf-to-pptx" className='btn' > pdf to pptx Converter </Link></li>
                                    <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
                                    <li><Link to="/tiffcompressor" className='btn' > Compress Tiff  </Link></li>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Can I convert multi-page TIFFs?<br />
        <strong>A:</strong> Yes, all pages in the TIFF will be preserved in the final PDF.</p>
      <p><strong>Q:</strong> Will the PDF retain the original resolution?<br />
        <strong>A:</strong> Absolutely. We maintain high image quality during conversion.</p>
      <p><strong>Q:</strong> Is this tool private and secure?<br />
        <strong>A:</strong> Yes, your files are automatically deleted after conversion.</p>
    </div>
            <div className="compresspdf-article-section">
  <h2>🧾 Convert TIFF to PDF – High-Quality TIFF to PDF Transformation</h2>
  <p>
    Need to convert large TIFF files into a more shareable and readable format? Our TIFF to PDF converter makes it simple to turn your scanned documents, faxes, or high-resolution images into compact PDF files, ready for digital sharing and printing.
  </p>

  <h3>🖼️ What is TIFF to PDF Conversion?</h3>
  <p>
    TIFF (Tagged Image File Format) is commonly used for storing high-quality images, often scanned documents or faxes. However, TIFFs can be large and not always compatible with mobile devices or browsers. Converting TIFF files to PDF ensures better accessibility, smaller file sizes, and universal compatibility.
  </p>

  <h3>✅ Why Convert TIFF to PDF?</h3>
  <ul>
    <li><strong>Better Compatibility:</strong> PDFs are easier to open and share across devices.</li>
    <li><strong>Smaller File Size:</strong> Compress large TIFFs into optimized PDF documents.</li>
    <li><strong>Preserve Image Quality:</strong> Retain clarity while reducing file size.</li>
    <li><strong>Multi-Page Support:</strong> Combine multiple TIFF images into a single PDF file.</li>
  </ul>

  <h3>👤 Who Should Use TIFF to PDF?</h3>
  <ul>
    <li><strong>Medical professionals:</strong> Store scanned X-rays or documents efficiently.</li>
    <li><strong>Lawyers & agencies:</strong> Archive scanned legal documents.</li>
    <li><strong>Students & researchers:</strong> Convert large TIFF research files to PDF.</li>
    <li><strong>Photographers:</strong> Share TIFF images as accessible PDF portfolios.</li>
  </ul>

  <h3>🌟 Features of Our TIFF to PDF Tool</h3>
  <ul>
    <li>Supports both single and multi-page TIFFs</li>
    <li>Preserves image sharpness and resolution</li>
    <li>Automatic orientation and page size detection</li>
    <li>Drag-and-drop functionality</li>
    <li>100% free to use with no watermarks</li>
  </ul>

  <h3>📲 Cross-Platform & Browser-Based</h3>
  <p>
    Use our tool on Windows, macOS, Android, or iOS without downloading any software. It's completely web-based and optimized for all screen sizes.
  </p>

  <h3>🔒 Secure and Private</h3>
  <p>
    We prioritize your data privacy. Your TIFF files are processed securely and automatically deleted after conversion—nothing is stored on our servers.
  </p>

  <h3>🚀 Why Choose Our TIFF to PDF Converter?</h3>
  <ul>
    <li>Fast, simple, and efficient conversion process</li>
    <li>Retains the original image clarity</li>
    <li>Great for printing or digital use</li>
    <li>No sign-up or account required</li>
  </ul>

 
</div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your TIFF images to clean, professional PDFs instantly – fast, free, and secure.</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

        </>
  );
};

export default TiffToPdfConverter;
