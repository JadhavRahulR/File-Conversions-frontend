import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./test.css";

import { useLoader } from "./LoaderContext";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const CLIENT_ID =
  "944813734617-fisrviaq1i2e8faentib45tq5jsqpq8c.apps.googleusercontent.com";

const SCOPE = "https://www.googleapis.com/auth/drive.file";

export default function SaveToGoogleDriveCloud({
  fileId,
  fileName,
  mimeType = "application/pdf",
  label = "Google Drive"
}) {
  const [uploading, setUploading] = useState(false);
  const [ready, setReady] = useState(false);
  const { setLoading } = useLoader();

  const tokenClientRef = useRef(null);

  // 🔹 Load Google Identity script
  useEffect(() => {
    if (window.google?.accounts?.oauth2) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);

  // 🔹 Init token client ONCE
  useEffect(() => {
    if (!ready || tokenClientRef.current) return;

    tokenClientRef.current =
      window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: ({ access_token }) => {
          localStorage.setItem("googleAccessToken", access_token);
          uploadToDrive(access_token);
        }
      });
  }, [ready]);

  // 🔹 Backend → Google Drive upload
  const uploadToDrive = async (accessToken) => {
    if (!fileId) {
      alert("❌ File ID missing");
      return;
    }

    setUploading(true);
    setLoading(true)
    try {
      await axios.post(`${BASE_URL}/save-to-drive`, {
        fileId,
        fileName,
        mimeType,
        accessToken
      });
      
      alert("✅ Saved to Google Drive");
      setLoading(false)

    } catch (err) {
      // 🔥 Token invalid / expired → force re-auth
      if (err.response?.status === 401) {
        localStorage.removeItem("googleAccessToken");
        tokenClientRef.current?.requestAccessToken({ prompt: "consent" });
        return;
      }

      console.error("Drive upload failed:", err);
      alert("❌ Failed to save to Google Drive");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Button handler
  const handleSave = () => {
    if (!ready || uploading) return;

    const token = localStorage.getItem("googleAccessToken");

    if (!token) {
      tokenClientRef.current?.requestAccessToken();
      return;
    }

    uploadToDrive(token);
  };

  return (
    <div className="gdb">
      <button
        onClick={handleSave}
        disabled={!ready || uploading}
        className="googleDrivesavebtn no-border-animation"
        style={{ cursor: uploading ? "not-allowed" : "pointer" }}
      >
        <img
          src="/google-drive.png"
          alt="Google Drive"
          style={{ width: "20px", marginRight: 5 }}
        />
        {uploading ? "Saving..." : label}
      </button>
    </div>
  );
}