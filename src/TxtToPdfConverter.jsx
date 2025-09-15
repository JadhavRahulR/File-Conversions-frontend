// TxtToPdfConverter.jsx
import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from "axios";
import "./converter.css";
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL
const TxtToPdfConverter = () => {
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

    if (!file) return alert("Please upload a TXT file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-txt-to-pdf`,
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
      a.download = file.name.replace(".txt", ".pdf");
      a.click();
      window.URL.revokeObjectURL(url);
      setStatus("✅ Conversion complete!");
    } catch (error) {
      console.error("❌ Conversion failed", error);
      alert("Conversion failed");
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
        <title>TXT to PDF | Free Text File to PDF Converter</title>
        <meta name="description" content="Convert TXT files to PDF easily and securely. Free online TXT to PDF converter with no signup or email required." />
        <link rel="canonical" href="https://fileunivers.in/text-to-pdf" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="txt to pdf, convert txt to pdf, text file to pdf, free txt to pdf converter, online txt to pdf" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <section>
        <Tools />
        <div className='converter'>
          <h1>Convert Text/Txt To PDF</h1>
          <input type="file" accept=".txt" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={[".txt"]} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.txt']} />
          </div>
          <DropzoneInput acceptedType={['txt']} file={file} onFileAccepted={setFile} setStatus={setStatus} />

          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status === 'Converting...'? `Converting... (${progress}%)` :"Upload"}
          </button>
        </div>
      </section>
      <section>
        <div className="converter-container">
          <h2 className="converter-title">Convert Text to PDF – Simple & Fast</h2>

          <div className="converter-section">
            <h2>🔄 How to Convert Text to PDF</h2>
            <ol>
              <li>📤 Upload your TXT file – drag & drop or click to select.</li>
              <li>⚙️ We’ll convert your plain text into a clean PDF file.</li>
              <li>📥 Auto Download the PDF instantly after conversion.</li>
            </ol>
            <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
          </div>

          <div className="converter-section">
            <h2>🔒 Why Use Our Text to PDF Converter?</h2>
            <ul>
              <li>✅ Clean formatting: Your text is neatly wrapped into a readable PDF.</li>
              <li>🔐 Privacy-first: Files are deleted automatically after conversion.</li>
              <li>⚡ Instant conversion with zero waiting time.</li>
              <li>🌐 Works on desktop, mobile, and all modern browsers.</li>
              <li>🆓 100% free with no signups.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .txt (Plain Text)</p>
            <p><strong>Output:</strong> .pdf</p>
             <h2>Also check other features Related to Txt file formate </h2>
              <li><Link to="/pdf-to-txt" className='btn' > pdf to txt Converter </Link></li>
              <Link></Link>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Can I copy/paste from the PDF?<br />
              <strong>A:</strong> Yes, the output PDF is fully selectable and copyable.</p>
            <p><strong>Q:</strong> Will line breaks and spacing be preserved?<br />
              <strong>A:</strong> Yes, we preserve the structure of your original TXT file.</p>
            <p><strong>Q:</strong> Is this tool free to use forever?<br />
              <strong>A:</strong> Yes, no limits, no fees.</p>
          </div>
          <div className="compresspdf-article-section">
            <h2>📝 Convert Text to PDF – Free Online Tool</h2>
            <p>
              Looking to save your plain text (.txt) files as professional PDFs? Our Text to PDF converter helps you create clean, printer-friendly PDFs from any text content in just a few clicks. Whether it's notes, logs, code, or a draft — we’ve got you covered.
            </p>

            <h3>📄 Why Convert Text to PDF?</h3>
            <p>
              Text files are lightweight and simple, but not ideal for sharing or printing. Converting a .txt file to PDF adds structure, maintains layout, and ensures it looks the same on every device. It's great for sharing documents, preserving records, or printing clean versions of plain text.
            </p>

            <h3>🔍 Key Features</h3>
            <ul>
              <li><strong>Quick Conversion:</strong> Upload your .txt file and convert it instantly.</li>
              <li><strong>Preserves Content:</strong> Keeps your original text untouched and well-formatted.</li>
              <li><strong>Multiple Fonts:</strong> Choose styles and sizes to make your PDF look clean and readable.</li>
              <li><strong>Secure:</strong> All files are deleted automatically after conversion.</li>
              <li><strong>Free & Unlimited:</strong> No signup, no watermark, no limit.</li>
            </ul>

            <h3>🧑‍💻 Best For</h3>
            <ul>
              <li><strong>Writers & Bloggers:</strong> Save drafts or posts in a shareable format.</li>
              <li><strong>Students:</strong> Convert assignments, summaries, and research notes.</li>
              <li><strong>Developers:</strong> Share logs, code comments, or readme files as PDFs.</li>
              <li><strong>Office Users:</strong> Archive notes, memos, or records professionally.</li>
            </ul>

            <h3>🔐 Your Privacy Is Safe</h3>
            <p>
              We never store or share your files. All uploads are processed in real time and automatically removed after conversion. Your text remains private and secure.
            </p>

            <h3>💡 Key Benefits</h3>
            <ul>
              <li>Fast & simple interface</li>
              <li>No watermarks or file size limits</li>
              <li>Works on mobile & desktop</li>
              <li>Supports basic and large .txt files</li>
            </ul>

          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your plain text files to PDF in just a click – simple, safe, and fast.</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default TxtToPdfConverter;
