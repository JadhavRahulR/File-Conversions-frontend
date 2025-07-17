import React, { useState ,useEffect} from "react";
import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from "./ScrollToTop";

const MdToPdfConverter = () => {
  const [file, setFile] = useState(null);
   const [status, setStatus] = useState("Upload");
  
    const handleFileChange = (eOrFile) => {
      const file = eOrFile?.target?.files?.[0] || eOrFile;
      if (file) {
        setFile(file);
        setStatus(status === "Done" ? "upload" : "convert");
      }
    };

  const handleConvert = async () => {
    if (!file) return alert("Please upload a Markdown (.md) file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        "http://localhost:5000/convert-md-to-pdf",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.md$/, "") + ".pdf";
      a.click();
      window.URL.revokeObjectURL(url);
      setStatus("✅ Conversion complete!");
    } catch (error) {
      console.error("❌ Conversion failed", error);
      alert("Conversion failed");
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
    <Tools/>
    <section>
        <div className='converter'>
          <h3>Convert Md To Pdf </h3>
          <input type="file" accept=".md" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.md']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.md']} />
          </div>
          <DropzoneInput acceptedType={['md']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert Markdown (MD) to PDF – Free & Accurate</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert MD to PDF</h2>
      <ol>
        <li>📤 Upload your Markdown (.md) file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it to a beautifully formatted PDF document.</li>
        <li>📥 Auto Download the PDF instantly after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files or heavily formatted Markdown may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our Markdown to PDF Converter?</h2>
      <ul>
        <li>✅ Supports headings, lists, code blocks, tables, links, and more.</li>
        <li>🔐 Secure: All files are deleted automatically after processing.</li>
        <li>⚡ Converts instantly with accurate formatting.</li>
        <li>🌐 Use it on any browser, any device – no installs needed.</li>
        <li>🆓 100% free with unlimited usage.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .md (Markdown)</p>
      <p><strong>Output:</strong> .pdf</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will code blocks and formatting be preserved?<br />
        <strong>A:</strong> Yes, your PDF will reflect all Markdown formatting including code blocks and tables.</p>
      <p><strong>Q:</strong> Can I convert GitHub-flavored Markdown?<br />
        <strong>A:</strong> Yes, we support GFM extensions like task lists and fenced code blocks.</p>
      <p><strong>Q:</strong> Can I use this without installing anything?<br />
        <strong>A:</strong> Absolutely! No registration or installation is needed.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your Markdown files to PDF instantly – perfect for documentation, notes, and reports.</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

    </>
  );
};

export default MdToPdfConverter;
