// import React, { useState ,useEffect} from 'react';
import React, { useState ,useEffect} from "react";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from "./ScrollToTop";

const CsvToPdfConverter = () => {
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
    if (!file) return alert("Please upload a CSV file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        "http://localhost:5000/convert-csv-to-pdf",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
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
    <div className='converter'>
        <h3>Convert Csv  To Pdf </h3>

        <input type="file" accept=".csv" onChange={handleFileChange} />
        <br /><br />
       <div className="fileuploadcontainer">

        <DriveFileInput onFilePicked={setFile} setStatus={setStatus}  allowedTypes={['.csv']}/>
        <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.csv']}  />
        </div>
        <DropzoneInput acceptedType={['csv']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
        {file && (
          <p className="selected-file ">
            ✅ Selected File: <b>{file.name}</b>
          </p>
        )}
        <button onClick={handleConvert} disabled={status === 'Converting...'}>
          {status}
        </button>

      </div>
      <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert CSV to PDF – Instant, Clean & Free</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert CSV to PDF</h2>
      <ol>
        <li>📤 Upload your CSV file – drag & drop or click to select.</li>
        <li>⚙️ We’ll format the data into a neat and printable PDF table.</li>
        <li>📥 Auto Download the PDF after conversion is complete.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large CSV files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our CSV to PDF Converter?</h2>
      <ul>
        <li>✅ Converts tabular data into well-formatted PDF tables.</li>
        <li>🔐 Secure and private – files are deleted automatically after processing.</li>
        <li>⚡ Lightning-fast conversion with no formatting loss.</li>
        <li>🌐 100% browser-based – no need to install anything.</li>
        <li>🆓 Free to use with unlimited conversions.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .csv (Comma-Separated Values)</p>
      <p><strong>Output:</strong> .pdf</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will the data appear as a table in the PDF?<br />
        <strong>A:</strong> Yes, we automatically format the CSV content into a clear, readable table.</p>
      <p><strong>Q:</strong> Can I use this for large datasets?<br />
        <strong>A:</strong> Yes, though very large files may take a few extra seconds to convert.</p>
      <p><strong>Q:</strong> Do I need Microsoft Excel or any other tool?<br />
        <strong>A:</strong> No, the tool works entirely in your browser.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your CSV file to a clean and structured PDF in seconds – safe, fast, and free!</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

    </>
  );
};

export default CsvToPdfConverter;
