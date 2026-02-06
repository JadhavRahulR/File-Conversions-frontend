import React, { useRef } from "react";
import { useLoader } from "./LoaderContext";

const DROPBOX_CLIENT_ID = "j92akkp69vnhhm7";

export default function SaveToDropbox({ file }) {
  const { setLoading } = useLoader();
  const popupRef = useRef(null);

  const startAuth = () => {
    if (!file) {
      alert("❌ No file to upload");
      return;
    }

    const redirectUri = `${window.location.origin}/dropbox-auth.html`;

    const authUrl =
  "https://www.dropbox.com/oauth2/authorize" +
  `?client_id=${DROPBOX_CLIENT_ID}` +
  "&response_type=token" +
  `&redirect_uri=${encodeURIComponent(redirectUri)}`;

    popupRef.current = window.open(
      authUrl,
      "dropbox-oauth",
      "width=600,height=700"
    );
  };

  const uploadToDropbox = async (accessToken) => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://content.dropboxapi.com/2/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Dropbox-API-Arg": JSON.stringify({
              path: `/${file.name}`,
              mode: "add",
              autorename: true,
            }),
            "Content-Type": "application/octet-stream",
          },
          body: file,
        }
      );

      if (!res.ok) throw new Error(await res.text());

      alert("✅ File uploaded to Dropbox!");
    } catch (err) {
      console.error("Dropbox upload failed:", err);
      alert("❌ Dropbox upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Called from dropbox-auth.html
  window.handleDropboxAuth = (token) => {
    uploadToDropbox(token);
    popupRef.current?.close();
  };

  return (
    <>
    <div className="gdb">

    <button onClick={startAuth} className="googleDrivesavebtn no-border-animation">
      <img src="/dropbox.png" style={{ width: 20, marginRight:10 }} />
      Dropbox
    </button>
    </div>
    </>
  );
}
