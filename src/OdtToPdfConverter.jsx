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
import IntroVideo from "../src/assets/videos/how to convert odt to pdf.mp4"
import IntroPoster from "../src/assets/images/odt to pdf poster.png";


const BASE_URL = import.meta.env.VITE_BASE_URL
const OdtToPdfConverter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("upload");
  const [progress, setProgress] = useState(0);


  const handleFileChange = (eOrFile) => {
    const file = eOrFile?.target?.files?.[0] || eOrFile;
    if (file) {
      setFile(file);
      setStatus(status === "Done" ? "upload" : "convert");
    }
  };


  const handleConvert = async () => {
    setProgress(10);

    if (!file) return setStatus("❗ Please upload an ODT file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...");
      const response = await axios.post(`${BASE_URL}/convert-odt-to-pdf`, formData, {
        responseType: "blob",
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(Math.min(percent, 90));
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.odt$/, ".pdf");
      a.click();
      setStatus("✅ Conversion successful!");
    } catch (error) {
      console.error("Conversion failed", error);
      setStatus("❌ Conversion failed.");
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
      <section>
      <ScrollToTop />
      <Tools />
      <Helmet> 
        <title>ODT To PDF Converter-Online Free ,Safe & Easy ODT to PDF File Converter</title>
        <meta name="description" content="Convert ODT files to PDF format instantly. Free and secure ODT to PDF converter with no registration or email required." />
        <link rel="canonical" href="https://fileunivers.in/odt-to-pdf" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="odt to pdf, convert odt to pdf, free odt to pdf converter, online odt to pdf, secure odt to pdf" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
         <div className="pagetitle">

          <h1>ODT to PDF Converter – Free, Fast & Secure Online Conversion of ODT to PDF </h1>

          <p className="intro-paragraph">
            Convert your ODT files to professional-quality PDFs instantly with our free ODT to PDF converter. This fast and secure online tool preserves your original formatting, fonts, and layout while generating a print-ready PDF in seconds. No registrations required — simply upload your ODT document, click "Upload" button , and get your high-quality PDF file.
          </p>
        </div>
        <div className='converter'>
          
          <input type="file" accept=".odt" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.odt']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.odt']} />
          </div>
          <DropzoneInput acceptedType={['odt']} file={file} onFileAccepted={setFile} setStatus={setStatus} />
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status === 'Converting...' ? `Converting... (${progress}%)` : "Upload"}
          </button>
        </div>
      </section>
      <section>
        <div className="converter-container">
          <h2 className="converter-title">Convert ODT to PDF – Free, Fast & Reliable</h2>
              <p className="converter-intro" style={{ marginTop: "20px" }}>
            Convert ODT to PDF online for free. Fast, secure, and accurate — no software or sign-up required. Upload your ODT file, convert in seconds, and download your PDF instantly.Whether you’re a student, writer, or office user, our ODT to PDF converter makes document sharing easier, faster, and more reliable.
          </p>
           <div className="converterImg">
            <img src="pdf.png" alt="Pdf Img" className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Img" className='ConverterArrowImg' />

            <img src="word.png" alt="Word Img" className='ConverterImgtwo' />

          </div>
          <div className="converter-section">
            <h2> How to Convert ODT to PDF ? </h2>
            <ol>
              <li>📤 Upload your ODT file – drag & drop or click to select.</li>
              <li>⚙️ We’ll convert it to a high-quality PDF file.</li>
              <li>📥 Auto Download the PDF instantly after conversion.</li>
            </ol>
            <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
          </div>
               <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert ODT to PDF ? "
              description='Convert your ODT files to PDF instantly with this free online ODT to PDF converter! 
               No software installation, no sign-up, and no watermark — just upload your .odt file and download a perfectly formatted PDF in seconds. Whether you’re a student, writer, or professional, this tool helps you save and share your ODT documents as secure, print-ready PDFs with just one click.'
            />
          </section>
          <div className="converter-section">
            <h2>🔒 Why Use Our ODT to PDF Converter?</h2>
            <ul>
              <li>✅ Preserves layout, formatting, images, and fonts.</li>
              <li>🔐 Files are deleted automatically after conversion to ensure privacy.</li>
              <li>⚡ Converts in seconds with minimal wait time.</li>
              <li>🌐 No installation – works on Chrome, Firefox, Safari, Edge, and more.</li>
              <li>🆓 100% free to use, no limits or registration.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .odt (OpenDocument Text)</p>
            <p><strong>Output:</strong> .pdf</p>
            <h2>Also check other features Related to odt file  </h2>
            <li><Link to="/doc-to-odt" className='btn' >DOC To ODT Converter </Link></li>
            <li><Link to="/odt-to-doc" className='btn' > ODT To DOC  Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/odtcompressor" className='btn'>Compress ODT </Link></li>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Will the converted PDF look the same as my original ODT?<br />
              <strong>A:</strong> Yes! Layout, text, and styles are preserved.</p>
            <p><strong>Q:</strong> Can I use this on my phone?<br />
              <strong>A:</strong> Absolutely. It's fully mobile-friendly.</p>
            <p><strong>Q:</strong> Do I need to install any software?<br />
              <strong>A:</strong> No. Everything runs in your browser.</p>
          </div>


        </div>
      </section>
      <section>
        <div className="compresspdf-article-section">
          <h2>📄 Convert ODT to PDF – Free & Instant</h2>
          <p>
            Looking to convert your OpenDocument Text (.odt) files to PDF format quickly? Our free online ODT to PDF converter makes it effortless to create professional-looking PDF documents directly from your ODT files — no installation or signup required.
          </p>

          <h3>🔄 Why Convert ODT to PDF?</h3>
          <p>
            ODT files, created by LibreOffice or OpenOffice, are great for editing. But when it comes to sharing documents that look the same across all devices, PDF is the industry standard. Converting to PDF ensures your document appears exactly as you intended, no matter where it’s viewed.
          </p>

          <h3>✨ Features of Our ODT to PDF Tool</h3>
          <ul>
            <li><strong>One-Click Conversion:</strong> Upload and convert in seconds.</li>
            <li><strong>Retain Formatting:</strong> Keeps layout, fonts, and images intact.</li>
            <li><strong>No Watermarks:</strong> Clean and professional output PDFs.</li>
            <li><strong>Free and Secure:</strong> Completely free, and files are auto-deleted after conversion.</li>
            <li><strong>Browser-Based:</strong> Works on Chrome, Firefox, Safari, and all devices.</li>
          </ul>

          <h3>📚 Who Is This For?</h3>
          <ul>
            <li><strong>Students:</strong> Convert thesis or assignments created in ODT format.</li>
            <li><strong>Writers & Editors:</strong> Share final drafts as PDFs for review.</li>
            <li><strong>Professionals:</strong> Send ODT-generated reports or memos in a secure PDF format.</li>
            <li><strong>Anyone:</strong> Needing a polished and portable document from ODT.</li>
          </ul>



          <h3>🔐 Secure & Private</h3>
          <p>
            We take your privacy seriously. Your ODT file is processed locally or securely in the cloud and automatically deleted shortly after conversion. No one sees your content but you.
          </p>

          <h3>✅ Benefits at a Glance</h3>
          <ul>
            <li>No signup or login required</li>
            <li>100% free and unlimited use</li>
            <li>Fast, accurate file conversion</li>
            <li>Trusted by students, freelancers, and professionals</li>
          </ul>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your ODT file to a PDF instantly – fast, secure, and free!</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>

      </section>

    </>
  );
};

export default OdtToPdfConverter;
