import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./converter.css"
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL

function PdfToWordConverter() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");
  const [progress, setProgress] = useState(0);


  const handleFileChange = (eOrFile) => {
    const selected = eOrFile?.target?.files?.[0] || eOrFile;
    if (!selected) return;

    console.log("📄 File selected:", selected.name, selected.size, "bytes");
    console.time("📤 File → Ready to Convert");

    setFile(selected);
    setStatus("Convert");

    console.timeEnd("📤 File → Ready to Convert");
  };


  const handleConvert = async () => {
    setProgress(10);


    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);


    try {
      setStatus("Converting...");
      console.time("⏱ ConvertRequest");

      const response = await axios.post(
        `${BASE_URL}/convert-pdf-to-word`,
        formData,
        {
          responseType: "blob",
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(Math.min(percent, 90));
          },
        }

      );

      console.timeEnd("⏱ ConvertRequest");

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/, "") + ".docx";
      a.click();
      window.URL.revokeObjectURL(url);

      setStatus("✅ Done");
    } catch (error) {
      console.error("❌ Conversion failed:", error);
      alert("Conversion failed.");
      setStatus("❌ Error");
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
    <div>


      <ScrollToTop />
      <Tools />
      <section>
        <Helmet>
          <title>Convert PDF to Word | Free & Secure Online Tool</title>
          <meta name="description" content="Convert PDF files to Word documents (.docx) quickly and securely. Free online PDF to Word converter with no email or signup required." />
          <link rel="canonical" href="https://fileunivers.in/pdf-to-word" />
          <meta name="robots" content="index, follow" />
          <meta name="keywords" content="pdf to word, convert pdf to word, free pdf to word converter, secure pdf to word, pdf to docx" />
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

        </Helmet>
        <div className='converter'>
          <h1>Convert Pdf To Word/Docx </h1>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pdf']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pdf']} />
          </div>
          <DropzoneInput acceptedType={['pdf']} file={file} onFileAccepted={setFile} setStatus={setStatus} />
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status === 'Converting...' ? `Converting... (${progress}%)` : "Upload"}
          </button>
        </div>
      </section>
      <section>
        <div className="converter-container">
          <h1 className="converter-title">Convert PDF to Word – Free & Accurate</h1>

          <div className="converter-section">
            <h2>🔄 How to Convert PDF to Word</h2>
            <ol>
              <li>📤 Upload your PDF file – drag & drop or click to select.</li>
              <li>⚙️ Let us convert your file to an editable Word document (.docx).</li>
              <li>📥 Auto Download the converted file instantly.</li>
            </ol>
            <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
          </div>

          <div className="converter-section">
            <h2>🔒 Why Use Our PDF to Word Converter?</h2>
            <ul>
              <li>✅ Retains layout, fonts, and formatting.</li>
              <li>🔐 Privacy-friendly: Files are automatically deleted after conversion.</li>
              <li>⚡ Quick and accurate conversion with support for scanned PDFs (OCR).</li>
              <li>🌐 Works on all browsers and devices.</li>
              <li>🆓 100% free, unlimited conversions.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .pdf</p>
            <p><strong>Output:</strong> .docx</p>
            <h2>Also check other features Related to PDF file  </h2>
            <li><Link to="/word-to-pdf" className='btn' >Word to PDF Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >odt to pdf Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>pdf to odt Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >txt to pdf Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > pptx to pdf  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > rtf to pdf Converter </Link></li>
            <li><Link to="/html-to-pdf" className='btn' > html to pdf Converter </Link></li>
            <li><Link to="/md-to-pdf" className='btn' > md  to pdf Converter </Link></li>
            <li><Link to="/xlsx-to-pdf" className='btn' > xlsx  to pdf Converter </Link></li>
            <li><Link to="/csv-to-pdf" className='btn' > csv to pdf Converter </Link></li>
            <li><Link to="/img-to-pdf" className='btn' > img to pdf Converter </Link></li>
            <li><Link to="/tiff-to-pdf" className='btn' > tiff to pdf Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' > pdf to odt Converter </Link></li>
            <li><Link to="/pdf-to-txt" className='btn' > pdf to txt Converter </Link></li>
            <li><Link to="/pdf-to-pptx" className='btn' > pdf to pptx Converter </Link></li>
            <li><Link to="/pdf-to-rtf" className='btn' > pdf to rtf Converter </Link></li>
            <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
            <Link></Link>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Will the converted Word file be editable?<br />
              <strong>A:</strong> Yes! You can edit text, images, tables, and more.</p>
            <p><strong>Q:</strong> Does this support scanned PDFs?<br />
              <strong>A:</strong> Yes, OCR is applied where needed.</p>
            <p><strong>Q:</strong> Do I need to install anything?<br />
              <strong>A:</strong> No. Everything works in your browser.</p>
          </div>


        </div>
      </section>
      <section>
        <div className="compresspdf-article-section">
          <h2>📄About Convert PDF to Word </h2>
          <p>
            Need to make changes to a PDF file? Use our free and easy PDF to Word converter to turn your PDFs into fully editable Word (.docx) documents. Whether you're editing a resume, contract, or academic report, this tool makes the process simple and efficient.
          </p>

          <h3> Why Use PDF to Word Conversion?</h3>
          <p>
            PDF files are ideal for sharing, but they aren't easy to edit. Converting a PDF to Word allows you to modify content, update formatting, and reuse text without retyping. Our tool ensures high-quality conversion that keeps layout, fonts, images, and tables intact.
          </p>

          <h3>✨ Key Features</h3>
          <ul>
            <li><strong>Accurate Layout:</strong> Preserves formatting, images, and structure in Word.</li>
            <li><strong>Instant Results:</strong> Convert in seconds, large files may takes more time .</li>
            <li><strong>No Watermarks:</strong> Your final Word file is clean and professional.</li>
            <li><strong>Works on All Devices:</strong> Use from desktop, mobile, or tablet.</li>
            <li><strong>Free & Secure:</strong> No email needed. Files auto-delete after conversion.</li>
          </ul>

          <h3>🧑‍💻 Who Should Use This Tool?</h3>
          <ul>
            <li><strong>Students:</strong> Edit lecture notes or assignment PDFs with ease.</li>
            <li><strong>Professionals:</strong> Modify contracts, reports, and proposals.</li>
            <li><strong>Writers & Editors:</strong> Update written content from archived PDFs.</li>
            <li><strong>General Users:</strong> Anyone needing editable Word versions of PDFs.</li>
          </ul>


          <h3>🔐 Your Files Are Safe</h3>
          <p>
            We never store your files permanently. All conversions happen securely, and your uploaded PDF is automatically deleted after processing. We value your privacy and file confidentiality.
          </p>

          <h3>✅ Why Choose Us?</h3>
          <ul>
            <li>No signup required</li>
            <li>Clean and accurate Word files</li>
            <li>Mobile-friendly interface</li>
            <li>Free for unlimited use</li>
          </ul>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your PDF to a fully editable Word document instantly.</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>

      </section>
    </div>
  );
}

export default PdfToWordConverter;
