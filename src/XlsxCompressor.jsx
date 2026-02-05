import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LazyVideo from "./LazyVideo";
import IntroVideo from "../src/assets/videos/how to compress xlsx.mp4";
import IntroPoster from "../src/assets/images/xlsx compress poster.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const XlsxCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(30);
  const [outputType, setOutputType] = useState('xlsx');
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith('.xlsx')) {
      setFile(dropped);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.xlsx')) {
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
      const response = await axios.post(`${BASE_URL}/compress-xlsx`, formData, {
        responseType: 'blob',
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(Math.min(percent, 90));
        },
      });

      const ext = outputType === '7z' ? '.xlsx.7z' : '_compressed.xlsx';
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name.replace('.xlsx', ext));
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Compress Excel | Reduce XLSX File Size Online</title>
        <meta name="description" content="Compress your Excel spreadsheets (.xlsx) online to reduce file size while preserving data and formatting. Free and secure XLSX compressor tool." />
        <link rel="canonical" href="https://fileunivers.com/xlsxcompressor" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="compress xlsx, excel compressor, reduce excel file size, compress spreadsheet, shrink xlsx, xlsx file compression online" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <div className="pagetitle">
        <h1>Compress XLSX File Online - Free Excel File Size Reducer</h1>
        <p className="intro-paragraph">
          Compress XLSX files online to reduce large Excel file sizes while keeping your data, charts, and formatting fully intact. Whether you’re sharing reports, financial sheets, or project data, this fast and secure tool helps you shrink Excel files in seconds- no software installation required. Just upload your XLSX file, choose your preferred compression level, and download the optimized version instantly.
        </p>
      </div>
      <div
        className="compressor-container "
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
          <div className="compressing">
          <h2>Compress XLSX</h2>
        </div>
        <p
          className="file-label clickable-label"
          onClick={() => fileInputRef.current.click()}
        >
          {file ? `✅ Selected: ${file.name}` : '   📂 Drag & drop a .xlsx file here, or click to select'}
        </p>
        <input
          type="file"
          accept=".xlsx"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden-input"
        />
        <div className="fileuploadcontainer">
          <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.xlsx']} />
          <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.xlsx']} />
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
            <span>📚 Clearer</span>
          </div>
        </div>

        <div className="output-select">
          <label>
            <input
              type="radio"
              name="xlsxOutputType"
              value="xlsx"
              checked={outputType === 'xlsx'}
              onChange={() => setOutputType('xlsx')}
            />
            Export as .xlsx
          </label>
          <label>
            <input
              type="radio"
              name="xlsxOutputType"
              value="7z"
              checked={outputType === '7z'}
              onChange={() => setOutputType('7z')}
            />
            Export as .xlsx.7z
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
          <h2 className="compressor-heading">Compress XLSX File Online</h2>
          <p className="compressor-description">
            Reduce the size of your Excel spreadsheet (.xlsx) files by optimizing embedded content like images and charts, without changing your data or formulas.XLSX compressor intelligently minimizes file size by optimizing embedded images, removing unnecessary metadata, and streamlining internal data structure. Perfect for professionals and students who deal with heavy Excel spreadsheets, this online tool makes sharing and uploading smoother than ever. Experience lightning-fast, 100% secure, and free Excel file compression with fileunivers.com today.
          </p>
          <div className="converterImg">
            <div style={{ textAlign: "center" }}>
              <img src="compression.png" alt="Arrow Symbol" className='ConverterArrowImg' />
              <p>Compress</p>
            </div>
            <div >
              <img src="xlsx.png" alt="xlsx Img" className='ConverterImgtwo' />
              <p style={{ textAlign: "center" }}>XLSX</p>
            </div>
          </div>

          <h2 className="compressor-subheading">How to Compress an XLSX File?</h2>
          <ol className="compressor-steps">
            <li>   📂 Upload or drag & drop your <code>.xlsx</code> file</li>
            <li>   🎚️ Select a compression level (for image-heavy spreadsheets)</li>
            <li>🚀 Click <strong>Compress</strong> to begin</li>
            <li>   ⬇️ Your compressed <code>.xlsx</code> will auto-download once ready</li>
          </ol>
            <section>
            <LazyVideo src={IntroVideo} poster={IntroPoster}
              title="How to Compress XLSX ? "
              description='Compress your Excel files online in just seconds!. This video shows how to reduce XLSX file size without losing any data, formatting, or charts. In this video, you’ll learn: How to upload and compress XLSX files online Select compression level for best results , and Download your optimized Excel file instantly'
            />
            </section>
          <h2 className="compressor-subheading">Why Use Our XLSX Compressor?</h2>
          <ul className="compressor-benefits">
            <li>📚 Preserves all data, formulas, and formatting</li>
            <li>   📉 Shrinks file size for easier sharing and storage</li>
            <li>🔐 Secure and private compression process</li>
            <li>⚡ Fast performance with instant auto-download</li>
            <h2 style={{ marginBottom: '6px' }}>Also check other features Related to PDF and Xlsx file  </h2>
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
            <h2>Everything You Need to Know About XLSX Compression</h2>

            <h3>📚 What is an XLSX File?</h3>
            <p>
              XLSX is the default file format used by Microsoft Excel. It stores spreadsheet data including text, numbers, formulas,
              charts, images, and formatting. While efficient, XLSX files can become quite large due to embedded images or large datasets.
            </p>

            <h3>   📦 Why Compress an XLSX File?</h3>
            <p>
              XLSX files may grow in size if they contain high-resolution charts, pivot tables, embedded pictures, macros, or
              unnecessary formatting. Compressing them helps in reducing load time and makes sharing easier.
            </p>

            <h3>💡 Benefits of Compressing XLSX Files</h3>
            <ul>
              <li><strong>   📉 Reduce File Size</strong> - Shrink large Excel sheets while keeping data intact</li>
              <li><strong>📤 Easy to Share</strong> - Faster email uploads and sharing on cloud drives</li>
              <li><strong>   💾   Save Storage</strong> - Less disk usage for large spreadsheets</li>
              <li><strong>📱 Better Performance</strong> - Faster access on mobile and older devices</li>
            </ul>

            <h3>⚙️ How Our XLSX Compressor Works</h3>
            <p>
              Our tool compresses XLSX files by optimizing images, removing hidden data, and cleaning up excess formatting.
              It retains your original content, structure, and calculations   —just in a lighter package.
            </p>

            <h3>🔐 Is It Safe to Use This XLSX Compressor?</h3>
            <p>
              Absolutely. We prioritize your privacy. All file compression happens over a secure connection and we don’t store or
              analyze your content. Files are deleted after processing.
            </p>
            <ul>
              <li>🔒Encrypted transfer</li>
              <li>   🚫 No file retention</li>
              <li>✅ Works on all devices</li>
            </ul>

            <h3>📌Final Tip</h3>
            <p>
              Whether you're managing financial reports, academic data, or simple tables, compressing large XLSX files
              ensures better usability and faster sharing. Try it now   —it's quick, safe, and free.
            </p>

            <h2>📚 Frequently Asked Questions</h2>

            <h3>❓ Will my formulas and charts be preserved?</h3>
            <p>
              Yes, all formulas, functions, charts, and formatting remain unchanged. Only file weight is reduced.
            </p>

            <h3>❓ Can I compress password-protected XLSX files?</h3>
            <p>
              No. Please remove any password protection before uploading the file for compression.
            </p>

            <h3>❓ What formats can I download after compression?</h3>
            <p>
              You can download the result as a compressed `.xlsx`, or as a `.xlsx.7z` archive for further size reduction.
            </p>
          </div>
        </section>

      </section>
    </>
  );
};

export default XlsxCompressor;
