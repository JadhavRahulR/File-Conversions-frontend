// File: PdfPageRemover.jsx
// ----- PAGE REMOVER (With Preview) -----

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { useRef, useEffect } from "react";
import "./PdfTools.css";
import { Helmet } from "react-helmet-async";
import ScrollToTop from "./ScrollToTop";
import DropboxFileInput from "./DropboxFileInput";
import DriveFileInput from "./DriveFileInput";
import SaveToGoogleDrive from "./SaveToGoogleDrive";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export function PdfPageRemove() {
  const previewRef = useRef(null);
  const [file, setFile] = useState(null);
  const [pagePreviews, setPagePreviews] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [downloadedFile, setDownloadedFile] = useState(null);
  const [outputFileName, setOutputFileName] = useState("");



  // ---------- FILE HANDLER ----------
  const handleFile = (pdfFile) => {
    if (!pdfFile) {
      setError("No file selected.");
      return;
    }

    const isPdf =
      pdfFile.type === "application/pdf" ||
      pdfFile.name?.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Please upload a valid PDF file.");
      return;
    }

    setError("");
    setFile(pdfFile);
    setSelectedPages([]);
    renderPdfPreviews(pdfFile);
  };

  const handleFileSelect = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  // ---------- RENDER PAGE PREVIEWS ----------
  const renderPdfPreviews = async (pdfFile) => {
    try {
      setStatus("Rendering previews...");
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
      setStatus("");
    } catch (err) {
      console.error(err);
      setError("Could not read PDF");
    }
  };

  // ---------- SELECT / UNSELECT PAGE ----------
  const togglePage = (pageNumber) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  // ---------- REMOVE SELECTED PAGES ----------
 const removePages = async () => {
  if (!file) return;

  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const total = pdfDoc.getPageCount();

  const keepPages = [];
  for (let i = 0; i < total; i++) {
    if (!selectedPages.includes(i + 1)) keepPages.push(i);
  }

  const newPdf = await PDFDocument.create();
  const copied = await newPdf.copyPages(pdfDoc, keepPages);
  copied.forEach((p) => newPdf.addPage(p));

  const pdfBytes = await newPdf.save();

  // ðŸ”¹ Safe filename
  const finalName =
    outputFileName.trim() !== ""
      ? outputFileName.trim()
      : "pages-removed";

  //    ⬇️ Download
  download(pdfBytes, `${finalName}.pdf`);

  //    ⬇️ Save for Google Drive
  const fileObj = new File([pdfBytes], `${finalName}.pdf`, {
    type: "application/pdf",
  });
  setDownloadedFile(fileObj);
};

  // ---------- DOWNLOAD ----------
  const download = (bytes, filename) => {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // For prew sroll up
  useEffect(() => {
    if (pagePreviews.length > 0 && previewRef.current) {
      previewRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [pagePreviews]);

  return (
    <>
      <Helmet>
        <title>PDF Page Remover | delete pages from pdf</title>
        <meta
          name="description"
          content="Remove unwanted pages from PDF files easily and securely. Free online PDF page remover to delete single or multiple pages without affecting quality."
        />
        <link rel="canonical" href="https://fileunivers.com/pdfpageremover" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="pdf page remover, remove pages from pdf, delete pdf pages, pdf page delete tool, free pdf page remover, secure pdf page remover"
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <ScrollToTop />

      <div className="pagetitle">
        <h1>PDF Page Remover - Delete Pages from PDF Online for Free</h1>

        <p className="intro-paragraph">
          PDF Page Remover is a simple and powerful online tool that allows you to
          delete unwanted pages from any PDF file in just a few clicks. Whether your
          document contains extra blank pages, outdated content, or unnecessary
          sections, this tool helps you clean your PDF quickly and securely. No
          software installation is required   —just upload your PDF, preview the pages,
          remove what you don’t need, and download a clean, high-quality PDF
          instantly.
        </p>
      </div>

      <div
        className="tool-container"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h2>Upload PDF and Remove Page</h2>

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

        {/* {file && ( */}
  <div className="filename-box" >
    <p>Rename Your File</p>
    <input
      type="text"
      className="file-input"
      placeholder="Enter File Name without .pdf"
      value={outputFileName}
      onChange={(e) => setOutputFileName(e.target.value) }
    />
  </div>
{/* )} */}


        <div className="drop-zone">
          {file ? <p>{file.name}</p> : <p>Drag & Drop PDF Here</p>}
        </div>

        {/* To Save to Google Drive */}
        {downloadedFile && (
          <div className="save-drive-section">
            <SaveToGoogleDrive file={downloadedFile} />
          </div>
        )}

        {status && <p className="status">{status}</p>}
        {error && <p className="error">{error}</p>}
      </div>
      {/* PAGE PREVIEWS */}
      {pagePreviews.length > 0 && (
        <div className="pages-box" ref={previewRef}>
          <h3>Select Pages to Remove</h3>

          <div className="pages-preview-grid" >
            {pagePreviews.map((p) => (
              <div
                key={p.pageNumber}
                className={
                  selectedPages.includes(p.pageNumber)
                    ? "page-preview active"
                    : "page-preview"
                }
                onClick={() => togglePage(p.pageNumber)}
              >
                <img
                  src={p.image}
                  alt={`Page ${p.pageNumber}`}
                  width={150}
                  height={200}
                />
                <span>Page {p.pageNumber}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {pagePreviews.length > 0 && (
        <div className="action-buttons">
          <button
            onClick={removePages}
            className="extract-btn"
            disabled={selectedPages.length === 0}
          >
            Download PDF
          </button>
        </div>
      )}

      {pagePreviews.length === 0 && (
        <div className="pdf-extractor-container">
          <p className="intro">
            PDF Page Remover is a smart and user-friendly online tool that helps you
            delete unwanted pages from a PDF document quickly and safely. Whether
            your file contains extra blank pages, outdated information, or sections
            that are no longer required, this tool allows you to remove specific
            pages without affecting the remaining content or quality of the PDF.
            Everything works directly in your browser, so there is no need to
            install software or create an account.
          </p>
          <div className="deletpdfimg">
          <img src="delete.png" alt="" />
          </div>

          <p>
            Many PDF documents such as reports, assignments, scanned files, invoices,
            eBooks, and presentations often include unnecessary pages. Sharing or
            storing such large files can be inconvenient and unprofessional. PDF
            Page Remover solves this problem by allowing you to delete selected pages
            and download a clean, optimized PDF containing only the pages you need.
            This helps reduce file size, improve readability, and simplify document
            management.
          </p>

          <h2>How PDF Page Remover Works</h2>
          <p>
            Using the PDF Page Remover is simple and intuitive. First, upload your PDF
            file using the upload button or drag-and-drop option. Once the file is
            loaded, you will see a preview of all pages in the document. Select the
            pages you want to remove, and then click the remove button. Within a few
            seconds, a new PDF file without the selected pages will be generated and
            ready to download.
          </p>

          <p>
            The entire process is designed to be smooth and efficient. Even users
            with no prior experience working with PDF tools can remove pages easily.
            The interface is clean, responsive, and optimized for desktops, tablets,
            and mobile devices, ensuring a seamless experience across all platforms.
          </p>

          <h2>Key Features</h2>
          <ul className="features">
            <li>Remove unwanted pages from PDF files</li>
            <li>Delete single or multiple pages at once</li>
            <li>Preserve original PDF quality and layout</li>
            <li>No installation or registration required</li>
            <li>Works on all devices and browsers</li>
            <li>Secure and privacy-focused processing</li>
          </ul>

          <p>
            One of the most important features of PDF Page Remover is its commitment
            to security and privacy. Your files are processed securely and are not
            stored permanently on the server. This makes the tool ideal for handling
            sensitive documents such as legal contracts, academic papers, financial
            statements, and business reports.
          </p>

          <h2>Why Use PDF Page Remover?</h2>
          <p>
            PDF is one of the most widely used document formats, but editing PDFs is
            often difficult without paid software. PDF Page Remover provides a free
            and accessible solution for removing pages without compromising document
            quality. You can quickly clean up your files and share only relevant
            information with others.
          </p>

          <p>
            Students can remove unnecessary pages from assignments, teachers can
            delete outdated syllabus pages, and professionals can clean reports
            before sharing them with clients or colleagues. This improves clarity,
            professionalism, and overall document presentation.
          </p>

          <h2>Fast, Reliable, and Free</h2>
          <p>
            Speed and reliability are essential when working with online document
            tools. PDF Page Remover processes files quickly while maintaining the
            original fonts, images, formatting, and structure of the document. The
            final PDF looks exactly like the original, minus the removed pages.
          </p>

          <p>
            The best part is that PDF Page Remover is completely free to use. There
            are no hidden fees, watermarks, or usage limits. You can remove pages from
            PDFs as many times as you need, making it an excellent tool for everyday
            personal, academic, and professional use.
          </p>

          <h2>Improve File Size and Organization</h2>
          <p>
            Removing unnecessary pages from a PDF not only improves readability but
            also helps reduce file size. Smaller files are easier to upload, share,
            and store. This is especially useful when sending documents via email or
            uploading them to cloud storage platforms with file size limits.
          </p>

          <p>
            PDF Page Remover helps you stay organized by ensuring that your documents
            contain only relevant content. Clean and well-structured PDFs leave a
            better impression and make information easier to understand for readers.
          </p>

          <h2>Start Removing PDF Pages Now</h2>
          <p className="closing">
            If you need a simple, secure, and effective way to remove pages from a
            PDF, PDF Page Remover is the perfect solution. Upload your file, select
            the pages you want to delete, and download a clean, professional PDF in
            seconds. Save time, reduce file size, and manage your PDF documents with
            confidence and ease.
          </p>

          <h2>Frequently Asked Questions (FAQ)</h2>
          <div className="faq">
            <div className="faq-item">
              <h3>Is PDF Page Remover free to use?</h3>
              <p>
                Yes, PDF Page Remover is completely free. There are no hidden charges,
                subscriptions, or watermarks added to your final PDF.
              </p>
            </div>

            <div className="faq-item">
              <h3>Are my PDF files safe?</h3>
              <p>
                Yes. Your files are processed securely and are not stored permanently.
                Your privacy and data security are always protected.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I remove multiple pages at once?</h3>
              <p>
                Absolutely. You can select and remove single or multiple pages in one
                action.
              </p>
            </div>

            <div className="faq-item">
              <h3>Will removing pages affect PDF quality?</h3>
              <p>
                No. The remaining pages retain their original quality, formatting,
                fonts, and layout.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do I need to install software?</h3>
              <p>
                No installation is required. PDF Page Remover works entirely in your
                web browser.
              </p>
            </div>

            <div className="faq-item">
              <h3>Which devices and browsers are supported?</h3>
              <p>
                The tool works on all modern browsers including Chrome, Edge,
                Firefox, and Safari, and supports Windows, macOS, Android, and iOS.
              </p>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
