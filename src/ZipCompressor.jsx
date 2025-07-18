import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./ZipCompressor.css"; // 👈 custom styles here

const BASE_URL = import.meta.env.VITE_BASE_URL
const ZipCompressor = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one file.");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/convert-to-zip`, formData, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed_files.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      alert("ZIP creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zip-container">
      <h2>Convert Files to ZIP</h2>

      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        <p>{isDragActive ? "Drop your files here..." : "Drag & drop files here, or click to browse"}</p>
      </div>

      {files.length > 0 && (
        <ul className="file-list">
          {files.map((f, i) => (
            <li key={i}>📄 {f.name}</li>
          ))}
        </ul>
      )}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Compressing..." : "Create ZIP"}
      </button>
    </div>
  );
};

export default ZipCompressor;
