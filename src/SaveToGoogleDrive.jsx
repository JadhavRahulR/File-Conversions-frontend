
import React, { useRef, useState } from "react";
// import "./SaveTo.css";
import "./test.css";

import { useLoader } from "./LoaderContext";
import { loadGoogleDriveSDK } from "./googleDriveLoader";

const CLIENT_ID =
  "944813734617-fisrviaq1i2e8faentib45tq5jsqpq8c.apps.googleusercontent.com";

const API_KEY =
  "AIzaSyBaCuq8dNmnjqndvCJ0GKlyotquqKZ_MUM";

const SCOPE =
  "https://www.googleapis.com/auth/drive.file";

export default function SaveToGoogleDrive({
  file,
  label = "Save to Google Drive",
}) {
  const [ready, setReady] = useState(false);
  const [loadingGoogle, setLoadingGoogle] =
    useState(false);
  const [uploading, setUploading] = useState(false);

  const accessTokenRef = useRef(null);
  const tokenClientRef = useRef(null);

  const { setLoading } = useLoader();

  const wait = (ms) =>
    new Promise((res) => setTimeout(res, ms));

  // ==========================================================
  // INITIALIZE GOOGLE DRIVE
  // ==========================================================

  const initializeGoogleDrive = async () => {
    try {
      setLoadingGoogle(true);

      // ======================================================
      // LOAD GOOGLE SDK ONLY AFTER BUTTON CLICK
      // ======================================================

      await loadGoogleDriveSDK({
        client: true,
      });

      // ======================================================
      // INITIALIZE OAUTH CLIENT
      // ======================================================

      if (!tokenClientRef.current) {
        tokenClientRef.current =
          window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPE,

            callback: (tokenResponse) => {
              if (tokenResponse?.access_token) {
                accessTokenRef.current =
                  tokenResponse.access_token;

                uploadToDrive();
              } else {
                console.error(
                  "Google authorization failed"
                );
              }
            },
          });
      }

      setReady(true);
      setLoadingGoogle(false);

      // ======================================================
      // REQUEST ACCESS TOKEN
      // ======================================================

      if (!accessTokenRef.current) {
        tokenClientRef.current.requestAccessToken();
      } else {
        uploadToDrive();
      }
    } catch (err) {
      console.error(
        "Google Drive initialization error:",
        err
      );

      setLoadingGoogle(false);
      setReady(false);

      alert(
        "Google Drive failed to load. Please try again."
      );
    }
  };

  // ==========================================================
  // BUTTON CLICK
  // ==========================================================

  const handleClick = async () => {
    if (!file) {
      return alert(
        "No file available to upload."
      );
    }

    // First click → load Google SDK
    if (!ready || !tokenClientRef.current) {
      await initializeGoogleDrive();
      return;
    }

    // SDK already loaded
    if (accessTokenRef.current) {
      uploadToDrive();
    } else {
      tokenClientRef.current.requestAccessToken();
    }
  };

  // ==========================================================
  // UPLOAD TO GOOGLE DRIVE
  // ==========================================================

  const uploadToDrive = async () => {
    try {
      setUploading(true);

      // await wait(150);

      const metadata = {
        name: file.name,
        mimeType: file.type,
      };

      const boundary =
        "-------314159265358979323846";

      const delimiter =
        `\r\n--${boundary}\r\n`;

      const closeDelim =
        `\r\n--${boundary}--`;

      const reader = new FileReader();

      reader.onload = async (e) => {
        const content =
          e.target.result.split(",")[1];

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
          // Loader starts exactly when upload begins
          setLoading(true);

          const response = await fetch(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
            {
              method: "POST",

              headers: {
                Authorization: `Bearer ${accessTokenRef.current}`,

                "Content-Type":
                  `multipart/related; boundary=${boundary}`,
              },

              body: body,
            }
          );

          // Loader stops after response
          setLoading(false);

          if (!response.ok) {
            throw new Error(
              await response.text()
            );
          }

          alert(
            "✅ File uploaded to Google Drive!"
          );
        } catch (err) {
          console.error(
            "Upload error:",
            err
          );

          alert(
            "Failed: " + err.message
          );
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(
        "Upload failed:",
        err
      );

      alert(
        "Failed: " + err.message
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <>
      <div className="gdb">
        <button
          onClick={handleClick}
          disabled={loadingGoogle || uploading}
          className="googleDrivesavebtn no-border-animation"
          style={{
            cursor:
              loadingGoogle || uploading
                ? "not-allowed"
                : "pointer",
          }}
        >
          <img
            src="/google-drive.png"
            alt=""
            style={{
              width: "20px",
              marginRight: 5,
            }}
          />

          {loadingGoogle
            ? "Loading Google Drive..."
            : uploading
            ? "Uploading..."
            : "Google Drive"}
        </button>
      </div>
    </>
  );
}

