import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';

const RtfToPdfConverter = () => {
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
    if (!file) return alert("Please upload an RTF file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        "http://localhost:5000/convert-rtf-to-pdf",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".rtf",".pdf");
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
          <h3>Convert Rtf To Pdf</h3>
          <input type="file" accept=".rtf" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={[".rtf"]} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.rtf']} />
          </div>
          <DropzoneInput acceptedType={['rtf']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
         
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert RTF to PDF – Free, Fast & Secure</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert RTF to PDF</h2>
      <ol>
        <li>📤 Upload your RTF file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it to a high-quality PDF file.</li>
        <li>📥 Auto Download the PDF after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our RTF to PDF Converter?</h2>
      <ul>
        <li>✅ Preserves fonts, formatting, images, and layout accurately.</li>
        <li>🔐 Files are deleted automatically after conversion to ensure privacy.</li>
        <li>⚡ Quick conversion with reliable results every time.</li>
        <li>🌐 Works on all devices and browsers – no installation needed.</li>
        <li>🆓 Completely free with unlimited usage.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .rtf (Rich Text Format)</p>
      <p><strong>Output:</strong> .pdf</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will the PDF preserve the original formatting and styles?<br />
        <strong>A:</strong> Yes, all fonts, spacing, and styles will be retained.</p>
      <p><strong>Q:</strong> Can I convert RTF files created from any text editor?<br />
        <strong>A:</strong> Yes, our tool supports RTF from all major editors including WordPad and MS Word.</p>
      <p><strong>Q:</strong> Do I need to install any software?<br />
        <strong>A:</strong> No installation needed – everything works online in your browser.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your RTF file to a polished PDF in seconds – safe, easy, and free.</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

    </>
  );
};

export default RtfToPdfConverter;
