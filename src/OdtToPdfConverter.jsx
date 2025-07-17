import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';


const OdtToPdfConverter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("upload");

  const handleFileChange = (eOrFile) => {
      const file = eOrFile?.target?.files?.[0] || eOrFile;
      if (file) {
        setFile(file);
        setStatus(status === "Done" ? "upload" : "convert");
      }
    };


  const handleConvert = async () => {
    if (!file) return setStatus("❗ Please upload an ODT file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...");
      const response = await axios.post("http://localhost:5000/convert-odt-to-pdf", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.odt$/, ".pdf");
      a.click();
      setStatus("✅ Conversion successful!");
    } catch (error) {
      console.error("Conversion failed", error);
      setStatus("❌ Conversion failed.");
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
    <ScrollToTop/>
    <Tools/>
    <section>
        <div className='converter'>
          <h3>Convert Odt To Pdf </h3>
          <input type="file" accept=".odt" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.odt']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.odt']} />
          </div>
          <DropzoneInput acceptedType={['odt']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert ODT to PDF – Free, Fast & Reliable</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert ODT to PDF</h2>
      <ol>
        <li>📤 Upload your ODT file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it to a high-quality PDF file.</li>
        <li>📥 Auto Download the PDF instantly after conversion.</li>
      </ol>
       <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our ODT to PDF Converter?</h2>
      <ul>
        <li>✅ Preserves layout, formatting, images, and fonts.</li>
        <li>🔐 Files are deleted automatically after conversion to ensure privacy.</li>
        <li>⚡ Converts in seconds with minimal wait time.</li>
        <li>🌐 No installation – works on Chrome, Firefox, Safari, Edge, and more.</li>
        <li>🆓 100% free to use, no limits or registration.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .odt (OpenDocument Text)</p>
      <p><strong>Output:</strong> .pdf</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will the converted PDF look the same as my original ODT?<br />
        <strong>A:</strong> Yes! Layout, text, and styles are preserved.</p>
      <p><strong>Q:</strong> Can I use this on my phone?<br />
        <strong>A:</strong> Absolutely. It's fully mobile-friendly.</p>
      <p><strong>Q:</strong> Do I need to install any software?<br />
        <strong>A:</strong> No. Everything runs in your browser.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your ODT file to a PDF instantly – fast, secure, and free!</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

    </>
  );
};

export default OdtToPdfConverter;
