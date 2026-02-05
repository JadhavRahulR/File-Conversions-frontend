import React, { useState } from "react";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import "./urltofile.css";
import { Helmet } from "react-helmet-async";
import ScrollToTop from "./ScrollToTop";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PdfUrlToPdf() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadedFile, setDownloadedFile] = useState(null);
  const [fileName, setFileName] = useState(""); // â† custom filename

  const handleDownload = async () => {
    if (!url) return alert("Please enter PDF URL");

    if (url.startsWith("file://")) {
      alert("Local file links are not supported.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/pdf-url-to-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl: url }),
      });

      const blob = await res.blob();

      // ðŸ‘‰ Use user filename or fallback
      const finalName = fileName.trim() !== "" ? fileName : "downloaded";
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${finalName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // ðŸ‘‰ Prepare file object for Google Drive upload
      const fileObj = new File([blob], `${finalName}.pdf`, {
        type: "application/pdf",
      });
      setDownloadedFile(fileObj);

      URL.revokeObjectURL(blobUrl);

    } catch (err) {
      console.error("Error fetching PDF:", err);
      alert("Failed to download PDF");
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>PDF URL To PDF | Convert PDF Link To PDF Online Free</title>

        <meta name="description" content="PDF URL to PDF Converter - Paste any direct PDF link and instantly download the PDF file. Simple, Fast & Free tool to convert a PDF URL into a PDF document." />
        <link rel="canonical" href="https://fileunivers.com/urlpdf" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="pdf url to pdf,convert pdf url to pdf,download pdf from url,pdf link to pdf,convert link to pdf file,pdf url downloader,get pdf from link,extract pdf from url"/>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      {/* <Helmet */}
      <ScrollToTop/>
     <div className="file-page">

  <div className="urlHeading">
    <h1>PDF URL To PDF - Convert Any PDF Link to a Downloadable PDF</h1>
    <p className="url-intro">
      Convert any PDF URL into a real PDF file instantly with our free PDF URL to PDF tool. 
      Just paste the direct PDF link, click download, and get the exact same PDF saved to your device. 
      No signup, no watermark, and super fast. This tool is perfect when you find a PDF online but 
      cannot download it directly, or when a website only gives you a view-only PDF link. 
      Our converter fetches the original PDF securely and lets you download it in one click.
    </p>
  </div>

  <div className="file-container">

    <div className="input-wrapper">
      <div className="url-input-box">
        <input
          type="text"
          value={url}
          placeholder="Paste PDF link hereâ€¦"
          className="file-input"
          onChange={(e) => setUrl(e.target.value)}
        />

        {url && (
          <button
            className="clear-btn"
            onClick={() => {
              setUrl("");
              setDownloadedFile(null);
            }}
          >
            âœ–
          </button>
        )}
      </div>

      <input
        type="text"
        className="file-input "
        placeholder="Give file name without extention"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
    </div>

    <button className="file-button" onClick={handleDownload} disabled={loading}>
      {loading ? "Fetchingâ€¦" : "Download PDF"}
    </button>

    {downloadedFile && (
      <div className="save-drive-section">
        <SaveToGoogleDrive file={downloadedFile} />
      </div>
    )}
  </div>

  <section className="urlpagecontainer">

    <div className="pageImg">
      <div>
        <img src="link.png" alt="PDF URL" />
        <p>PDF URL</p>
      </div>
      <p> --â†’ </p>

      <div>
        <img src="pdf.png" alt="PDF File" />
        <p>PDF</p>
      </div>
    </div>

    <p>
      Many websites allow you to view a PDF online but do not give you a direct download option. 
      Sometimes the PDF opens in the browser, or the link only displays the document instead of letting 
      you download it. That’s exactly where a <strong>PDF URL to PDF converter</strong> becomes useful. 
      With this tool, you can paste any direct PDF link and instantly download the original PDF file to 
      your device without restrictions, loading issues, or page errors.
    </p>

    <h2>What Does PDF URL to PDF Mean?</h2>
    <p>
      PDF URL to PDF simply means taking a link that points to a PDF file and converting it into an 
      actual downloadable PDF document. Instead of opening the document inside the browser, the tool 
      fetches the file securely and provides a clean PDF that you can save, share, or use offline. 
      Many people also call this:
    </p>

    <ul>
      <li>PDF Link to PDF</li>
      <li>Download PDF from URL</li>
      <li>Convert PDF URL to File</li>
    </ul>

    <p>
      This process requires no sign-up, no technical knowledge, and works on any modern browser.
    </p>

    <h2>Why Convert a PDF URL Into a PDF File?</h2>

    <p>Here are the most common reasons people use this tool:</p>

    <ul>
      <li><strong>Direct Download:</strong> Some websites block the download button   —this tool bypasses that.</li>
      <li><strong>Offline Access:</strong> Save PDFs from links so you can read them without internet.</li>
      <li><strong>Fast Saving:</strong> Instead of opening the PDF in a new tab, instantly download it.</li>
      <li><strong>Better File Management:</strong> Store PDFs locally on your device for quick access.</li>
      <li><strong>Perfect for Students & Professionals:</strong> Notes, books, assignments, invoices, and reports.</li>
    </ul>

    <h2>How to Convert a PDF URL to PDF (Simple Steps)</h2>

    <p>Many users search for <strong>how to download PDF from link</strong> or <strong>PDF URL to file</strong>. 
    Using this tool is extremely simple:</p>

    <ol>
      <li>Copy any direct PDF link or PDF URL.</li>
      <li>Paste it into the converter input box.</li>
      <li>The tool fetches the PDF securely from the source.</li>
      <li>You get a clean, downloadable PDF file instantly.</li>
    </ol>

    <p>
      That’s all   —no software installation or extra steps required.
    </p>

    <h2>How PDF URL to PDF Works (Simple Explanation)</h2>

    <p>
      When you paste a PDF link, the tool sends a request to the original server hosting the PDF. 
      If the document is publicly accessible, the tool retrieves the PDF file and allows you to 
      download it directly. This is especially helpful for:
    </p>

    <ul>
      <li>Public study materials</li>
      <li>Government PDFs</li>
      <li>Online forms and brochures</li>
      <li>E-books and manuals</li>
      <li>Company documents shared via links</li>
    </ul>

    <p>
      As long as the link ends with <strong>.pdf</strong>, the tool can convert and download it.
    </p>

    <h2>Who Uses the PDF URL to PDF Tool?</h2>

    <ul>
      <li><strong>Students</strong> - Download notes, books, and assignments from online links.</li>
      <li><strong>Teachers</strong> - Save PDFs shared through URLs for offline use.</li>
      <li><strong>Professionals</strong> - Download invoices, contracts, and forms quickly.</li>
      <li><strong>Businesses</strong> - Save important documents shared via online PDF links.</li>
      <li><strong>Researchers</strong> - Download study papers and reference PDFs.</li>
    </ul>

    <p>
      Converting a PDF URL into a PDF file makes saving online documents extremely easy. 
      Many users struggle when a website only lets them view a PDF instead of downloading it. 
      With this tool, you can bypass that limitation and instantly fetch the original PDF without 
      any hassle. Whether you're wondering 
      <strong>how to download PDF from URL</strong>, 
      <strong>how to convert PDF link into PDF</strong>, or 
      <strong>how to save PDF opened in browser</strong>, 
      this tool gives you the fastest and simplest solution.
    </p>

  </section>

</div>
    </>
  );
}
