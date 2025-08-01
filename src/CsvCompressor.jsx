import React, { useState } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';
import ScrollToTop from './ScrollToTop';
import { Helmet } from 'react-helmet-async';
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
        <Helmet>
          <title>Compress CSV | Reduce CSV File Size Online Free</title>
<meta name="description" content="Compress your CSV files online to reduce file size quickly and securely. Free CSV compressor with no signup or software required." />
<link rel="canonical" href="https://fileunivers.in/compress-csv" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="compress csv, csv file compressor, reduce csv file size, online csv compression, shrink csv, free csv compressor" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

        </Helmet>
            <ScrollToTop />
            <div className="compressor-container" onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
                <h1>CSV Compressor</h1>
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
                    <h2 className="compressor-heading">Compress CSV File Online</h2>
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

                    <section>

  <div className="compressor-article">
    <h2>Everything You Need to Know About CSV Compression</h2>

    <h3>📄 What is a CSV File?</h3>
    <p>
      CSV stands for <strong>Comma-Separated Values</strong>, a simple text format used to store tabular
      data. It’s widely supported across applications like Excel, Google Sheets, databases, and more.
      Each line represents a row, and values are separated by commas.
    </p>

    <h3>🧮 Why Are Some CSV Files So Large?</h3>
    <p>
      While CSV is a plain text format, large datasets—such as financial records, analytics exports, or
      logs—can contain thousands of rows and columns. Uncompressed, these files grow quickly and are
      difficult to manage or share.
    </p>

    <h3>💡 Benefits of Compressing CSV Files</h3>
    <ul>
      <li><strong>🚀 Faster Uploads & Downloads</strong> – Share large files easily via email or cloud</li>
      <li><strong>📤 Efficient Storage</strong> – Reduce data consumption on servers or local devices</li>
      <li><strong>📁 Easy Archiving</strong> – Store historical data in compressed archives</li>
      <li><strong>🔐 Secure & Private</strong> – Your data never leaves your browser or device</li>
    </ul>

    <h3>🛠️ How Our CSV Compressor Works</h3>
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
      <li>🔒 Is not stored on any server</li>
      <li>🔐 Is not accessed by anyone</li>
      <li>♻️ Is deleted automatically after processing</li>
    </ul>


    <h3>🔚 Final Thoughts</h3>
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
