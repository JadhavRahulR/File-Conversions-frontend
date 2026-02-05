import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "./assets/videos/how to convert pdf to pptx.mp4"
import IntroPoster from "./assets/images/pdf to pptx poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

const BASE_URL = import.meta.env.VITE_BASE_URL
const PdfToPptxConverter = () => {
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
  const handleUpload = async () => {
    setProgress(10);

    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")

      const response = await axios.post(`${BASE_URL}/convert-pdf-to-pptx`, formData, {
        responseType: "blob",
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
        file.name.replace(/\.pdf$/i, "") + ".pptx",
        {
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        }
      );

      setConvertedFile(convertedFile);



      // Auto-download PPTX file
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = file.name.replace(".pdf", ".pptx");
      link.click();
      setStatus("✅ Done");
    } catch (error) {
      console.error("Conversion failed", error);
      setStatus("   ❌ Conversion failed");
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
        <title>Convert PDF To PPTX |Online Secure and Free PDF To PowerPoint Converter</title>
        <meta name="description" content="Convert PDF files to PowerPoint (.pptx) presentations easily and securely. Free online PDF to PPTX converter with no registration required." />
        <link rel="canonical" href="https://fileunivers.com/pdf-to-pptx" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="pdf to pptx, convert pdf to powerpoint, pdf to ppt, free pdf to pptx converter, online pdf to pptx, pdf presentation converter" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <div className="pagetitle">

        <h1>Convert PDF to PPTX Online - Free PDF to PowerPoint Converter (Fast & Accurate) </h1>

        <p className="intro-paragraph">
          Convert your PDF files into editable PowerPoint presentations instantly with our free online PDF to PPTX converter. This fast and reliable tool transforms your PDF slides into fully editable PowerPoint (.pptx) files without losing quality, design, or formatting. No software installation required- just upload your PDF, click “Upload”, and auto download your ready-to-edit PPTX file within seconds. Perfect for students, professionals, and teachers who want to reuse presentation content easily and save time.    </p>
      </div>
      <section>
        <div className='converter'>
          <div className="converterheading">
            <h2>Convert PDF To PPTX </h2>
          </div>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} />
          </div>
          <DropzoneInput acceptedType={['pdf']} file={file} onFileAccepted={setFile} setStatus={setStatus} />

          {/* <button onClick={handleUpload} disabled={status === 'Converting...'}>
            {status === 'Converting...' ? `Converting... (${progress}%)` : "Upload"}
          </button> */}
          <button onClick={handleUpload} disabled={status === 'Converting...'}>
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
          <h2 className="converter-title">Convert PDF to PPTX - Turn PDFs into PowerPoint Slides</h2>
          <p>Convert your PDF files into  PowerPoint presentations within minutes with our free online PDF to PPTX converter. This fast and reliable tool transforms your PDF  into fully editable PowerPoint (.pptx) files without losing quality, design, or formatting. No Sign up or email require- just upload your PDF, click “Upload”, and auto download your ready-to-edit PPTX file. Perfect for students, professionals, and teachers who want to reuse presentation content. </p>
          <div className="converterImg">
            <img src="pdf.png" alt="pdf Img" className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Symbol" className='ConverterArrowImg' />
            <img src="pptx.png" alt="pptx Img" className='ConverterImgtwo' />

          </div>
          <div className="converter-section">
            <h2>🔄 How to Convert PDF to PPTX</h2>
            <ol>
              <li>📤 Upload your PDF file - drag & drop or click to select.</li>
              <li>⚙️ We’ll convert each page into an editable PowerPoint slide (.pptx).</li>
              <li>📥 Auto Download the PPTX file after conversion.</li>
            </ol>
            <p><strong>📌Note:</strong> Large PDFs or scanned documents may take more time to process.</p>
          </div>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert PDF To PPTX ? "
              description='Convert PDF to PPTX easily with our free online PDF to PowerPoint converter. This quick tutorial shows how to turn your PDF documents into fully editable PowerPoint (.pptx) slides in just a few seconds- no software installation, no sign-up, and completely free. Perfect for students, teachers, and professionals who want to reuse or edit presentation content effortlessly.'
            />
          </section>
          <div className="converter-section">
            <h2>🔒Why Use Our PDF to PPTX Converter?</h2>
            <ul>
              <li>✅ Preserves layout, images, and structure of your PDF in slides.</li>
              <li>🔐 All files are automatically deleted after conversion - your data is safe.</li>
              <li>⚡ Fast and accurate conversion, including OCR for scanned PDFs.</li>
              <li>🌐 Works online in all browsers - no installation required.</li>
              <li>🆓 100% free and unlimited to use.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .pdf</p>
            <p><strong>Output:</strong> .pptx (PowerPoint Presentation)</p>
            <h2>Also check other features Related to PDF file  </h2>
            <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > RTF To PDF Converter </Link></li>
            <li><Link to="/html-to-pdf" className='btn' > HTML To PDF Converter </Link></li>
            <li><Link to="/md-to-pdf" className='btn' > MD  To PDF Converter </Link></li>
            <li><Link to="/xlsx-to-pdf" className='btn' > XLSX  To PDF Converter </Link></li>
            <li><Link to="/csv-to-pdf" className='btn' > CSV To PDF Converter </Link></li>
            <li><Link to="/img-to-pdf" className='btn' > IMG To PDF Converter </Link></li>
            <li><Link to="/tiff-to-pdf" className='btn' > TIFF To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' > PDF To ODT Converter </Link></li>
            <li><Link to="/pdf-to-txt" className='btn' > PDF To TEXT Converter </Link></li>
            <li><Link to="/pdf-to-rtf" className='btn' > PDF To RTF Converter </Link></li>
            <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
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
            <h2>📄 Convert PDF to PPTX - Turn Documents into Presentations</h2>
            <p>
              Instantly convert your PDF documents into fully editable PowerPoint slides (PPTX). Whether you're preparing a presentation based on a report, visualizing a proposal, or repurposing content, our PDF to PPTX tool helps you transform static pages into dynamic slides quickly and effortlessly.
            </p>

            <h3>📘 What is a PDF File?</h3>
            <p>
              PDF (Portable Document Format) is widely used for sharing documents that look the same on any device. While perfect for reading and printing, PDFs are not meant for editing or visual presentations- which is where PPTX files come in.
            </p>

            <h3>📚 Why Convert PDF to PPTX?</h3>
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
              Our PDF to PPTX converter is web-based and works on all operating systems   —Windows, Mac, Linux, Android, and iOS. All you need is a browser and an internet connection.
            </p>

            <h3>🔒Secure & Private</h3>
            <p>
              Your uploaded documents are encrypted and processed securely. Files are deleted automatically from our servers after conversion. We do not store or use your data for any purpose beyond the conversion process.
            </p>

            <h3>🚀 Why Choose Our Tool?</h3>
            <ul>
              <li>Free to use - no hidden fees</li>
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
