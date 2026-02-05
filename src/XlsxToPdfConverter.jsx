import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to convert xlsx to pdf.mp4";
import IntroPoster from "../src/assets/images/xlsx to pdf poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const XlsxToPdfConverter = () => {
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

    if (!file) return alert("Please upload an XLSX file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-xlsx-to-pdf`,
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
        file.name.replace(/\.xlsx$/i, "") + ".pdf",
        { type: "application/pdf" }
      );

      setConvertedFile(convertedFile);
      
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".xlsx", ".pdf");
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
        <title>XLSX To PDF Converter | Free Fast and Safe Excel To PDF Online Converter</title>
        <meta name="description" content="Convert XLSX Excel spreadsheets to PDF format quickly and securely. Free online XLSX to PDF converter with no email or signup required." />
        <link rel="canonical" href="https://fileunivers.com/xlsx-to-pdf" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="xlsx to pdf, convert xlsx to pdf, excel to pdf, spreadsheet to pdf, free xlsx to pdf converter, online excel to pdf" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <div className="pagetitle">

        <h1>Convert XLSX To PDF Online - Free & Fast Excel To PDF Converter</h1>

        <p className="intro-paragraph">
          Easily convert your Excel spreadsheets (.xlsx) to PDF online with our free and reliable converter. Keep your tables, charts, and cell formatting perfectly intact while turning your Excel data into a professional, shareable PDF file. No software installation or signup needed- just upload your XLSX file, click Upload for conversion, and auto  download your ready-to-use PDF instantly. Ideal for students, accountants, and professionals who want clean, print-ready Excel reports in seconds.       </p>
      </div>
      <section>
        <div className='converter'>
          <div className="converterheading">
            <h2>Convert XLSX To PDF </h2>
          </div>
          <input type="file" accept=".xlsx" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={[".xlsx"]} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.xlsx']} />
          </div>
          <DropzoneInput acceptedType={['xlsx']} file={file} onFileAccepted={setFile} setStatus={setStatus} />

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
      </section>
      <section>
        <div className="converter-container">
          <h2 className="converter-title">Convert XLSX to PDF - Preserve Tables & Layout</h2>
          <p>
            Our XLSX to PDF converter ensures high-quality conversion while maintaining your original layout, fonts, and formulas. Whether you’re exporting financial reports, invoices, data sheets, or business summaries, this tool guarantees accurate alignment and easy readability on any device. 100% secure, browser-based, and lightning-fast- convert your Excel to PDF online now and make your spreadsheets look professional and ready to share anywhere.
          </p>
          <div className="converterImg">
            <img src="xlsx.png" alt="xlsx Img" className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Symbol" className='ConverterArrowImg' />

            <img src="pdf.png" alt="Pdf Img" className='ConverterImgtwo' />

          </div>
          <div className="converter-section">
            <h2>🔄 How to Convert XLSX to PDF ?</h2>
            <ol>
              <li>📤 Upload your Excel (.xlsx) file - drag & drop or click to select.</li>
              <li>⚙️ We’ll convert it to a well-formatted, printable PDF.</li>
              <li>📥 Auto Download the PDF instantly after conversion.</li>
            </ol>
            <p><strong>📌Note:</strong> Large files or spreadsheets with many sheets may take more time to process.</p>
          </div>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert XLSX To PDF ? "
              description='Learn how to convert XLSX to PDF online in just a few seconds with this easy step-by-step video!. Turn your Excel spreadsheet (.xlsx) into a clean, professional PDF file- perfect for reports, invoices, and business documents. No software, no registration- just fast and simple conversion.'
            />
          </section>
          <div className="converter-section">
            <h2>🔒Why Use Our XLSX to PDF Converter?</h2>
            <ul>
              <li>✅ Retains tables, charts, cell formatting, and layout.</li>
              <li>🔐 Files are automatically deleted after conversion - privacy guaranteed.</li>
              <li>⚡ Fast conversion with precise output.</li>
              <li>🌐 Works on any browser, no Excel or plugins needed.</li>
              <li>🆓 Completely free and unlimited.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .xlsx (Excel Workbook)</p>
            <p><strong>Output:</strong> .pdf</p>
            <h2>Also check other features Related to PDF and Xlsx file  </h2>
            <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > RTf To PDF Converter </Link></li>
            <li><Link to="/csv-to-pdf" className='btn' > CSV To PDF Converter </Link></li>
            <li><Link to="/img-to-pdf" className='btn' > IMG To PDF Converter </Link></li>
            <li><Link to="/tiff-to-pdf" className='btn' > TIFF To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' > PDF To ODT Converter </Link></li>
            <li><Link to="/pdf-to-pptx" className='btn' > PDF To PPTX Converter </Link></li>
            <li><Link to="/pdf-to-rtf" className='btn' > PDF To RTF Converter </Link></li>
            <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
            <li><Link to="/merge-pdf" className='btn' > Merge PDF  </Link></li>

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
          <div className="compresspdf-article-section">
            <h2>📚 Convert XLSX to PDF - Export Excel Spreadsheets to PDF Easily</h2>
            <p>
              Turn your Excel files (.xlsx) into clean, professional PDF documents in just seconds. Perfect for reports, financial summaries, charts, or spreadsheets you want to preserve or share across any device.
            </p>

            <h3>📄 What is XLSX to PDF Conversion?</h3>
            <p>
              XLSX is the default spreadsheet file format used by Microsoft Excel. Converting an XLSX to PDF means transforming your editable spreadsheet into a fixed-format document that maintains your data layout, styles, charts, and tables- ready for printing or sharing.
            </p>

            <h3>📌Why Convert Excel Files to PDF?</h3>
            <ul>
              <li><strong>Universal Access:</strong> Anyone can open PDFs without needing Excel or spreadsheet software.</li>
              <li><strong>Protect Layout:</strong> Keep formatting, fonts, graphs, and rows exactly as they appear in Excel.</li>
              <li><strong>Printable Format:</strong> Share PDFs in meetings, as official documents, or email-friendly attachments.</li>
              <li><strong>Secure Sharing:</strong> Lock in spreadsheet content so no accidental changes occur.</li>
            </ul>

            <h3>Who Uses XLSX to PDF Tools?</h3>
            <ul>
              <li><strong>Accountants & Finance Teams:</strong> Share reports with clients or auditors.</li>
              <li><strong>Students & Educators:</strong> Submit grade sheets, lab data, or project data in a portable format.</li>
              <li><strong>HR Professionals:</strong> Export payroll or leave records for documentation.</li>
              <li><strong>Project Managers:</strong> Save project data or Gantt charts for offline use or approval.</li>
            </ul>


            <h3>⚙️ Features of Our Excel to PDF Converter</h3>
            <ul>
              <li>Retains tables, colors, borders, and embedded charts</li>
              <li>Supports multi-sheet Excel files</li>
              <li>Auto-fits content within PDF pages</li>
              <li>No ads or watermarks</li>
              <li>Completely free to use</li>
            </ul>

            <h3>     Fully Online & Compatible</h3>
            <p>
              This tool runs in your browser - no installation needed. Works on Windows, macOS, Linux, and all mobile devices with ease.
            </p>

            <h3>🔐 Private & Secure</h3>
            <p>
              Your Excel data remains safe. Files are encrypted during upload and are automatically removed from our servers after conversion.
            </p>

            <h3> Why Choose Our XLSX to PDF Converter?</h3>
            <ul>
              <li>Blazing-fast conversions</li>
              <li>Preserves formatting, even for complex sheets</li>
              <li>Free to use with no login required</li>
              <li>User-friendly drag-and-drop interface</li>
              <li>Ideal for business, education, and personal use</li>
            </ul>

          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your Excel spreadsheets to PDF with perfect formatting - free and instant.</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default XlsxToPdfConverter;
