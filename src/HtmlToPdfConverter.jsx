import React, { useState ,useEffect} from 'react';
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from './ScrollToTop';

const BASE_URL = import.meta.env.VITE_BASE_URL
const HtmlToPdfConverter = () => {
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
    if (!file) return alert("Please upload an HTML file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-html-to-pdf`,
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.html$/, "") + ".pdf";
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
      <ScrollToTop/>
      <Tools />
      <section>
        <div className='converter'>
          <h3>Convert Html To Pdf </h3>
          <input type="file" accept=".html" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.html']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.html']} />
          </div>
          <DropzoneInput acceptedType={['html']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>

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
    <h1 className="converter-title">Convert HTML to PDF – Clean, Fast & Free</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert HTML to PDF</h2>
      <ol>
        <li>📤 Upload your HTML file – drag & drop or click to select.</li>
        <li>⚙️ We’ll render and convert it into a high-quality PDF.</li>
        <li>📥 Auto Download the PDF file after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files or pages with heavy styling may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our HTML to PDF Converter?</h2>
      <ul>
        <li>✅ Converts HTML files with styles, images, and layout intact.</li>
        <li>🔐 Secure: We automatically delete your files after conversion.</li>
        <li>⚡ Fast rendering and precise output – even for complex pages.</li>
        <li>🌐 No extensions or installs required – works in all browsers.</li>
        <li>🆓 100% free and unlimited usage.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .html, .htm</p>
      <p><strong>Output:</strong> .pdf</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will images and CSS be included in the PDF?<br />
        <strong>A:</strong> Yes! All linked styles and images are preserved during conversion.</p>
      <p><strong>Q:</strong> Can I upload an entire webpage?<br />
        <strong>A:</strong> This tool is for `.html` files. For live URLs, use our **Webpage to PDF** converter.</p>
      <p><strong>Q:</strong> Can I use this on mobile?<br />
        <strong>A:</strong> Yes, it's fully responsive and mobile-friendly.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert HTML files to PDF effortlessly – perfect for reports, invoices, or saving web content.</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

    </>
  );
};

export default HtmlToPdfConverter;
