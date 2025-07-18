import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const XlsxToPdfConverter = () => {
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
    if (!file) return alert("Please upload an XLSX file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-xlsx-to-pdf`,
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =file.name.replace(".xlsx",".pdf");
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
          <h3>Convert Xlsx To Pdf</h3>
          <input type="file" accept=".xlsx" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={[".xlsx"]} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.xlsx']} />
          </div>
           <DropzoneInput acceptedType={['xlsx']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>

          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert XLSX to PDF – Preserve Tables & Layout</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert XLSX to PDF</h2>
      <ol>
        <li>📤 Upload your Excel (.xlsx) file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it to a well-formatted, printable PDF.</li>
        <li>📥 Auto Download the PDF instantly after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files or spreadsheets with many sheets may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our XLSX to PDF Converter?</h2>
      <ul>
        <li>✅ Retains tables, charts, cell formatting, and layout.</li>
        <li>🔐 Files are automatically deleted after conversion – privacy guaranteed.</li>
        <li>⚡ Fast conversion with precise output.</li>
        <li>🌐 Works on any browser, no Excel or plugins needed.</li>
        <li>🆓 Completely free and unlimited.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .xlsx (Excel Workbook)</p>
      <p><strong>Output:</strong> .pdf</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will all sheets in my workbook be included?<br />
        <strong>A:</strong> Yes, all sheets are included unless you choose otherwise before uploading.</p>
      <p><strong>Q:</strong> Are formulas preserved?<br />
        <strong>A:</strong> Formulas are flattened into values in the PDF output.</p>
      <p><strong>Q:</strong> Will charts and tables remain formatted?<br />
        <strong>A:</strong> Yes, we preserve all formatting and visuals as shown in Excel.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your Excel spreadsheets to PDF with perfect formatting – free and instant.</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

    </>
  );
};

export default XlsxToPdfConverter;
