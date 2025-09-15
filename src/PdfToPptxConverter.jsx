import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL
const PdfToPptxConverter = () => {
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
  const handleUpload = async () => {
    setProgress(10);

    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...");

      const response = await axios.post(`${BASE_URL}/convert-pdf-to-pptx`, formData, {
        responseType: "blob",
        onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(Math.min(percent, 90));
                },
      });

      // Auto-download PPTX file
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = file.name.replace(".pdf", ".pptx");
      link.click();
      setStatus("✅ Conversion complete!");
    } catch (error) {
      console.error("Conversion failed", error);
      setStatus("❌ Conversion failed");
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
      <title>PDF to PPTX | Free PDF to PowerPoint Converter</title>
<meta name="description" content="Convert PDF files to PowerPoint (.pptx) presentations easily and securely. Free online PDF to PPTX converter with no registration required." />
<link rel="canonical" href="https://fileunivers.in/pdf-to-pptx" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="pdf to pptx, convert pdf to powerpoint, pdf to ppt, free pdf to pptx converter, online pdf to pptx, pdf presentation converter" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
    <ScrollToTop/>
    <section>
    <Tools/>
    <div className='converter'>
        <h1> Converte Pdf To Pptx </h1>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <br /><br />
       <div className="fileuploadcontainer">
        <DriveFileInput onFilePicked={setFile} setStatus={setStatus} />
        <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} />
        </div>
       <DropzoneInput acceptedType={['pdf']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>

        <button onClick={handleUpload} disabled={status === 'Converting...'}>
           {status === 'Converting...'? `Converting... (${progress}%)` :"Upload"}
        </button>
      </div>
        </section>
        <section>
  <div className="converter-container">
    <h2 className="converter-title">Convert PDF to PPTX – Turn PDFs into PowerPoint Slides</h2>

    <div className="converter-section">
      <h2>🔄 How to Convert PDF to PPTX</h2>
      <ol>
        <li>📤 Upload your PDF file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert each page into an editable PowerPoint slide (.pptx).</li>
        <li>📥 Auto Download the PPTX file after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large PDFs or scanned documents may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our PDF to PPTX Converter?</h2>
      <ul>
        <li>✅ Preserves layout, images, and structure of your PDF in slides.</li>
        <li>🔐 All files are automatically deleted after conversion – your data is safe.</li>
        <li>⚡ Fast and accurate conversion, including OCR for scanned PDFs.</li>
        <li>🌐 Works online in all browsers – no installation required.</li>
        <li>🆓 100% free and unlimited to use.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .pdf</p>
      <p><strong>Output:</strong> .pptx (PowerPoint Presentation)</p>
      <h2>Also check other features Related to PDF file  </h2>
                        <li><Link to="/word-to-pdf" className='btn' >Word to PDF Converter </Link></li>
                        <li><Link to="/pdf-to-word" className='btn'>PDF to Word Converter </Link></li>
                        <li><Link to="/odt-to-pdf" className='btn' >odt to pdf Converter </Link></li>
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
                        <li><Link to="/pdf-to-rtf" className='btn' > pdf to rtf Converter </Link></li>
                        <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
                        <Link></Link>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will the PowerPoint file be editable?<br />
        <strong>A:</strong> Yes! Each page is converted into a slide you can fully customize.</p>
      <p><strong>Q:</strong> Does it support scanned PDFs?<br />
        <strong>A:</strong> Yes, OCR is applied to extract text where possible.</p>
      <p><strong>Q:</strong> Do I need Microsoft PowerPoint installed?<br />
        <strong>A:</strong> No, but you’ll need PowerPoint, LibreOffice Impress, or Google Slides to open the file.</p>
    </div>
      <div className="compresspdf-article-section">
  <h2>📄 Convert PDF to PPTX – Turn Documents into Presentations</h2>
  <p>
    Instantly convert your PDF documents into fully editable PowerPoint slides (PPTX). Whether you're preparing a presentation based on a report, visualizing a proposal, or repurposing content, our PDF to PPTX tool helps you transform static pages into dynamic slides quickly and effortlessly.
  </p>

  <h3>📘 What is a PDF File?</h3>
  <p>
    PDF (Portable Document Format) is widely used for sharing documents that look the same on any device. While perfect for reading and printing, PDFs are not meant for editing or visual presentations — which is where PPTX files come in.
  </p>

  <h3>📊 Why Convert PDF to PPTX?</h3>
  <ul>
    <li><strong>Editable Format:</strong> Open the converted file in PowerPoint and make real-time changes to text, images, or layout.</li>
    <li><strong>Visual Presentations:</strong> Easily present static content in a visually engaging slide format.</li>
    <li><strong>Better Storytelling:</strong> Add animations, transitions, and speaker notes to enhance delivery.</li>
    <li><strong>Reusability:</strong> Repurpose existing reports or documents without recreating slides from scratch.</li>
    <li><strong>Professional Appeal:</strong> Perfect for pitches, seminars, or educational material development.</li>
  </ul>

  <h3>🎯 Who Can Use PDF to PPTX Conversion?</h3>
  <ul>
    <li><strong>Students:</strong> Convert project reports or research documents into presentation format.</li>
    <li><strong>Educators:</strong> Turn reading materials into lecture slides easily.</li>
    <li><strong>Business Professionals:</strong> Convert company documents, proposals, or meeting notes into client-ready decks.</li>
    <li><strong>Marketers & Designers:</strong> Repurpose static content into engaging visual presentations.</li>
  </ul>

  <h3>💡 Features of Our Online Converter</h3>
  <ul>
    <li>Simple and intuitive interface for everyone</li>
    <li>Preserves original layout, fonts, and structure wherever possible</li>
    <li>Converts multi-page PDFs into corresponding PowerPoint slides</li>
    <li>Works without any software installation or plugins</li>
    <li>Supports both scanned and native PDFs</li>
  </ul>

  <h3>🌐 Works on All Devices</h3>
  <p>
    Our PDF to PPTX converter is web-based and works on all operating systems—Windows, Mac, Linux, Android, and iOS. All you need is a browser and an internet connection.
  </p>

  <h3>🔒 Secure & Private</h3>
  <p>
    Your uploaded documents are encrypted and processed securely. Files are deleted automatically from our servers after conversion. We do not store or use your data for any purpose beyond the conversion process.
  </p>

  <h3>🚀 Why Choose Our Tool?</h3>
  <ul>
    <li>Free to use – no hidden fees</li>
    <li>No registration or login required</li>
    <li>Fast conversion with high accuracy</li>
    <li>Editable output compatible with Microsoft PowerPoint and Google Slides</li>
    <li>Suitable for professional, academic, and personal use</li>
  </ul>

</div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your PDF files to fully editable PowerPoint slides in just seconds.</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

    </>
  );
};

export default PdfToPptxConverter;
