import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';

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
        <ScrollToTop/>
        <div
            className="compressor-container drop-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            >
            <h2>DOCX Compressor</h2>

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
  <h1 className="compressor-heading">Compress DOCX File Online</h1>
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

        </section>
    </>
    );
};

export default DocxCompressor;
