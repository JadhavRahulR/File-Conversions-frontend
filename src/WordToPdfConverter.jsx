import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./converter.css"
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "./assets/videos/how to convert  word to pdf .mp4";
import IntroPoster from "./assets/images/Word-to-pdf-conversion-poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";



const BASE_URL = import.meta.env.VITE_BASE_URL;
function WordToPdfConverter() {
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

    if (!file) {
      alert('Please select a Word file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setStatus("Converting...")
      const response = await axios.post(`${BASE_URL}/convert-word-to-pdf`, formData, {
        responseType: 'blob',
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(Math.min(percent, 90));
        },
      });

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      });

const convertedFile = new File(
  [blob],
  file.name.replace(/\.(docx|doc)$/i, "") + ".pdf",
  {
    type: "application/pdf",
  }
);
setConvertedFile(convertedFile); 


      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.(doc|docx)$/, '') + '.pdf';
      a.click();
      URL.revokeObjectURL(url);
      setStatus(" ✅  Done");
    } catch (error) {
      console.error('   ❌ Conversion failed:', error);
      alert('Conversion failed.');
      setStatus("Upload")
    }
  };
  useEffect(() => {
    if (status === " ✅  Conversion complete!") {
      setTimeout(() => {
        setFile(null);
        setStatus("Convert");
      }, 4000);
    }
  }, [status]);

  return (
    <div>
      <section>
      <ScrollToTop />
        <Tools />
      <Helmet>
        <title>Word To PDF |Word TO PDF Converter</title>
        <meta name="description" content="Convert Word documents (.doc, .docx) to PDF easily and securely. Free online Word to PDF converter with no email or signup needed." />
        <link rel="canonical" href="https://fileunivers.com/word-to-pdf" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="word to pdf, convert word to pdf, doc to pdf, docx to pdf, free word to pdf converter, secure word to pdf" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      
        
        <div className="pagetitle">

        <h1>WORD To PDF Converter - Convert WORD (DOCX) To PDF Online Free</h1>

        <p className="intro-paragraph">
          Word to PDF Converter is a simple and reliable online tool that helps you convert Word documents (DOC or DOCX) into high-quality PDF files within seconds. It preserves original formatting, fonts, images, and layout, making it perfect for sharing, printing, or professional use. No installation or sign-up is required   —just upload your Word file and download a secure, perfectly converted PDF instantly.
        </p>
        </div>
        <div className='converter'>
          <div className="converterheading">
          <h2>Convert Word To PDF </h2>
          </div>
          <input type="file" accept=".docx" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={[".docx"]} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.docx']} />
          </div>
          <DropzoneInput acceptedType={['docx']} file={file} onFileAccepted={setFile} setStatus={setStatus} />

          <button onClick={handleConvert} disabled={status === 'Converting...'}>
           {status === "Upload" && "Upload"}
            {status === "Convert" && "Convert"}
            {status === "Converting..." && `Converting... (${progress}%)`}
            {status === " ✅  Done" && "Download Again"}
          </button>

           {status === " ✅  Done" && convertedFile && (<>
                    <p>Save To . . .</p>
                    <div className="saveTo">
                      <SaveToGoogleDrive file={convertedFile} />
                      <SaveToDropbox file={convertedFile} className='savetodropbox'/>
          
                    </div>
                    </>)}
        </div>
      </section>

       <div className="converter-container">
        <h2 className="converter-title">Convert Word to PDF – Free & Easy Online Tool</h2>
        <p className="converter-intro" style={{ marginTop: "20px" }}>
          Easily convert Word documents (.doc, .docx) into secure, high-quality PDFs online. No registration, no watermarks – just a fast, free tool you can trust.
        </p>
        <div className="converterImg">
          <img src="word.png" alt="Word Img" className='ConverterImgone'/>
          <img src="Arrow.png" alt="Arrow Symbol" className='ConverterArrowImg'/>

          <img src="pdf.png" alt="Pdf Img" className='ConverterImgtwo'/>

        </div>

        <div className="converter-section">
          <h2>🔄 How to Convert Word to PDF ? </h2>
          <ol>
            <li>📤 Upload your Word file – drag & drop or click to select.</li>
            <li>⚙️ Wait a moment – we convert your file to a clean, compact PDF.</li>
            <li>📥 Auto Download your converted PDF instantly.</li>
          </ol>
          <p><strong>Note:</strong> Large files may take more time to process.</p>
        </div>

        <section>
          <LazyVideo src={IntroVideo} poster={IntroPoster}
            title="How to Convert WORD to PDF ? "
            description='Convert your Word documents (.docx) to PDF instantly with our free online tool "File-Univers". Preserve formatting, protect content, and download in seconds.'
          />
        </section>

        <div className="converter-section">
          <h2>🔒 Why Use Our Word to PDF Converter?</h2>
          <ul>
            <li>✅ Preserve formatting: Fonts, tables, and layouts remain intact.</li>
            <li>🔐 Privacy-first: Files auto-delete after conversion.</li>
            <li>⚡ Fast results: Convert in seconds with no loss.</li>
            <li>🌐 Works on any device – no installs needed.</li>
            <li>🆓 Totally free, forever.</li>
          </ul>
        </div>

        <div className="converter-section">
          <h2>📁 Supported Formats</h2>
          <p><strong>Input:</strong> .doc, .docx</p>
          <p><strong>Output:</strong> .pdf</p>
          <h2>Also check other features Related to word / DOC file  </h2>
          <li><Link to="/pdf-to-word" className='btn'>PDF To WORD Converter </Link></li>
          <li><Link to="/doc-to-odt" className='btn'>DOC To ODT Converter </Link></li>
          <li><Link to="/odt-to-doc" className='btn'> ODT To DOC  Converter </Link></li>
          <li><Link to="/docxcompressor" className='btn'> Compress DOC / WORD  </Link></li>
        </div>

        <div className="converter-section">
          <h2> FAQ ❓</h2>
          <p><strong>Q:</strong> Will my layout and fonts be preserved?<br />
            <strong>A:</strong> Yes, our tool ensures perfect formatting.</p>
          <p><strong>Q:</strong> Any size limits?<br />
            <strong>A:</strong> Yes, up to 50MB per file.</p>
          <p><strong>Q:</strong> Is this browser-based?<br />
            <strong>A:</strong> Yes! No install needed.</p>
        </div>


      </div>
      <div className="converter-article-section">
        <h2>📝 About Word to PDF Conversion</h2>
        <p>
          Converting Word documents to PDF has become a common task in our digital workflows. Whether you’re a student submitting an assignment, a professional sending a resume, or a business preparing a contract, PDFs are the most preferred format due to their consistency, compatibility, and fixed layout.
        </p>

        <h3> Why PDF is the Ideal Format</h3>
        <p>
          Unlike Word documents (.doc or .docx), PDFs are not easily altered and preserve formatting across all devices. This means that what you see on your screen is exactly what others will see—no missing fonts, weird layouts, or broken elements.
        </p>
        <p>
          PDFs are also lighter in size and more secure. With our tool, you can generate a high-quality PDF that is perfect for sharing, printing, or archiving.
        </p>

        <h3> Key Features of Our Word to PDF Converter</h3>
        <ul>
          <li><strong>One-click Upload:</strong> Drag and drop your file or click to browse.</li>
          <li><strong>Fast Conversion:</strong> Our engine converts most files in under seconds.</li>
          <li><strong>High Compatibility:</strong> Works with .doc and .docx formats from Microsoft Word or Google Docs.</li>
          <li><strong>No Watermarks:</strong> Your converted PDF remains clean and professional.</li>
          <li><strong>Privacy First:</strong> Files are automatically deleted after processing.</li>
        </ul>

        <h3>📂 Who Can Use This Tool?</h3>
        <p>
          Our online Word to PDF converter is ideal for:
        </p>
        <ul>
          <li>📚 <strong>Students</strong> needing to submit reports, essays, or assignments.</li>
          <li>💼 <strong>Job seekers</strong> converting resumes or cover letters into secure PDFs.</li>
          <li>🧑‍💼 <strong>Professionals</strong> preparing legal or business documents.</li>
          <li>🌍 <strong>Anyone</strong> who wants a reliable way to share Word documents without losing formatting.</li>
        </ul>



        <h3> No Installation Needed</h3>
        <p>
          This converter works entirely in your browser. Whether you’re on Windows, macOS, Linux, Android, or iOS – it just works. No account sign-up. No email required.
        </p>

        <h3> Final Words</h3>
        <p>
          If you’re looking for a quick, safe, and free way to convert Word to PDF, you’ve come to the right place. Thousands of users trust our tool every day for academic, personal, and professional tasks.
        </p>
        <p>
          Try it now and experience fast, accurate, and secure document conversion — all online and absolutely free.
        </p>
        <div className="converter-section" style={{ textAlign: 'center' }}>
          <h2> Try It Now!</h2>
          <p>Upload your Word file and convert to PDF in seconds!</p>
          <p className="converter-tagline">✅ Fast | ✅ Secure | ✅ No Email Required</p>
        </div>
      </div>

    </div>
  );
}

export default WordToPdfConverter;