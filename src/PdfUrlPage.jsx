import "./UrlPages.css";
import React, { useState } from "react";
import axios from "axios";
import DriveFileInput from './DriveFileInput';
import DropboxFileInput from './DropboxFileInput';
import DropzoneInput from "./DropzoneInput";
import { Helmet } from "react-helmet-async";
import ScrollToTop from "./ScrollToTop";
import SaveToGoogleDrive from "./SaveToGoogleDrive";


const BASE_URL = import.meta.env.VITE_BASE_URL
export default function PdfUrlPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Upload");
  const [file, setFile] = useState(null);
  const [downloadedFile, setDownloadedFile] = useState(null);


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setFileUrl("");
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first!");
      return;
    }

    setLoading(true);
    setError("");
    setFileUrl("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFileUrl(res.data.fileUrl);
      //       const blob = await res.blob();
      // const fileObj = new File([blob], fileName, { type: "application/pdf" });
      // setDownloadedFile(fileObj);


    } catch (err) {
      console.error(err);
      setError("   ❌ Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy!");
      });
  };


  return (
    <>
      <Helmet>
        <title>Make PDF Into a Link | Turn PDF Into Url Free</title>
        <meta name="description" content="Make a PDF into URL or Link , Convert PDF into hyperlink or into website link.These is Online and Free Tool." />
        <link rel="canonical" href="https://fileunivers.com/pdfurl" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="how to turn a pdf into a link,how to turn pdf into a link,how to make pdf into a link,how to make a pdf into a url,make a pdf into a website link,turn a pdf into a url,convert a pdf into a link,convert a pdf into a url,make a pdf into a web link,turn pdf into link " />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>
      <ScrollToTop />
      <div className="file-page">
        <div className="urlHeading">

          <h1>Convert PDF Into Link - Turn PDF File Into URL</h1>
          <p>
            Instead of sending the full file, you upload your PDF once and receive a clean,
            shareable link that works anywhere. Whether you’re a student, teacher, freelancer,
            or business owner, turning a PDF into a link saves time, storage, and effort.
          </p>
        </div>
        <div className="file-container">
          <h2 className="file-title"> Upload PDF & Create Shareable URL</h2>

          {/* File input */}
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file-input"
          />
          <div className="fileuploadcontainer">
            <div className="drive">
              <DriveFileInput onFilePicked={setSelectedFile} setStatus={setStatus} allowedTypes={['.pdf']} />
            </div>
            <DropboxFileInput onFilePicked={setSelectedFile} setStatus={setStatus} extensions={['.pdf']} />
          </div>
          <DropzoneInput acceptedType={['.pdf']} file={selectedFile} onFileAccepted={setSelectedFile} setStatus={setStatus} />

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="file-button"
          >
            {loading ? "Uploading..." : "Generate File URL"}
          </button>

          {/* Error message */}
          {error && <p className="file-error">{error}</p>}

          {/* Success message */}
          {fileUrl && (
            <div className="file-success">
              <p><strong>✅ File Uploaded Successfully!</strong></p>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                {fileUrl}
              </a>
              <div>

                <button
                  onClick={() => copyToClipboard(fileUrl)}
                  className="copy-btn"
                >
                  Copy URL
                </button>
              </div>
            </div>

          )}




        </div>

        <section className="urlpagecontainer">

          <div className="pageImg">
            <div>
              <img src="pdf.png" alt="" />
              <p>PDF</p>
            </div>
            <p > â†’ </p>

            <div>
              <img src="link.png" alt="" />
              <p>Url</p>
            </div>
          </div>


          <p>
            Sharing documents should be simple. But sometimes, sending a PDF through email,
            WhatsApp, or social media becomes difficult because the file is too large or takes too long to upload.
            That’s exactly why a <strong>PDF to URL converter</strong> is so useful.
          </p>



          <h2>What Does PDF to URL Actually Mean?</h2>
          <p>
            PDF to URL simply means turning your PDF into a unique online link.
            Once the file is uploaded, the tool creates a URL that anyone can click to view or download the PDF.
            Many people also call this:
          </p>

          <ul>
            <li>PDF to Link</li>
            <li>PDF to Weblink</li>
            <li>Create URL for PDF</li>
          </ul>

          <p>
            No technical skills needed   —just upload the file and copy the link.
          </p>

          <h2>Why Convert PDF Into a Link?</h2>

          <p>Here are the biggest advantages:</p>

          <ul>
            <li><strong>Easy Sharing:</strong> One link works everywhere   —WhatsApp, email, Facebook, Instagram, or even your website.</li>
            <li><strong>No Storage Issues:</strong> Receivers don’t need to download the entire file unless they want to.</li>
            <li><strong>Faster Uploading:</strong> Upload once, share unlimited times.</li>
            <li><strong>Perfect for Websites:</strong> Just embed the URL instead of uploading a heavy PDF.</li>
            <li><strong>Works on Any Device:</strong> Mobile, tablet, or laptop   —everything supports URLs.</li>
          </ul>

          <h2>How to Turn PDF Into a Link (Simple Steps)</h2>

          <p>Most people search for <strong>how to turn PDF into link</strong>, and it’s actually very easy:</p>

          <ol>
            <li>Upload your PDF to a PDF-to-URL converter.</li>
            <li>The tool processes your file securely.</li>
            <li>You get a unique, shareable link.</li>
            <li>Copy the link and share it anywhere.</li>
          </ol>

          <p>
            That’s it! No complicated setup or account required.
          </p>

          <h2>How to Convert a Link into URL (Simple Explanation)</h2>

          <p>
            Many users ask, <strong>“how to convert a link into URL?”</strong>
            Technically, a <strong>link and URL are the same</strong>.
            A URL is simply the written address, and a link is the clickable form of that URL.
          </p>

          <p>
            So when you generate a PDF link using this tool, you actually receive a full URL that you can
            paste anywhere. Anyone who clicks it can instantly access your PDF.
          </p>

          <h2>How to Turn PDF Into Weblink for Websites</h2>

          <p>
            If you're a blogger or website owner, converting PDF to weblink is perfect.
            You can attach the link to:
          </p>

          <ul>
            <li>Download buttons</li>
            <li>Blog posts</li>
            <li>HTML anchor tags</li>
            <li>Contact forms</li>
          </ul>

          <p>
            It makes your website faster and more SEO-friendly since you avoid uploading heavy files.
          </p>

          <h2>Who Uses PDF to URL?</h2>

          <ul>
            <li><strong>Students</strong> - Share notes and assignments quickly</li>
            <li><strong>Teachers</strong> - Provide study materials through one link</li>
            <li><strong>Businesses</strong> - Send proposals, invoices, brochures</li>
            <li><strong>Freelancers</strong> - Share portfolios and documents professionally</li>
            <li><strong>Websites</strong> - Provide downloadable PDFs without slowing pages</li>
          </ul>



          <p>
            So, Converting PDF to URL is one of the easiest ways to share documents online.
            Instead of sending large files, you can turn your PDF into a clean, accessible link
            and share it anywhere instantly.
            If you’ve been wondering
            <strong>how to turn pdf into link</strong>,
            <strong>how to turn pdf into weblink</strong>, or
            <strong>how to convert a link into url</strong>,
            this tool gives you the simplest possible solution.
          </p>

        </section>

      </div>

    </>
  );
}