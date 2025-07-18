import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';

const BASE_URL = import.meta.env.VITE_BASE_URL
const PdfToPptxConverter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");

  const handleFileChange = (eOrFile) => {
    const file = eOrFile?.target?.files?.[0] || eOrFile;
    if (file) {
      setFile(file);
      setStatus(status === "Done" ? "upload" : "convert");
    }
  };
  const handleUpload = async () => {
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
    <ScrollToTop/>
    <section>
    <Tools/>
    <div className='converter'>
        <h3> Converte Pdf To Pptx </h3>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <br /><br />
       <div className="fileuploadcontainer">
        <DriveFileInput onFilePicked={setFile} setStatus={setStatus} />
        <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} />
        </div>
       <DropzoneInput acceptedType={['pdf']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>

        <button onClick={handleUpload} disabled={status === 'Converting...'}>
          {status}
        </button>
      </div>
        </section>
        <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert PDF to PPTX – Turn PDFs into PowerPoint Slides</h1>

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
