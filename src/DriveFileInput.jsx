import React, { useEffect, useRef, useState } from "react";
import "./drivefileinput.css"

const extensionToMimeType = {
  ".pdf": "application/pdf",
  ".csv": "text/csv",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".odp": "application/vnd.oasis.opendocument.presentation",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".txt": "text/plain",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".rtf": "application/rtf",
  ".html": "text/html",
  ".md": "text/markdown",
  ".zip": "application/zip",
   ".jpg": "image/jpg",
  ".jpeg": "image/jpeg",
  ".png": "image/png"
};

  const CLIENT_ID = "944813734617-fisrviaq1i2e8faentib45tq5jsqpq8c.apps.googleusercontent.com";
  const API_KEY = "AIzaSyBaCuq8dNmnjqndvCJ0GKlyotquqKZ_MUM";

const SCOPE = "https://www.googleapis.com/auth/drive.readonly";

const DriveFileInput = ({ onFilePicked, setStatus, allowedTypes = ['.pdf', '.csv','.docx',".rtf",'.tiff','.txt','.lxsx','.html','.jpg','.png','.jpeg'] }) => {
  const [pickerReady, setPickerReady] = useState(false);
  const accessTokenRef = useRef(null);
  const tokenClientRef = useRef(null);

  useEffect(() => {
    const loadScripts = async () => {
      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

      try {
        await loadScript("https://apis.google.com/js/api.js");
        await loadScript("https://accounts.google.com/gsi/client");

        window.gapi.load("picker", () => {
          console.log("✅ Picker loaded");
          setPickerReady(true);
        });

        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          callback: (tokenResponse) => {
            accessTokenRef.current = tokenResponse.access_token;
            console.log("🔐 Access Token:", tokenResponse.access_token);
            openPicker();
          },
        });
      } catch (err) {
        console.error("❌ Failed to load Google scripts", err);
      }
    };

    loadScripts();
  }, []);

  const handleDriveClick = () => {
    if (!pickerReady) return setStatus("Picker not ready");

    setStatus("Authorizing...");
    if (accessTokenRef.current) {
      openPicker();
    } else {
      tokenClientRef.current.requestAccessToken();
    }
  };

  const openPicker = () => {
    setStatus("Opening Google Drive...");

    const mimeTypes = allowedTypes
      .map((ext) => extensionToMimeType[ext])
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

  const pickerCallback = async (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const fileId = data.docs[0].id;
      const fileName = data.docs[0].name;
      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

      try {
        setStatus("Connecting to Drive...");

        const response = await fetch(downloadUrl, {
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
          },
        });

        const contentLength = response.headers.get("Content-Length");
        const totalBytes = contentLength ? parseInt(contentLength, 10) : null;

        if (!response.body) throw new Error("ReadableStream not supported");

        const reader = response.body.getReader();
        const chunks = [];
        let receivedLength = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          if (totalBytes) {
            const percent = Math.round((receivedLength / totalBytes) * 100);
            setStatus(`Downloading... ${percent}%`);
          } else {
            setStatus(`Downloading... ${Math.round(receivedLength / 1024)} KB`);
          }
        }

        const blob = new Blob(chunks);
        const file = new File([blob], fileName, { type: blob.type });

        setStatus("Convert");
        onFilePicked(file);
      } catch (error) {
        console.error("❌ Error during download:", error);
        setStatus("❌ Failed to fetch file");
      }
    }
  };

  return (
    <>
    <div className="drivfileinputcontainer">

    <p onClick={handleDriveClick} className="googleDrivebtn">
      <img src="/google-drive.png" alt="" style={{width:"20px",marginRight:'5px'}}/>Google Drive
    </p>
    </div>
    </>
  );
};

export default DriveFileInput;