import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CsvCompressor.css';
import DropboxFileInput from './DropboxFileInput'
import DriveFileInput from './DriveFileInput';

const BASE_URL = import.meta.env.VITE_BASE_URL
const PptxCompressor = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(30);
  const [outputType, setOutputType] = useState('pptx');
  const [status, setStatus] = useState('idle');
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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);
    formData.append('outputType', outputType);

    try {
      const response = await axios.post(`${BASE_URL}/compress-pptx`, formData, {
        responseType: 'blob',
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
    <div
      className="compressor-container drop-area"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2>PPTX Compressor</h2>

      <p className="file-label clickable-label"
        onClick={() => fileInputRef.current.click()}>
        {file ? `✅ Selected: ${file.name}` : '📂 Drag & drop a .pptx file here, or click to select'}
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
          <span>📉 Smaller</span>
          <span>📸 Clearer</span>
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
        {status === 'uploading' ? 'Compressing...' : '🔽 Compress'}
      </button>

      {status === 'done' && <p className="success-msg">✅ File compressed and downloaded!</p>}
      {status === 'error' && <p className="error-msg">❌ Compression failed</p>}
    </div>
  );
};

export default PptxCompressor;
