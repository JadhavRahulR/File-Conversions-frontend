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
import IntroVideo from "../src/assets/videos/how to convert pdf to text.mp4"
import IntroPoster from "../src/assets/images/pdf to text poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

const BASE_URL = import.meta.env.VITE_BASE_URL
const PdfToTextConverter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState(null);


  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };
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
      setStatus("Converting...");

      const response = await axios.post(`${BASE_URL}/convert-pdf-to-text`, formData, {
        responseType: "blob",
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(Math.min(percent, 90));
        },

      });
      const save = new Blob([response.data], {
        type: "text/plain",
      });

      const convertedFile = new File(
        [save],
        file.name.replace(/\.pdf$/i, "") + ".txt",
        {
          type: "text/plain",
        }
      );

      setConvertedFile(convertedFile);



      // Create a link to download the file
      const blob = new Blob([response.data], { type: 'text/plain' });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = file.name.replace(".pdf", ".txt");
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
        <title>PDF to TXT | Free and Easy PDF To Text Online Converter</title>
        <meta name="description" content="Convert PDF files to plain text (.txt) quickly and securely. Free online PDF to TXT converter with no email or signup required." />
        <link rel="canonical" href="https://fileunivers.com/pdf-to-txt" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="pdf to txt, convert pdf to text, pdf to text file, extract text from pdf, free pdf to txt converter, online pdf to txt" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <div className="pagetitle">

        <h1>PDF To Text Converter - Online Convert PDF To Text Free Fast and Secure  </h1>

        <p className="intro-paragraph">
          Extract text from any PDF file instantly with our free PDF to Text converter. This fast and secure online tool converts your PDF into a clean, editable text (.txt) file while preserving the original content and layout. No software installation or registration required- just upload your PDF, click “Convert,” and download your text file in seconds. Perfect for students, researchers, and professionals who need to copy, edit, or reuse text from PDF documents quickly and accurately.
        </p>
      </div>
      <section>
        <div className='converter'>
          <div className="converterheading">
            <h2>Convert PDF To TEXT </h2>
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
          <h2 className="converter-title">Convert PDF to Text - Extract Plain Text for Free</h2>
          <p>Convert PDF to Text online for free. Fast, secure, and accurate- extract editable text from any PDF instantly. No sign-up or software required.Perfect for students, researchers, and professionals who need to copy, edit, or reuse text from PDF documents quickly and accurately.</p>
          <div className="converterImg">
            <img src="pdf.png" alt="pdf Img" className='ConverterImgtwo' />
            <img src="Arrow.png" alt="Arrow Img" className='ConverterArrowImg' />
            <img src="txt.png" alt="txt Img" className='ConverterImgone' />


          </div>
          <div className="converter-section">
            <h2>🔄 How to Convert PDF to Text ?</h2>
            <ol>
              <li>📤 Upload your PDF file - drag & drop or click to select.</li>
              <li>⚙️ We’ll extract all readable text and convert it into a clean .txt file.</li>
              <li>📥 Auto Download the text file after conversion.</li>
            </ol>
            <p><strong>📌Note:</strong> Large or scanned PDFs may take more time to process.</p>
          </div>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert PDF to Text ? "
              description='Easily extract text from any PDF file using this free online PDF to Text converter!.
              No software, no registration- just upload your PDF, click “Upload”, and Auto download your editable .txt file in seconds.'
            />
          </section>
          <div className="converter-section">
            <h2>🔒Why Use Our PDF to Text Converter?</h2>
            <ul>
              <li>✅ Extracts raw text content from any PDF file.</li>
              <li>🔐 Secure: Files are auto-deleted after processing.</li>
              <li>⚡ Fast, accurate conversion with OCR for scanned PDFs.</li>
              <li>🌐 Works on all browsers and devices - no installation needed.</li>
              <li>🆓 Completely free with no usage limits.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .pdf</p>
            <p><strong>Output:</strong> .txt (Plain Text)</p>
            <h2>Also check other features Related to PDF file formate </h2>
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
            <li><Link to="/pdf-to-pptx" className='btn' > PDF To PPTX Converter </Link></li>
            <li><Link to="/pdf-to-rtf" className='btn' > PDF To RTF Converter </Link></li>
            <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
            <Link></Link>
          </div>

          <div className="converter-section">
            <h2>❓ FAQ</h2>
            <p><strong>Q:</strong> Will the formatting be preserved?<br />
              <strong>A:</strong> Basic structure is preserved, but the output is plain text without styling.</p>
            <p><strong>Q:</strong> Does this support scanned PDFs?<br />
              <strong>A:</strong> Yes, OCR is used to extract text from images within PDFs.</p>
            <p><strong>Q:</strong> Can I edit the output file?<br />
              <strong>A:</strong> Yes, the .txt file is fully editable in any text editor.</p>
          </div>


          <div className="compresspdf-article-section">
            <h2>📄 Convert PDF to Text - Extract Text from PDF Easily</h2>
            <p>
              Need to extract plain text from a PDF file? Our PDF to Text converter tool lets you instantly turn any PDF document into an editable .txt file. Whether you’re working with reports, articles, invoices, or scanned notes, this tool makes data extraction effortless and accurate.
            </p>

            <h3>🔍 Why Use a PDF to Text Converter?</h3>
            <p>
              PDF files are great for viewing and sharing, but they’re not always easy to edit or reuse. Extracting the raw text from a PDF allows you to repurpose the content for research, editing, analysis, or record-keeping- all without losing formatting or layout accuracy.
            </p>

            <h3>⚡ Key Features</h3>
            <ul>
              <li><strong>Fast & Reliable:</strong> Get clean .txt files in seconds.</li>
              <li><strong>No Sign-up Needed:</strong> Use it instantly with no limitations.</li>
              <li><strong>100% Free:</strong> Unlimited conversions with no watermarks.</li>
              <li><strong>Secure:</strong> Your files are never stored or shared.</li>
            </ul>

            <h3>🧑‍💼 Who Uses It?</h3>
            <ul>
              <li><strong>Students:</strong> Extract notes or textbook text for study.</li>
              <li><strong>Writers & Editors:</strong> Repurpose content from books or articles.</li>
              <li><strong>Data Analysts:</strong> Pull text for analysis from PDF reports.</li>
              <li><strong>Professionals:</strong> Copy content from resumes, invoices, or proposals.</li>
            </ul>

            <h3>🔐 Safe & Private</h3>
            <p>
              We value your privacy. All PDF files are processed locally or deleted right after conversion. No tracking, no data sharing, and no file retention.
            </p>

            <h3>💡 Benefits at a Glance</h3>
            <ul>
              <li>Accurate PDF text extraction</li>
              <li>Supports both native and scanned PDFs</li>
              <li>No software download required</li>
              <li>Mobile and desktop-friendly</li>
            </ul>

          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Extract raw text from your PDFs easily - fast, secure, and completely free.</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default PdfToTextConverter;
