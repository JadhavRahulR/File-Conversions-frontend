import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import "./converter.css"
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from './ScrollToTop';

function PdfToWordConverter() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");

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
    console.log("🔥 handleConvert triggered:", new Date().toISOString());

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
        "http://localhost:5000/convert-pdf-to-word",
        formData,
        {
          responseType: "blob",
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
      <ScrollToTop/>
      <Tools/>
       <section>
        <div className='converter'>
          <h3>Convert Pdf To Word/Docx </h3>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pdf']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pdf']} />
          </div>
          <DropzoneInput acceptedType={['pdf']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
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
