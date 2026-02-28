import React, { useState, useEffect } from 'react';
import DropzoneInput from "./DropzoneInput"; import axios from "axios";
import "./PDFCompressor.css";
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to compress pdf.mp4";
import IntroPoster from "../src/assets/images/pdf compress poster.png";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";
import SaveToGoogleDriveCloud from './SaveToGoogleDriveCloud';
import SaveToDropboxCloud from './SaveToDropboxCloud';

const BASE_URL = import.meta.env.VITE_BASE_URL
const PDFCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(60);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("upload");
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState(null);
  const [compressionStats, setCompressionStats] = useState(null);


  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith('.pdf')) {
      setFile(dropped);
    }
  };
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.pdf')) {
      setFile(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a PDF.");

    // ⏱ FRONTEND START TIME
    const frontendStartTime = performance.now();

    setProgress(10);
    setStatus("compressing");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);

    try {
      const response = await axios.post(
        `${BASE_URL}/convert-compress-pdf`,
        formData,
        {
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(Math.min(percent, 80));
          },
        }
      );

      // ⏱ FRONTEND END TIME (response received)
      const frontendEndTime = performance.now();
      const totalFrontendMs = Math.round(frontendEndTime - frontendStartTime);

      console.log("⏱ Frontend total time (ms):", totalFrontendMs);
      console.log("⏱ Frontend total time (sec):", (totalFrontendMs / 1000).toFixed(2));

      console.log("⏱ Backend Ghostscript time (ms):", response.data.compressionTimeMs);

      const { fileId, downloadUrl } = response.data;
      // console.log(convertedFile.downloadUrl);

      // Auto download
      const a = document.createElement("a");
      a.href = `${BASE_URL}${downloadUrl}`;
      a.download = file.name.replace(/\.pdf$/i, "") + "_compressed.pdf";
      a.click();

      setStatus("✅ Done");
      setProgress(100);

      // const { fileId, downloadUrl } = response.data;

      const cloudFile = {
        fileId,
        fileName: file.name.replace(/\.pdf$/i, "") + "_compressed.pdf",
        downloadUrl: `${BASE_URL}${downloadUrl}`,
        mimeType: "application/pdf"
      };

      setConvertedFile(cloudFile);
      // OPTIONAL: store for UI
      setCompressionStats({
        frontendMs: totalFrontendMs,
        backendMs: response.data.compressionTimeMs
      });

    } catch (error) {
      console.error("Compression failed:", error);
      alert("Compression failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Compress PDF | Reduce PDF File Size Online Free and Secure</title>
        <meta name="description" content="Compress your PDF files to reduce file size without losing quality. Free online PDF compressor with fast and secure compression." />
        <link rel="canonical" href="https://fileunivers.com/pdf-compressor" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="compress pdf, reduce pdf size, pdf compressor, shrink pdf file, compress pdf online, free pdf compression tool" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <div className="pagetitle">
        <h1>Compress PDF Online - Free Secure  & Fast PDF File Size Reducer</h1>
        <p className="intro-paragraph">
          Easily compress your PDF files online without losing quality using our free and secure PDF compressor. Reduce large PDF file sizes for faster sharing, emailing, or uploading while keeping the text, images, and layout perfectly intact. No software installation or registration required- simply upload your PDF, choose compression quality, and download your optimized file instantly. Perfect for students, professionals, and businesses who need smaller, high-quality PDFs in seconds.
        </p>
      </div>

      <div className="compressor-container" onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
        <div className="pdfcontainer">
          <h2>Compress PDF </h2>
        </div>


        <div>

          {/* <form onSubmit={handleSubmit}> */}
          <label htmlFor="csvInput" className="file-label">
            {file ? `✅ Selected: ${file.name}` : '   📂Drag and Drop or  Click here  to select a .pdf file'}
          </label>
          <input id="csvInput" type="file" accept=".pdf" onChange={handleFileChange} className="hidden-input" />
          <div className="pdfcenter">

            <div className="fileupload">
              <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pdf']} className='hiii' />
              <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pdf']} />
            </div>
          </div>
          <div className="slidercon">

            <div className="slider-container">
              <label htmlFor="quality">Compression Level: {quality}</label>
              <input
                type="range"
                id="quality"
                min="30"
                max="95"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
              />
              <div className="slider-labels">
                <span>⚡More Compress </span>
                <span>   📦 Less Compress</span>
              </div>
            </div>
          </div>


          {/* <button type="submit" disabled={loading}>
            {loading ? `Compressing... (${progress}%)` : "Compress PDF"}
            </button> */}
          <button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? `Compressing... (${progress}%)` : "Compress PDF"}
          </button>

          {status === "✅ Done" && convertedFile && (
            <>
              <p style={{ color: "white" }}>Save To . . .</p>
              <div className="saveTo">
                <SaveToGoogleDriveCloud
                  fileId={convertedFile.fileId}
                  fileName={convertedFile.fileName}
                />
                <SaveToDropboxCloud
                  downloadUrl={convertedFile.downloadUrl}
                  fileName={convertedFile.fileName}
                />
              </div>
            </>
          )}



          {status === '✅ Done' && <p className="success-msg">✅ Compression complete. File downloaded.</p>}
          {status === 'error' && <p className="error-msg">   ❌ Compression failed. Try again.</p>}
          {/* </form> */}
        </div>
      </div>
      <section>
        <div className="compressor-page">
          <h2 className="compressor-heading">Compress PDF Online</h2>
          <p className="compressor-description">
            Reduce the file size of your PDF documents quickly and securely. This tool compresses images and removes unnecessary data while keeping your PDF content intact.Our online PDF compressor uses advanced optimization to minimize file size while maintaining clear visuals and readable text. Whether you’re compressing scanned PDFs, image-heavy files, or multi-page documents, this tool ensures smooth, fast, and accurate results. 100% browser-based, secure, and compatible with all devices- experience lightning-fast PDF compression anytime, anywhere. Reduce your file size and keep your documents ready for sharing with fileunivers.com.
          </p>
          <div className="converterImg">
            <div style={{ textAlign: "center" }}>
              <img src="compression.png" alt="Arrow Symbol" className='ConverterArrowImg' />
              <p>Compress</p>
            </div>
            <div >
              <img src="pdf.png" alt="Pdf Img" className='ConverterImgtwo' />
              <p style={{ textAlign: "center" }}>PDF</p>
            </div>
          </div>


          <h2 className="compressor-subheading">How to Compress a PDF?</h2>
          <ol className="compressor-steps">
            <li>   📂 Upload or drag & drop your PDF file</li>
            <li>⚙️ Choose compression quality (e.g., low, medium, high)</li>
            <li>🚀 Click on <strong>Compress</strong> to reduce the file size</li>
            <li>   ⬇️ Auto Download the optimized PDF or `.pdf.7z` archive</li>
          </ol>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Compress PDF ? "
              description='Reduce your PDF file size in seconds with this simple step-by-step video!. Learn how to compress PDF online without losing quality- perfect for emailing, uploading, or saving storage space. No software, no sign-up- just fast and secure compression.'
            />
          </section>

          <h2 className="compressor-subheading">Why Use Our PDF Compressor?</h2>
          <ul className="compressor-benefits">
            <li>✅ No watermark</li>
            <li>🔒Your files stay private - processed locally or securely deleted</li>
            <li>⚡ Fast compression powered by Python backend</li>
            <li>📱 Works on mobile and desktop</li>



            <h2 style={{ marginBottom: "4px" }}>Also check other features Related to PDF file  </h2>
            <div className="otherlink">
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
            </div>
          </ul>

        </div>

        <section className="pdf-compressor-section">
          <div className="pdf-compressor-container">

            <h2 className="pdf-compressor-heading">Compress PDF Online - Reduce File Size Effortlessly</h2>
            <p className="pdf-compressor-intro">
              Want to reduce the size of your PDF files without compromising quality? Our online PDF compressor helps you shrink large PDF documents into smaller, more manageable files within seconds- no software installation needed!
            </p>

            <h2 className="pdf-compressor-subheading">How to Compress a PDF File?</h2>
            <ol className="pdf-compressor-steps">
              <li>📁 Upload or drag & drop your <code>.pdf</code> file into the compressor</li>
              <li>⚙️ Select your desired compression quality (high, medium, or low)</li>
              <li>🚀 Click <strong>Compress</strong> and let our tool do the work</li>
              <li>   ⬇️ Download the compressed PDF instantly</li>
            </ol>

            <h2 className="pdf-compressor-subheading">Why Should You Compress Your PDF Files?</h2>
            <p className="pdf-compressor-text">
              PDF files are widely used for sharing documents, contracts, reports, and more. However, high-resolution images, embedded fonts, and graphics can make PDFs unnecessarily large. Compressing your PDFs offers several benefits:
            </p>
            <ul className="pdf-compressor-benefits">
              <li>🚀 Faster upload and download speeds</li>
              <li>📱 Easy sharing via email or messaging apps</li>
              <li>   💾   Saves disk space and server bandwidth</li>
              <li>🔐 Maintains content quality and layout</li>
            </ul>

            <h2 className="pdf-compressor-subheading">Features of Our Free PDF Compressor Tool</h2>
            <ul className="pdf-compressor-features">
              <li>💡 Smart compression technology for optimal quality retention</li>
              <li>🔒100% secure - your files are never stored or shared</li>
              <li>🌐 Web-based - works on all devices and browsers</li>
              <li>   🕒 Super fast - compression in seconds</li>
            </ul>

            <h2 className="pdf-compressor-subheading">Who Uses Our PDF Compressor?</h2>
            <p className="pdf-compressor-text">
              Our tool is built for everyone- from students submitting assignments to professionals sharing large documents. Whether you're working with eBooks, invoices, design portfolios, or scanned reports, our compressor simplifies your file management.
            </p>

            <h2 className="pdf-compressor-subheading">FAQs About PDF Compression</h2>
            <div className="pdf-compressor-faq">
              <h3>Q: Will compression affect the quality of my PDF?</h3>
              <p>A: Not significantly. We use intelligent compression algorithms to balance quality and size.</p>

              <h3>Q: Is there a file size limit?</h3>
              <p>A: You can upload files up to 100MB for compression. For larger files, upgrade options will be available soon.</p>

              <h3>Q: Are my files secure?</h3>
              <p>A: Absolutely. Files are processed temporarily and automatically deleted after compression.</p>
            </div>

            <h2 className="pdf-compressor-subheading">Start Compressing Your PDFs Today</h2>
            <p className="pdf-compressor-conclusion">
              Don’t let bulky files slow you down. Compress your PDF documents instantly with our simple, secure, and fast online tool. Whether it’s for work, school, or personal use- save space, reduce load times, and improve your sharing experience.
            </p>
          </div>
        </section>
      </section>
    </>
  );
};

export default PDFCompressor;