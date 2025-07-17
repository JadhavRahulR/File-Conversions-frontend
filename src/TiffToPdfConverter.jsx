import React, { useState } from "react";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from "./ScrollToTop";

const TiffToPdfConverter = () => {
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
    if (!file) return alert("Please upload a TIFF file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        "http://localhost:5000/convert-tiff-to-pdf",
        formData,
        { responseType: "blob" }
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
    <ScrollToTop/>
    <Tools/>
   <section>
        <div className='converter'>
          <h3>Convert TIFF To Pdf</h3>
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
            {status}
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
      <h2>🔒 Why Use Our TIFF to PDF Converter?</h2>
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
