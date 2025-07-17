import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./DropzoneInput.css";

const DropzoneInput = ({ acceptedType = [], onFileAccepted, setStatus, file }) => {
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
    md:"text/markdown",
    odp:"application/vnd.oasis.opendocument.presentation",
    odt:"application/vnd.oasis.opendocument.text",
    rtf:"application/rtf",
  };

  // Build accept object for react-dropzone
  const accept = {};
  acceptedType.forEach((type) => {
    const mime = getMimeMap[type];
    if (mime) {
      if (!accept[mime]) accept[mime] = [];
      accept[mime].push(`.${type}`);
    }
  });

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        alert(`❌ Only ${acceptedType.join(", ")} files are allowed.`);
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
        if (setStatus) setStatus("Convert");
      }
    },
    [onFileAccepted, acceptedType, setStatus]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone-container ${isDragActive ? "drag-active" : ""}`}
    >
      <input {...getInputProps()} />
      {file ? (
        <>
        <p>📄 File selected: {file.name} — </p>
        <span><strong>Click  button below to start</strong></span>
        </>
      ) : isDragActive ? (
        <p>📥 Drop your {acceptedType.map(t => `.${t}`).join(", ")} file here...and click convert button  </p>
      ) : (
        <p>📂 Drag & drop a {acceptedType.map(t => `.${t}`).join(", ")} file here, or click to select</p>
      )}
    </div>
  );
};

export default DropzoneInput;
