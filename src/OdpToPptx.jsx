import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import "./converter.css"
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';

const BASE_URL = import.meta.env.VITE_BASE_URL
const OdpToPptx = () => {
  const [file, setFile] = useState(null);
  // const [downloadUrl, setDownloadUrl] = useState('');
  const [status, setStatus] = useState("Upload");
  
    const handleFileChange = (eOrFile) => {
      const file = eOrFile?.target?.files?.[0] || eOrFile;
      if (file) {
        setFile(file);
        setStatus(status === "Done" ? "upload" : "convert");
      }
    };

  const handleConvert = async () => {
    if (!file) return alert("Please select an ODP file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post( `${BASE_URL}/convert-odp-to-pptx`, formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.odp$/, "") + ".pptx";
      a.click();
      window.URL.revokeObjectURL(url);
      // setDownloadUrl(url);
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
    <ScrollToTop/>
    <Tools/>
    <section>
        <div className='converter'>
          <h3>Convert Odp To Pptx </h3>
          <input type="file" accept=".odp" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.odp']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.odp']} />
          </div>
          <DropzoneInput acceptedType={['odp']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert ODP to PPTX – Fast & Free Online</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert ODP to PPTX</h2>
      <ol>
        <li>📤 Upload your ODP file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it to a PowerPoint Presentation (.pptx) format.</li>
        <li>📥 Auto Download the PPTX file after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our ODP to PPTX Converter?</h2>
      <ul>
        <li>✅ Converts slide content, formatting, and layout accurately.</li>
        <li>🔐 Your privacy is protected – files are automatically deleted after conversion.</li>
        <li>⚡ Fast conversion with no design loss.</li>
        <li>🌐 Works in all browsers – no software required.</li>
        <li>🆓 Free to use with unlimited access.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .odp (OpenDocument Presentation)</p>
      <p><strong>Output:</strong> .pptx (PowerPoint Presentation)</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Can I open the PPTX file in Microsoft PowerPoint?<br />
        <strong>A:</strong> Yes! The converted file is fully compatible with all versions of PowerPoint.</p>
      <p><strong>Q:</strong> Will my images and slide design remain the same?<br />
        <strong>A:</strong> Yes, we preserve layout, images, and fonts during conversion.</p>
      <p><strong>Q:</strong> Do I need to create an account to use this tool?<br />
        <strong>A:</strong> No sign-up is required. It's 100% free and secure.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your ODP presentation to PPTX in seconds – accurate, private, and completely free.</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

      </>
  );
};

export default OdpToPptx;
