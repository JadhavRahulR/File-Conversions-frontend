// DocToOdtConverter.jsx
import React, { useState ,useEffect} from 'react';
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from './ScrollToTop';


const DocToOdtConverter = () => {
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
    if (!file) return alert("Please upload a DOC or DOCX file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
       setStatus("Converting...")
      const response = await axios.post(
        "http://localhost:5000/convert-doc-to-odt",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.oasis.opendocument.text",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.docx$/, "") + ".odt";
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
        <h3>Convert Doc/Word To Odt </h3>

        <input type="file" accept=".docx" onChange={handleFileChange} />
        <br /><br />
       <div className="fileuploadcontainer">

        <DriveFileInput onFilePicked={setFile} setStatus={setStatus}  allowedTypes={['.docx']}/>
        <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.docx']}  />
        </div>
        <DropzoneInput acceptedType={['docx']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>

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
    <h1 className="converter-title">Convert DOC to ODT – Free & Instant</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert DOC to ODT</h2>
      <ol>
        <li>📤 Upload your DOC file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it to an OpenDocument Text (.odt) file.</li>
        <li>📥 Auto Download the ODT file after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our DOC to ODT Converter?</h2>
      <ul>
        <li>✅ Preserves document formatting and layout.</li>
        <li>🔐 Privacy-friendly: We automatically delete files after conversion.</li>
        <li>⚡ Fast and accurate conversion.</li>
        <li>🌐 Works on all browsers and devices – no installation required.</li>
        <li>🆓 100% free, unlimited use with no restrictions.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .doc (Microsoft Word)</p>
      <p><strong>Output:</strong> .odt (OpenDocument Text)</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Can I open the ODT file in LibreOffice or OpenOffice?<br />
        <strong>A:</strong> Yes! It works perfectly with any OpenDocument-compatible software.</p>
      <p><strong>Q:</strong> Will tables and images be preserved?<br />
        <strong>A:</strong> Yes, all formatting is retained.</p>
      <p><strong>Q:</strong> Do I need to install anything?<br />
        <strong>A:</strong> No. This tool works entirely online.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your DOC file to ODT instantly – safe, accurate, and free!</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

        </>
  );
};

export default DocToOdtConverter;
