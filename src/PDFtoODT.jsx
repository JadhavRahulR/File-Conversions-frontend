import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';

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
    <ScrollToTop/>
      <Tools />
      <section>
      <div className='converter'>
        <h3>Converte Pdf To Odt </h3>
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
    <h1 className="converter-title">Convert PDF to ODT – Free, Editable & Accurate</h1>

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
