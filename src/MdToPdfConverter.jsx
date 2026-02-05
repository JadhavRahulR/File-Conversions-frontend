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
import IntroVideo from "./assets/videos/how to convert md to pdf.mp4";
import IntroPoster from "./assets/images/md to pdf poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";


const BASE_URL = import.meta.env.VITE_BASE_URL
const MdToPdfConverter = () => {
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

    if (!file) return alert("Please upload a Markdown (.md) file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-md-to-pdf`,
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
        file.name.replace(/\.md$/i, "") + ".pdf",
        { type: "application/pdf" }
      );

      setConvertedFile(convertedFile);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.md$/, "") + ".pdf";
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
        <title>MD To PDF Convert Online | Secure and Free Markdown To PDF Converter</title>
        <meta name="description" content="Convert Markdown (.md) files to PDF easily and securely. Free online MD to PDF converter with no email or registration required." />
        <link rel="canonical" href="https://fileunivers.com/md-to-pdf" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="md to pdf, convert md to pdf, markdown to pdf, free md to pdf converter, online markdown to pdf" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <div className="pagetitle">

        <h1>Convert MD To PDF Online - Free Markdown To PDF Converter For Clean Formatting</h1>

        <p className="intro-paragraph">
          Easily convert your Markdown (.md) files to PDF online with our fast, accurate, and free converter. Preserve your document’s headings, lists, code blocks, and formatting style exactly as written in Markdown. No installation or setup required- just upload your MD file, click Upload for Conversion, and instantly Auto download a professional PDF version. Perfect for developers, writers, and technical professionals who want to share or print Markdown documents in a clean, readable PDF format.   </p>
      </div>
      <section>
        <div className='converter'>
          <div className="converterheading">
            <h2>Convert MD To PDF </h2>
          </div>
          <input type="file" accept=".md" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.md']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.md']} />
          </div>
          <DropzoneInput acceptedType={['md']} file={file} onFileAccepted={setFile} setStatus={setStatus} />
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
          <h2 className="converter-title">Convert Markdown (MD) to PDF - Free & Accurate</h2>
          <p>Our MD to PDF converter ensures high-quality rendering with perfect text alignment, syntax highlighting, and support for Markdown elements like tables, links, and images. Whether you’re converting documentation, notes, or project files, this tool delivers beautifully formatted PDFs that are ready for sharing or publication. 100% secure, browser-based, and mobile-friendly- experience seamless Markdown to PDF conversion without losing structure or style.</p>
          <div className="converterImg">
            <img src="md.png" alt="md Img" className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Symbol" className='ConverterArrowImg' />

            <img src="pdf.png" alt="Pdf Img" className='ConverterImgtwo' />

          </div>
          <div className="converter-section">
            <h2>🔄 How to Convert MD to PDF</h2>
            <ol>
              <li>📤 Upload your Markdown (.md) file - drag & drop or click to select.</li>
              <li>⚙️ We’ll convert it to a beautifully formatted PDF document.</li>
              <li>📥 Auto Download the PDF instantly after conversion.</li>
            </ol>
            <p><strong>📌Note:</strong> Large files or heavily formatted Markdown may take more time to process.</p>
          </div>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert MD to PDF ? "
              description='Convert your Markdown (.md) file to PDF in just a few seconds with this simple step-by-step video!. Learn how to turn your Markdown documents into beautifully formatted PDF files- perfect for sharing, printing, or publishing your work. No software installation or coding required!.'
            />
          </section>
          <div className="converter-section">
            <h2>🔒Why Use Our Markdown to PDF Converter?</h2>
            <ul>
              <li>✅ Supports headings, lists, code blocks, tables, links, and more.</li>
              <li>🔐 Secure: All files are deleted automatically after processing.</li>
              <li>⚡ Converts instantly with accurate formatting.</li>
              <li>🌐 Use it on any browser, any device - no installs needed.</li>
              <li>🆓 100% free with unlimited usage.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .md (Markdown)</p>
            <p><strong>Output:</strong> .pdf</p>
            <h2>Also check other features Related to PDF file  </h2>
            <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > RTf To PDF Converter </Link></li>
            <li><Link to="/xlsx-to-pdf" className='btn' > XLSX  To PDF Converter </Link></li>
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
            <p><strong>Q:</strong> Will code blocks and formatting be preserved?<br />
              <strong>A:</strong> Yes, your PDF will reflect all Markdown formatting including code blocks and tables.</p>
            <p><strong>Q:</strong> Can I convert GitHub-flavored Markdown?<br />
              <strong>A:</strong> Yes, we support GFM extensions like task lists and fenced code blocks.</p>
            <p><strong>Q:</strong> Can I use this without installing anything?<br />
              <strong>A:</strong> Absolutely! No registration or installation is needed.</p>
          </div>
          <div className="compresspdf-article-section">
            <h2>📝 Convert Markdown (MD) to PDF - Clean, Readable Document Export</h2>
            <p>
              Quickly convert your Markdown (.md) files into professional-grade PDF documents. Whether you're writing documentation, notes, or technical content, this tool helps you create a printable, shareable PDF version in seconds.
            </p>

            <h3>📄 What is Markdown to PDF Conversion?</h3>
            <p>
              Markdown is a lightweight markup language widely used for formatting plain text. Converting Markdown to PDF lets you preserve the structure and formatting of your content in a fixed, portable document format.
            </p>

            <h3>📌Why Convert Markdown Files to PDF?</h3>
            <ul>
              <li><strong>Universal Sharing:</strong> PDFs are easier to share, print, and archive.</li>
              <li><strong>Clean Formatting:</strong> Convert structured content like headings, lists, links, and code blocks into polished PDF layouts.</li>
              <li><strong>Documentation:</strong> Turn README.md or project docs into official reports or manuals.</li>
              <li><strong>Offline Use:</strong> Create accessible content that doesn't rely on Markdown viewers.</li>
            </ul>

            <h3>         Who Uses MD to PDF Tools?</h3>
            <ul>
              <li><strong>Developers:</strong> Export README files or API docs into PDFs.</li>
              <li><strong>Writers & Bloggers:</strong> Write in Markdown, publish in PDF.</li>
              <li><strong>Students & Researchers:</strong> Submit formatted reports created in Markdown.</li>
              <li><strong>Open Source Contributors:</strong> Share markdown documentation in universally viewable PDF formats.</li>
            </ul>


            <h3>⚙️ Features of Our Markdown to PDF Converter</h3>
            <ul>
              <li>Supports GitHub-style Markdown syntax</li>
              <li>Includes headers, bold/italic text, tables, and code blocks</li>
              <li>Custom fonts and formatting for professional output</li>
              <li>Handles large and multi-section Markdown files</li>
              <li>No ads, no watermarks, and no limitations</li>
            </ul>

            <h3>     Cross-Platform Compatibility</h3>
            <p>
              This tool works flawlessly on all devices and browsers   —whether you're on Windows, macOS, Linux, Android, or iOS.
            </p>

            <h3>🔐 Secure & Private</h3>
            <p>
              We prioritize user privacy. All uploaded Markdown files are encrypted during transmission and deleted automatically after conversion.
            </p>

            <h3>🚀 Why Use Our MD to PDF Converter?</h3>
            <ul>
              <li>Free and instant conversion</li>
              <li>No need to install any software</li>
              <li>Clean and minimal design</li>
              <li>Perfect for tech professionals and writers</li>
              <li>Optimized for speed and accuracy</li>
            </ul>

          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your Markdown files to PDF instantly - perfect for documentation, notes, and reports.</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default MdToPdfConverter;
