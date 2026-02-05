import React, { useEffect, useRef, useState } from "react";
// import "./SaveTo.css";
import "./test.css";

import { useLoader } from "./LoaderContext";

const CLIENT_ID =
  "944813734617-fisrviaq1i2e8faentib45tq5jsqpq8c.apps.googleusercontent.com";
const API_KEY = "AIzaSyBaCuq8dNmnjqndvCJ0GKlyotquqKZ_MUM";

const SCOPE = "https://www.googleapis.com/auth/drive.file";

export default function SaveToGoogleDrive({ file, label = "Save to Google Drive" }) {
  const [ready, setReady] = useState(false);
  const [uploading, setUploading] = useState(false);

  const accessTokenRef = useRef(null);
  const tokenClientRef = useRef(null);
  const { setLoading } = useLoader();

  const wait = (ms) => new Promise((res) => setTimeout(res, ms));  // 🔥 FIX

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

        window.gapi.load("client", async () => {
          await window.gapi.client.load("drive", "v3");
          setReady(true);
        });

        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          callback: (tokenResponse) => {
            accessTokenRef.current = tokenResponse.access_token;
            uploadToDrive();
          },
        });
      } catch (err) {
        console.error("Google script load failed:", err);
      }
    };

    loadScripts();
  }, []);

  const handleClick = () => {
    if (!file) return alert("No file available to upload.");
    if (!ready) return alert("Google Drive is loading. Try again.");

    if (accessTokenRef.current) {
      uploadToDrive();
    } else {
      tokenClientRef.current.requestAccessToken();
    }
  };

  const uploadToDrive = async () => {
    try {
      setUploading(true);
    //   setLoading(true);

    //   await wait(150);   
      const metadata = {
        name: file.name,
        mimeType: file.type,
      };

      const boundary = "-------314159265358979323846";
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelim = `\r\n--${boundary}--`;

      const reader = new FileReader();

      reader.onload = async (e) => {
        const content = e.target.result.split(",")[1];

        const body =
          delimiter +
          "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
          JSON.stringify(metadata) +
          delimiter +
          `Content-Type: ${file.type}\r\n` +
          "Content-Transfer-Encoding: base64\r\n\r\n" +
          content +
          closeDelim;

        try {
          // 🔥 Loader starts EXACTLY when upload begins
          setLoading(true);

          const response = await fetch(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessTokenRef.current}`,
                "Content-Type": `multipart/related; boundary=${boundary}`,
              },
              body: body,
            }
          );

          // 🔥 Loader stops only after response
          setLoading(false);

          if (!response.ok) throw new Error(await response.text());

          alert("✅ File uploaded to Google Drive!");
        } catch (err) {
          console.error("Upload error:", err);
          alert("Failed: " + err.message);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
    <div className="gdb">

    <button onClick={handleClick} disabled={!ready || uploading}  className="googleDrivesavebtn no-border-animation" 
      style={{ cursor: uploading ? "not-allowed" : "pointer", }}  >
      <img src="/google-drive.png" alt="" style={{ width: "20px", marginRight: 5 }} />
      {uploading ? "Uploading..." : 'Google Drive'}
    </button>
        </div>
        </>
  );
}
