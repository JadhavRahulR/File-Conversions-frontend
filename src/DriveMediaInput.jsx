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
    ".webp": "image/webp",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".webm": "video/webm",
    ".mkv": "video/x-matroska",
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
const DriveMediaInput = ({
    onFilePicked,
    setStatus,
    allowedTypes = [
        ".mp3",
        ".wav",
        ".m4a",
        ".ogg",
        ".mp4",
        ".mov",
        ".avi",
        ".webm",
        ".mkv",
    ],
    useBackend = false,
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
        setStatus("Upload");

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
  .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
  .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
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

  const selectedFiles = [];

  console.log("Docs:", data.docs);
console.log("Count:", data.docs.length);
  const token = accessTokenRef.current;

  try {
    setLoading(true);

    for (let picked of data.docs) {

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

      const lower = fileName.toLowerCase();

      let downloadUrl =
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

      if (mime === "application/vnd.google-apps.document") {
        downloadUrl =
          `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`;

        fileName =
          fileName.replace(/\.[^.]+$/, "") + ".pdf";
      }

      const res = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok)
        throw new Error("HTTP " + res.status);

      const blob = await res.blob();

      selectedFiles.push(
        new File(
          [blob],
          fileName,
          {
            type: blob.type || mime,
          }
        )
      );
    }

    onFilePicked(selectedFiles);
    setStatus("Files loaded!");

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

export default DriveMediaInput;;
