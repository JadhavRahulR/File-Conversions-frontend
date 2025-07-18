import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';

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
      <ScrollToTop />
      <section>
        <Tools />

        <div className='converter'>
          <h3>Convert Pdf to Rtf </h3>

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
    <h1 className="converter-title">Convert PDF to RTF – Editable Rich Text Format</h1>

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
