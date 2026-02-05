import React, { useState } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "./assets/videos/how to compress csv.mp4";
import IntroPoster from "./assets/images/csv compress poster.png";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const CsvCompressor = () => {
  const [file, setFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState(19);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);

  console.log("Base URL:", import.meta.env.VITE_BASE_URL);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith('.csv')) {
      setFile(dropped);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.csv')) {
      setFile(selected);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setStatus('uploading');
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('level', compressionLevel);

    try {
      const response = await axios.post(`${BASE_URL}/compress-csv`, formData, {
        responseType: 'blob',
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(Math.min(percent, 90));
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name.replace('.csv', '_compressed.csv'));
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
        <title>Compress CSV | Reduce CSV File Size Online Free</title>
        <meta name="description" content="Compress your CSV files online to reduce file size quickly and securely. Free CSV compressor with no signup or software required." />
        <link rel="canonical" href="https://fileunivers.com/csvcompress" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="compress csv, csv file compressor, reduce csv file size, online csv compression, shrink csv, free csv compressor" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <div className="pagetitle">
        <h1>Compress CSV Online - Free & Fast CSV File Compressor</h1>
        <p className="intro-paragraph">
          Compress CSV files online to reduce file size without losing data accuracy or structure. Our free and secure CSV compressor helps you shrink large spreadsheets for faster uploads, sharing, and storage. No software installation or registration required- just upload your CSV file, click compress, and download your optimized version in seconds. Perfect for data analysts, developers, and professionals who manage large datasets.
        </p>
      </div>
      <div className="compressor-container" onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
        <div className="compressing">
          <h2>Compress CSV</h2>
        </div>
        <label htmlFor="csvInput" className="file-label">
          {file ? `✅ Selected: ${file.name}` : '   📂Drag and Drop or  Click here  to select a .csv file'}
        </label>
        <input id="csvInput" type="file" accept=".csv" onChange={handleFileChange} className="hidden-input" />
        <div className="fileuploadcontainer">
          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.csv']} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.csv']} />
        </div>

        <div className="level-slider">
          <label htmlFor="compressionSlider">Compression Level: {compressionLevel}</label>
          <input type="range" id="compressionSlider" min="1" max="22" value={compressionLevel} onChange={(e) => setCompressionLevel(parseInt(e.target.value))} />
          <div className="slider-labels">
            <span>⚡ Faster</span>
            <span>   📦 Smaller File</span>
          </div>
        </div>


        <button
          onClick={handleCompress}
          disabled={!file || status === 'uploading'}
          className="compress-btn"
        >
          {status === 'uploading' ? `Compressing... (${progress}%)` : '    Compress CSV'}
        </button>

        {status === 'done' && <p className="success-msg">✅ Compression complete. File downloaded.</p>}
        {status === 'error' && <p className="error-msg">   ❌ Compression failed. Try again.</p>}
      </div>
      <section>
        <div className="compressor-page">
          <h2 className="compressor-heading">Compress CSV File Online</h2>
          <p className="compressor-description">
            Quickly reduce the size of your CSV files without altering the data. Ideal for large spreadsheet exports or data backups.
            Our online CSV compression tool uses smart optimization to reduce file size while keeping every value, column, and format intact. Whether you’re compressing large data files, reports, or analytics sheets, this tool ensures accurate and safe results every time. 100% free, browser-based, and secure- works on all devices. Start compressing your CSV files now with fileunivers.com and make your data lighter, faster, and easier to store or share.
          </p>

           <div className="converterImg">
            <div style={{ textAlign: "center" }}>
              <img src="compression.png" alt="Arrow Symbol" className='ConverterArrowImg' />
              <p>Compress</p>
            </div>
            <div >
              <img src="csv.png" alt="Pdf Img" className='ConverterImgtwo' />
              <p style={{ textAlign: "center" }}>CSV</p>
            </div>
          </div>

          <h2 className="compressor-subheading">How to Compress a CSV File?</h2>
          <ol className="compressor-steps">
            <li>   📂 Upload or drag & drop your <code>.csv</code> file</li>
            <li>⚙️ Choose your preferred compression level</li>
            <li>🚀 Click <strong>Compress</strong> to process the file</li>
            <li>   ⬇️ Auto Download the compressed <code>.csv</code> file</li>
          </ol>
          <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Compress PDF ? "
              description='Compress your CSV files online quickly and easily with this step-by-step video!. Learn how to reduce CSV file size without losing data, making it perfect for faster uploads, sharing, and storage- no software needed.'
            />
          </section>

          <h2 className="compressor-subheading">Why Use Our CSV Compressor?</h2>
          <ul className="compressor-benefits">
            <li>   📉 Reduces file size without losing data</li>
            <li>🔒Your CSV stays secure and private</li>
            <li>⚡ Fast processing with instant download</li>
            <li>     Works on all devices with a browser</li>
            <h2 style={{ marginBottom: '6px' }}>Also check other features Related to PDF and CSV file  </h2>
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
            <h2>Everything You Need to Know About CSV Compression</h2>

            <h3>📄 What is a CSV File?</h3>
            <p>
              CSV stands for <strong>Comma-Separated Values</strong>, a simple text format used to store tabular
              data. It’s widely supported across applications like Excel, Google Sheets, databases, and more.
              Each line represents a row, and values are separated by commas.
            </p>

            <h3>🧠    Why Are Some CSV Files So Large?</h3>
            <p>
              While CSV is a plain text format, large datasets   —such as financial records, analytics exports, or
              logs   —can contain thousands of rows and columns. Uncompressed, these files grow quickly and are
              difficult to manage or share.
            </p>

            <h3>💡 Benefits of Compressing CSV Files</h3>
            <ul>
              <li><strong>🚀 Faster Uploads & Downloads</strong> - Share large files easily via email or cloud</li>
              <li><strong>📤 Efficient Storage</strong> - Reduce data consumption on servers or local devices</li>
              <li><strong>📁 Easy Archiving</strong> - Store historical data in compressed archives</li>
              <li><strong>🔐 Secure & Private</strong> - Your data never leaves your browser or device</li>
            </ul>

            <h3>   🛠️ How Our CSV Compressor Works</h3>
            <p>
              Our online tool takes your CSV file and compresses it using efficient formats like ZIP or 7Z.
              Simply upload your file, choose a format, and get a compressed version instantly. No signup or
              software required.
            </p>

            <div className="table-container">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>File Type</th>
                    <th>Before Compression</th>
                    <th>After Compression</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CSV (Uncompressed)</td>
                    <td>25MB</td>
                    <td>3.2MB (.csv.zip)</td>
                  </tr>
                  <tr>
                    <td>Large Log Export</td>
                    <td>45MB</td>
                    <td>5.8MB (.csv.7z)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>🔐 Is it Safe to Compress CSV Files Online?</h3>
            <p>
              Yes! Your data is never saved or viewed. Compression is done in a secure environment, and your file:
            </p>
            <ul>
              <li>🔒Is not stored on any server</li>
              <li>🔐 Is not accessed by anyone</li>
              <li>   ♻️ Is deleted automatically after processing</li>
            </ul>


            <h3>   🔚 Final Thoughts</h3>
            <p>
              CSV files are essential for storing and sharing structured data, but they can get bulky quickly.
              Compressing them reduces load times, saves space, and makes transferring easier than ever. Try our
              tool today for fast, private, and efficient CSV file compression in just a few clicks.
            </p>
          </div>
        </section>

      </section>
    </>
  );
};

export default CsvCompressor;
