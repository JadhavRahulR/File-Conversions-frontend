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
import IntroVideo from "../src/assets/videos/how to convert odt to doc.mp4"
import IntroPoster from "../src/assets/images/odt to doc poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

const BASE_URL = import.meta.env.VITE_BASE_URL
const OdtToDocConverter = () => {
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

    if (!file) return alert("Please upload an ODT file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-odt-to-doc`,
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
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const convertedFile = new File(
        [save],
        file.name.replace(/\.odt$/i, "") + ".docx",
        {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }
      );

      setConvertedFile(convertedFile);



      const blob = new Blob([response.data], {
        type: "application/msword",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.odt$/, "") + ".docx";
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
        <title>Convert ODT To DOC | Free OpenDocument To Word Online and Secure Converter</title>
        <meta name="description" content="Convert ODT files to DOC format easily and securely. Free online ODT to DOC converter with no email or registration required." />
        <link rel="canonical" href="https://fileunivers.com/odt-to-doc" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="odt to doc, convert odt to doc, opendocument to word, free odt to doc converter, online odt to doc" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <div className="pagetitle">

        <h1>Convert ODT To DOC Online - Free ODT To Word Converter (Fast & Secure)</h1>

        <p className="intro-paragraph">
          Convert your ODT files to DOC format quickly with our free online ODT to Word converter. This powerful tool allows you to turn OpenDocument Text (.odt) files into editable Microsoft Word (.doc) documents in seconds- no software installation required. Just upload your ODT file, click “Upload”, and auto download your DOC file instantly. The conversion is 100% secure, fast, and preserves your original formatting perfectly for easy editing in Microsoft Word.          </p>
      </div>
      <section>
        <div className='converter'>
          <div className="converterheading">
            <h2>Convert ODT To Word </h2>
          </div>
          <input type="file" accept=".odt" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.odt']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.odt']} />
          </div>
          <DropzoneInput acceptedType={['odt']} file={file} onFileAccepted={setFile} setStatus={setStatus} />
          {/* <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status === 'Converting...' ? `Converting... (${progress}%)` : "Upload"}
          </button> */}
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
          <h2 className="converter-title">Convert ODT to DOC - Free & Reliable</h2>
          <p>Convert your ODT files to DOC format quickly with our free online ODT to Word converter. This tool allows you to turn OpenDocument Text (.odt) files to (.doc) documents in seconds- no sign up need. Just upload your ODT file, click “Upload”, and auto download your DOC file instantly. IT secure, fast, and preserves your original formatting perfectly for easy editing in Microsoft Word. </p>
          <div className="converterImg">
            <img src="odt.png" alt="odt Img" className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Symbol" className='ConverterArrowImg' />

            <img src="word.png" alt="word Img" className='ConverterImgtwo' />

          </div>
          <div className="converter-section">
            <h2>🔄 How to Convert ODT to DOC ? </h2>
            <ol>
              <li>📤 Upload your ODT file - drag & drop or click to select.</li>
              <li>⚙️ We’ll convert it into a Microsoft Word (.doc) format.</li>
              <li>📥 Auto Download the DOC file after conversion.</li>
            </ol>
            <p><strong>📌Note:</strong> Large files may take more time to process.</p>
          </div>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert ODT To DOC ? "
              description='Convert ODT to DOC format quickly and easily with our free online ODT to Word converter. This video shows you how to change your OpenDocument Text (.odt) files into Microsoft Word (.doc) files in just a few seconds- no software or sign-up needed. Perfect for users of LibreOffice, OpenOffice, or Google Docs who need full compatibility with Microsoft Word.'
            />
          </section>
          <div className="converter-section">
            <h2>🔒Why Use Our ODT to DOC Converter?</h2>
            <ul>
              <li>✅ Accurately converts formatting, fonts, and images.</li>
              <li>🔐 Your files are safe - we delete them shortly after conversion.</li>
              <li>⚡ Converts in seconds with reliable output.</li>
              <li>🌐 No software needed - works in all browsers and devices.</li>
              <li>🆓 100% free with unlimited use.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .odt (OpenDocument Text)</p>
            <p><strong>Output:</strong> .doc /docs</p>
            <h2>Also check other features Related to odt file  </h2>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/doc-to-odt" className='btn' >DOC To ODT Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/odtcompressor" className='btn'>Compress ODT </Link></li>
            <Link></Link>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Will the converted file open in older versions of Word?<br />
              <strong>A:</strong> Yes, the output is compatible with Word 97-2003 and newer.</p>
            <p><strong>Q:</strong> Is formatting preserved?<br />
              <strong>A:</strong> Yes, formatting, tables, and images are retained.</p>
            <p><strong>Q:</strong> Do I need to register or install anything?<br />
              <strong>A:</strong> No registration or installation required. It works online.</p>
          </div>
          <div className="compresspdf-article-section">
            <h2>📄 Convert ODT to DOC - OpenDocument to Microsoft Word Format</h2>
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

            <h3>🧠 Who Can Use This Tool?</h3>
            <ul>
              <li><strong>Students:</strong> Submit school assignments in the format teachers expect.</li>
              <li><strong>Professionals:</strong> Collaborate on DOC files with teams using Microsoft Word.</li>
              <li><strong>Writers:</strong> Prepare manuscripts or proposals for publishers that require DOC format.</li>
              <li><strong>Remote Workers:</strong> Ensure your documents open perfectly on any colleague’s device.</li>
            </ul>

            <h3>📱 Works on All Devices</h3>
            <p>
              Our converter is 100% browser-based and mobile-friendly. Whether you’re using a phone, tablet, laptop, or desktop- it works everywhere with no installation needed.
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
            <p>Convert your ODT file to a DOC document in one click - quick and secure!</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default OdtToDocConverter;
