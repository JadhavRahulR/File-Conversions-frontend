import React, { useEffect, useRef, useState } from "react";
import "./drivefileinput.css";
import { useLoader } from "./LoaderContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ==========================================================
// EXT → MIME
// ==========================================================
const extensionToMimeType = {
  ".pdf": "application/pdf",
  ".csv": "text/csv",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".odp": "application/vnd.oasis.opendocument.presentation",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".txt": "text/plain",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".rtf": "application/rtf",
  ".html": "text/html",
  ".md": "text/markdown",
  ".zip": [
    "application/zip",
    "application/x-zip-compressed",
    "application/octet-stream",
  ],
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".bmp": "image/bmp",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
};

// ==========================================================
// GOOGLE CONFIG
// ==========================================================
const CLIENT_ID =
  "944813734617-fisrviaq1i2e8faentib45tq5jsqpq8c.apps.googleusercontent.com";
const API_KEY = "AIzaSyBaCuq8dNmnjqndvCJ0GKlyotquqKZ_MUM";
const SCOPE = "https://www.googleapis.com/auth/drive.file";

// ==========================================================
// COMPONENT
// ==========================================================
const DriveFileInput = ({
  onFilePicked,
  setStatus,
  allowedTypes = [
    ".pdf",
    ".csv",
    ".docx",
    ".rtf",
    ".tiff",
    ".txt",
    ".xlsx",
    ".html",
    ".jpg",
    ".png",
    ".jpeg",
    ".odt",
    ".odp",
    ".bmp",
    ".md",
    ".zip",
  ],
  useBackend = false, // ✅ SAFE DEFAULT
}) => {
  const [pickerReady, setPickerReady] = useState(false);
  const { setLoading } = useLoader();

  const accessTokenRef = useRef(null);
  const tokenClientRef = useRef(null);

  // ==========================================================
  // LOAD GOOGLE API
  // ==========================================================
  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });

    const init = async () => {
      try {
        await loadScript("https://apis.google.com/js/api.js");
        await loadScript("https://accounts.google.com/gsi/client");

        window.gapi.load("picker", () => setPickerReady(true));

        tokenClientRef.current =
          window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPE,
            callback: (tokenResponse) => {
              accessTokenRef.current = tokenResponse.access_token;
              openPicker();
            },
          });
      } catch (err) {
        console.error("Google API error", err);
      }
    };

    init();
  }, []);

  // ==========================================================
  // AUTH → PICKER
  // ==========================================================
  const handleDriveClick = () => {
    if (!pickerReady) return setStatus("Picker not ready");

    if (!accessTokenRef.current)
      tokenClientRef.current.requestAccessToken();
    else openPicker();
  };

  // ==========================================================
  // OPEN PICKER
  // ==========================================================
  const openPicker = () => {
    setStatus("Opening Google Drive...");

    const mimeTypes = allowedTypes
      .map((ext) => extensionToMimeType[ext])
      .flat()
      .filter(Boolean)
      .join(",");

    const view = new window.google.picker.DocsView()
      .setMimeTypes(mimeTypes)
      .setMode(window.google.picker.DocsViewMode.LIST);

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .enableFeature(window.google.picker.Feature.MULTISELECT_DISABLED)
      .setOAuthToken(accessTokenRef.current)
      .setDeveloperKey(API_KEY)
      .setCallback(pickerCallback)
      .build();

    picker.setVisible(true);
  };

  // ==========================================================
  // PICKER CALLBACK
  // ==========================================================
  const pickerCallback = async (data) => {
    if (data.action !== window.google.picker.Action.PICKED) return;

    let picked = data.docs[0];

    // Fix shortcut
    if (
      picked.mimeType === "application/vnd.google-apps.shortcut" &&
      picked.shortcutDetails?.targetId
    ) {
      picked.id = picked.shortcutDetails.targetId;
      picked.mimeType = picked.shortcutDetails.targetMimeType;
    }

    const fileId = picked.id;
    let fileName = picked.name;
    let mime = picked.mimeType;
    const token = accessTokenRef.current;

    const lower = fileName.toLowerCase();
    const isZip = lower.endsWith(".zip");
    const isFavicon =
      lower.endsWith(".ico") ||
      lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg");

    const shouldUseBackend = isZip || isFavicon || useBackend;

    // ================= BACKEND =================
    if (shouldUseBackend) {
      try {
        setLoading(true);
        setStatus("Downloading via backend...");

        const res = await fetch(`${BASE_URL}/fetch-drive-file`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileId,
            fileName,
            accessToken: token,
          }),
        });

        
        if (!res.ok) throw new Error("Backend fetch failed");

        const buffer = await res.arrayBuffer();
        const blob = new Blob([buffer]);

        onFilePicked(new File([blob], fileName, { type: blob.type || mime }));
        setStatus("Loaded via backend!");
      } catch (err) {
        console.error(err);
        setStatus("Drive backend error");
      } finally {
        setLoading(false);
      }
      return;
    }

    // ================= FRONTEND =================
    try {
      setLoading(true);
      setStatus("Downloading...");

      let downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

      if (mime === "application/vnd.google-apps.document") {
        downloadUrl =
          `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`;
        fileName = fileName.replace(/\.[^.]+$/, "") + ".pdf";
      }

      const res = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      const blob = await res.blob();
      onFilePicked(new File([blob], fileName, { type: blob.type || mime }));
      setStatus("File loaded!");
    } catch (err) {
      console.error(err);
      setStatus("Google Drive error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drivfileinputcontainer">
      <p onClick={handleDriveClick} className="googleDrivebtn">
        <img src="/google-drive.png" alt="" style={{ width: 20 }} />
        Google Drive
      </p>
    </div>
  );
};

export default DriveFileInput;
