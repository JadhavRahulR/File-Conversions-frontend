import React, { useState } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';
const BASE_URL = import.meta.env.VITE_BASE_URL
const CsvCompressor = () => {
    const [file, setFile] = useState(null);
    const [compressionLevel, setCompressionLevel] = useState(19);
    const [status, setStatus] = useState('idle');

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

        const formData = new FormData();
        formData.append('file', file);
        formData.append('level', compressionLevel);

        try {
            const response = await axios.post(`${BASE_URL}/compress-csv'`, formData, {
                responseType: 'blob',
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
            <ScrollToTop />
            <div className="compressor-container" onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
                <h2>CSV Compressor</h2>
                <label htmlFor="csvInput" className="file-label">
                    {file ? `✅ Selected: ${file.name}` : '📂Drag and Drop or  Click here  to select a .csv file'}
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
                        <span>📦 Smaller File</span>
                    </div>
                </div>


                <button
                    onClick={handleCompress}
                    disabled={!file || status === 'uploading'}
                    className="compress-btn"
                >
                    {status === 'uploading' ? 'Compressing...' : '🔽 Compress CSV'}
                </button>

                {status === 'done' && <p className="success-msg">✅ Compression complete. File downloaded.</p>}
                {status === 'error' && <p className="error-msg">❌ Compression failed. Try again.</p>}
            </div>
            <section>
                <div className="compressor-page">
                    <h1 className="compressor-heading">Compress CSV File Online</h1>
                    <p className="compressor-description">
                        Quickly reduce the size of your CSV files without altering the data. Ideal for large spreadsheet exports or data backups.
                    </p>

                    <h2 className="compressor-subheading">How to Compress a CSV File?</h2>
                    <ol className="compressor-steps">
                        <li>📂 Upload or drag & drop your <code>.csv</code> file</li>
                        <li>⚙️ Choose your preferred compression level</li>
                        <li>🚀 Click <strong>Compress</strong> to process the file</li>
                        <li>⬇️ Auto Download the compressed <code>.csv</code> file</li>
                    </ol>

                    <h2 className="compressor-subheading">Why Use Our CSV Compressor?</h2>
                    <ul className="compressor-benefits">
                        <li>📉 Reduces file size without losing data</li>
                        <li>🔒 Your CSV stays secure and private</li>
                        <li>⚡ Fast processing with instant download</li>
                        <li>🖥️ Works on all devices with a browser</li>
                    </ul>
                </div>


            </section>
        </>
    );
};

export default CsvCompressor;
