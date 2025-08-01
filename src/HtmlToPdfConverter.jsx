import React, { useState ,useEffect} from 'react';
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';

const BASE_URL = import.meta.env.VITE_BASE_URL
const HtmlToPdfConverter = () => {
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
    if (!file) return alert("Please upload an HTML file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-html-to-pdf`,
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.html$/, "") + ".pdf";
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
      <title>HTML to PDF | Free Webpage to PDF Converter</title>
<meta name="description" content="Convert HTML files or webpages to PDF quickly and securely. Free online HTML to PDF converter with no email or signup needed." />
<link rel="canonical" href="https://fileunivers.in/html-to-pdf" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="html to pdf, convert html to pdf, webpage to pdf, free html to pdf converter, online html to pdf" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
      <ScrollToTop/>
      <Tools />
      <section>
        <div className='converter'>
          <h1>Convert Html To Pdf </h1>
          <input type="file" accept=".html" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.html']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.html']} />
          </div>
          <DropzoneInput acceptedType={['html']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>

          {file && (
            <p className="selected-file ">
              ✅ Selected File: <b>{file.name}</b>
            </p>
          )}
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h2 className="converter-title">Convert HTML to PDF – Clean, Fast & Free</h2>

    <div className="converter-section">
      <h2>🔄 How to Convert HTML to PDF</h2>
      <ol>
        <li>📤 Upload your HTML file – drag & drop or click to select.</li>
        <li>⚙️ We’ll render and convert it into a high-quality PDF.</li>
        <li>📥 Auto Download the PDF file after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files or pages with heavy styling may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our HTML to PDF Converter?</h2>
      <ul>
        <li>✅ Converts HTML files with styles, images, and layout intact.</li>
        <li>🔐 Secure: We automatically delete your files after conversion.</li>
        <li>⚡ Fast rendering and precise output – even for complex pages.</li>
        <li>🌐 No extensions or installs required – works in all browsers.</li>
        <li>🆓 100% free and unlimited usage.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .html, .htm</p>
      <p><strong>Output:</strong> .pdf</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will images and CSS be included in the PDF?<br />
        <strong>A:</strong> Yes! All linked styles and images are preserved during conversion.</p>
      <p><strong>Q:</strong> Can I upload an entire webpage?<br />
        <strong>A:</strong> This tool is for `.html` files. For live URLs, use our **Webpage to PDF** converter.</p>
      <p><strong>Q:</strong> Can I use this on mobile?<br />
        <strong>A:</strong> Yes, it's fully responsive and mobile-friendly.</p>
    </div>
            <div className="compresspdf-article-section">
  <h2>🌐 Convert HTML to PDF – Turn Webpages into Printable Documents</h2>
  <p>
    Convert your HTML files or webpage content into high-quality PDF documents quickly and securely. Whether it's a web design mockup, blog post, or dynamic report, our HTML to PDF converter captures it all with precision.
  </p>

  <h3>📄 What is an HTML to PDF Conversion?</h3>
  <p>
    HTML (HyperText Markup Language) is used to build web pages. Converting HTML to PDF allows you to preserve the layout, styling, images, and content of a webpage or HTML file into a universal document format suitable for sharing and printing.
  </p>

  <h3>📌 Why Convert HTML to PDF?</h3>
  <ul>
    <li><strong>Offline Access:</strong> Save webpages for later viewing without an internet connection.</li>
    <li><strong>Print-Ready:</strong> Create clean and formatted documents from any HTML or website content.</li>
    <li><strong>Archive Web Content:</strong> Preserve designs, blog posts, or online articles in PDF format.</li>
    <li><strong>Professional Reports:</strong> Convert dynamic data reports or invoices into PDFs with ease.</li>
  </ul>

  <h3>👨‍💻 Who Uses HTML to PDF Tools?</h3>
  <ul>
    <li><strong>Web Developers:</strong> Export HTML prototypes or documentation into PDF.</li>
    <li><strong>Designers:</strong> Showcase web layouts or portfolios in a fixed-format PDF.</li>
    <li><strong>Students:</strong> Save educational content or research articles from the web.</li>
    <li><strong>Marketers & Bloggers:</strong> Distribute web articles in downloadable PDF format.</li>
  </ul>

  

  <h3>⚙️ Features of Our HTML to PDF Converter</h3>
  <ul>
    <li>Accurate rendering of HTML, CSS, and images</li>
    <li>Preserves layout, fonts, and structure</li>
    <li>Supports embedded styles and external resources</li>
    <li>Handles both static HTML files and dynamic web content</li>
    <li>No file size limits or conversion restrictions</li>
  </ul>

  <h3>🖥️ Device & Browser Compatibility</h3>
  <p>
    Our tool works across all platforms and browsers. Use it on Windows, macOS, Linux, iOS, or Android – no downloads or installations required.
  </p>

  <h3>🔐 Secure and Private</h3>
  <p>
    We ensure full privacy for your content. Uploaded HTML files are never stored or shared. Files are removed automatically after conversion.
  </p>

  <h3>🚀 Why Choose This HTML to PDF Converter?</h3>
  <ul>
    <li>Free, fast, and easy to use</li>
    <li>No account or email needed</li>
    <li>High-quality PDF output</li>
    <li>Responsive and mobile-friendly tool</li>
    <li>Ideal for developers, professionals, and general users</li>
  </ul>

 
</div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert HTML files to PDF effortlessly – perfect for reports, invoices, or saving web content.</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

    </>
  );
};

export default HtmlToPdfConverter;
