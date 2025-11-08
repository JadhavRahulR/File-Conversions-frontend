// DocToOdtConverter.jsx
import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to convert doc to odt.mp4";
import IntroPoster from "../src/assets/images/doc to odt poster.png";

const BASE_URL = import.meta.env.VITE_BASE_URL
const DocToOdtConverter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");
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

    if (!file) return alert("Please upload a DOC or DOCX file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-doc-to-odt`,
        formData,
        {
          responseType: "blob",
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(Math.min(percent, 90));
          },
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.oasis.opendocument.text",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.docx$/, "") + ".odt";
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
      <ScrollToTop />
      <Tools />
      <Helmet>
        <title>Convert DOC To ODT | Free and Secure Word To OpenDocument Online Converter</title>
        <meta name="description" content="Convert DOC files to ODT format online for free. Fast, secure, and easy DOC to ODT converter with no email or signup needed." />
        <link rel="canonical" href="https://fileunivers.in/doc-to-odt" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="doc to odt, convert doc to odt, word to odt, free doc to odt converter, online doc to odt" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <div className="pagetitle">

        <h1>Convert DOC To ODT Online – Free Word To ODT Converter (Fast & Secure)</h1>

        <p className="intro-paragraph">
          Convert your Microsoft Word DOC files to ODT format instantly with our free online DOC to ODT converter. This tool works directly in your browser — no software installation needed and sign up . Just upload your Word document, click “Upload”, and auto download your ODT file in seconds.It’s fast, secure, and  ideal for LibreOffice or OpenOffice users who need compatibility without losing quality.
        </p>
      </div>
      <section>

        <div className='converter'>

          <input type="file" accept=".docx" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">

            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.docx']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.docx']} />
          </div>
          <DropzoneInput acceptedType={['docx']} file={file} onFileAccepted={setFile} setStatus={setStatus} />

          {file && (
            <p className="selected-file ">
              ✅ Selected File: <b>{file.name}</b>
            </p>
          )}
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status === 'Converting...' ? `Converting... (${progress}%)` : "Upload"}
          </button>

        </div>
      </section>
      <section>
        <div className="converter-container">
          <h2 className="converter-title">Convert DOC To ODT – Free & Instant</h2>
          <p>
            Convert your  DOC files to ODT instantly with our free online DOC to ODT converter tool. This tool works directly in your browser — no sign up needed. Just upload your Word document, click “Upload”, and auto download your ODT file in seconds.It’s fast and secure making it ideal for LibreOffice or OpenOffice users.
          </p>
          <div className="converterImg">
            <img src="word.png" alt="Word Img" className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Symbol" className='ConverterArrowImg' />

            <img src="odt.png" alt="odt Img" className='ConverterImgtwo' />

          </div>
          <div className="converter-section">
            <h2>🔄 How to Convert DOC to ODT ?</h2>
            <ol>
              <li>📤 Upload your DOC file – drag & drop or click to select.</li>
              <li>⚙️ We’ll convert it to an OpenDocument Text (.odt) file.</li>
              <li>📥 Auto Download the ODT file after conversion.</li>
            </ol>
            <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
          </div>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert DOC To ODT ? "
              description='Convert your DOC files to ODT format easily using our free online DOC to ODT converter. This video shows a simple step-by-step method to change Microsoft Word (.doc) files into OpenDocument Text (.odt) without installing any software. It’s fast, secure, and completely free — ideal for anyone using LibreOffice or OpenOffice.'
            />
          </section>
          <div className="converter-section">
            <h2>🔒 Why Use Our DOC to ODT Converter?</h2>
            <ul>
              <li>✅ Preserves document formatting and layout.</li>
              <li>🔐 Privacy-friendly: We automatically delete files after conversion.</li>
              <li>⚡ Fast and accurate conversion.</li>
              <li>🌐 Works on all browsers and devices – no installation required.</li>
              <li>🆓 100% free, unlimited use with no restrictions.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .doc (Microsoft Word)</p>
            <p><strong>Output:</strong> .odt (OpenDocument Text)</p>
            <h2>Also check other features Related to word / doc file  </h2>
            <li><Link to="/odt-to-doc" className='btn'> ODT To DOC  Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' >PDF To ODT Converter </Link></li>
            <li><Link to="/docxcompressor" className='btn'> Compress DOC / Word  </Link></li>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Can I open the ODT file in LibreOffice or OpenOffice?<br />
              <strong>A:</strong> Yes! It works perfectly with any OpenDocument-compatible software.</p>
            <p><strong>Q:</strong> Will tables and images be preserved?<br />
              <strong>A:</strong> Yes, all formatting is retained.</p>
            <p><strong>Q:</strong> Do I need to install anything?<br />
              <strong>A:</strong> No. This tool works entirely online.</p>
          </div>
          <div className="compresspdf-article-section">
            <h2>📄 Convert DOC to ODT – Microsoft Word to Open Document Format</h2>
            <p>
              Want to convert your DOC or DOCX files to ODT format? Our free online DOC to ODT converter lets you switch your Microsoft Word documents into the OpenDocument format instantly and without hassle. Whether you're migrating to open-source tools or simply need a compatible format for LibreOffice, this tool ensures quick and accurate conversions.
            </p>

            <h3>🔄 What is ODT?</h3>
            <p>
              ODT stands for Open Document Text, an open standard format used by word processors like LibreOffice and OpenOffice. Unlike DOC (used by Microsoft Word), ODT is freely accessible, more portable, and ideal for users who prefer open-source ecosystems.
            </p>

            <h3>✨ Why Convert DOC to ODT?</h3>
            <ul>
              <li><strong>Compatibility:</strong> ODT files work seamlessly with LibreOffice, OpenOffice, and many other free office suites.</li>
              <li><strong>Free and Open-Source:</strong> No need for Microsoft Word to view or edit your file.</li>
              <li><strong>Lightweight:</strong> ODT files are generally smaller in size compared to DOCX.</li>
              <li><strong>Perfect for Collaboration:</strong> Many organizations and institutions prefer open formats for document sharing.</li>
            </ul>

            <h3>🧠 Who Can Benefit?</h3>
            <ul>
              <li><strong>Students:</strong> Submit assignments or reports in ODT for LibreOffice-based institutions.</li>
              <li><strong>Freelancers & Writers:</strong> Create universally accessible documents for clients.</li>
              <li><strong>Government Employees:</strong> Comply with open standards in public administration.</li>
              <li><strong>Linux Users:</strong> Open and edit documents without needing proprietary software.</li>
            </ul>

            <h3>📱 Works on Any Device</h3>
            <p>
              This DOC to ODT converter is browser-based, so you can use it on any platform – Windows, macOS, Linux, Android, or iOS. There's no need to install software or create an account.
            </p>

            <h3>🔐 Your Privacy is Our Priority</h3>
            <p>
              We respect your data. All file conversions happen securely, and your uploaded files are automatically deleted after processing. No data is stored or shared.
            </p>

            <h3>💡 Top Features</h3>
            <ul>
              <li>No login or registration required</li>
              <li>Supports both DOC and DOCX files</li>
              <li>Fast conversion and instant download</li>
              <li>Mobile-optimized interface</li>
              <li>Unlimited file conversions for free</li>
            </ul>

          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your DOC file to ODT instantly – safe, accurate, and free!</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default DocToOdtConverter;
