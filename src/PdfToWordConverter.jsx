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
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to convert pdf to word.mp4"
import IntroPoster from "../src/assets/images/pdf to word poster .png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";


const BASE_URL = import.meta.env.VITE_BASE_URL

function PdfToWordConverter() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");
  const [progress, setProgress] = useState(0);
  // For Dropbox
  // const [convertedBlob, setConvertedBlob] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);




  const handleFileChange = (eOrFile) => {
    const selected = eOrFile?.target?.files?.[0] || eOrFile;
    if (!selected) return;

    console.log("📄 File selected:", selected.name, selected.size, "bytes");
    console.time("📤 File â†’ Ready to Convert");

    setFile(selected);
    setStatus("Convert");

    console.timeEnd("📤 File â†’ Ready to Convert");
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
      console.time("â± ConvertRequest");

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

      console.timeEnd("â± ConvertRequest");

      const blob = new Blob([response.data], {
  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
});

const convertedFile = new File(
  [blob],
  file.name.replace(/\.pdf$/, "") + ".docx",
  {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  }
);

setConvertedFile(convertedFile); 

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/, "") + ".docx";
      a.click();
      window.URL.revokeObjectURL(url);

      setStatus(" ✅  Done");
    } catch (error) {
      console.error("   ❌ Conversion failed:", error);
      alert("Conversion failed.");
      setStatus("   ❌ Error");
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


      <ScrollToTop />
      <Tools />
      <section>
        <Helmet>
          <title>Convert PDF To Word | Free & Secure Online Tool</title>
          <meta name="description" content="Convert PDF files to Word documents (.docx) quickly and securely. Free online PDF to Word converter with no email or signup required." />
          <link rel="canonical" href="https://fileunivers.com/pdf-to-word" />
          <meta name="robots" content="index, follow" />
          <meta name="keywords" content="pdf to word, convert pdf to word, free pdf to word converter, secure pdf to word, pdf to docx" />
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

        </Helmet>
        <div className="pagetitle">

          <h1>PDF To Word Converter- Convert PDF To DOC Online Free, Fast & Secure </h1>

          <p className="intro-paragraph">
            Convert PDF to Word online for free - fast, secure, and accurate. No sign-up or software needed. Upload your PDF, convert to editable Word, and download instantly.Simply upload your PDF, click " Upload”, and download your Word file within seconds.
          </p>
        </div>
        <div className='converter'>
          <div className="converterheading">
          <h2>Convert PDF To Word </h2>
          </div>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pdf']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pdf']} />
          </div>
          <DropzoneInput acceptedType={['pdf']} file={file} onFileAccepted={setFile} setStatus={setStatus} />
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
      <section>
        <div className="converter-container">
          <h2 className="converter-title">Convert PDF to Word – Free & Accurate</h2>
          <p className="converter-intro" style={{ marginTop: "20px" }}>
            Convert your PDF files to editable Word documents instantly with our free online PDF to Word converter. This tool keeps your formatting, fonts, and images perfectly intact while transforming your PDFs into fully editable .docx files. No software installation or sign-up required.
          </p>
          <div className="converter-section">
            <h2>🔄 How to Convert PDF to Word ? </h2>

            <ol>
              <li>📤 Upload your PDF file – drag & drop or click to select.</li>
              <li>⚙️ Let us convert your file to an editable Word document (.docx).</li>
              <li>📥 Auto Download the converted file instantly.</li>
            </ol>
            <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
          </div>

          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert PDF to Word ? "
              description='Easily convert any PDF to Word (DOCX) online for free — no software, no sign-up, and no watermark!.
                 In this video, you’ll learn how to convert a PDF file into an editable Word document in just a few seconds using a simple online tool. Perfect for students, office users, and anyone who needs to edit or update text in a PDF.'
            />
          </section>


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
          <div className="converterImg">
            <img src="pdf.png" alt="Pdf Img" className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Img" className='ConverterArrowImg' />

            <img src="word.png" alt="Word Img" className='ConverterImgtwo' />

          </div>
          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .pdf</p>
            <p><strong>Output:</strong> .docx</p>
            <h2>Also check other features Related to PDF file  </h2>
            <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > RTf To PDF Converter </Link></li>
            <li><Link to="/html-to-pdf" className='btn' > HTML To PDF Converter </Link></li>
            <li><Link to="/md-to-pdf" className='btn' > MD  To PDF Converter </Link></li>
            <li><Link to="/xlsx-to-pdf" className='btn' > XLSX  To PDF Converter </Link></li>
            <li><Link to="/csv-to-pdf" className='btn' > CSV To PDF Converter </Link></li>
            <li><Link to="/img-to-pdf" className='btn' > IMG To PDF Converter </Link></li>
            <li><Link to="/tiff-to-pdf" className='btn' > TIFF To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn' > PDF To ODT Converter </Link></li>
            <li><Link to="/pdf-to-pptx" className='btn' > PDF To PPTX Converter </Link></li>
            <li><Link to="/pdf-to-rtf" className='btn' > PDF To RTF Converter </Link></li>
            <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
            <li><Link to="/merge-pdf" className='btn' > Merge PDF  </Link></li>
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

          <h3>🔄 Key Features</h3>
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