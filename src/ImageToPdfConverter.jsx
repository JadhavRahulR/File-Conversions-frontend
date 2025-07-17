import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import React, { useState ,useEffect} from 'react';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from "./ScrollToTop";

const ImageToPdfConverter = () => {
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
    if (!file) return alert("Please upload an image file (JPG or PNG).");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        "http://localhost:5000/convert-image-to-pdf",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.png$/, "") + ".pdf";
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
        <h3>Convert Image  To Pdf  </h3>

        <input type="file" accept=".jpg,.png,.jpeg" onChange={handleFileChange} />
        <br /><br />
       <div className="fileuploadcontainer">

        <DriveFileInput onFilePicked={setFile} setStatus={setStatus}  allowedTypes={['.jpg','.png','.jpeg']}/>
        <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.jpg','.png','.jpeg']}  />
        </div>
        <DropzoneInput acceptedType={['jpg', 'jpeg', 'png']} file={file} onFileAccepted={setFile} setStatus={setStatus}/>

        {file && (
          <p className="selected-file ">
            ✅ Selected File: <b>{file.name}</b>
          </p>
        )}
        <button onClick={handleConvert} disabled={status === 'Converting...'}>
          {status}
        </button>

      </div>
        </section>
        <section>
  <div className="converter-container">
    <h1 className="converter-title">Convert Image to PDF – JPG, PNG & More</h1>

    <div className="converter-section">
      <h2>🔄 How to Convert Images to PDF</h2>
      <ol>
        <li>📤 Upload your image file (JPG, PNG, JPEG, BMP, etc.).</li>
        <li>⚙️ We’ll convert it into a high-quality, printable PDF document.</li>
        <li>📥 Auto Download the PDF instantly after conversion.</li>
      </ol>
      <p><strong>📌 Note:</strong> Large or high-resolution images may take more time to process.</p>
    </div>

    <div className="converter-section">
      <h2>🔒 Why Use Our Image to PDF Converter?</h2>
      <ul>
        <li>✅ Converts any image into a clear, printable PDF.</li>
        <li>🔐 Files are automatically deleted after conversion for full privacy.</li>
        <li>⚡ Fast conversion with no quality loss.</li>
        <li>🌐 Works on all devices and browsers – no app needed.</li>
        <li>🆓 Free to use with no limits or sign-up.</li>
      </ul>
    </div>

    <div className="converter-section">
      <h2>📁 Supported Formats</h2>
      <p><strong>Input:</strong> .jpg, .jpeg, .png, .bmp, .webp, .tiff</p>
      <p><strong>Output:</strong> .pdf</p>
    </div>

    <div className="converter-section">
      <h2>❓ FAQ</h2>
      <p><strong>Q:</strong> Will the image quality be preserved?<br />
        <strong>A:</strong> Yes, we maintain original quality in the converted PDF.</p>
      <p><strong>Q:</strong> Can I merge multiple images into one PDF?<br />
        <strong>A:</strong> Yes, simply upload multiple images in the desired order.</p>
      <p><strong>Q:</strong> Is this tool free and safe?<br />
        <strong>A:</strong> Yes, it’s 100% free and all files are auto-deleted after processing.</p>
    </div>

    <div className="converter-section" style={{ textAlign: 'center' }}>
      <h2>🎯 Try It Now!</h2>
      <p>Convert your images to a polished PDF instantly – secure, simple, and free.</p>
      <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
    </div>
  </div>
</section>

        </>
  );
};

export default ImageToPdfConverter;
