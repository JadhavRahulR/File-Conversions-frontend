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
import { Link } from "react-router-dom";
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to convert csv to pdf.mp4";
import IntroPoster from "../src/assets/images/csv to pdf poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

const BASE_URL = import.meta.env.VITE_BASE_URL
const CsvToPdfConverter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState(null);




  const handleFileChange = (eOrFile) => {
    const file = eOrFile?.target?.files?.[0] || eOrFile;
    if (file) {
      setFile(file);
      setStatus("Convert");
    }
  };
  const handleConvert = async () => {
    setProgress(10);

    if (!file) return alert("Please upload a CSV file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-csv-to-pdf`,
        formData,
        {
          responseType: "blob",
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(Math.min(percent, 90));
          },
        }
      );
      const save = new Blob([response.data], {
        type: "application/pdf",
      });

      const convertedFile = new File(
        [save],
        file.name.replace(/\.csv$/i, "") + ".pdf",
        { type: "application/pdf" }
      );

      setConvertedFile(convertedFile);



      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
      setStatus("✅ Done");
    } catch (error) {
      console.error("   ❌ Conversion failed", error);
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
      <ScrollToTop />
      <Tools />
      <Helmet>
        <title>CSV To PDF Online Converter| Free and Secure CSV File To PDF Converter</title>
        <meta name="description" content="Convert CSV files to PDF format easily and securely. Free online CSV to PDF converter with no email or registration required." />
        <link rel="canonical" href="https://fileunivers.com/csv-to-pdf" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="csv to pdf, convert csv to pdf, spreadsheet to pdf, free csv to pdf converter, online csv to pdf" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <div className="pagetitle">

        <h1>Convert CSV To PDF Online - Free & Fast CSV File To PDF Converter</h1>

        <p className="intro-paragraph">
          Easily convert your CSV (Comma-Separated Values) files to PDF online with our fast and secure converter. Keep your data organized and perfectly formatted while transforming spreadsheets into clean, shareable PDF documents. No software installation or technical setup required- simply upload your CSV file, click Upload for Conversion, and auto  download your PDF in seconds. Ideal for data analysts, accountants, students, and professionals who need quick and accurate CSV to PDF conversion.     </p>
      </div>
      <div className='converter'>
        <div className="converterheading">
          <h2>Convert CSV To PDF </h2>
        </div>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <br /><br />
        <div className="fileuploadcontainer">

          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.csv']} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.csv']} />
        </div>
        <DropzoneInput acceptedType={['csv']} file={file} onFileAccepted={setFile} setStatus={setStatus} />
        
        <button onClick={handleConvert} disabled={status === 'Converting...'}>
          {status === "Upload" && "Upload"}
          {status === "Convert" && "Convert"}
          {status === "Converting..." && `Converting... (${progress}%)`}
          {status === "✅ Done" && "Download Again"}
        </button>

        {status === "✅ Done" && convertedFile && (
          <>
            <p>Save To . . .</p>
            <div className="saveTo">
              <SaveToGoogleDrive file={convertedFile} />
              <SaveToDropbox file={convertedFile} className="savetodropbox" />
            </div>
          </>
        )}

      </div>
      <section>
        <div className="converter-container">
          <h2 className="converter-title">Convert CSV to PDF - Instant, Clean & Free</h2>
          <p>Our CSV to PDF converter ensures precise alignment, clear table formatting, and full compatibility with all devices. Whether your file contains financial data, reports, or lists, this tool converts every row and column into a beautifully structured, print-ready PDF. 100% free, browser-based, and secure- your files are automatically deleted after processing. Experience seamless CSV to PDF conversion today and make your data presentation-ready in just one click.</p>
          <div className="converterImg">
            <img src="csv.png" alt="csv Img" className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Symbol" className='ConverterArrowImg' />

            <img src="pdf.png" alt="Pdf Img" className='ConverterImgtwo' />

          </div>
          <div className="converter-section">
            <h2>🔄 How to Convert CSV to PDF</h2>
            <ol>
              <li>📤 Upload your CSV file - drag & drop or click to select.</li>
              <li>⚙️ We’ll format the data into a neat and printable PDF table.</li>
              <li>📥 Auto Download the PDF after conversion is complete.</li>
            </ol>
            <p><strong>📌Note:</strong> Large CSV files may take more time to process.</p>
          </div>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert CSV To PDF ? "
              description='Convert your CSV file to PDF in just a few seconds with this easy step-by-step video!. Learn how to turn your Comma-Separated Values (CSV) data into a clean, well-formatted PDF document that’s ready for sharing, printing, or reporting- all without installing any software.'
            />
          </section>
          <div className="converter-section">
            <h2>🔒Why Use Our CSV to PDF Converter?</h2>
            <ul>
              <li>✅ Converts tabular data into well-formatted PDF tables.</li>
              <li>🔐 Secure and private - files are deleted automatically after processing.</li>
              <li>⚡ Lightning-fast conversion with no formatting loss.</li>
              <li>🌐 100% browser-based - no need to install anything.</li>
              <li>🆓 Free to use with unlimited conversions.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .csv (Comma-Separated Values)</p>
            <p><strong>Output:</strong> .pdf</p>
            <h2>Also check other features Related to PDF and CSV file  </h2>
            <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > RTf To PDF Converter </Link></li>
            <li><Link to="/img-to-pdf" className='btn' > IMG To PDF Converter </Link></li>
            <li><Link to="/tiff-to-pdf" className='btn' > TIFF To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' > PDF To ODT Converter </Link></li>
            <li><Link to="/pdf-to-pptx" className='btn' > PDF To PPTX Converter </Link></li>
            <li><Link to="/pdf-to-rtf" className='btn' > PDF To RTF Converter </Link></li>
            <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
            <li><Link to="/merge-pdf" className='btn' > Merge PDF  </Link></li>
            <li><Link to='/csvcompress' className='btn' > Compress CSV  </Link></li>
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
            <h2>📄 Convert CSV to PDF - Export Table Data into Polished PDFs</h2>
            <p>
              Convert your raw CSV data into clean, readable PDF files with just one click. Perfect for printing spreadsheets, data logs, reports, or tables in a universally accessible format.
            </p>

            <h3>🧠   What is CSV to PDF Conversion?</h3>
            <p>
              A CSV (Comma Separated Values) file contains tabular data in plain text format. Converting a CSV to PDF allows you to present that data in a neatly formatted document that's easy to print, view, or share- with rows, columns, and spacing retained.
            </p>

            <h3>✅ Why Convert CSV Files to PDF?</h3>
            <ul>
              <li><strong>Improved Presentation:</strong> Make raw data look professional and organized.</li>
              <li><strong>Universal Format:</strong> PDFs work across all devices and don't require spreadsheet software.</li>
              <li><strong>Read-Only Format:</strong> Lock your table layout and prevent accidental edits.</li>
              <li><strong>Easy Sharing:</strong> Attach clean PDFs to emails, reports, or meeting notes.</li>
            </ul>

            <h3>    Who Uses CSV to PDF Tools?</h3>
            <ul>
              <li><strong>Developers & Analysts:</strong> Export API logs or results in readable form.</li>
              <li><strong>Accountants:</strong> Share CSV financial data with clients as formatted PDFs.</li>
              <li><strong>Researchers:</strong> Export structured datasets for review or printing.</li>
              <li><strong>Students:</strong> Convert lab results or data tables into report-ready PDFs.</li>
            </ul>



            <h3>     Features of Our CSV to PDF Converter</h3>
            <ul>
              <li>Auto-detects column separators</li>
              <li>Formats tables for clean readability</li>
              <li>Supports thousands of rows</li>
              <li>No watermarks or ads</li>
              <li>Free, fast, and secure</li>
            </ul>

            <h3>     Fully Online, No Installation Needed</h3>
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
              <li>100% browser-based - no downloads</li>
              <li>No login or signup required</li>
              <li>Fast results with high accuracy</li>
            </ul>


          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your CSV file to a clean and structured PDF in seconds - safe, fast, and free!</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default CsvToPdfConverter;
