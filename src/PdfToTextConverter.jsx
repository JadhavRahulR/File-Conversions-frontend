import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';

const PdfToTextConverter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");

  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };
  const handleFileChange = (eOrFile) => {
    const file = eOrFile?.target?.files?.[0] || eOrFile;
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

      const response = await axios.post("http://localhost:5000/convert-pdf-to-text", formData, {
        responseType: "blob",
      });

      // Create a link to download the file
      const blob = new Blob([response.data], { type: 'text/plain' });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = file.name.replace(".pdf", ".txt");
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
      <ScrollToTop />
      <section>
        <Tools />
        <div className='converter'>
          <h3>Converte pdf To Txt/Text </h3>
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
          <h1 className="converter-title">Convert PDF to Text – Extract Plain Text for Free</h1>

          <div className="converter-section">
            <h2>🔄 How to Convert PDF to Text</h2>
            <ol>
              <li>📤 Upload your PDF file – drag & drop or click to select.</li>
              <li>⚙️ We’ll extract all readable text and convert it into a clean .txt file.</li>
              <li>📥 Auto Download the text file after conversion.</li>
            </ol>
            <p><strong>📌 Note:</strong> Large or scanned PDFs may take more time to process.</p>
          </div>

          <div className="converter-section">
            <h2>🔒 Why Use Our PDF to Text Converter?</h2>
            <ul>
              <li>✅ Extracts raw text content from any PDF file.</li>
              <li>🔐 Secure: Files are auto-deleted after processing.</li>
              <li>⚡ Fast, accurate conversion with OCR for scanned PDFs.</li>
              <li>🌐 Works on all browsers and devices – no installation needed.</li>
              <li>🆓 Completely free with no usage limits.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .pdf</p>
            <p><strong>Output:</strong> .txt (Plain Text)</p>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Will the formatting be preserved?<br />
              <strong>A:</strong> Basic structure is preserved, but the output is plain text without styling.</p>
            <p><strong>Q:</strong> Does this support scanned PDFs?<br />
              <strong>A:</strong> Yes, OCR is used to extract text from images within PDFs.</p>
            <p><strong>Q:</strong> Can I edit the output file?<br />
              <strong>A:</strong> Yes, the .txt file is fully editable in any text editor.</p>
          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Extract raw text from your PDFs easily – fast, secure, and completely free.</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default PdfToTextConverter;
