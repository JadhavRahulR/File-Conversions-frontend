import React, { useState } from "react";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import ScrollToTop from "./ScrollToTop";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function WebpageToPdf() {
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");   // ⭐ Custom name
  const [loading, setLoading] = useState(false);
  const [downloadedFile, setDownloadedFile] = useState(null);

  const handleConvert = async () => {
    if (!url) return alert("Please enter webpage URL");

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/link-to-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const blob = await res.blob();

      // ⭐ FINAL PDF NAME
      const finalName = fileName?.trim() !== "" ? `${fileName}.pdf` : "webpage.pdf";

      // ⭐ DOWNLOAD TO LOCAL
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = finalName;
      link.click();
      link.remove();

      // ⭐ PREPARE FOR GOOGLE DRIVE
      const fileObj = new File([blob], finalName, { type: "application/pdf" });
      setDownloadedFile(fileObj);

    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    }

    setLoading(false);
  };

  return (
    <>
    <ScrollToTop/>
      <div className="url-tool-wrapper">
        <h1 className="tool-title">Webpage To PDF | Convert Link Into PDF</h1>

        {/* URL Input */}
        <div className="inputvalutandbtn">
          <input
            type="text"
            placeholder="Enter webpage URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="url-input"
          />
          {url && (
            <button
              className="clear-btn"
              onClick={() => {
                setUrl("");
                setDownloadedFile(null);
              }}
            >
              ✖
            </button>
          )}
        </div>

        {/* PDF Name Input */}
        <div className="inputvalutandbtn" style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Enter PDF name (optional)"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="url-input"
          />
        </div>

        <button 
          onClick={handleConvert} 
          disabled={loading} 
          className="download-btn"
        >
          {loading ? "Converting…" : "Convert to PDF"}
        </button>

        {/* ⭐ Save to Google Drive */}
        {downloadedFile && (
          <div className="save-drive-section">
            <SaveToGoogleDrive file={downloadedFile} />
          </div>
        )}
      </div>
      <div className="url-tool-wrap">
  <h2 className="tool-title">Webpage to PDF Converter</h2>

  <p className="tool-description">
    The Webpage to PDF tool allows you to convert any website, article, blog, or online 
    document into a clean and high-quality PDF file. Whether you want to save a webpage 
    for offline reading, create a permanent snapshot of an online source, or share a 
    formatted version of a webpage with others, this tool provides an easy and reliable 
    way to generate downloadable PDFs from URLs. Simply enter the link of the webpage 
    you want to convert, click the convert button, and the tool will automatically fetch, 
    process, and generate a PDF copy of that page for you.
  </p>

  <section className="tool-section">
    <h2 className="tool-subheading">Why Convert a Webpage to PDF?</h2>
    <p className="tool-paragraph">
      Many websites today contain valuable information such as news articles, tutorials, 
      research material, forms, blog posts, and product documentation. However, webpages 
      can be changed, deleted, or updated anytime. Saving the page as a PDF ensures that 
      you always keep a permanent, uneditable copy of the information as it existed at 
      the time you downloaded it. This is especially useful for students, researchers, 
      professionals, and even everyday users who want to keep important content for 
      future reference. PDF files are also easier to print, share, and organize compared 
      to bookmarking pages or taking screenshots.
    </p>
  </section>

  <section className="tool-section">
    <h2 className="tool-subheading">How This Tool Works</h2>
    <p className="tool-paragraph">
      When you paste a URL into the input field, the tool fetches the HTML content of 
      the website using a secure backend request. The webpage is then processed, cleaned, 
      and converted into a PDF document using an optimized rendering engine. Dynamic 
      elements like animations or scripts are removed to ensure a clean output, while 
      text, images, layout, and styling remain preserved as much as possible. Once the 
      conversion is complete, you can download the PDF instantly or save it directly to 
      Google Drive using the integrated Save to Drive feature. This makes the process 
      simple, fast, and accessible from any device.
    </p>
  </section>

  <section className="tool-section">
    <h2 className="tool-subheading">Key Features</h2>
    <ul className="tool-list">
      <li>✔ Convert any public webpage URL into a full PDF document</li>
      <li>✔ Clean layout with preserved formatting, text, and images</li>
      <li>✔ Fast processing using optimized backend conversion</li>
      <li>✔ Save the generated PDF to your device or Google Drive</li>
      <li>✔ Works on mobile, tablet, and desktop browsers</li>
      <li>✔ No installation or login required</li>
      <li>✔ Supports blogs, articles, documentation, and more</li>
      <li>✔ Privacy-friendly—your data is not stored on our servers</li>
    </ul>
  </section>

  <section className="tool-section">
    <h2 className="tool-subheading">Benefits of Using Webpage to PDF</h2>
    <p className="tool-paragraph">
      This tool is perfect for preserving content exactly as it appears on the internet. 
      Whether you want to store research notes, share an article, keep a record of online 
      information, or create a PDF version of your own website design for printing or 
      submission, this tool covers all use cases. PDFs provide consistent formatting on 
      every device, unlike webpages that can change appearance across different screens. 
      By converting webpages into PDFs, you ensure that the content remains unchanged, 
      easy to print, and accessible offline at any time.
    </p>
  </section>

  <section className="tool-section">
    <h2 className="tool-subheading">How to Use</h2>
    <ul className="tool-list">
      <li>• Copy the URL of the webpage you want to convert</li>
      <li>• Paste the link into the input field above</li>
      <li>• Click the "Convert to PDF" button</li>
      <li>• Wait a few seconds while the PDF is generated</li>
      <li>• Download the file or upload it to Google Drive</li>
    </ul>
  </section>

  <section className="tool-section">
    <h2 className="tool-subheading">Supported Content Types</h2>
    <p className="tool-paragraph">
      The Webpage to PDF tool supports most modern websites, including news articles, 
      blogs, educational content, online resumes, documentation sites, tutorials, and 
      product guides. While extremely dynamic websites containing videos, animations, 
      or interactive components may display simplified layouts, the tool ensures that 
      the main textual and visual content remains preserved in the generated PDF.
    </p>
  </section>

  <p className="tool-paragraph">
    This Webpage to PDF converter has been designed to deliver the best possible 
    balance between speed, accuracy, and readability. Whether you’re storing content 
    for offline access, printing documents, sharing professional work, or saving 
    important information for later study, this tool gives you a reliable and efficient 
    way to convert any webpage into a polished PDF file with just one click.
  </p>
</div>

        </>
    
  );
}
