import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import "./DropzoneInput.css";

const NAVBAR_HEIGHT = 70;

export default function MediaDropzoneInput({
  onFilesAccepted,
  accept = {},
  multiple = false,
  overlayText = "📂 Drop Files Here",
  filenam=''
}) {
  const [showOverlay, setShowOverlay] =
    useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setShowOverlay(false);

      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles);
      }
    },
    [onFilesAccepted]
  );

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop,
    accept,
    multiple,
    noClick: true,
  });

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

    window.addEventListener(
      "dragenter",
      dragEnter
    );
    window.addEventListener(
      "dragleave",
      dragLeave
    );
    window.addEventListener("drop", drop);

    return () => {
      window.removeEventListener(
        "dragenter",
        dragEnter
      );
      window.removeEventListener(
        "dragleave",
        dragLeave
      );
      window.removeEventListener("drop", drop);
    };
  }, []);
const isMobile = window.innerWidth <= 468;

return (
  <>
    {!isMobile && (
      <div className="dropzone-big">
        <p>🎵 Drag & Drop {filenam} files anywhere on screen</p>
      </div>
    )}

    {!isMobile && showOverlay && (
      <div
        {...getRootProps()}
        className="page-drop-overlay"
        style={{ top: NAVBAR_HEIGHT }}
      >
        <input {...getInputProps()} />
        <h2>{overlayText}</h2>
      </div>
    )}
  </>
);}