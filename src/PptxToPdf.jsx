import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import "./converter.css"
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';

const BASE_URL = import.meta.env.VITE_BASE_URL
const PptxToPdf = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");

  const handleFileChange = (eOrFile) => {
    const file = eOrFile?.target?.files?.[0] || eOrFile;
    if (file) {
      setFile(file);
      setStatus(status === "Done" ? "upload" : "convert");
    }
  };

  const handleConvert = async () => {
    if (!file) return alert("Please select a PPTX file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(`${BASE_URL}/convert-pptx-to-pdf`, formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pptx$/, '') + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
      setStatus("✅ Conversion complete!");
    } catch (error) {
      console.error("Conversion failed", error);
      alert("Failed to convert file.");
    }
  };
  useEffect(() => {
    if (status === "✅ Conversion complete!") {
      setTimeout(() => {
        setFile(null);
        setStatus("Convert");
      }, 4000);
    }
  }, [status]);

  return (
    <>
      <Helmet>
        <title>PPTX to PDF | Free PowerPoint to PDF Converter</title>
        <meta name="description" content="Convert PPTX presentations to PDF format quickly and securely. Free online PPTX to PDF converter with no signup or email needed." />
        <link rel="canonical" href="https://fileunivers.in/pptx-to-pdf" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="pptx to pdf, convert pptx to pdf, powerpoint to pdf, free pptx to pdf converter, online pptx to pdf" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <Tools />
      <section>
        <div className='converter'>
          <h1>Convert Pptx To Pdf</h1>
          <input type="file" accept=".pptx" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pptx']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pptx']} />
          </div>
          <DropzoneInput acceptedType={['pptx']} file={file} onFileAccepted={setFile} setStatus={setStatus} />
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
        <div className="converter-container">
          <h2 className="converter-title">Convert PPTX to PDF – High-Quality & Free</h2>

          <div className="converter-section">
            <h2>🔄 How to Convert PPTX to PDF</h2>
            <ol>
              <li>📤 Upload your PowerPoint (.pptx) file – drag & drop or click to select.</li>
              <li>⚙️ We’ll convert your slides into a clean and printable PDF.</li>
              <li>📥 Auto Download the PDF after conversion.</li>
            </ol>
            <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
          </div>

          <div className="converter-section">
            <h2>🔒 Why Use Our PPTX to PDF Converter?</h2>
            <ul>
              <li>✅ Preserves slide design, fonts, animations (as static), and layout.</li>
              <li>🔐 Files are deleted automatically after conversion to ensure privacy.</li>
              <li>⚡ Fast and accurate conversion – ready in seconds.</li>
              <li>🌐 Works on all browsers and devices, no installs needed.</li>
              <li>🆓 Completely free with unlimited conversions.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .pptx (PowerPoint Presentation)</p>
            <p><strong>Output:</strong> .pdf</p>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Will transitions or animations be preserved?<br />
              <strong>A:</strong> No, animations are flattened into static slides in the PDF.</p>
            <p><strong>Q:</strong> Can I print the resulting PDF?<br />
              <strong>A:</strong> Yes, the output is print-ready and optimized.</p>
            <p><strong>Q:</strong> Will slide notes be included?<br />
              <strong>A:</strong> Currently, only the visual slides are included, not speaker notes.</p>
          </div>
          <div className="compresspdf-article-section">
            <h2>🎯 Convert PPTX to PDF – Presentations to Portable Documents</h2>
            <p>
              Quickly convert your PowerPoint presentations (PPTX) into universally viewable PDF files with our fast, free, and secure online converter. Whether you’re submitting a presentation for review, sharing it via email, or printing it for meetings, converting it to PDF ensures consistent formatting across all devices and platforms.
            </p>

            <h3>📘 What is a PPTX File?</h3>
            <p>
              A PPTX file is the modern file format used by Microsoft PowerPoint to create digital slideshows. It supports multimedia, transitions, charts, and other dynamic elements. While great for editing, PPTX files can sometimes display inconsistently on different systems.
            </p>

            <h3>📄 Why Convert PPTX to PDF?</h3>
            <ul>
              <li><strong>Universal Accessibility:</strong> PDFs can be opened on any device without PowerPoint or presentation software.</li>
              <li><strong>Preserves Layout:</strong> Ensure fonts, images, and slide designs appear exactly as intended.</li>
              <li><strong>Smaller File Size:</strong> PDF files are often more lightweight than large PPTX files, making them ideal for sharing.</li>
              <li><strong>Ready for Printing:</strong> Convert for high-quality handouts or archival purposes.</li>
              <li><strong>Professional Submissions:</strong> Many academic and corporate systems prefer document submissions in PDF format.</li>
            </ul>

            <h3>🧑‍💼 Who Uses PPTX to PDF Conversion?</h3>
            <ul>
              <li><strong>Students:</strong> Submit final presentations in fixed-format PDFs for assignments or thesis evaluations.</li>
              <li><strong>Educators:</strong> Distribute static slide decks without the risk of formatting errors.</li>
              <li><strong>Corporate Teams:</strong> Archive pitch decks or share with clients in a professional format.</li>
              <li><strong>Designers & Freelancers:</strong> Deliver polished presentations as uneditable PDFs to clients.</li>
            </ul>

            <h3>🌍 Online & Cross-Platform</h3>
            <p>
              Our converter works entirely in your browser. No installation, no downloads, no limits. It’s compatible with Windows, macOS, Linux, Android, and iOS.
            </p>

            <h3>🔒 Privacy Matters</h3>
            <p>
              We take your privacy seriously. All uploads are processed securely and automatically deleted from our servers after a short time. Your data remains confidential at all times.
            </p>

            <h3>✨ Benefits of Using Our Tool</h3>
            <ul>
              <li>Absolutely free, no hidden costs or subscriptions</li>
              <li>No account or login needed</li>
              <li>Fast processing with accurate conversion results</li>
              <li>Preserves fonts, slide design, images, and layout</li>
              <li>Supports all modern PowerPoint (.pptx) versions</li>
            </ul>

          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your PPTX file to a professional PDF – secure, accurate, and fast!</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default PptxToPdf;
