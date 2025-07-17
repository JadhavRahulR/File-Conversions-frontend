import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import axios from 'axios';
import "./converter.css"
import Tools from './Tools';
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import ScrollToTop from './ScrollToTop';

const PptxToOdp = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Upload");
     
       const handleFileChange = (eOrFile) => {
         const file = eOrFile?.target?.files?.[0] || eOrFile;
         if (file) {
           setFile(file);
           setStatus(status === "✅ Conversion complete!" ? "upload" : "convert");
         }
       };
  const handleConvert = async () => {
    if (!file) return alert("Please select a PPTX file");

    const formData = new FormData();
    formData.append("file", file);

    try {
       setStatus("Converting...")
      const response = await axios.post('http://localhost:5000/convert-pptx-to-odp', formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/vnd.oasis.opendocument.presentation' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pptx$/, '') + '.odp';
      a.click();
      URL.revokeObjectURL(url);
      setStatus("✅ Conversion complete!");
    } catch (error) {
      console.error("Conversion failed", error);
      alert("Failed to convert file.");
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
          <h3>Convert Pptx To Odp</h3>
          <input type="file" accept=".pptx" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">
            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pptx']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pptx']} />
          </div>
         <DropzoneInput acceptedType={['pptx']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>
          
          <button onClick={handleConvert} disabled={status === 'Converting...'}>
            {status}
          </button>
        </div>
      </section>
      <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert PPTX to ODP – Free Online Converter</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert PPTX to ODP</h2>
      <ol>
        <li>📤 Upload your PPTX file – drag & drop or click to select.</li>
        <li>⚙️ We’ll convert it to an OpenDocument Presentation (.odp).</li>
        <li>📥 Auto Download the ODP file after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large files may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our PPTX to ODP Converter?</h2>
      <ul>
        <li>✅ Preserves slide layouts, text, images, and design elements.</li>
        <li>🔐 Your files are secure – automatically deleted after processing.</li>
        <li>⚡ Quick and reliable conversion with no formatting loss.</li>
        <li>🌐 100% browser-based – no software or plugins needed.</li>
        <li>🆓 Free for unlimited use with no registration required.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .pptx (PowerPoint Presentation)</p>
      <p><strong>Output:</strong> .odp (OpenDocument Presentation)</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Can I open the ODP file in LibreOffice or OpenOffice?<br />
        <strong>A:</strong> Yes! ODP files are fully compatible with LibreOffice Impress and other open-source tools.</p>
      <p><strong>Q:</strong> Will animations and transitions be preserved?<br />
        <strong>A:</strong> Basic transitions may work, but complex animations may be flattened.</p>
      <p><strong>Q:</strong> Will my file be saved or stored?<br />
        <strong>A:</strong> No. All files are auto-deleted after conversion.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your PPTX presentations to ODP format easily and securely – perfect for open-source tools!</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

      </>
  );
};

export default PptxToOdp;
