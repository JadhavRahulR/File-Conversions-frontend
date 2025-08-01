// import React, { useState ,useEffect} from 'react';
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';

const BASE_URL = import.meta.env.VITE_BASE_URL
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
        `${BASE_URL}/convert-csv-to-pdf`,
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
    <Helmet>
      <title>CSV to PDF | Free CSV File to PDF Converter</title>
<meta name="description" content="Convert CSV files to PDF format easily and securely. Free online CSV to PDF converter with no email or registration required." />
<link rel="canonical" href="https://fileunivers.in/csv-to-pdf" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="csv to pdf, convert csv to pdf, spreadsheet to pdf, free csv to pdf converter, online csv to pdf" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
      <ScrollToTop />
      <Tools />
      <div className='converter'>
        <h1>Convert Csv  To Pdf </h1>

        <input type="file" accept=".csv" onChange={handleFileChange} />
        <br /><br />
        <div className="fileuploadcontainer">

          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.csv']} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.csv']} />
        </div>
        <DropzoneInput acceptedType={['csv']} file={file} onFileAccepted={setFile} setStatus={setStatus} />
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
          <div className="compresspdf-article-section">
            <h2>📄 Convert CSV to PDF – Export Table Data into Polished PDFs</h2>
            <p>
              Convert your raw CSV data into clean, readable PDF files with just one click. Perfect for printing spreadsheets, data logs, reports, or tables in a universally accessible format.
            </p>

            <h3>🧾 What is CSV to PDF Conversion?</h3>
            <p>
              A CSV (Comma Separated Values) file contains tabular data in plain text format. Converting a CSV to PDF allows you to present that data in a neatly formatted document that's easy to print, view, or share — with rows, columns, and spacing retained.
            </p>

            <h3>✅ Why Convert CSV Files to PDF?</h3>
            <ul>
              <li><strong>Improved Presentation:</strong> Make raw data look professional and organized.</li>
              <li><strong>Universal Format:</strong> PDFs work across all devices and don't require spreadsheet software.</li>
              <li><strong>Read-Only Format:</strong> Lock your table layout and prevent accidental edits.</li>
              <li><strong>Easy Sharing:</strong> Attach clean PDFs to emails, reports, or meeting notes.</li>
            </ul>

            <h3>👥 Who Uses CSV to PDF Tools?</h3>
            <ul>
              <li><strong>Developers & Analysts:</strong> Export API logs or results in readable form.</li>
              <li><strong>Accountants:</strong> Share CSV financial data with clients as formatted PDFs.</li>
              <li><strong>Researchers:</strong> Export structured datasets for review or printing.</li>
              <li><strong>Students:</strong> Convert lab results or data tables into report-ready PDFs.</li>
            </ul>

            

            <h3>🌟 Features of Our CSV to PDF Converter</h3>
            <ul>
              <li>Auto-detects column separators</li>
              <li>Formats tables for clean readability</li>
              <li>Supports thousands of rows</li>
              <li>No watermarks or ads</li>
              <li>Free, fast, and secure</li>
            </ul>

            <h3>💻 Fully Online, No Installation Needed</h3>
            <p>
              Convert CSV to PDF right in your browser. No need for Excel, Google Sheets, or any plugins. Compatible with Windows, Mac, Linux, and mobile browsers.
            </p>

            <h3>🔐 Secure and Private</h3>
            <p>
              Your data stays safe. We use secure file handling, and all files are deleted shortly after conversion.
            </p>

            <h3> Why Use This CSV to PDF Tool?</h3>
            <ul>
              <li>Clean, professional formatting for tables</li>
              <li>Supports large CSV files</li>
              <li>100% browser-based – no downloads</li>
              <li>No login or signup required</li>
              <li>Fast results with high accuracy</li>
            </ul>


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
