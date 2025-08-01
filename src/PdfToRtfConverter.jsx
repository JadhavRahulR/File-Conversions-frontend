import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';

const BASE_URL = import.meta.env.VITE_BASE_URL
const PdfToRtfConverter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");

  const handleFileChange = (eOrFile) => {
    const file = eOrFile?.target?.files?.[0] || eOrFile;
    // setFile(file);
    if (file) {
      setFile(file);
      setStatus(status === "Done" ? "upload" : "convert");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...");

      const response = await axios.post(`${BASE_URL}/convert-pdf-to-rtf`, formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: 'application/rtf' });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = file.name.replace(/\.pdf$/, ".rtf");
      link.click();

      setStatus("✅ Conversion complete!");
    } catch (error) {
      console.error("Conversion failed", error);
      setStatus("❌ Conversion failed");
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
      <title>PDF to RTF | Free PDF to Rich Text Format Converter</title>
<meta name="description" content="Easily convert PDF files to RTF documents online. Use our free PDF to RTF converter — no email, signup, or watermark required." />
<link rel="canonical" href="https://fileunivers.in/pdf-to-rtf" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="pdf to rtf, convert pdf to rtf, pdf to rich text, free pdf to rtf converter, online pdf to rtf, editable rtf from pdf" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
      <ScrollToTop />
      <section>
        <Tools />

        <div className='converter'>
          <h1>Convert Pdf to Rtf </h1>

          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} />
          </div>
          <DropzoneInput acceptedType={['pdf']} file={file} onFileAccepted={setFile} setStatus={setStatus} />

          <button onClick={handleUpload} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h2 className="converter-title">Convert PDF to RTF – Editable Rich Text Format</h2>

    <div className="converter-section">
      <h2>🔄 How to Convert PDF to RTF</h2>
      <ol>
        <li>📤 Upload your PDF file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it to an RTF (Rich Text Format) document.</li>
        <li>📥 Auto Download the RTF file after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large or scanned PDFs may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our PDF to RTF Converter?</h2>
      <ul>
        <li>✅ Accurately extracts text, images, and formatting.</li>
        <li>🔐 Your files are auto-deleted after conversion to ensure privacy.</li>
        <li>⚡ Fast and reliable conversion, including OCR for scanned PDFs.</li>
        <li>🌐 100% browser-based – works on any device.</li>
        <li>🆓 Free to use with no registration required.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .pdf</p>
      <p><strong>Output:</strong> .rtf (Rich Text Format)</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Is the output file editable?<br />
        <strong>A:</strong> Yes, the RTF file can be edited in WordPad, Microsoft Word, LibreOffice, and other editors.</p>
      <p><strong>Q:</strong> Will it extract text from scanned documents?<br />
        <strong>A:</strong> Yes, OCR is used for image-based PDFs to retrieve editable text.</p>
      <p><strong>Q:</strong> Do I need to install anything?<br />
        <strong>A:</strong> No, the tool works directly in your web browser.</p>
    </div>
<div className="compresspdf-article-section">
  <h2>📄 Convert PDF to RTF – Extract Editable Text from PDF Files</h2>
  <p>
    Easily convert your PDF documents to Rich Text Format (RTF) using our free and secure online tool. Extract editable content including paragraphs, font styles, and lists into an RTF file that can be opened in any word processor like Microsoft Word or LibreOffice.
  </p>

  <h3>📌 Why Convert PDF to RTF?</h3>
  <ul>
    <li><strong>Edit Your PDF Content:</strong> Convert static text from PDF into a format you can easily modify.</li>
    <li><strong>Lightweight & Portable:</strong> RTF files are smaller and supported by nearly all text editors.</li>
    <li><strong>Cross-Platform Compatibility:</strong> Open RTF files in Word, Google Docs, LibreOffice, and more.</li>
    <li><strong>Ideal for Resumes, Letters, and Reports:</strong> Reuse content from PDFs without retyping.</li>
  </ul>

  <h3>👨‍💼 Who Needs PDF to RTF Conversion?</h3>
  <ul>
    <li><strong>Writers:</strong> Reuse content from published PDFs in editable form.</li>
    <li><strong>Students:</strong> Extract information from study PDFs to edit notes.</li>
    <li><strong>Businesses:</strong> Edit or update contracts, invoices, and memos saved as PDFs.</li>
    <li><strong>Researchers:</strong> Quickly copy and adapt references or excerpts from PDF files.</li>
  </ul>


  <h3>⚙️ Features of This PDF to RTF Converter</h3>
  <ul>
    <li>Preserves fonts, text alignment, and basic formatting</li>
    <li>Fast conversion even for large PDF documents</li>
    <li>No watermark, no signup – 100% free</li>
    <li>Works on all devices: mobile, desktop, tablet</li>
    <li>Browser-based – no software installation needed</li>
  </ul>

  <h3>🖥️ Platform Support</h3>
  <p>
    This converter runs on Windows, macOS, Linux, Android, and iOS. Whether you’re using Chrome, Safari, or Firefox, your conversion is fast and reliable.
  </p>

  <h3>🔐 File Safety & Privacy</h3>
  <p>
    We take file security seriously. Your PDF and converted RTF are transmitted securely and automatically deleted after conversion. Your documents are never stored or viewed by anyone.
  </p>

  <h3>🚀 Why Use Our PDF to RTF Tool?</h3>
  <ul>
    <li>Free and unlimited use</li>
    <li>No login or account needed</li>
    <li>Clean and fast interface</li>
    <li>Accurate and editable RTF output</li>
    <li>Supports both simple and complex PDFs</li>
  </ul>

</div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your PDFs to fully editable RTF documents in just seconds – secure, fast, and free!</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>


    </>
  );
};

export default PdfToRtfConverter;
