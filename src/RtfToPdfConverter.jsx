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
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";
// import IntroVideo from "../src/assets/videos/how to convert rtf to pdf.mp4";
// import IntroPoster from "../src/assets/images/rtf to pdf poster.png";


const BASE_URL = import.meta.env.VITE_BASE_URL
const RtfToPdfConverter = () => {
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

    if (!file) return alert("Please upload an RTF file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-rtf-to-pdf`,
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
        file.name.replace(/\.rtf$/i, "") + ".pdf",
        { type: "application/pdf" }
      );

      setConvertedFile(convertedFile);



      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".rtf", ".pdf");
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
        <title>RTF To PDF Converter | Free Rich Text To PDF Online Converter</title>
        <meta name="description" content="Convert RTF (Rich Text Format) files to PDF online for free. Fast, secure RTF to PDF converter with no signup or email required." />
        <link rel="canonical" href="https://fileunivers.com/rtf-to-pdf" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="rtf to pdf, convert rtf to pdf, rich text to pdf, free rtf to pdf converter, online rtf to pdf" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <div className="pagetitle">

        <h1>Convert RTF To PDF Online - Free & Fast Rich Text To PDF Converter</h1>

        <p className="intro-paragraph">
          Quickly convert your RTF (Rich Text Format) files to PDF online with our fast and secure converter. Maintain your original fonts, layout, and formatting while transforming editable RTF documents into professional, print-ready PDFs. No installation or registration needed- simply upload your RTF file, click Upload, and Auto download your PDF instantly. Perfect for students, writers, and professionals who want a reliable RTF to PDF converter that works on any device.
        </p>
      </div>
      <section>
        <div className='converter'>
          <div className="converterheading">
            <h2>Convert RTF To PDF </h2>
          </div>
          <input type="file" accept=".rtf" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={[".rtf"]} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.rtf']} />
          </div>
          <DropzoneInput acceptedType={['rtf']} file={file} onFileAccepted={setFile} setStatus={setStatus} />

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
          <h2 className="converter-title">Convert RTF to PDF - Free, Fast & Secure</h2>
          <p>
            Our RTF to PDF converter is designed for speed, accuracy, and simplicity. Whether you're converting resumes, reports, or formatted documents, this tool ensures that every element- including bold text, tables, and page structure- is perfectly preserved in the final PDF. You can use it anytime, anywhere, directly from your browser. With secure file handling and automatic deletion after processing, your data remains completely private. Convert RTF to PDF online now and get a clean, professional-looking document ready for sharing or printing in seconds.
          </p>
          <div className="converterImg">
            <img src="rtf.png" alt="rtf Img" className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Symbol" className='ConverterArrowImg' />

            <img src="pdf.png" alt="Pdf Img" className='ConverterImgtwo' />

          </div>

          <div className="converter-section">
            <h2>🔄 How to Convert RTF to PDF ?</h2>
            <ol>
              <li>📤 Upload your RTF file - drag & drop or click to select.</li>
              <li>⚙️ We’ll convert it to a high-quality PDF file.</li>
              <li>📥 Auto Download the PDF after conversion.</li>
            </ol>
            <p><strong>📌Note:</strong> Large files may take more time to process.</p>
          </div>
          <section>
            <LazyVideo 
             youtubeId="5o13N4_ySLc"
              title="How to Convert RTF to PDF ? "
              description='Learn how to convert RTF to PDF online in just a few seconds with this easy step-by-step video!. This tutorial shows you how to turn your Rich Text Format (RTF) documents into professional PDF files- without installing any software or losing formatting.'
            />
          </section>
          <div className="converter-section">
            <h2>🔒Why Use Our RTF to PDF Converter?</h2>
            <ul>
              <li>✅ Preserves fonts, formatting, images, and layout accurately.</li>
              <li>🔐 Files are deleted automatically after conversion to ensure privacy.</li>
              <li>⚡ Quick conversion with reliable results every time.</li>
              <li>🌐 Works on all devices and browsers - no installation needed.</li>
              <li>🆓 Completely free with unlimited usage.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .rtf (Rich Text Format)</p>
            <p><strong>Output:</strong> .pdf</p>
            <h2>Also check other features Related to rtf file  </h2>
            <div className="unzipPagelink">

            <li><Link to="/pdf-to-rtf" className='btn' > PDF To RTF Converter </Link></li>
            <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > RTF To PDF Converter </Link></li>
            <li><Link to="/html-to-pdf" className='btn' > HTML To PDF Converter </Link></li>
            <li><Link to="/md-to-pdf" className='btn' > MD  To PDF Converter </Link></li>
            <li><Link to="/xlsx-to-pdf" className='btn' > XLSX  To PDF Converter </Link></li>
            <li><Link to="/csv-to-pdf" className='btn' > CSV To PDF Converter </Link></li>
            <li><Link to="/img-to-pdf" className='btn' > IMG To PDF Converter </Link></li>
            <li><Link to="/tiff-to-pdf" className='btn' > TIFF To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' > PDF To ODT Converter </Link></li>
            <li><Link to="/pdf-to-txt" className='btn' > PDF To TEXT Converter </Link></li>
            <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
            </div>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Will the PDF preserve the original formatting and styles?<br />
              <strong>A:</strong> Yes, all fonts, spacing, and styles will be retained.</p>
            <p><strong>Q:</strong> Can I convert RTF files created from any text editor?<br />
              <strong>A:</strong> Yes, our tool supports RTF from all major editors including WordPad and MS Word.</p>
            <p><strong>Q:</strong> Do I need to install any software?<br />
              <strong>A:</strong> No installation needed - everything works online in your browser.</p>
          </div>
          <div className="compresspdf-article-section">
            <h2>📄 Convert RTF to PDF - Fast, Free & Accurate</h2>
            <p>
              Easily convert Rich Text Format (.rtf) documents to PDF with our online converter. Whether you’re working with styled text, images, or embedded elements, this tool ensures a seamless and secure transition from RTF to professional-grade PDF files.
            </p>

            <h3>📝 What is an RTF File?</h3>
            <p>
              RTF (Rich Text Format) is a cross-platform document format developed by Microsoft. It allows you to save text along with basic formatting like bold, italics, bullet lists, fonts, and embedded images. RTF files are supported by most word processors, including Microsoft Word, WordPad, and LibreOffice.
            </p>

            <h3>📌Why Convert RTF to PDF?</h3>
            <ul>
              <li><strong>Universal Compatibility:</strong> PDFs are viewable on all devices and systems without formatting issues.</li>
              <li><strong>Secure & Read-Only:</strong> PDF files can be locked or encrypted to prevent editing.</li>
              <li><strong>Professional Sharing:</strong> Perfect for submitting resumes, official documents, and reports.</li>
              <li><strong>Print-Ready:</strong> PDFs preserve page layout and print exactly as expected.</li>
              <li><strong>Reduced File Size:</strong> PDF files are usually smaller and easier to share online.</li>
            </ul>

            <h3>     Who Uses RTF to PDF Conversion?</h3>
            <ul>
              <li><strong>Students & Teachers:</strong> Submit assignments in a standardized, secure format.</li>
              <li><strong>HR Professionals:</strong> Convert resumes from RTF to PDF for consistency.</li>
              <li><strong>Writers:</strong> Export rich text manuscripts or articles into printable PDFs.</li>
              <li><strong>Legal Teams:</strong> Convert RTF documents for archival and court submissions.</li>
            </ul>


            <h3>⚙️ Features of Our RTF to PDF Converter</h3>
            <ul>
              <li>Accurate formatting retention - fonts, colors, bullet lists, and alignment preserved</li>
              <li>Supports embedded images and headers</li>
              <li>No installation needed - browser-based conversion</li>
              <li>Fast processing with high output quality</li>
              <li>Works on desktop and mobile</li>
            </ul>

            <h3>     Device & Platform Compatibility</h3>
            <p>
              Our tool runs directly in your browser and supports all platforms - Windows, Mac, Linux, Android, and iOS. Whether you're on a laptop or smartphone, you can convert files on the go.
            </p>

            <h3>🔐 Is My File Safe?</h3>
            <p>
              Yes. We care about your privacy. Your RTF and converted PDF files are encrypted during transfer and deleted from our servers after the conversion is complete. We never store or share your data.
            </p>

            <h3>🚀 Why Choose Our Converter?</h3>
            <ul>
              <li>No login or signup required</li>
              <li>Completely free to use</li>
              <li>Clean, simple, and fast interface</li>
              <li>Supports both small and large RTF documents</li>
              <li>Accurate PDF output for professional use</li>
            </ul>

          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your RTF file to a polished PDF in seconds - safe, easy, and free.</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default RtfToPdfConverter;
