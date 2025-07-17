// TxtToPdfConverter.jsx
import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from "axios";
import "./converter.css";
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';

const TxtToPdfConverter = () => {
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
    if (!file) return alert("Please upload a TXT file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        "http://localhost:5000/convert-txt-to-pdf",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".txt",".pdf");
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
    <section>
    <Tools/>
        <div className='converter'>
          <h3>Convert Text/Txt To PDF</h3>
          <input type="file" accept=".txt" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={[".txt"]} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.txt']} />
          </div>
         <DropzoneInput acceptedType={['txt']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
         
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert Text to PDF – Simple & Fast</h1>

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
