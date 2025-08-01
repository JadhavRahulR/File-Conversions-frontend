import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';

const BASE_URL = import.meta.env.VITE_BASE_URL
const OdtToDocConverter = () => {
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
    if (!file) return alert("Please upload an ODT file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-odt-to-doc`,
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/msword",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.odt$/, "") + ".docx";
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
        <title>ODT to DOC | Free OpenDocument to Word Converter</title>
        <meta name="description" content="Convert ODT files to DOC format easily and securely. Free online ODT to DOC converter with no email or registration required." />
        <link rel="canonical" href="https://fileunivers.in/odt-to-doc" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="odt to doc, convert odt to doc, opendocument to word, free odt to doc converter, online odt to doc" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <Tools />
      <section>
        <div className='converter'>
          <h1>Convert Odt To Word/Doc </h1>
          <input type="file" accept=".odt" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.odt']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.odt']} />
          </div>
          <DropzoneInput acceptedType={['odt']} file={file} onFileAccepted={setFile} setStatus={setStatus} />
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
        <div className="converter-container">
          <h2 className="converter-title">Convert ODT to DOC – Free & Reliable</h2>

          <div className="converter-section">
            <h2>🔄 How to Convert ODT to DOC</h2>
            <ol>
              <li>📤 Upload your ODT file – drag & drop or click to select.</li>
              <li>⚙️ We’ll convert it into a Microsoft Word (.doc) format.</li>
              <li>📥 Auto Download the DOC file after conversion.</li>
            </ol>
            <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
          </div>

          <div className="converter-section">
            <h2>🔒 Why Use Our ODT to DOC Converter?</h2>
            <ul>
              <li>✅ Accurately converts formatting, fonts, and images.</li>
              <li>🔐 Your files are safe – we delete them shortly after conversion.</li>
              <li>⚡ Converts in seconds with reliable output.</li>
              <li>🌐 No software needed – works in all browsers and devices.</li>
              <li>🆓 100% free with unlimited use.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .odt (OpenDocument Text)</p>
            <p><strong>Output:</strong> .doc /docs</p>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Will the converted file open in older versions of Word?<br />
              <strong>A:</strong> Yes, the output is compatible with Word 97–2003 and newer.</p>
            <p><strong>Q:</strong> Is formatting preserved?<br />
              <strong>A:</strong> Yes, formatting, tables, and images are retained.</p>
            <p><strong>Q:</strong> Do I need to register or install anything?<br />
              <strong>A:</strong> No registration or installation required. It works online.</p>
          </div>
          <div className="compresspdf-article-section">
            <h2>📄 Convert ODT to DOC – OpenDocument to Microsoft Word Format</h2>
            <p>
              Need to convert your ODT files into Microsoft Word’s DOC format? Our free and easy-to-use online tool lets you turn any OpenDocument Text (.odt) file into a fully compatible DOC file with just a few clicks. Whether you’re switching software or sharing files with Word users, this converter ensures seamless transformation.
            </p>

            <h3>🔍 What is an ODT File?</h3>
            <p>
              ODT, or OpenDocument Text, is a file format used by open-source word processors like LibreOffice and OpenOffice. It’s widely accepted in academic, government, and open-source communities but may not open properly in Microsoft Word without conversion.
            </p>

            <h3>🔄 Why Convert ODT to DOC?</h3>
            <ul>
              <li><strong>Greater Compatibility:</strong> DOC files work flawlessly with Microsoft Word, Google Docs, and most modern word processors.</li>
              <li><strong>Professional Use:</strong> Many organizations prefer DOC for official documentation and collaboration.</li>
              <li><strong>Formatting Accuracy:</strong> Conversion helps preserve formatting when sharing files with Microsoft Word users.</li>
              <li><strong>Convenient Editing:</strong> Easily edit converted DOC files using familiar Word features.</li>
            </ul>

            <h3>🧑‍🏫 Who Can Use This Tool?</h3>
            <ul>
              <li><strong>Students:</strong> Submit school assignments in the format teachers expect.</li>
              <li><strong>Professionals:</strong> Collaborate on DOC files with teams using Microsoft Word.</li>
              <li><strong>Writers:</strong> Prepare manuscripts or proposals for publishers that require DOC format.</li>
              <li><strong>Remote Workers:</strong> Ensure your documents open perfectly on any colleague’s device.</li>
            </ul>

            <h3>📱 Works on All Devices</h3>
            <p>
              Our converter is 100% browser-based and mobile-friendly. Whether you’re using a phone, tablet, laptop, or desktop — it works everywhere with no installation needed.
            </p>

            <h3>🔐 Safe, Secure, and Private</h3>
            <p>
              We value your privacy. All file conversions are encrypted and automatically deleted from our servers after processing. Your data is never stored or shared.
            </p>

            <h3>💡 Key Features</h3>
            <ul>
              <li>Completely free to use with no limitations</li>
              <li>No signup or account required</li>
              <li>Fast and accurate conversion from ODT to DOC</li>
              <li>Preserves original formatting, fonts, and layout</li>
              <li>Supports files from all ODT-based word processors</li>
            </ul>

          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your ODT file to a DOC document in one click – quick and secure!</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default OdtToDocConverter;
