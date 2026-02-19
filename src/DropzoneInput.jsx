import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./DropzoneInput.css";

const NAVBAR_HEIGHT = 70; // apne navbar ke hisaab se change karo

const DropzoneInput = ({ acceptedType = [], onFileAccepted, setStatus, file }) => {

  const [showOverlay, setShowOverlay] = useState(false);

  const getMimeMap = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain",
    csv: "text/csv",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    bmp: "image/bmp",
    tiff: "image/tiff",
    tif: "image/tiff",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    zip: "application/zip",
    "7z": "application/x-7z-compressed",
    md: "text/markdown",
    odp: "application/vnd.oasis.opendocument.presentation",
    odt: "application/vnd.oasis.opendocument.text",
    rtf: "application/rtf",
  };

  const accept = {};
  acceptedType.forEach((type) => {
    const mime = getMimeMap[type];
    if (mime) accept[mime] = [`.${type}`];
  });

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {

      setShowOverlay(false);

      if (rejectedFiles.length > 0) {
        alert(`❌ Only ${acceptedType.join(", ")} file allowed`);
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
        if (setStatus) setStatus("Convert");
      }
    },
    [onFileAccepted, acceptedType, setStatus]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    noClick: true
  });

  /* Detect global drag */
  useEffect(() => {

    const dragEnter = (e) => {
      e.preventDefault();
      setShowOverlay(true);
    };

    const dragLeave = (e) => {
      if (e.clientY <= 0) {
        setShowOverlay(false);
      }
    };

    const drop = () => setShowOverlay(false);

    window.addEventListener("dragenter", dragEnter);
    window.addEventListener("dragleave", dragLeave);
    window.addEventListener("drop", drop);

    return () => {
      window.removeEventListener("dragenter", dragEnter);
      window.removeEventListener("dragleave", dragLeave);
      window.removeEventListener("drop", drop);
    };

  }, []);

  return (
    <>
      {/* NORMAL BOX */}
      <div className="dropzone-big">
        {!file ? (
          <>
            <h2>📂 Drag & Drop file here</h2>
          </>
        ) : (
          <div className="file-inside">
            <div className="file-icon">📄</div>
            {file && (
              <ul className="file-list">
                {[file].map((f, i) => (
                  <li key={i} className="file-item">
                    {f.name}
                  </li>
                ))}
              </ul>
            )}
            <span>Click Convert button for Conversion<p></p></span>

          </div>
        )}
      </div>

      {/* FULL PAGE OVERLAY */}
      {showOverlay && (
        <div
          {...getRootProps()}
          className="page-drop-overlay"
          style={{ top: NAVBAR_HEIGHT }}
        >
          <input {...getInputProps()} />
          <h2>📥 Drop file anywhere</h2>
        </div>
      )}
    </>
  );
};

export default DropzoneInput;
