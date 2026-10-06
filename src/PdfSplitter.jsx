import React, {
  useEffect,
  useRef,
  useState,
} from "react";

// import "./PdfTools.css";

import { Helmet } from "react-helmet-async";

import ScrollToTop from "./ScrollToTop";

import DropboxFileInput from "./DropboxFileInput";

import DriveFileInput from "./DriveFileInput";

import SaveToGoogleDrive from "./SaveToGoogleDrive";

import SaveToDropbox from "./SaveToDropbox";
import "./pdfsplitter.css"

const PdfSplitter = () => {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [ranges, setRanges] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [outputFileName, setOutputFileName] = useState("");
  const [splitFiles, setSplitFiles] = useState([]);
  const [editingEnds, setEditingEnds] = useState({});
  const [autoRangesCreated, setAutoRangesCreated] = useState(false);

  // Page thumbnail previews
  const [pagePreviews, setPagePreviews] = useState({});

  // Keep PDF.js document available for rendering previews.
  const pdfDocumentRef = useRef(null);

  // Prevent old preview renders from updating new PDF state.
  const previewRequestRef = useRef(0);

  // --------------------------------------------------
  // LOAD PAGE PREVIEW
  // --------------------------------------------------

  const renderPagePreview = async (pdf, pageNumber) => {
    try {
      if (!pdf || typeof pdf.getPage !== "function") {
        console.error("Invalid PDF document:", pdf);
        return null;
      }

      if (!pageNumber) {
        console.error("Invalid page number:", pageNumber);
        return null;
      }

      const page = await pdf.getPage(pageNumber);

      // Small thumbnail for fast rendering
      const viewport = page.getViewport({
        scale: 0.25,
      });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", {
        alpha: false,
      });

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      context.fillStyle = "#ffffff";
      context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      const imageUrl = canvas.toDataURL(
        "image/jpeg",
        0.65
      );

      page.cleanup();

      return imageUrl;
    } catch (err) {
      console.error(
        `Preview failed for page ${pageNumber}:`,
        err
      );

      return null;
    }
  };
  // --------------------------------------------------
  // UPDATE REQUIRED PREVIEWS
  // --------------------------------------------------

  const updatePagePreviews = async (
    pdf,
    currentRanges,
    requestId
  ) => {
    if (
      !pdf ||
      typeof pdf.getPage !== "function" ||
      !currentRanges?.length
    ) {
      return;
    }

    const requiredPages = [
      ...new Set(
        currentRanges.flatMap(
          (range) => [
            range.start,
            range.end,
          ]
        )
      ),
    ];

    console.log(
      "Rendering preview pages:",
      requiredPages
    );

    /*
     * Render all required pages in parallel.
     */
    const results = await Promise.all(
      requiredPages.map(
        async (pageNumber) => {
          const preview =
            await renderPagePreview(
              pdf,
              pageNumber
            );

          return {
            pageNumber,
            preview,
          };
        }
      )
    );

    /*
     * Ignore old request.
     */
    if (
      requestId !==
      previewRequestRef.current
    ) {
      return;
    }

    const newPreviews = {};

    results.forEach(
      ({
        pageNumber,
        preview,
      }) => {
        if (preview) {
          newPreviews[
            pageNumber
          ] = preview;
        }
      }
    );

    setPagePreviews(
      newPreviews
    );
  };
  // --------------------------------------------------
  // FILE HANDLER
  // --------------------------------------------------

  const handleFile = async (pdfFile) => {
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

    // Cancel previous preview requests
    previewRequestRef.current += 1;

    // Destroy previous PDF.js document
    if (pdfDocumentRef.current) {
      try {
        await pdfDocumentRef.current.destroy();
      } catch { }
    }

    pdfDocumentRef.current = null;

    try {
      setError("");
      setStatus("Reading PDF...");

      setFile(pdfFile);
      setSplitFiles([]);
      setRanges([]);
      setTotalPages(0);
      setPagePreviews({});

      // --------------------------------------------------
      // LOAD PDF.JS ONLY AFTER PDF IS SELECTED
      // --------------------------------------------------

      const pdfjsLib = await import("pdfjs-dist");

      // Load worker only when required
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        const pdfWorker = (
          await import(
            "pdfjs-dist/build/pdf.worker?url"
          )
        ).default;

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          pdfWorker;
      }

      // --------------------------------------------------
      // READ PDF
      // --------------------------------------------------

      const buffer =
        await pdfFile.arrayBuffer();

      const pdf =
        await pdfjsLib
          .getDocument({
            data: buffer,
            disableFontFace: true,
            useSystemFonts: true,
          })
          .promise;

      // Keep PDF.js document for thumbnails
      pdfDocumentRef.current = pdf;

      const pages = pdf.numPages;

      setTotalPages(pages);

      // --------------------------------------------------
      // INITIAL RANGE
      // --------------------------------------------------

      const initialRanges = [
        {
          start: 1,
          end: pages,
        },
      ];

      setRanges(initialRanges);

      // --------------------------------------------------
      // CREATE FIRST + LAST PAGE PREVIEW
      // --------------------------------------------------

      setStatus("Creating page previews...");

      const requestId =
        previewRequestRef.current;

      await updatePagePreviews(
        pdf,
        initialRanges,
        requestId
      );

      setStatus("");
    } catch (err) {
      console.error(
        "Could not read PDF:",
        err
      );

      if (pdfDocumentRef.current) {
        try {
          await pdfDocumentRef.current.destroy();
        } catch { }
      }

      pdfDocumentRef.current = null;

      setFile(null);
      setTotalPages(0);
      setRanges([]);
      setPagePreviews({});

      setError(
        "Could not read PDF. Please try another file."
      );

      setStatus("");
    }
  };

  const handleFileSelect = (e) => {
    handleFile(
      e.target.files[0]
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();

    handleFile(
      e.dataTransfer.files[0]
    );
  };

  // --------------------------------------------------
  // UPDATE RANGE END
  // --------------------------------------------------

  const updateRangeEnd = (index, value) => {
    // Allow the input to temporarily become empty
    if (value === "") {
      setEditingEnds((prev) => ({
        ...prev,
        [index]: "",
      }));

      return;
    }

    const newEnd = Number(value);

    if (!Number.isInteger(newEnd)) {
      return;
    }

    // Remove temporary editing value
    setEditingEnds((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });

    let updatedRanges = [];

    setRanges((prev) => {
      const updated = [...prev];

      const current = updated[index];

      if (!current) {
        return prev;
      }

      /*
       * End cannot be smaller
       * than current start.
       */
      let safeEnd = Math.max(
        current.start,
        newEnd
      );

      /*
       * End cannot exceed
       * total pages.
       */
      safeEnd = Math.min(
        totalPages,
        safeEnd
      );

      /*
       * Existing next range:
       * don't allow overlap.
       */
      if (index < updated.length - 1) {
        const nextRange = updated[index + 1];

        safeEnd = Math.min(
          safeEnd,
          nextRange.end - 1
        );
      }

      updated[index] = {
        ...current,
        end: safeEnd,
      };

      /*
       * Recalculate every
       * following range start.
       */
      for (
        let i = index + 1;
        i < updated.length;
        i++
      ) {
        updated[i] = {
          ...updated[i],
          start: updated[i - 1].end + 1,
        };

        if (
          updated[i].end < updated[i].start
        ) {
          updated[i].end = totalPages;
        }
      }

      /*
       * If last range is reduced,
       * automatically create the
       * remaining range.
       */
      if (
        index === updated.length - 1 &&
        safeEnd < totalPages
      ) {
        updated.push({
          start: safeEnd + 1,
          end: totalPages,
        });
      }

      updatedRanges = updated;

      return updated;
    });

    setSplitFiles([]);
    setError("");

    setTimeout(() => {
      const requestId =
        ++previewRequestRef.current;

      updatePagePreviews(
        pdfDocumentRef.current,
        updatedRanges,
        requestId
      );
    }, 0);
  };
  const autoCreateFourRanges = () => {
  if (!totalPages || totalPages < 4) {
    return;
  }

  const basePages = Math.floor(totalPages / 4);
  const remainder = totalPages % 4;

  const autoRanges = [];
  let start = 1;

  for (let i = 0; i < 4; i++) {
    const partSize =
      basePages + (i === 3 ? remainder : 0);

    const end = start + partSize - 1;

    autoRanges.push({
      start,
      end,
    });

    start = end + 1;
  }

  setRanges(autoRanges);
  setSplitFiles([]);
  setError("");
  setAutoRangesCreated(true);

  const requestId = ++previewRequestRef.current;

  updatePagePreviews(
    pdfDocumentRef.current,
    autoRanges,
    requestId
  );
};
  // --------------------------------------------------
  // ADD NEW RANGE
  // --------------------------------------------------

  const addRange = () => {
    if (
      !totalPages ||
      ranges.length === 0
    ) {
      return;
    }

    const lastRange =
      ranges[
      ranges.length - 1
      ];

    if (
      lastRange.end >=
      totalPages
    ) {
      setError(
        "First change the last range end page to create another range."
      );

      return;
    }

    const newStart =
      lastRange.end + 1;

    const updatedRanges = [
      ...ranges,
      {
        start: newStart,
        end: totalPages,
      },
    ];

    setRanges(
      updatedRanges
    );

    setSplitFiles([]);
    setError("");

    const requestId =
      ++previewRequestRef.current;

    updatePagePreviews(
      pdfDocumentRef.current,
      updatedRanges,
      requestId
    );
  };

  // --------------------------------------------------
  // REMOVE RANGE
  // --------------------------------------------------

  const removeRange = (
    index
  ) => {
    if (
      ranges.length <= 1
    ) {
      return;
    }

    const updated =
      ranges.filter(
        (_, i) =>
          i !== index
      );

    /*
     * Recalculate starts.
     */
    for (
      let i = 0;
      i < updated.length;
      i++
    ) {
      if (i === 0) {
        updated[i].start =
          1;
      } else {
        updated[i].start =
          updated[
            i - 1
          ].end + 1;
      }
    }

    /*
     * Last range always reaches
     * final PDF page.
     */
    updated[
      updated.length - 1
    ].end =
      totalPages;

    setRanges(
      updated
    );

    setSplitFiles([]);
    setError("");

    const requestId =
      ++previewRequestRef.current;

    updatePagePreviews(
      pdfDocumentRef.current,
      updated,
      requestId
    );
  };

  // --------------------------------------------------
  // VALIDATE RANGES
  // --------------------------------------------------

  const validateRanges = () => {
    if (!file) {
      setError(
        "Please select a PDF first."
      );

      return false;
    }

    if (!totalPages) {
      setError(
        "Could not determine PDF pages."
      );

      return false;
    }

    if (!ranges.length) {
      setError(
        "Please add at least one range."
      );

      return false;
    }

    for (
      let i = 0;
      i < ranges.length;
      i++
    ) {
      const range =
        ranges[i];

      if (
        range.start < 1 ||
        range.end >
        totalPages ||
        range.start >
        range.end
      ) {
        setError(
          `Invalid range: ${range.start}-${range.end}`
        );

        return false;
      }

      if (i > 0) {
        const previous =
          ranges[i - 1];

        if (
          range.start !==
          previous.end + 1
        ) {
          setError(
            "Please make sure all page ranges are continuous."
          );

          return false;
        }
      }
    }

    if (
      ranges[
        ranges.length - 1
      ].end !== totalPages
    ) {
      setError(
        `The last range must end at page ${totalPages}.`
      );

      return false;
    }

    return true;
  };

  // --------------------------------------------------
  // SPLIT PDF
  // --------------------------------------------------

  const splitPdf =
    async () => {
      if (
        !validateRanges()
      ) {
        return;
      }

      try {
        setError("");
        setStatus(
          "Splitting PDF..."
        );
        setSplitFiles([]);

        /*
         * pdf-lib loads only when
         * Split PDF is clicked.
         */
        const {
          PDFDocument,
        } = await import(
          "pdf-lib"
        );

        const bytes =
          await file.arrayBuffer();

        const pdfDoc =
          await PDFDocument.load(
            bytes
          );

        const pdfPageCount =
          pdfDoc.getPageCount();

        if (
          pdfPageCount !==
          totalPages
        ) {
          throw new Error(
            "PDF page count changed unexpectedly."
          );
        }

        const baseName =
          outputFileName.trim() !==
            ""
            ? outputFileName.trim()
            : file.name
              .replace(
                /\.pdf$/i,
                ""
              )
              .trim() ||
            "split-pdf";

        const generatedFiles =
          [];

        for (
          let i = 0;
          i < ranges.length;
          i++
        ) {
          const range =
            ranges[i];

          const newPdf =
            await PDFDocument.create();

          const pageIndices =
            [];

          for (
            let page =
              range.start;
            page <=
            range.end;
            page++
          ) {
            pageIndices.push(
              page - 1
            );
          }

          const copiedPages =
            await newPdf.copyPages(
              pdfDoc,
              pageIndices
            );

          copiedPages.forEach(
            (page) => {
              newPdf.addPage(
                page
              );
            }
          );

          const pdfBytes =
            await newPdf.save();

          const fileName =
            `${baseName}-part-${i + 1
            }.pdf`;

          const fileObj =
            new File(
              [pdfBytes],
              fileName,
              {
                type: "application/pdf",
              }
            );

          generatedFiles.push({
            file: fileObj,
            bytes: pdfBytes,
            fileName,
            start:
              range.start,
            end:
              range.end,
          });
        }

        setSplitFiles(
          generatedFiles
        );

        setStatus(
          `${generatedFiles.length} PDF ${generatedFiles.length ===
            1
            ? "file"
            : "files"
          } created successfully.`
        );
      } catch (err) {
        console.error(
          "PDF split failed:",
          err
        );

        setError(
          "Could not split the PDF. Please try again."
        );

        setStatus("");
      }
    };

  // --------------------------------------------------
  // DOWNLOAD SINGLE PDF
  // --------------------------------------------------

  const downloadFile = (
    fileObj
  ) => {
    if (!fileObj) {
      return;
    }

    const url =
      URL.createObjectURL(
        fileObj
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download =
      fileObj.name;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(
        url
      );
    }, 1000);
  };

  // --------------------------------------------------
  // DOWNLOAD ALL AS ZIP
  // --------------------------------------------------

  const downloadAll =
    async () => {
      if (
        !splitFiles.length
      ) {
        return;
      }

      try {
        setError("");
        setStatus(
          "Creating ZIP..."
        );

        /*
         * JSZip loads only when
         * requested.
         */
        const {
          default: JSZip,
        } = await import(
          "jszip"
        );

        const zip =
          new JSZip();

        splitFiles.forEach(
          (item) => {
            zip.file(
              item.fileName,
              item.bytes
            );
          }
        );

        const zipBlob =
          await zip.generateAsync(
            {
              type: "blob",
              compression:
                "STORE",
            }
          );

        const url =
          URL.createObjectURL(
            zipBlob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          "split-pdf-files.zip";

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        setTimeout(() => {
          URL.revokeObjectURL(
            url
          );
        }, 1000);

        setStatus(
          "ZIP downloaded successfully."
        );
      } catch (err) {
        console.error(
          "ZIP creation failed:",
          err
        );

        setError(
          "Could not create ZIP file."
        );

        setStatus("");
      }
    };

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  const resetTool =
    async () => {
      previewRequestRef.current += 1;

      if (
        pdfDocumentRef.current
      ) {
        try {
          await pdfDocumentRef.current.destroy();
        } catch { }
      }

      pdfDocumentRef.current =
        null;

      setFile(null);
      setTotalPages(0);
      setRanges([]);
      setPagePreviews({});
      setSplitFiles([]);
      setOutputFileName("");
      setStatus("");
      setError("");
    };

  // --------------------------------------------------
  // CLEANUP ON UNMOUNT
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      previewRequestRef.current += 1;

      if (
        pdfDocumentRef.current
      ) {
        try {
          pdfDocumentRef.current.destroy();
        } catch { }
      }

      pdfDocumentRef.current =
        null;
    };
  }, []);

  // --------------------------------------------------
  // AUTO SCROLL
  // --------------------------------------------------

  useEffect(() => {
    if (
      ranges.length > 0
    ) {
      const element =
        document.getElementById(
          "pdf-split-ranges"
        );

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [ranges.length]);

  // --------------------------------------------------
  // JSX
  // --------------------------------------------------

  return (
    <>
      <Helmet>
        <title>
          Split PDF Online Free | Split PDF into Multiple Files
        </title>

        <meta
          name="description"
          content="Split PDF files online for free. Choose page ranges and divide your PDF into multiple files directly in your browser."
        />

        <link
          rel="canonical"
          href="https://fileunivers.com/pdf-split"
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <meta
          charSet="utf-8"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Helmet>

      <ScrollToTop />

      {/* PAGE HEADER */}

      <div className="pagetitle">
        <h1>
          Split PDF Online - Split PDF into Multiple Files
        </h1>

        <p className="intro-paragraph">
          Split PDF is a free online tool that
          lets you divide a PDF into multiple
          files by selecting page ranges.
          Choose where each section should end,
          create separate PDF files, and
          download them individually or
          together as a ZIP file. Your PDF is
          processed directly in your browser.
        </p>
      </div>

      {/* UPLOAD TOOL */}

      {/* DOWNLOAD POPUP */}

      {/* DOWNLOAD POPUP */}

{splitFiles.length > 0 && (
  <div className="download-modal-overlay">
    <div className="download-modal">

      {/* CLOSE */}

      <button
        type="button"
        className="download-modal-close"
        onClick={() => setSplitFiles([])}
        aria-label="Close download window"
      >
        ×
      </button>


      {/* TITLE */}

      <h2>Your Split PDF Files</h2>

      <p className="download-modal-description">
        Your PDF has been split into{" "}
        <strong>{splitFiles.length}</strong> files.
        Download all files together or download
        them individually.
      </p>


      {/* DOWNLOAD ALL - FIRST */}

      {splitFiles.length > 1 && (
        <div className="download-all-section">
          <button
            type="button"
            onClick={downloadAll}
          >
            Download All as ZIP
          </button>
        </div>
      )}


      {/* INDIVIDUAL FILES */}

      <div className="split-file-list">

        {splitFiles.map((item, index) => (
          <div
            className="split-file"
            key={item.fileName}
          >

            <div className="split-file-info">

              <strong>
                Part {index + 1}
              </strong>

              <span>
                Pages {item.start} - {item.end}
              </span>

              <span>
                {item.fileName}
              </span>

            </div>


            <div className="split-file-actions">

              <button
                type="button"
                onClick={() =>
                  downloadFile(item.file)
                }
              >
                Download
              </button>
                  <p>SAVE FILE...</p>
              <SaveToGoogleDrive
                file={item.file}
              />

              <SaveToDropbox
                file={item.file}
              />

            </div>

          </div>
        ))}

      </div>

    </div>
  </div>
)}
      <div
        className="tool-container"
        onDragOver={(e) =>
          e.preventDefault()
        }
        onDrop={handleDrop}
      >
        <h2>
          Upload PDF and Choose Page Ranges
        </h2>

        <input
          type="file"
          accept="application/pdf"
          className="file-input"
          onChange={handleFileSelect}
        />

        <div className="fileuploadcontainer">
          <DriveFileInput
            onFilePicked={
              handleFile
            }
            setStatus={
              setStatus
            }
            allowedTypes={[
              ".pdf",
            ]}
          />

          <DropboxFileInput
            onFilePicked={
              handleFile
            }
            setStatus={
              setStatus
            }
            extensions={[
              ".pdf",
            ]}
          />
        </div>

        <div className="filename-box">
          <p>
            Rename Your Files
          </p>

          <input
            type="text"
            className="file-input"
            placeholder="Enter File Name without .pdf"
            value={
              outputFileName
            }
            onChange={(e) =>
              setOutputFileName(
                e.target.value
              )
            }
          />
        </div>

        <div className="drop-zone">
          {file ? (
            <p>
              {file.name}
            </p>
          ) : (
            <p>
              Drag & Drop PDF Here
            </p>
          )}
        </div>

        {status && (
          <p
            className="status"
            style={{
              color: "white",
            }}
          >
            {status}
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}
      </div>

      {/* RANGE SECTION */}

      {file &&
        totalPages > 0 &&
        ranges.length > 0 && (
          <div
            className="pdf-split-section"
            id="pdf-split-ranges"
          >
            <h2>
              Choose PDF Split Ranges
            </h2>

            <p>
              This PDF contains{" "}
              <strong>
                {totalPages}
              </strong>{" "}
              pages. Set the last page
              of each range. The first
              page is automatically
              determined.
            </p>

            <div className="split-range-list">
              {ranges.map(
                (
                  range,
                  index
                ) => (
                  <div
                    className="split-range-row"
                    key={index}
                  >
                    {/* PART */}

                    <div className="range-label">
                      Part{" "}
                      {index + 1}
                    </div>

                    {/* PAGE PREVIEWS */}

                    <div className="range-previews">
                      {/* FIRST PAGE */}

                      <div className="page-preview-item">
                        <div className="page-preview-title">
                          First Page
                        </div>

                        <div className="page-preview">
                          {pagePreviews[
                            range
                              .start
                          ] ? (
                            <img
                              src={
                                pagePreviews[
                                range
                                  .start
                                ]
                              }
                              alt={`Page ${range.start} preview`}
                              loading="lazy"
                            />
                          ) : (
                            <div className="page-preview-loading">
                              Loading...
                            </div>
                          )}
                        </div>

                        <strong className="page-preview-number">
                          Page{" "}
                          {
                            range.start
                          }
                        </strong>
                      </div>

                      {/* ARROW */}

                      <div className="page-preview-separator">
                        →
                      </div>

                      {/* LAST PAGE */}

                      <div className="page-preview-item">
                        <div className="page-preview-title">
                          Last Page
                        </div>

                        <div className="page-preview">
                          {pagePreviews[
                            range
                              .end
                          ] ? (
                            <img
                              src={
                                pagePreviews[
                                range
                                  .end
                                ]
                              }
                              alt={`Page ${range.end} preview`}
                              loading="lazy"
                            />
                          ) : (
                            <div className="page-preview-loading">
                              Loading...
                            </div>
                          )}
                        </div>

                        <strong className="page-preview-number">
                          Page{" "}
                          {
                            range.end
                          }
                        </strong>
                      </div>
                    </div>

                    {/* RANGE INPUT */}

                    <div className="range-inputs">
                      <div className="range-page-box">
                        <span className="range-page-label">
                          First Page
                        </span>

                        <strong>
                          {
                            range.start
                          }
                        </strong>
                      </div>

                      <span className="range-separator">
                        -
                      </span>

                      <div className="range-page-box">
                        <span className="range-page-label">
                          Last Page
                        </span>

                        <input
                          type="number"
                          value={
                            editingEnds[index] !== undefined
                              ? editingEnds[index]
                              : range.end
                          }
                          min={range.start}
                          max={totalPages}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) =>
                            updateRangeEnd(
                              index,
                              e.target.value
                            )
                          }
                          onBlur={() => {
                            if (editingEnds[index] === "") {
                              setEditingEnds((prev) => {
                                const updated = { ...prev };
                                delete updated[index];
                                return updated;
                              });
                            }
                          }}
                          aria-label={`Part ${index + 1
                            } last page`}
                        />
                      </div>
                    </div>

                    {/* REMOVE */}

                    {ranges.length >
                      1 && (
                        <button
                          type="button"
                          className="remove-range-button"
                          onClick={() =>
                            removeRange(
                              index
                            )
                          }
                          aria-label={`Remove part ${index +
                            1
                            }`}
                        >
                          ×
                        </button>
                      )}
                  </div>
                )
              )}
            </div>

            {/* ADD RANGE */}

            {totalPages >= 4 && (
  <div className="auto-split-section">
    <button
      type="button"
      className={`auto-split-button ${
        autoRangesCreated ? "done" : ""
      }`}
      onClick={autoCreateFourRanges}
      disabled={autoRangesCreated}
    >
      {autoRangesCreated ? "Done ✓" : "Auto Create 4 Ranges"}
    </button>

    {!autoRangesCreated && (
      <span className="auto-split-help">
        Create 4 nearly equal page ranges automatically.
      </span>
    )}
  </div>
)}

            <button type="button" className="add-range-button" onClick={addRange} disabled={ranges[ranges.length - 1].end >= totalPages}>
              + Add Range
            </button>

            <div className="split-range-info">
              <p>
                The first and last page
                previews show exactly
                where each PDF part
                starts and ends.
              </p>
            </div>

            {/* SPLIT BUTTON */}

            <div className="split-action">
              <button
                type="button"
                onClick={
                  splitPdf
                }
                disabled={
                  !file
                }
              >
                Split PDF
              </button>
            </div>

            <button
              type="button"
              onClick={
                resetTool
              }
              className="reset-pdf-button"
            >
              Choose Another PDF
            </button>
          </div>
        )}

      {/* GENERATED FILES */}

      {splitFiles.length >
        0 && (
          <div className="split-results">
            <h2>
              Your Split PDF Files
            </h2>

            <p>
              Your PDF has been
              split into{" "}
              <strong>
                {
                  splitFiles.length
                }
              </strong>{" "}
              files. Download
              each file separately
              or download all files
              as a ZIP.
            </p>

             {splitFiles.length >
              1 && (
                <div className="download-all-section">
                  <button
                    type="button"
                    onClick={
                      downloadAll
                    }
                  >
                    Download All as ZIP
                  </button>
                </div>
              )}

            <div className="split-file-list">
              {splitFiles.map(
                (
                  item,
                  index
                ) => (
                  <div
                    className="split-file"
                    key={
                      item.fileName
                    }
                  >
                    {/* <div className="split-file-info">
                      <strong>
                        Part{" "}
                        {index +
                          1}
                      </strong>

                      <span>
                        Pages{" "}
                        {
                          item.start
                        }{" "}
                        -{" "}
                        {
                          item.end
                        }
                      </span>

                      <span>
                        {
                          item.fileName
                        }
                      </span>
                    </div>

                    <div className="split-file-actions">
                      <button
                        type="button"
                        onClick={() =>
                          downloadFile(
                            item.file
                          )
                        }
                      >
                        Download
                      </button>


                      <div className="savesplittpdfto">

                      
                      <SaveToGoogleDrive
                        file={
                          item.file
                        }
                        className="split-google-drive"
                        />

                      <SaveToDropbox
                        file={
                          item.file
                        }
                        />
                        </div>
                    </div> */}
                  </div>
                )
              )}
            </div>

           
          </div>
        )}

     {/* SEO CONTENT */}

<section className="content-section">

  <h2>How to Split a PDF Online</h2>

  <p>
    Splitting a PDF is useful when you need to separate specific pages from
    a larger document or divide a long PDF into smaller files. FileUnivers
    provides a simple way to split PDF files by selecting page ranges. Upload
    your PDF, review the available pages, choose where each section should end,
    and create separate PDF files without changing the original document.
  </p>

  <p>
    The tool is designed to make PDF splitting easy even when you have a
    document with many pages. Instead of manually copying pages or installing
    desktop software, you can select the required page ranges directly from
    your browser. Page previews make it easier to identify the pages you want
    to include in each section before creating the final PDF files.
  </p>


  <h2>Split a PDF into Multiple Files</h2>

  <p>
    You can divide one PDF into multiple sections based on your requirements.
    For example, if you have a 50-page document, you can create sections such
    as pages 1–10, 11–20, 21–35, and 36–50. Each selected range is generated
    as an individual PDF file, making it easier to manage, share, or download
    only the parts of the document you need.
  </p>

  <p>
    This can be helpful for reports, study materials, invoices, applications,
    contracts, presentations, scanned documents, and other multi-page files.
    You can create as many page ranges as needed within the limits of your
    browser and device. Before splitting the document, you can review the
    selected ranges and adjust them if necessary.
  </p>


  <h2>How to Create PDF Page Ranges</h2>

  <p>
    After selecting your PDF, the tool displays the available pages so you can
    decide how the document should be divided. Select the ending page for each
    section, and the beginning page of the next section is calculated
    automatically. This makes it easier to create consecutive ranges without
    entering every starting page manually.
  </p>

  <p>
    For example, you can create a first section ending at page 5, another
    section ending at page 15, and a final section containing the remaining
    pages. If you change a page range, you can review the selections before
    generating the split files. This helps reduce mistakes when working with
    documents that contain many pages.
  </p>


  <h2>Download Your Split PDF Files</h2>

  <p>
    Once the PDF has been split, each generated section is available as a
    separate PDF file. You can download individual files when you only need
    one or two sections from the original document. If multiple PDF files are
    created, you can also download them together as a ZIP file for convenient
    storage and transfer.
  </p>

  <p>
    Downloading the files separately can be useful when different pages need
    to be sent to different people or uploaded to different websites. The ZIP
    option is convenient when you want to keep all of the generated sections
    together and download them in one operation.
  </p>


  <h2>Split PDF Files Directly in Your Browser</h2>

  <p>
    FileUnivers processes the PDF splitting operation directly in your web
    browser. The selected PDF does not need to be uploaded to the FileUnivers
    conversion server for the splitting operation. Processing the document in
    the browser can also help keep the workflow simple because you can select,
    split, and download your files from the same page.
  </p>

  <p>
    Browser-based processing can be especially convenient for documents that
    contain personal, business, academic, or other private information. Your
    file remains available to the browser while the splitting operation is
    performed. As with any browser-based file tool, processing speed can vary
    depending on the size of the PDF, number of pages, available device memory,
    and browser performance.
  </p>


  <h2>Why Use an Online PDF Splitter?</h2>

  <p>
    A PDF splitter can save time when you only need certain parts of a large
    document. Instead of opening a PDF editor and manually exporting pages,
    you can select the required ranges and generate separate files in a few
    steps. This is useful for students separating chapters, businesses
    dividing reports, or anyone who needs to share only specific pages from a
    document.
  </p>

  <p>
    FileUnivers keeps the process straightforward: upload a PDF, select the
    page ranges, split the document, and download the resulting files. There
    is no need to install additional desktop software just to separate pages
    from a PDF. The tool works from a modern web browser and is designed for
    quick PDF page splitting on desktop and mobile devices.
  </p>


  <h2>Frequently Asked Questions About Splitting PDFs</h2>

  <h3>Can I split one PDF into several files?</h3>

  <p>
    Yes. You can create multiple page ranges from the same PDF, and each range
    is generated as a separate PDF file.
  </p>

  <h3>Can I download all split PDFs together?</h3>

  <p>
    Yes. When multiple files are generated, you can download them individually
    or download the generated PDFs together as a ZIP file.
  </p>

  <h3>Does splitting a PDF change the original file?</h3>

  <p>
    No. The original PDF is not modified. The selected page ranges are used to
    create new PDF files.
  </p>

  <h3>Do I need to install PDF software?</h3>

  <p>
    No. FileUnivers is browser-based, so you can split a PDF directly from a
    supported web browser without installing separate PDF editing software.
  </p>

</section>
    </>
  );
};

export default PdfSplitter;