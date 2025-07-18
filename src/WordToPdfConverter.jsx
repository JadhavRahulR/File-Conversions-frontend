import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import "./converter.css"
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from './ScrollToTop';

const BASE_URL = import.meta.env.VITE_BASE_URL;
function WordToPdfConverter() {
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
    if (!file) {
      alert('Please select a Word file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setStatus("Converting...")
      const response = await axios.post(`${BASE_URL}/convert-word-to-pdf`, formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.(doc|docx)$/, '') + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
      setStatus("✅ Conversion complete!");
    } catch (error) {
      console.error('❌ Conversion failed:', error);
      alert('Conversion failed.');
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
    <div>
      <section>
        <ScrollToTop/>
    <Tools/>
        <div className='converter'>
          <h3>Convert Word/Docx To Pdf</h3>
          <input type="file" accept=".docx" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={[".docx"]} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.docx']} />
          </div>
          <DropzoneInput acceptedType={['docx']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>

          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      
      <div className="converter-container">
      <h1 className="converter-title">Convert Word to PDF – Free & Easy Online Tool</h1>
      

      <div className="converter-section">
        <h2>🔄 How to Convert Word to PDF</h2>
        <ol>
          <li>📤 Upload your Word file – drag & drop or click to select.</li>
          <li>⚙️ Wait a moment – we convert your file to a clean, compact PDF.</li>
          <li>📥 Auto Download your converted PDF instantly.</li>
        </ol>
         <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
      </div>

      <div className="converter-section">
        <h2>🔒 Why Use Our Word to PDF Converter?</h2>
        <ul>
          <li>✅ Preserve formatting: Fonts, tables, and layouts remain intact.</li>
          <li>🔐 Privacy-first: Files auto-delete after conversion.</li>
          <li>⚡ Fast results: Convert in seconds with no loss.</li>
          <li>🌐 Works on any device – no installs needed.</li>
          <li>🆓 Totally free, forever.</li>
        </ul>
      </div>

      <div className="converter-section">
        <h2>📁 Supported Formats</h2>
        <p><strong>Input:</strong> .doc, .docx</p>
        <p><strong>Output:</strong> .pdf</p>
      </div>

      <div className="converter-section">
        <h2>❓ FAQ</h2>
        <p><strong>Q:</strong> Will my layout and fonts be preserved?<br />
        <strong>A:</strong> Yes, our tool ensures perfect formatting.</p>
        <p><strong>Q:</strong> Any size limits?<br />
        <strong>A:</strong> Yes, up to 50MB per file.</p>
        <p><strong>Q:</strong> Is this browser-based?<br />
        <strong>A:</strong> Yes! No install needed.</p>
      </div>

      <div className="converter-section" style={{ textAlign: 'center' }}>
        <h2>🎯 Try It Now!</h2>
        <p>Upload your Word file and convert to PDF in seconds!</p>
        <p className="converter-tagline">✅ Fast | ✅ Secure | ✅ No Email Required</p>
        {/* <button className="converter-btn">Upload Word File</button> */}
      </div>
    </div>
    </div>
  );
}

export default WordToPdfConverter;
