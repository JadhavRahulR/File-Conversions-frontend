import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';

const BASE_URL = import.meta.env.VITE_BASE_URL
const PdfToOdtConverter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('Upload'); // "Upload", "Converting...", "Done"

  const handleFileChange = (eOrFile) => {
    const file = eOrFile?.target?.files?.[0] || eOrFile;
    // setFile(file);
    if (file) {
      setFile(file);
      setStatus(status === "Done" ? "upload" : "convert");
    }
  };


  const handleConvert = async () => {
    if (!file) return alert('Please select a PDF file.');

    setStatus('Converting...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${BASE_URL}/convert-pdf-to-odt`,
        formData,
        { responseType: 'blob' }
      );

      // Download the file
      const blob = new Blob([response.data], { type: 'application/vnd.oasis.opendocument.text' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.pdf', '.odt');
      a.click();
      window.URL.revokeObjectURL(url);

      setStatus('Done ✅');
    } catch (err) {
      alert('Conversion failed.');
      console.error(err);
      setStatus('Upload');
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
      <title>PDF to ODT | Free PDF to OpenDocument Converter</title>
<meta name="description" content="Convert PDF files to ODT documents easily and securely. Free online PDF to ODT converter with no signup or email required." />
<link rel="canonical" href="https://fileunivers.in/pdf-to-odt" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="pdf to odt, convert pdf to odt, pdf to open document, free pdf to odt converter, online pdf to odt" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

    </Helmet>
    <ScrollToTop/>
      <Tools />
      <section>
      <div className='converter'>
        <h1>Converte Pdf To Odt </h1>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <br /><br />
        <div className="fileuploadcontainer">
        <DriveFileInput onFilePicked={setFile} setStatus={setStatus} />
        <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} />
        </div>
        <DropzoneInput acceptedType={['pdf']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
        <button onClick={handleConvert} disabled={status === 'Converting...'}>
          {status}
        </button>
      </div>
        </section>
        <section>
  <div className="converter-container">
    <h2 className="converter-title">Convert PDF to ODT – Free, Editable & Accurate</h2>

    <div className="converter-section">
      <h2>🔄 How to Convert PDF to ODT</h2>
      <ol>
        <li>📤 Upload your PDF file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it into an editable ODT (OpenDocument Text) file.</li>
        <li>📥 Auto Download the ODT file after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large or scanned PDF files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our PDF to ODT Converter?</h2>
      <ul>
        <li>✅ Accurately retains text, images, and formatting.</li>
        <li>🔐 Secure: Files are automatically deleted after processing.</li>
        <li>⚡ Fast conversion, including OCR for scanned PDFs.</li>
        <li>🌐 100% online – works on any browser or device.</li>
        <li>🆓 Totally free with no usage limits.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .pdf</p>
      <p><strong>Output:</strong> .odt (OpenDocument Text)</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will the converted ODT be fully editable?<br />
        <strong>A:</strong> Yes, you can edit text, images, and formatting easily in LibreOffice or similar editors.</p>
      <p><strong>Q:</strong> Does it support scanned PDFs?<br />
        <strong>A:</strong> Yes, OCR is used to extract text from scanned documents.</p>
      <p><strong>Q:</strong> Do I need to install anything?<br />
        <strong>A:</strong> No installation required – everything works in your browser.</p>
    </div>

      <div className="compresspdf-article-section">
  <h2>📄 Convert PDF to ODT – Free & Accurate</h2>
  <p>
    Need to convert a PDF file into an editable ODT document? Our free online PDF to ODT converter allows you to easily turn fixed PDFs into fully editable OpenDocument Text (.odt) files used by LibreOffice and OpenOffice — no installation or registration needed.
  </p>

  <h3>🔄 Why Convert PDF to ODT?</h3>
  <p>
    PDFs are great for sharing and preserving formatting, but editing them can be a challenge. By converting your PDF to ODT, you can open and edit it with ease in open-source editors. This is perfect for rewriting documents, extracting content, or updating an older PDF layout.
  </p>

  <h3>✨ Key Features of the Tool</h3>
  <ul>
    <li><strong>Fast Conversion:</strong> Upload and get your ODT file in seconds.</li>
    <li><strong>Edit-Ready Output:</strong> Your converted file is fully editable.</li>
    <li><strong>Preserves Layout:</strong> Text, tables, and basic formatting remain intact.</li>
    <li><strong>Free to Use:</strong> No watermarks, no limits, no hidden fees.</li>
    <li><strong>Multi-Platform:</strong> Works on mobile, desktop, and all modern browsers.</li>
  </ul>

  <h3>📚 Ideal For</h3>
  <ul>
    <li><strong>Students:</strong> Extract and edit educational PDFs easily.</li>
    <li><strong>Writers:</strong> Turn eBooks or published PDFs into editable formats.</li>
    <li><strong>Professionals:</strong> Make changes to proposals, agreements, or letters.</li>
    <li><strong>Teachers:</strong> Modify and reuse PDF-based study material in ODT.</li>
  </ul>


  <h3>🔐 100% Private & Secure</h3>
  <p>
    We value your privacy. All uploaded files are processed securely and automatically deleted shortly after conversion. Your content is never shared or stored permanently.
  </p>

  <h3>✅ Quick Benefits</h3>
  <ul>
    <li>No signup or software required</li>
    <li>Completely free and unlimited use</li>
    <li>Editable ODT output in seconds</li>
    <li>Supports text-heavy and basic layout PDFs</li>
  </ul>

</div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your PDF files to ODT format for easy editing – quick, secure, and free!</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>


    </>
  );
};

export default PdfToOdtConverter;
