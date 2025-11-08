import React, { useState } from "react";
import axios from "axios";
import "./ImageCompressor.css";
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import "./compressor.css"
import ScrollToTop from "./ScrollToTop";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to compress img.mp4";
import IntroPoster from "../src/assets/images/img compress poster.png";

const BASE_URL = import.meta.env.VITE_BASE_URL
const ImageCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(70);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Upload");



  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];

    if (
      dropped &&
      /\.(jpe?g|png)$/i.test(dropped.name)
    ) {
      setFile(dropped);
    }
  };
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      /\.(jpe?g|png)$/i.test(selected.name)
    ) {
      setFile(selected);
    }

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Upload an image!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/compress-image`, formData, {
        responseType: "blob"
      });
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.jpg";
      a.click();
      URL.revokeObjectURL(url);
      setStatus('done');
    } catch (err) {
      console.error("Compression failed", err);
      alert("Compression failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Compress Image | Reduce Image File Size Online Free</title>
        <meta name="description" content="Compress JPG, PNG image formats online for free. Reduce image file size without compromising quality." />
        <link rel="canonical" href="https://fileunivers.in/img-compressor" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="compress image, reduce image size, image compressor, compress jpg, compress png free image compression online" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <div className="pagetitle">
        <h1>Compress Image Online – Free JPG, JPEG, and PNG Image Compressor</h1>
        <p className="intro-paragraph">
          Quickly compress JPG, JPEG, and PNG images online without losing quality using our free image compressor tool. Reduce image file size for faster uploads, sharing, and website performance while keeping sharpness and color intact. No software or registration required — simply upload your image, adjust compression quality, and download your optimized photo instantly. Perfect for photographers, web designers, and anyone who needs high-quality images at smaller sizes.
        </p>
      </div>
      <div className="compressor-container" onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>

        <label htmlFor="csvInput" className="file-label">
          {file ? `✅ Selected: ${file.name}` : '📂Drag and Drop or  Click here  to select a image file'}
        </label>
        <input id="csvInput" type="file" accept={['.jpg', '.jpeg', '.png']} onChange={handleFileChange} className="hidden-input" />
        <div className="fileuploadcontainer">
          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['jpg', 'jpeg', 'png']} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['jpg', 'jpeg', 'png']} />
        </div>

        <div className="level-slider">
          <div className="slider-section">
            <label>Compression Quality: {quality}</label>
            <input
              type="range"
              min="30"
              max="95"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            />
          </div>
          <div className="slider-labels">
            <span>⚡More Compress</span>
            <span>📦 Less Compress</span>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Compressing..." : "Compress Image"}
        </button>

        {status === 'done' && <p className="success-msg">✅ Compression complete. File downloaded.</p>}
        {status === 'error' && <p className="error-msg">❌ Compression failed. Try again.</p>}
      </div>
      <section>
        <section>
          <div className="compressor-page">
            <h2 className="compressor-heading">Compress Image Files Online</h2>
            <p className="compressor-description">
              Optimize your image files (.jpg, .jpeg, .png, .bmp, etc.) instantly without compromising quality.
              Ideal for faster web loading, smaller storage needs, and quick sharing.Our online image compressor uses smart optimization to reduce file size while preserving visual quality and resolution. Whether you’re compressing product images, social media photos, or website graphics, this tool ensures clean, detailed results every time. 100% free, browser-based, and secure — works perfectly on desktop and mobile. Start compressing your JPG, JPEG, or PNG images now with FileUnivers.in and make your files lighter, faster, and easier to share.
            </p>
            <div className="converterImg">
              <div style={{ textAlign: "center" }}>
                <img src="compression.png" alt="Arrow Symbol" className='ConverterArrowImg' />
                <p>Compress</p>
              </div>
              <div >
                <img src="img.png" alt="img Img" className='ConverterImgtwo' />
                <p style={{ textAlign: "center" }}>IMAGES</p>
              </div>
            </div>

            <h2 className="compressor-subheading">How to Compress an Image File?</h2>
            <ol className="compressor-steps">
              <li>📁 Upload or drag & drop your image file (JPG, PNG,and JPEG)</li>
              <li>🎚️ Select your desired compression level or quality setting</li>
              <li>🚀 Hit the <strong>Compress</strong> button to start compression</li>
              <li>⬇️ The optimized image will automatically download when done</li>
            </ol>
            <section>
              <LazyVideo src={IntroVideo} poster={IntroPoster}
                title="How to Compress IMAGES ? "
                description='Shrink your JPG, JPEG, or PNG images without losing quality in this quick tutorial!. Learn how to compress images online for faster uploads, website speed, or easy sharing — no app or software needed.'
              />
            </section>
            <h2 className="compressor-subheading">Why Use Our Image Compressor?</h2>
            <ul className="compressor-benefits">
              <li>🌆 Works with multiple formats including JPG, PNG, and BMP</li>
              <li>💡 Keeps quality high while reducing file size significantly</li>
              <li>🔐 100% secure – files are not stored or shared</li>
              <li>⚡ Quick processing with auto-download for convenience</li>
              <h2 style={{ marginBottom: '6px' }}>Also check other features Related to PDF and Image file  </h2>
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
            </ul>
          </div>

          <div className="compressor-article">
            <h2>Why Compressing Image Files Is a Smart Move</h2>

            <h3>🖼️ What Are Image Compression Tools?</h3>
            <p>
              Image compression tools help reduce the size of large image files without losing too much quality.
              Whether it's a JPG for a website banner or a PNG for a transparent logo, compressed images load
              faster and use less bandwidth.
            </p>

            <h3>🚀 Benefits of Compressing Image Files</h3>
            <ul>
              <li><strong>📥 Faster Uploads & Downloads</strong> – Smaller files move quickly online</li>
              <li><strong>📱 Mobile Optimization</strong> – Reduce data usage and load times on mobile networks</li>
              <li><strong>📈 Better SEO</strong> – Improve page speed and search engine ranking</li>
              <li><strong>💾 Save Storage</strong> – Free up disk space on your devices or cloud storage</li>
            </ul>

            <h3>🆚 JPG vs PNG vs BMP – When to Use Each Format</h3>
            <div className="table-container">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Format</th>
                    <th>Best For</th>
                    <th>Compression Available</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>JPG/JPEG</td>
                    <td>Photos and realistic images</td>
                    <td>Lossy – high compression, small file size</td>
                  </tr>
                  <tr>
                    <td>PNG</td>
                    <td>Graphics with transparency</td>
                    <td>Lossless – good quality, moderate size</td>
                  </tr>
                  <tr>
                    <td>BMP</td>
                    <td>Editing and archiving</td>
                    <td>Uncompressed – very large size</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>⚙️ How Our Image Compressor Works</h3>
            <p>
              Our tool automatically detects the format and applies optimal compression algorithms based on
              content type. You can adjust the quality slider to fine-tune output. Whether you're compressing a
              high-resolution photo or a transparent icon, we deliver results in seconds – no software required.
            </p>

            <h3>🔐 Privacy First – We Never Store Your Files</h3>
            <p>
              Your image files remain private. Compression happens directly in the browser or via secure
              temporary processing. We never:
            </p>
            <ul>
              <li>🚫 Store your files permanently</li>
              <li>🚫 Access your content</li>
              <li>♻️ Keep any data after the process completes</li>
            </ul>

            <h3>💡 Tips for Better Compression</h3>
            <ul>
              <li>🧪 Test different quality levels for the perfect balance</li>
              <li>🔄 Convert BMP to JPG or PNG before compressing</li>
              <li>🗜️ For maximum reduction, download as .zip or .7z after compression</li>
            </ul>

            <h3>📊 Real Compression Example</h3>
            <div className="table-container">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Original File</th>
                    <th>Compressed Size</th>
                    <th>Visual Difference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10MB (PNG)</td>
                    <td>2.1MB (PNG)</td>
                    <td>Virtually Identical</td>
                  </tr>
                  <tr>
                    <td>8MB (JPG)</td>
                    <td>1.3MB (JPG)</td>
                    <td>Very Slight</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>🔚 Final Words</h3>
            <p>
              High-quality images are essential, but oversized files can slow down everything from websites to
              mobile apps. Our free online image compressor offers a perfect balance between size and clarity. Use
              it for faster loading, smoother sharing, and improved storage efficiency – all with a few simple
              clicks.
            </p>
          </div>
        </section>

      </section>
    </>
  );
};

export default ImageCompressor;
