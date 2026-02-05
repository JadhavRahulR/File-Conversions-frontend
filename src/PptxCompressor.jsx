import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import "./compressor.css"
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "./assets/videos/how to compress pptx.mp4";
import IntroPoster from "./assets/images/pptx compress poster.png";

const BASE_URL = import.meta.env.VITE_BASE_URL
const PptxCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(30);
  const [outputType, setOutputType] = useState('pptx');
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.pptx')) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.pptx')) {
      setFile(selected);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setStatus('uploading');
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);
    formData.append('outputType', outputType);

    try {
      const response = await axios.post(`${BASE_URL}/compress-pptx`, formData, {
        responseType: 'blob',
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(Math.min(percent, 90));
        },
      });

      const ext = outputType === '7z' ? '.pptx.7z' : '_compressed.pptx';
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name.replace('.pptx', ext));
      document.body.appendChild(link);
      link.click();
      link.remove();

      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Compress PPTX | Reduce PowerPoint File Size Online</title>
        <meta name="description" content="Compress your PowerPoint (.pptx) presentations online to reduce file size without losing quality. Free and secure PPTX compressor tool." />
        <link rel="canonical" href="https://fileunivers.com/pptxcompress" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="compress pptx, pptx compressor, reduce powerpoint file size, shrink pptx, compress presentation, free pptx compression online" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <div className="pagetitle">
        <h1>Compress PPTX Online - Free & Fast PowerPoint File Size Reducer</h1>
        <p className="intro-paragraph">
          Easily compress your PPTX (PowerPoint) files online without losing presentation quality. Reduce large file sizes for faster sharing, emailing, and uploading while keeping your slides, images, and animations perfectly intact. No software or signup needed- just upload your PPTX file, choose your compression level, and download your optimized presentation instantly. Ideal for students, teachers, and professionals who want high-quality presentations in smaller file sizes.
        </p>
      </div>
      <div
        className="compressor-container "
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="compressing">
          <h2>Compress PPTX</h2>
        </div>
        <p className="file-label clickable-label"
          onClick={() => fileInputRef.current.click()}>
            
          {file ? `✅ Selected: ${file.name}` : '   📂 Drag & drop a .pptx file here, or click to select'}
        </p>
        <input type="file" accept=".pptx" onChange={handleFileChange} ref={fileInputRef} className="hidden-input" />
        <div className="fileuploadcontainer">
          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.pptx']} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.pptx']} />
        </div>
        <div className="level-slider">
          <label>Image Quality: {quality}</label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
          />
          <div className="slider-labels">
            <span>   📉 Smaller</span>
            <span>     Clearer</span>
          </div>
        </div>

        <div className="output-select">
          <label>
            <input
              type="radio"
              name="pptxOutputType"
              value="pptx"
              checked={outputType === 'pptx'}
              onChange={() => setOutputType('pptx')}
            />
            Export as .pptx
          </label>
          <label>
            <input
              type="radio"
              name="pptxOutputType"
              value="7z"
              checked={outputType === '7z'}
              onChange={() => setOutputType('7z')}
            />
            Export as .pptx.7z
          </label>
        </div>

        <button onClick={handleCompress} disabled={!file || status === 'uploading'}>
          {status === 'uploading' ? `Compressing... (${progress}%)` : '    Compress'}
        </button>

        {status === 'done' && <p className="success-msg">✅ File compressed and downloaded!</p>}
        {status === 'error' && <p className="error-msg">   ❌ Compression failed</p>}
      </div>
      <section>
        <div className="compressor-page">
          <h2 className="compressor-heading">Compress PPTX Online</h2>
          <p className="compressor-description">
            Shrink the size of your PowerPoint (.pptx) presentations without losing quality. This tool optimizes embedded images and removes unnecessary data while keeping your slides intact.Our online PPTX compressor intelligently reduces image and media sizes while maintaining visual clarity and slide formatting. Whether you’re compressing a corporate presentation, a school project, or a conference deck, this tool delivers fast, accurate, and secure results. 100% browser-based and mobile-friendly- start compressing your PowerPoint files now with fileunivers.com and make your presentations lighter, faster, and easier to share anywhere.
          </p>
          <div className="converterImg">
            <div style={{ textAlign: "center" }}>
              <img src="compression.png" alt="Arrow Symbol" className='ConverterArrowImg' />
              <p>Compress</p>
            </div>
            <div >
              <img src="pptx.png" alt="Pdf Img" className='ConverterImgtwo' />
              <p style={{ textAlign: "center" }}>PPTX</p>
            </div>
          </div>

          <h2 className="compressor-subheading">How to Compress a PPTX File?</h2>
          <ol className="compressor-steps">
            <li>   📂 Upload or drag & drop your .pptx file</li>
            <li>⚙️ Choose your desired image compression quality</li>
            <li>🚀 Click <strong>Compress</strong> to reduce file size</li>
            <li>   ⬇️ Your compressed PPTX will auto-download once it's ready</li>
          </ol>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Compress PPTX ? "
              description='Compress your PPTX files online in seconds with this quick and easy tutorial! Learn how to reduce PowerPoint file size without losing slide quality, animations, or images- no software required.In this video, you’ll see-How to upload your PPTX file Choose your compression level Instantly download your smaller, optimized presentation.'
            />
          </section>

          <h2 className="compressor-subheading">Why Use Our PPTX Compressor?</h2>
          <ul className="compressor-benefits">
            <li>✅ No quality loss in text and layout</li>
            <li>⚡ Quick and efficient image optimization</li>
            <li>🔒Your presentation stays secure and private</li>
            <li>📥 Automatic download after compression completes</li>
            <h2 style={{ marginBottom: '6px' }}>Also check other features Related to PDF and pptx file  </h2>
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
            <li><Link to="/merge-pdf" className='btn' > Merge PDF  </Link></li>
            <li><Link to='/pdf-compressor' className='btn' > Compress PDF  </Link></li>
            <li><Link to="/img-compressor" className='btn' > Compress Image  </Link></li>
          </ul>
        </div>
        <section>
          <div className="compressor-article">
            <h2>Everything You Need to Know About PPTX Compression</h2>

            <h3>📄 What is a PPTX File?</h3>
            <p>
              PPTX is the file extension for Microsoft PowerPoint presentations created using Office 2007 or
              later. These files can contain slides with text, images, charts, animations, and multimedia.
              Although powerful for presentations, PPTX files can quickly become large due to embedded media.
            </p>

            <h3>   📦 Why Do PPTX Files Get So Large?</h3>
            <p>
              PPTX files grow in size primarily due to high-resolution images, embedded videos, audio files,
              custom fonts, and slide animations. If you're working with a media-rich deck, even a few slides can
              become tens of megabytes in size.
            </p>

            <h3>💡 Benefits of Compressing PPTX Files</h3>
            <ul>
              <li><strong>🚀 Faster Sharing</strong> - Easily upload to email or cloud without hitting limits</li>
              <li><strong>📥 Reduced Storage</strong> - Save space on your device or team drives</li>
              <li><strong>📚 Smoother Presentations</strong> - Load and transition faster on any system</li>
              <li><strong>📱 Mobile Compatibility</strong> - Compressed files open quicker on mobile devices</li>
            </ul>

            <h3>   🛠️ How Our PPTX Compressor Works</h3>
            <p>
              Our tool scans your .pptx presentation and applies smart compression to embedded images, fonts, and
              media without compromising visual quality. You simply upload your file, and within seconds, a
              compressed version will be automatically downloaded.
            </p>

            <h3>🔐 Is it Safe to Compress PPTX Files Online?</h3>
            <p>
              Absolutely. Your PPTX file is processed securely and never stored or shared. We ensure:
            </p>
            <ul>
              <li>🔒No server-side storage</li>
              <li>🔐 Private and encrypted processing</li>
              <li>   ♻️ Automatic deletion right after compression</li>
            </ul>

            <h3>   🔚 Final Thoughts</h3>
            <p>
              Whether you're preparing for a business meeting or sharing a classroom presentation, compressing
              your PPTX file ensures faster, smoother delivery without sacrificing design. Use our free tool now
              to reduce size, save space, and keep your content impactful and efficient.
            </p>

            <h2>📚 Frequently Asked Questions</h2>

            <h3>❓ Will compressing my PPTX reduce its quality?</h3>
            <p>
              Not noticeably. Our tool compresses embedded media while keeping slide design and readability
              intact.
            </p>

            <h3>❓ How much size can I expect to save?</h3>
            <p>
              You can often reduce file size by 50-80%, depending on how many images, fonts are used.
            </p>

            <h3>❓ Do I need to install anything?</h3>
            <p>
              No installation needed. Everything works directly in your browser   —fast, simple, and secure.
            </p>
          </div>
        </section>

      </section>
    </>
  );
};

export default PptxCompressor;
