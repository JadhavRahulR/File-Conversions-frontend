import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';

const OdtToDocConverter = () => {
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
    if (!file) return alert("Please upload an ODT file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        "http://localhost:5000/convert-odt-to-doc",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/msword",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.odt$/, "") + ".docx";
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
    <Tools/>
    <section>
        <div className='converter'>
          <h3>Convert Odt To Word/Doc </h3>
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
    <h1 className="converter-title">Convert ODT to DOC – Free & Reliable</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert ODT to DOC</h2>
      <ol>
        <li>📤 Upload your ODT file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it into a Microsoft Word (.doc) format.</li>
        <li>📥 Auto Download the DOC file after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our ODT to DOC Converter?</h2>
      <ul>
        <li>✅ Accurately converts formatting, fonts, and images.</li>
        <li>🔐 Your files are safe – we delete them shortly after conversion.</li>
        <li>⚡ Converts in seconds with reliable output.</li>
        <li>🌐 No software needed – works in all browsers and devices.</li>
        <li>🆓 100% free with unlimited use.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .odt (OpenDocument Text)</p>
      <p><strong>Output:</strong> .doc /docs</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will the converted file open in older versions of Word?<br />
        <strong>A:</strong> Yes, the output is compatible with Word 97–2003 and newer.</p>
      <p><strong>Q:</strong> Is formatting preserved?<br />
        <strong>A:</strong> Yes, formatting, tables, and images are retained.</p>
      <p><strong>Q:</strong> Do I need to register or install anything?<br />
        <strong>A:</strong> No registration or installation required. It works online.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your ODT file to a DOC document in one click – quick and secure!</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

        </>
  );
};

export default OdtToDocConverter;
