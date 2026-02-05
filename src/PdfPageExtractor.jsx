// File: PdfPageExtractor.jsx
import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import "./PdfTools.css";
import ScrollToTop from "./ScrollToTop";
import { Helmet } from "react-helmet-async";
import DropboxFileInput from "./DropboxFileInput";
import DriveFileInput from "./DriveFileInput";
import { useRef, useEffect } from "react";
import SaveToGoogleDrive from "./SaveToGoogleDrive";
import SaveToDropbox from "./SaveToDropbox";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export function PdfPageExtractor() {
  const previewRef = useRef(null);

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("upload");
  const [pagePreviews, setPagePreviews] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [error, setError] = useState("");
  const [downloadedFile, setDownloadedFile] = useState(null);

  /* ---------- FILE SELECT ---------- */
  const handleFile = (pdfFile) => {
    if (!pdfFile) return;

    const isPdf =
      pdfFile.type === "application/pdf" ||
      pdfFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Please upload a valid PDF file.");
      return;
    }

    setError("");
    setFile(pdfFile);
    setSelectedPages([]);
    setDownloadedFile(null);
    renderPdfPreviews(pdfFile);
  };

  const handleFileSelect = (e) => handleFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  /* ---------- RENDER PREVIEWS ---------- */
  const renderPdfPreviews = async (pdfFile) => {
    try {
      setStatus("rendering");
      const buffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      const previews = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(150 / viewport.width, 200 / viewport.height);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const scaledViewport = page.getViewport({ scale });
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        await page.render({
          canvasContext: ctx,
          viewport: scaledViewport,
        }).promise;

        previews.push({
          pageNumber: i,
          image: canvas.toDataURL("image/png"),
        });
      }

      setPagePreviews(previews);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setError("Failed to read PDF file");
      setStatus("upload");
    }
  };

  /* ---------- SELECT PAGE ---------- */
  const togglePage = (pageNumber) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  /* ---------- EXTRACT PAGES ---------- */
  const extractPages = async () => {
    if (!file || selectedPages.length === 0) return;

    try {
      setStatus("extracting");

      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      for (const pageNum of selectedPages.sort((a, b) => a - b)) {
        const [page] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
        newPdf.addPage(page);
      }

      const pdfBytes = await newPdf.save();

      const extractedFile = new File(
        [pdfBytes],
        "extracted-pages.pdf",
        { type: "application/pdf" }
      );

      setDownloadedFile(extractedFile);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setError("Failed to extract pages");
      setStatus("ready");
    }
  };

  /* ---------- AUTO DOWNLOAD (ONCE) ---------- */
  useEffect(() => {
    if (status === "done" && downloadedFile) {
      const url = URL.createObjectURL(downloadedFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadedFile.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [status, downloadedFile]);

  /* ---------- SCROLL TO PREVIEW ---------- */
  useEffect(() => {
    if (pagePreviews.length > 0 && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pagePreviews]);
  return (
    <>
      <Helmet>
        <title>PDF Page Extractor | PDF Document Extractor</title>
        <meta name="description" content="Extract selected pages from PDF files easily and securely. Free online PDF page extractor to split, save, or remove pages with no signup required." />
        <link rel="canonical" href="https://fileunivers.com/pdfextractor" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="pdf page extractor, extract pages from pdf, split pdf pages, remove pdf pages, select pdf pages, free pdf page extractor, secure pdf extractor" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </Helmet>

      <ScrollToTop />

      <div className="pagetitle">

        <h1>PDF Page Extractor - Extract Selected Pages from PDF Online</h1>

        <p className="intro-paragraph">
          PDF Page Extractor is a fast and easy online tool that allows you to extract specific pages from any PDF file in just a few clicks. Whether you want to save selected pages, remove unnecessary content, or split a large PDF into smaller files, this tool helps you do it securely and efficiently. No software installation is required   —simply upload your PDF, preview the pages, choose the ones you need, and download a new PDF instantly with perfect quality.
        </p>
      </div>

      <div className="tool-container"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h2>Upload PDF and select Pages to Extract</h2>

        <input
          type="file"
          accept="application/pdf"
          className="file-input"
          onChange={handleFileSelect}
        />

        <div className="fileuploadcontainer">
          <DriveFileInput
            onFilePicked={handleFile}
            setStatus={setStatus}
            allowedTypes={[".pdf"]}
          />
          <DropboxFileInput
            onFilePicked={handleFile}
            setStatus={setStatus}
            extensions={[".pdf"]}
          />
        </div>


        <div>
          <div className="file-status-text">
  {!file ? (
    <p className="selectFile">   📂 Drag & Drop PDF here</p>
  ) : (
    <>
      <p className="selectFile">✅ Selected File:</p>
      <p className="file-name">{file.name}</p>
    </>
  )}
</div>

        </div>

        {error && <p className="error">{error}</p>}

        {status === "done" && downloadedFile && (
          <>
            <p style={{color:"white",marginTop:'30px'}}>Save To . . .</p>
            <div className="saveTo">
              <SaveToGoogleDrive file={downloadedFile} />
              <SaveToDropbox file={downloadedFile} />
            </div>
          </>
        )}
      </div>

      {pagePreviews.length > 0 && (
        <div className="pages-box" ref={previewRef}>
          <h3>Select Pages to Extract</h3>

          <div className="pages-preview-grid">
            {pagePreviews.map((p) => (
              <div
                key={p.pageNumber}
                className={`page-preview ${
                  selectedPages.includes(p.pageNumber) ? "active" : ""
                }`}
                onClick={() => togglePage(p.pageNumber)}
              >
                <img src={p.image} alt={`Page ${p.pageNumber}`} />
                <span>Page {p.pageNumber}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pagePreviews.length > 0 && (
        <div className="action-buttons">
          <button
            onClick={extractPages}
            className="extract-btn"
            disabled={selectedPages.length === 0 || status === "extracting"}
          >
            {status === "extracting"
              ? "Extracting..."
              : selectedPages.length === 0
              ? "Select pages first"
              : "Extract Pages"}
          </button>
        </div>
      )}


      {pagePreviews.length === 0 && (
        <div className="pdf-extractor-container">
          <p className="intro">
            PDF Page Extractor is a powerful and easy-to-use online tool that allows
            you to extract specific pages from a PDF file without affecting the
            original quality. Whether you want to save a few important pages, remove
            unnecessary content, or split a large PDF into smaller files, this tool
            helps you complete the task quickly and securely. It works directly in
            your browser, so there is no need to install any software or create an
            account.
          </p>
          <div className="deletpdfimg">
            <img src="pdf.png" alt="" />
          </div>

          <p>
            Many users deal with large PDF documents such as eBooks, reports,
            invoices, study materials, or legal files where only certain pages are
            required. Instead of sharing the entire document, PDF Page Extractor
            lets you select only the pages you need and download them as a new PDF.
            This saves storage space, reduces file size, and makes document sharing
            more efficient.
          </p>

          <h2>How PDF Page Extractor Works</h2>
          <p>
            Using the PDF Page Extractor is simple and straightforward. First,
            upload your PDF file using the upload button or drag-and-drop feature.
            Once the file is loaded, you will see a preview or list of pages. Select
            the page numbers you want to extract, and click the extract button.
            Within seconds, a new PDF file containing only the selected pages will
            be generated and ready for download.
          </p>

          <p>
            The tool is designed to be user-friendly for both beginners and
            professionals. Even if you have never worked with PDF editing tools
            before, you can extract pages effortlessly. The interface is clean,
            responsive, and optimized for desktop as well as mobile devices.
          </p>

          <h2>Key Features</h2>
          <ul className="features">
            <li>Extract selected pages from PDF files</li>
            <li>Remove unwanted pages easily</li>
            <li>Split large PDFs into smaller documents</li>
            <li>No software installation required</li>
            <li>Works on all devices and browsers</li>
            <li>Secure processing with privacy protection</li>
          </ul>

          <p>
            One of the biggest advantages of this PDF Page Extractor is that your
            files are processed securely. Your documents are not stored permanently
            on the server, ensuring complete privacy. This makes the tool safe for
            handling sensitive documents such as contracts, academic papers, or
            financial records.
          </p>

          <h2>Why Use PDF Page Extractor?</h2>
          <p>
            PDF is one of the most widely used document formats, but editing PDFs is
            often difficult without premium software. PDF Page Extractor eliminates
            this problem by providing a free and accessible solution. It allows you
            to manage your documents efficiently without compromising quality.
          </p>

          <p>
            Students can extract important chapters from study materials, teachers
            can share selected notes, and professionals can send only relevant pages
            of reports or presentations. This makes collaboration easier and more
            organized.
          </p>

          <h2>Fast, Reliable, and Free</h2>
          <p>
            Speed and reliability are key factors when working with online tools.
            PDF Page Extractor processes files quickly and maintains the original
            formatting, fonts, and layout of the document. The extracted PDF looks
            exactly like the original pages, ensuring professional results every
            time.
          </p>

          <p>
            Best of all, this tool is completely free to use. There are no hidden
            charges, watermarks, or limitations. You can extract pages as many times
            as you want, making it a perfect solution for everyday document needs.
          </p>

          <h2>Start Extracting PDF Pages Now</h2>
          <p className="closing">
            If you are looking for a simple, secure, and efficient way to extract
            pages from a PDF, PDF Page Extractor is the right choice. Upload your
            file, select the pages you need, and download a clean, high-quality PDF
            instantly. Save time, stay organized, and manage your PDF documents with
            ease.
          </p>

          <h2>Frequently Asked Questions (FAQ)</h2>
          <div className="faq">
            <div className="faq-item">
              <h3>Is PDF Page Extractor free to use?</h3>
              <p>
                Yes, PDF Page Extractor is completely free to use. There are no hidden
                charges, subscriptions, or watermarks added to your extracted PDF
                files.
              </p>
            </div>


            <div className="faq-item">
              <h3>Are my PDF files safe and secure?</h3>
              <p>
                Absolutely. Your files are processed securely and are not stored
                permanently on our servers. This ensures your privacy and data
                protection at all times.
              </p>
            </div>


            <div className="faq-item">
              <h3>Can I extract multiple pages at once?</h3>
              <p>
                Yes, you can select single or multiple pages and extract them into
                one new PDF file easily.
              </p>
            </div>


            <div className="faq-item">
              <h3>Will the extracted PDF lose quality?</h3>
              <p>
                No, the extracted pages maintain the original quality, formatting,
                fonts, and layout of the source PDF.
              </p>
            </div>


            <div className="faq-item">
              <h3>Do I need to install any software?</h3>
              <p>
                No installation is required. PDF Page Extractor works directly in
                your web browser on desktop, tablet, and mobile devices.
              </p>
            </div>


            <div className="faq-item">
              <h3>Which devices and browsers are supported?</h3>
              <p>
                The tool supports all modern browsers such as Chrome, Edge, Firefox,
                and Safari, and works on Windows, macOS, Android, and iOS.
              </p>
            </div>
          </div>
        </div>)}
    </>
  );
}
