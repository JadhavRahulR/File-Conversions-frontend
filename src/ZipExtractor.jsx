import React, { useState } from "react";
import axios from "axios";
import "./ZipExtractor.css";

const BASE_URL = import.meta.env.VITE_BASE_URL
const ZipExtractor = () => {
  const [zipFile, setZipFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setZipFile(e.target.files[0]);
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!zipFile) return alert("Please upload a .zip file");

    const formData = new FormData();
    formData.append("file", zipFile);

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/extract-zip`, formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "unzipped_files.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Extraction failed", err);
      alert("Extraction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="extract-container">
      <h2>Extract ZIP Archive</h2>

      <input type="file" accept=".zip" onChange={handleFileChange} className="file-input" />

      <button onClick={handleExtract} disabled={loading}>
        {loading ? "Extracting..." : "Extract ZIP"}
      </button>
    </div>
  );
};

export default ZipExtractor;
