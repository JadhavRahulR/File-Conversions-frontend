import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import "./converter.css"
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL
const PptxToOdp = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");
  const [progress, setProgress] = useState(0);

     
       const handleFileChange = (eOrFile) => {
         const file = eOrFile?.target?.files?.[0] || eOrFile;
         if (file) {
           setFile(file);
           setStatus(status === "✅ Conversion complete!" ? "upload" : "convert");
         }
       };
  const handleConvert = async () => {
    setProgress(10);

    if (!file) return alert("Please select a PPTX file");

    const formData = new FormData();
    formData.append("file", file);

    try {
       setStatus("Converting...")
      const response = await axios.post(`${BASE_URL}/convert-pptx-to-odp`, formData, {
        responseType: 'blob',
        onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(Math.min(percent, 90));
                },
      });

      const blob = new Blob([response.data], { type: 'application/vnd.oasis.opendocument.presentation' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pptx$/, '') + '.odp';
      a.click();
      URL.revokeObjectURL(url);
      setStatus("✅ Conversion complete!");
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
    <Helmet>
      <title>PPTX to ODP | Free PowerPoint to OpenDocument Converter</title>
<meta name="description" content="Convert PPTX files to ODP format online for free. Fast, secure, and easy PPTX to ODP converter with no email or registration required." />
<link rel="canonical" href="https://fileunivers.in/pptx-to-odp" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="pptx to odp, convert pptx to odp, powerpoint to odp, free pptx to odp converter, online pptx to odp" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
    <ScrollToTop/>
   <section>
    <Tools/>
        <div className='converter'>
          <h1>Convert Pptx To Odp</h1>
          <input type="file" accept=".pptx" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pptx']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pptx']} />
          </div>
         <DropzoneInput acceptedType={['pptx']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
          
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status === 'Converting...'? `Converting... (${progress}%)` :"Upload"}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h2 className="converter-title">Convert PPTX to ODP – Free Online Converter</h2>

    <div className="converter-section">
      <h2>🔄 How to Convert PPTX to ODP</h2>
      <ol>
        <li>📤 Upload your PPTX file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it to an OpenDocument Presentation (.odp).</li>
        <li>📥 Auto Download the ODP file after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our PPTX to ODP Converter?</h2>
      <ul>
        <li>✅ Preserves slide layouts, text, images, and design elements.</li>
        <li>🔐 Your files are secure – automatically deleted after processing.</li>
        <li>⚡ Quick and reliable conversion with no formatting loss.</li>
        <li>🌐 100% browser-based – no software or plugins needed.</li>
        <li>🆓 Free for unlimited use with no registration required.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .pptx (PowerPoint Presentation)</p>
      <p><strong>Output:</strong> .odp (OpenDocument Presentation)</p>
      <h2>Also check other features Related to Pptx file  </h2>
                    <li><Link to="/pptx-to-pdf" className='btn'> pptx to PDF  Converter </Link></li>
                    <li><Link to="/odp-to-pptx" className='btn'> odp to pptx  Converter </Link></li>
                     <li><Link to="/pdf-to-pptx" className='btn' > pdf to pptx Converter </Link></li>
                    <li><Link to="/pptxcompress" className='btn'> Compress PPtx </Link></li>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Can I open the ODP file in LibreOffice or OpenOffice?<br />
        <strong>A:</strong> Yes! ODP files are fully compatible with LibreOffice Impress and other open-source tools.</p>
      <p><strong>Q:</strong> Will animations and transitions be preserved?<br />
        <strong>A:</strong> Basic transitions may work, but complex animations may be flattened.</p>
      <p><strong>Q:</strong> Will my file be saved or stored?<br />
        <strong>A:</strong> No. All files are auto-deleted after conversion.</p>
    </div>
    <div className="compresspdf-article-section">
  <h2>🎥 Convert PPTX to ODP – Switch from PowerPoint to Open Format</h2>
  <p>
    Seamlessly convert your PowerPoint presentations (PPTX) into the Open Document Presentation format (ODP) used by LibreOffice and other open-source platforms. Our tool helps you maintain formatting and structure while making your presentations more accessible and flexible across different software.
  </p>

  <h3>🧾 What is an ODP File?</h3>
  <p>
    ODP stands for Open Document Presentation. It is the default format for presentation files created in open-source office suites like LibreOffice Impress and Apache OpenOffice. ODP files store slides with text, images, charts, transitions, and formatting – similar to Microsoft’s PPTX format, but in an open-standard layout.
  </p>

  <h3>📌 Why Convert PPTX to ODP?</h3>
  <ul>
    <li><strong>Cross-Platform Compatibility:</strong> ODP files can be opened on any platform supporting open document formats.</li>
    <li><strong>LibreOffice Integration:</strong> Ideal for Linux users or anyone using open-source office software.</li>
    <li><strong>Open Standard:</strong> No proprietary lock-in – ensures long-term accessibility and transparency.</li>
    <li><strong>Collaboration Friendly:</strong> Teams using mixed software stacks can collaborate more easily.</li>
    <li><strong>Lightweight Files:</strong> ODP files often take up less space compared to PPTX.</li>
  </ul>

  <h3>👥 Who Benefits from PPTX to ODP Conversion?</h3>
  <ul>
    <li><strong>Students & Teachers:</strong> Prepare and view presentations on open-source platforms like LibreOffice Impress.</li>
    <li><strong>Linux Users:</strong> Convert PowerPoint files into a format compatible with Linux-native applications.</li>
    <li><strong>Remote Teams:</strong> Use open document formats to promote accessibility and reduce dependency on Microsoft tools.</li>
    <li><strong>Government & NGOs:</strong> Many institutions prefer ODF-compliant formats for regulatory compliance and cost-saving.</li>
  </ul>

  

  <h3>⚙️ Key Features</h3>
  <ul>
    <li>Preserves original slide layout, formatting, and images</li>
    <li>Fast, accurate, and high-quality conversion</li>
    <li>Completely online – no software download needed</li>
    <li>Supports large and multi-slide presentations</li>
    <li>Instant download after processing</li>
  </ul>

  <h3>🖥️ Works on All Platforms</h3>
  <p>
    Convert PPTX to ODP on any device – Windows, macOS, Linux, Android, or iOS. Our tool is browser-based and does not require any app installation.
  </p>

  <h3>🔐 Privacy First</h3>
  <p>
    We respect your privacy. Files uploaded for conversion are encrypted during transfer and deleted automatically after a short time. We do not store or share your files.
  </p>

  <h3>🚀 Why Use Our PPTX to ODP Converter?</h3>
  <ul>
    <li>Free and simple to use</li>
    <li>No registration required</li>
    <li>Supports complex presentations with animations and charts</li>
    <li>Compatible with LibreOffice, OpenOffice, and other ODF software</li>
    <li>Quick downloads with no file size limits for most use cases</li>
  </ul>

 
</div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your PPTX presentations to ODP format easily and securely – perfect for open-source tools!</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

      </>
  );
};

export default PptxToOdp;
