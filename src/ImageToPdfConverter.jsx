import axios from "axios";
import "./converter.css"
import Tools from "./Tools";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput'
import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import LazyVideo from "./LazyVideo";
import IntroVideo from "./assets/videos/how to convert img to pdf.mp4";
import IntroPoster from "./assets/images/img to pdf poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

const BASE_URL = import.meta.env.VITE_BASE_URL
const ImageToPdfConverter = () => {
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

    if (!file) return alert("Please upload an image file (JPG or PNG).");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Converting...")
      const response = await axios.post(
        `${BASE_URL}/convert-image-to-pdf`,
        formData,
        {
          responseType: "blob",
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(Math.min(percent, 90));
          },
        }
      );
      const save = new Blob([response.data], {
        type: "application/pdf",
      });

      const convertedFile = new File(
        [save],
        file.name.replace(/\.(jpg|jpeg|png|webp)$/i, "") + ".pdf",
        { type: "application/pdf" }
      );

      setConvertedFile(convertedFile);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.png$/, "") + ".pdf";
      a.click();
      window.URL.revokeObjectURL(url);
      setStatus("✅ Done");
    } catch (error) {
      console.error("   ❌ Conversion failed", error);
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
      <ScrollToTop />
      <Tools />
      <Helmet>
        <title>IMG To PDF Converter | Free and Secure Image To PDF Online Converter</title>
        <meta name="description" content="Convert images (JPG, PNG, BMP, etc.) to PDF format quickly and securely. Free online IMG to PDF converter with no signup or email required." />
        <link rel="canonical" href="https://fileunivers.com/img-to-pdf" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="img to pdf, image to pdf, jpg to pdf, png to pdf, convert image to pdf, free img to pdf converter, online image to pdf" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <div className="pagetitle">


        <h1>Convert Image to PDF Online - Free and Secure JPG, PNG, or JPEG To PDF Converter </h1>
        <p className="intro-paragraph">
          Easily convert your images (JPG, PNG, JPEG, or WebP) to PDF online with our fast and free converter. Combine multiple photos or documents into a single, professional PDF file in seconds. No software installation or signup required- just upload your images, click Upload for conversion, and auto download your high-quality PDF instantly. Perfect for students, photographers, and professionals who need to quickly turn images into printable or shareable PDF documents.   </p>
      </div>
      <section>

        <div className='converter'>
          <div className="converterheading">
            <h2>Convert Image To PDF </h2>
          </div>
          <input type="file" accept=".jpg,.png,.jpeg" onChange={handleFileChange} />
          <br /><br />
          <div className="fileuploadcontainer">

            <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.jpg', '.png', '.jpeg']} />
            <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.jpg', '.png', '.jpeg']} />
          </div>
          <DropzoneInput acceptedType={['jpg', 'jpeg', 'png']} file={file} onFileAccepted={setFile} setStatus={setStatus} />

          <button onClick={handleConvert} disabled={status === 'Converting...'}>
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
          <h2 className="converter-title">Convert Image to PDF - JPG, PNG & More</h2>
          <p>Our Image to PDF converter preserves image quality, orientation, and resolution while keeping file size optimized for easy sharing. You can upload any number of images, and the tool will automatically align and convert them into a clean, multi-page PDF. 100% browser-based, secure, and compatible with all devices- convert JPG to PDF, PNG to PDF, or any image format effortlessly. Get fast, accurate, and reliable Image to PDF conversion anytime with fileunivers.com.</p>
          <div className="converterImg">
            <img src="img.png" alt=" Img " className='ConverterImgone' />
            <img src="Arrow.png" alt="Arrow Symbol" className='ConverterArrowImg' />

            <img src="pdf.png" alt="Pdf Img" className='ConverterImgtwo' />

          </div>

          <div className="converter-section">
            <h2>🔄 How to Convert Images to PDF</h2>
            <ol>
              <li>📤 Upload your image file (JPG, PNG, JPEG, BMP, etc.).</li>
              <li>⚙️ We’ll convert it into a high-quality, printable PDF document.</li>
              <li>📥 Auto Download the PDF instantly after conversion.</li>
            </ol>
            <p><strong>📌Note:</strong> Large or high-resolution images may take more time to process.</p>
          </div>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Convert IMG to PDF ? "
              description='Convert your JPG, JPEG, or PNG images to PDF in just a few seconds with this easy step-by-step video!.Learn how to turn your photos, screenshots, or scanned documents into a single, professional PDF file- without installing any software.'
            />
          </section>
          <div className="converter-section">
            <h2>🔒Why Use Our Image to PDF Converter?</h2>
            <ul>
              <li>✅ Converts any image into a clear, printable PDF.</li>
              <li>🔐 Files are automatically deleted after conversion for full privacy.</li>
              <li>⚡ Fast conversion with no quality loss.</li>
              <li>🌐 Works on all devices and browsers - no app needed.</li>
              <li>🆓 Free to use with no limits or sign-up.</li>
            </ul>
          </div>

          <div className="converter-section">
            <h2>📁 Supported Formats</h2>
            <p><strong>Input:</strong> .jpg, .jpeg, .png, .bmp, .webp, .tiff</p>
            <p><strong>Output:</strong> .pdf</p>
            <h2>Also check other features Related to PDF and Image file  </h2>
            <li><Link to="/word-to-pdf" className='btn' >WORD To PDF Converter </Link></li>
            <li><Link to="/odt-to-pdf" className='btn' >ODT To PDF Converter </Link></li>
            <li><Link to="/pdf-to-odt" className='btn'>PDF To ODT Converter </Link></li>
            <li><Link to="/text-to-pdf" className='btn' >TEXT To PDF Converter </Link></li>
            <li><Link to="/pptx-to-pdf" className='btn' > PPTX To PDF  Converter </Link></li>
            <li><Link to="/rtf-to-pdf" className='btn' > RTf To PDF Converter </Link></li>
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
            <li><Link to="/img-compressor" className='btn' > Compress Image  </Link></li>
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
          <div className="compresspdf-article-section">
            <h2>     Convert Image to PDF - Turn Photos into Printable Documents</h2>
            <p>
              Transform your images (JPG, PNG, BMP, etc.) into high-quality PDF documents in just a few seconds. Whether you're archiving scanned receipts, creating digital photo albums, or preparing professional reports, our Image to PDF tool makes it easy.
            </p>

            <h3>     What is Image to PDF Conversion?</h3>
            <p>
              Image to PDF conversion allows you to combine one or multiple image files into a single PDF document. This process is useful for sharing images in a universal format while preserving their resolution and layout.
            </p>

            <h3>✅ Why Convert Images to PDF?</h3>
            <ul>
              <li><strong>Universal Format:</strong> PDFs are widely supported on all devices.</li>
              <li><strong>Batch Processing:</strong> Combine multiple images into one PDF file.</li>
              <li><strong>Better Organization:</strong> Present images in a sequence, like a document.</li>
              <li><strong>High-Quality Output:</strong> Retain image clarity and resolution.</li>
            </ul>

            <h3>     Who Benefits from Image to PDF Conversion?</h3>
            <ul>
              <li><strong>Students:</strong> Convert handwritten notes or diagrams into PDF for submission.</li>
              <li><strong>Professionals:</strong> Send official ID scans or reports in PDF format.</li>
              <li><strong>Photographers:</strong> Share portfolios as polished PDF albums.</li>
              <li><strong>Everyone:</strong> Preserve and share memories securely and efficiently.</li>
            </ul>



            <h3>     Features of Our Image to PDF Tool</h3>
            <ul>
              <li>Supports multiple image formats</li>
              <li>Combines multiple images into one PDF</li>
              <li>Auto-adjusts page layout and orientation</li>
              <li>Drag & drop support</li>
              <li>Completely free and watermark-free</li>
            </ul>

            <h3>     Online & Cross-Platform</h3>
            <p>
              Our tool works seamlessly on any device   —Windows, macOS, Android, or iOS   —without needing to install any software.
            </p>

            <h3>🔒Safe and Private</h3>
            <p>
              Your files are processed securely and deleted automatically. We never store your images or PDFs.
            </p>

            <h3> Why Choose This Image to PDF Converter?</h3>
            <ul>
              <li>Fast and simple UI</li>
              <li>Combines multiple images instantly</li>
              <li>Maintains original image quality</li>
              <li>No registration required</li>
              <li>Optimized for both print and digital use</li>
            </ul>


          </div>

          <div className="converter-section" style={{ textAlign: 'center' }}>
            <h2>🎯 Try It Now!</h2>
            <p>Convert your images to a polished PDF instantly - secure, simple, and free.</p>
            <p className="converter-tagline">✅ Easy | ✅ Secure | ✅ No Sign-up Required</p>
          </div>
        </div>
      </section>

    </>
  );
};

export default ImageToPdfConverter;
