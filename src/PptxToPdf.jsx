import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import "./converter.css"
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';


const PptxToPdf = () => {
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
    if (!file) return alert("Please select a PPTX file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post('http://localhost:5000/convert-pptx-to-pdf', formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pptx$/, '') + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
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
          <h3>Convert Pptx To Pdf</h3>
          <input type="file" accept=".pptx" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pptx']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pptx']} />
          </div>
         <DropzoneInput acceptedType={['pptx']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert PPTX to PDF – High-Quality & Free</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert PPTX to PDF</h2>
      <ol>
        <li>📤 Upload your PowerPoint (.pptx) file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert your slides into a clean and printable PDF.</li>
        <li>📥 Auto Download the PDF after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our PPTX to PDF Converter?</h2>
      <ul>
        <li>✅ Preserves slide design, fonts, animations (as static), and layout.</li>
        <li>🔐 Files are deleted automatically after conversion to ensure privacy.</li>
        <li>⚡ Fast and accurate conversion – ready in seconds.</li>
        <li>🌐 Works on all browsers and devices, no installs needed.</li>
        <li>🆓 Completely free with unlimited conversions.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .pptx (PowerPoint Presentation)</p>
      <p><strong>Output:</strong> .pdf</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will transitions or animations be preserved?<br />
        <strong>A:</strong> No, animations are flattened into static slides in the PDF.</p>
      <p><strong>Q:</strong> Can I print the resulting PDF?<br />
        <strong>A:</strong> Yes, the output is print-ready and optimized.</p>
      <p><strong>Q:</strong> Will slide notes be included?<br />
        <strong>A:</strong> Currently, only the visual slides are included, not speaker notes.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your PPTX file to a professional PDF – secure, accurate, and fast!</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

      </>
  );
};

export default PptxToPdf;
