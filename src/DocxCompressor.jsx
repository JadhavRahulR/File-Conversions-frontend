import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';

const BASE_URL = import.meta.env.VITE_BASE_URL
const DocxCompressor = () => {
    const [file, setFile] = useState(null);
    const [quality, setQuality] = useState(30);
    const [outputType, setOutputType] = useState('docx');
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped && dropped.name.endsWith('.docx')) {
            setFile(dropped);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.name.endsWith('.docx')) {
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
            const response = await axios.post( `${BASE_URL}/compress-docx`, formData, {
                responseType: 'blob',
                onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(Math.min(percent, 90));
                },
            });

            const ext = outputType === '7z' ? '.docx.7z' : '_compressed.docx';
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name.replace('.docx', ext));
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
          <title>Compress Word | Reduce DOCX File Size Online</title>
<meta name="description" content="Compress your Microsoft Word (.docx) files online and reduce file size instantly. Free DOCX compressor with no signup or installation needed." />
<link rel="canonical" href="https://fileunivers.in/docxcompressor" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="compress word, docx compressor, reduce word file size, compress doc file, shrink docx, word file compression online" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

        </Helmet>
        <ScrollToTop/>
        <div
            className="compressor-container drop-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            >
            <h1>DOCX Compressor</h1>

            <p
                className="file-label clickable-label"
                onClick={() => fileInputRef.current.click()}
                >
                {file ? `✅ Selected: ${file.name}` : '📂 Drag & drop a .docx file here, or click to select'}
            </p>
            <input type="file" accept=".docx" ref={fileInputRef} onChange={handleFileChange} className="hidden-input" />
            <div className="fileuploadcontainer">
                <DriveFileInput onFilePicked={setFile} setStatus={setStatus} allowedTypes={['.docx']} />
                <DropboxFileInput onFilePicked={setFile} setStatus={setStatus} extensions={['.docx']} />
            </div>
            <div className="level-slider">
                <label>Image Quality: {quality}</label>
                <input type="range" min="10" max="100" step="5" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))}/>
                <div className="slider-labels">
                    <span>📉 Compress More</span>
                    <span>📖 Compress Less</span>
                </div>
            </div>

            <div className="output-select">
                <label>
                    <input
                        type="radio"
                        name="docxOutputType"
                        value="docx"
                        checked={outputType === 'docx'}
                        onChange={() => setOutputType('docx')}
                    />
                    Export as .docx
                </label>
                <label>
                    <input
                        type="radio"
                        name="docxOutputType"
                        value="7z"
                        checked={outputType === '7z'}
                        onChange={() => setOutputType('7z')}
                        />
                    Export as .docx.7z
                </label>
            </div>

            <button onClick={handleCompress} disabled={!file || status === 'uploading'}>
                {status === 'uploading' ? `Compressing... (${progress}%)` : '🔽 Compress'}
            </button>

            {status === 'done' && <p className="success-msg">✅ File compressed and downloaded!</p>}
            {status === 'error' && <p className="error-msg">❌ Compression failed</p>}
        </div>
        <section>
                <div className="compressor-page">
  <h2 className="compressor-heading">Compress DOCX File Online</h2>
  <p className="compressor-description">
    Reduce the size of your Microsoft Word (.docx) documents without affecting formatting or content. Ideal for faster sharing and storage.
  </p>

  <h2 className="compressor-subheading">How to Compress a DOCX File?</h2>
  <ol className="compressor-steps">
    <li>📂 Upload or drag & drop your <code>.docx</code> file</li>
    <li>🎚️ Choose your preferred image compression level</li>
    <li>🚀 Click <strong>Compress</strong> to begin the process</li>
    <li>⬇️ The compressed <code>.docx</code> will auto-download once ready</li>
  </ol>

  <h2 className="compressor-subheading">Why Use Our DOCX Compressor?</h2>
  <ul className="compressor-benefits">
    <li>📄 Keeps formatting, fonts, and layout intact</li>
    <li>📉 Reduces file size by compressing embedded images</li>
    <li>🔐 Your document remains secure and private</li>
    <li>⚡ Fast processing with automatic download</li>
  </ul>
</div>
            <section>
  <div className="compressor-article">
    <h2>Everything You Need to Know About DOCX Compression</h2>

    <h3>📄 What is a DOCX File?</h3>
    <p>
      DOCX is the default file format used by Microsoft Word. It contains formatted text, images, tables,
      styles, and other elements. While DOCX files are more efficient than the older DOC format, they can
      still become large—especially when filled with images or embedded objects.
    </p>

    <h3>📦 Why Do DOCX Files Get So Large?</h3>
    <p>
      DOCX files often grow in size due to high-resolution images, embedded fonts, custom graphics, and
      media. Reports, resumes, portfolios, or academic papers with multiple elements can easily cross
      size limits for emails or cloud uploads.
    </p>

    <h3>💡 Benefits of Compressing DOCX Files</h3>
    <ul>
      <li><strong>📤 Easier Sharing</strong> – Send documents faster through email or messaging apps</li>
      <li><strong>💾 Save Storage</strong> – Free up space on your computer, drive, or device</li>
      <li><strong>⚡ Faster Load Times</strong> – Open large documents more smoothly</li>
      <li><strong>📱 Better Mobile Experience</strong> – Smaller files open faster on mobile devices</li>
    </ul>

    <h3>🛠️ How Our DOCX Compressor Works</h3>
    <p>
      Our tool analyzes your DOCX file and compresses embedded images, removes unnecessary metadata, and
      restructures internal elements for maximum size reduction—all while preserving your document’s
      layout and formatting. Upload, compress, and download instantly.
    </p>

    <h3>🔐 Is it Safe to Compress DOCX Files Online?</h3>
    <p>
      Yes, your document is processed safely in your browser or over an encrypted connection. We do not
      store or access your files, and everything is deleted after compression.
    </p>
    <ul>
      <li>🔒 No file storage</li>
      <li>🔐 Secure processing</li>
      <li>♻️ Automatic cleanup after processing</li>
    </ul>

    <h3>🔚 Final Thoughts</h3>
    <p>
      DOCX is one of the most commonly used formats for documentation. If your Word files are too large
      to share or store comfortably, compressing them is a quick and effective solution. Try our DOCX
      compressor today—it's fast, secure, and completely free.
    </p>

    <h2>📚 Frequently Asked Questions</h2>

    <h3>❓ What types of DOCX files can I compress?</h3>
    <p>
      You can compress any standard DOCX file, including resumes, reports, academic papers, or brochures
      created in Microsoft Word or similar apps.
    </p>

    <h3>❓ Will compression affect formatting or layout?</h3>
    <p>
      No. Your original structure, fonts, and formatting will remain intact. Only image sizes and
      redundant data are reduced.
    </p>

    <h3>❓ Can I download the file as a  .7z?</h3>
    <p>
      Yes! After compression, you can choose to export the file as a .docx, .docx.zip, or .docx.7z archive
      for maximum portability.
    </p>
  </div>
</section>

        </section>
    </>
    );
};

export default DocxCompressor;
