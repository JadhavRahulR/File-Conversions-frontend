import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import "./converter.css"
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "./assets/videos/how to convert odp to pptx.mp4"
import IntroPoster from "./assets/images/odp to pptx poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

const BASE_URL = import.meta.env.VITE_BASE_URL
const OdpToPptx = () => {
  const [file, setFile] = useState(null);
  // const [downloadUrl, setDownloadUrl] = useState('');
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

    if (!file) return alert("Please select an ODP file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(`${BASE_URL}/convert-odp-to-pptx`, formData, {
        responseType: 'blob',
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(Math.min(percent, 90));
        },
      });

      const save = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });

      const convertedFile = new File(
        [save],
        file.name.replace(/\.odp$/i, "") + ".pptx",
        {
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        }
      );

      setConvertedFile(convertedFile);


      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.odp$/, "") + ".pptx";
      a.click();
      window.URL.revokeObjectURL(url);
      // setDownloadUrl(url);
      setStatus("✅ Done");

    } catch (error) {
      console.error("Conversion failed", error);
      alert("Failed to convert file.");
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
        <title>Convert ODP To PPTX | Free OpenDocument To PowerPoint Online Converter</title>
        <meta name="description" content="Convert ODP files to PPTX format quickly and securely. Free online ODP to PPTX converter with no signup or email required." />
        <link rel="canonical" href="https://fileunivers.com/odp-to-pptx" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="odp to pptx, convert odp to pptx, opendocument to powerpoint, free odp to pptx converter, online odp to pptx" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <div className="pagetitle">

        <h1> Convert ODP to PPTX Online - Free and Secure OpenOffice to PowerPoint Converter </h1>

        <p className="intro-paragraph">
          Convert your PowerPoint presentations (.pptx) to OpenDocument Presentation (.odp) format easily with our free online PPTX to ODP converter. This tool provides a fast, accurate, and secure way to make your slides compatible with LibreOffice Impress and OpenOffice. No software installation is needed- just upload your PPTX file, click “Upload”, and auto download your ODP presentation within seconds. It preserves your original formatting, animations, and slide design perfectly for smooth cross-platform editing.
        </p>
      </div>
      <section>
        <div className='converter'>
          <div className="converterheading">
            <h2>Convert ODP To PPTX </h2>
          </div>
          <input type="file" accept=".odp" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.odp']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.odp']} />
          </div>
          <DropzoneInput acceptedType={['odp']} file={file} onFileAccepted={setFile} setStatus={setStatus} />
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
          <h2 className="converter-title">Convert ODP to PPTX - Fast & Free Online</h2>
          <p>Convert your PowerPoint presentations to OpenDocument Presentation easily with our free online PPTX to ODP tool. This tool provides a fast, accurate, and secure way to make your slides compatible with LibreOffice Impress and OpenOffice. Usefull for Student , Teachers and Office worker. </p>
          <div className="converter-section">
            <h2>🔄 How to Convert ODP to PPTX ? </h2>
            <ol>
              <li>📤 Upload your ODP file - drag & drop or click to select.</li>
              <li>⚙️ We’ll convert it to a PowerPoint Presentation (.pptx) format.</li>
              <li>📥 Auto Download the PPTX file after conversion.</li>
            </ol>
            <p><strong>📌Note:</strong> Large files may take more time to process.</p>
          </div>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert ODP To PPTX ? "
              description='Easily convert your ODP file to PPTX format online with this simple step-by-step guide!     🔄 This video shows you how to turn your OpenOffice or LibreOffice presentation (.odp) into a PowerPoint file (.pptx) in just a few clicks- no software or registration required.'
            />
          </section>

          <div className="converter-section">
            <h2>🔒Why Use Our ODP to PPTX Converter?</h2>
            <ul>
              <li>✅ Converts slide content, formatting, and layout accurately.</li>
              <li>🔐 Your privacy is protected - files are automatically deleted after conversion.</li>
              <li>⚡ Fast conversion with no design loss.</li>
              <li>🌐 Works in all browsers - no software required.</li>
              <li>🆓 Free to use with unlimited access.</li>
            </ul>
          </div>
          <div className="converterImg">
            <img src="odp.png" alt="odp Img" className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Symbol" className='ConverterArrowImg' />
            <img src="pptx.png" alt="pptx Img" className='ConverterImgtwo' />

          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .odp (OpenDocument Presentation)</p>
            <p><strong>Output:</strong> .pptx (PowerPoint Presentation)</p>

            <h2>Also check other features Related to ODP file  </h2>
            <li><Link to="/pptx-to-pdf" className='btn'> PPTX To PDF  Converter </Link></li>
            <li><Link to="/odp-to-pptx" className='btn'> PPTX To ODP  Converter </Link></li>
            <li><Link to="/pdf-to-pptx" className='btn' > PDF To PPTX Converter </Link></li>
            <li><Link to="/pptxcompress" className='btn'> Compress ODP </Link></li>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Can I open the PPTX file in Microsoft PowerPoint?<br />
              <strong>A:</strong> Yes! The converted file is fully compatible with all versions of PowerPoint.</p>
            <p><strong>Q:</strong> Will my images and slide design remain the same?<br />
              <strong>A:</strong> Yes, we preserve layout, images, and fonts during conversion.</p>
            <p><strong>Q:</strong> Do I need to create an account to use this tool?<br />
              <strong>A:</strong> No sign-up is required. It's 100% free and secure.</p>
          </div>
          <div className="compresspdf-article-section">
            <h2>     Convert ODP to PPTX - OpenDocument to PowerPoint Made Easy</h2>
            <p>
              Convert your OpenDocument Presentation files (.odp) into Microsoft PowerPoint format (.pptx) quickly and effortlessly. Our online tool helps you transition from open-source software like LibreOffice to PowerPoint without losing your presentation’s layout, animations, or visuals.
            </p>

            <h3>📌Why Convert ODP to PPTX?</h3>
            <ul>
              <li><strong>Better Compatibility:</strong> PPTX is fully compatible with Microsoft PowerPoint and Office 365.</li>
              <li><strong>Professional Presentations:</strong> Use advanced PowerPoint features like animations, templates, and transitions.</li>
              <li><strong>Collaboration:</strong> Work easily with teams using Microsoft tools.</li>
              <li><strong>Editing Flexibility:</strong> PPTX offers richer editing options and design flexibility.</li>
              <li><strong>Presentation Sharing:</strong> PPTX format is widely accepted on platforms like Zoom, Teams, and Google Slides.</li>
            </ul>

            <h3>     Who Needs ODP to PPTX Conversion?</h3>
            <ul>
              <li><strong>Students:</strong> Share class presentations with professors or peers using Microsoft tools.</li>
              <li><strong>Professionals:</strong> Use company templates and PowerPoint formatting for client presentations.</li>
              <li><strong>Teachers:</strong> Reuse LibreOffice slides in PowerPoint for easier classroom presentation.</li>
              <li><strong>Freelancers:</strong> Convert and submit presentations to clients who use Office formats.</li>
            </ul>

            <h3>⚙️ Key Features</h3>
            <ul>
              <li>Preserves layout, fonts, animations, and images</li>
              <li>High-quality file conversion with minimal formatting loss</li>
              <li>Completely browser-based - no software needed</li>
              <li>Fast conversion with instant download</li>
              <li>Works with all versions of Microsoft PowerPoint</li>
            </ul>

            <h3>     Compatible with All Devices</h3>
            <p>
              Our converter works on Windows, Mac, Linux, Android, and iOS. You only need a browser - no installation or account required.
            </p>

            <h3>🔐 File Safety & Privacy</h3>
            <p>
              Your files are encrypted during transfer and deleted from our servers automatically after processing. We do not store or share your presentations with anyone.
            </p>

            <h3>🚀 Why Choose Our ODP to PPTX Converter?</h3>
            <ul>
              <li>Fast, free, and easy to use</li>
              <li>No login or signup required</li>
              <li>High-accuracy layout preservation</li>
              <li>Supports large and complex presentations</li>
              <li>Perfect for students, professionals, and educators</li>
            </ul>


          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your ODP presentation to PPTX in seconds - accurate, private, and completely free.</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default OdpToPptx;
