import React, { useEffect, useRef } from "react";

const GoogleDrivePicker = ({ onFilePicked }) => {
  const tokenClient = useRef(null);
  const accessToken = useRef(null);

  useEffect(() => {
    const initialize = () => {
      // Load Google APIs
      window.gapi.load("client:picker", async () => {
        await window.gapi.client.init({
          apiKey: "AIzaSyBaCuq8dNmnjqndvCJ0GKlyotquqKZ_MUM",
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        });

        // ✅ Setup token client after gapi loads
        tokenClient.current = window.google.accounts.oauth2.initTokenClient({
          client_id: "944813734617-fisrviaq1i2e8faentib45tq5jsqpq8c.apps.googleusercontent.com",
          scope: "https://www.googleapis.com/auth/drive.readonly",
          callback: (tokenResponse) => {
            accessToken.current = tokenResponse.access_token;
            openPicker();
          },
        });
      });
    };

    // Load GSI & gapi
    const script1 = document.createElement("script");
    script1.src = "https://accounts.google.com/gsi/client";
    script1.async = true;
    script1.defer = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://apis.google.com/js/api.js";
    script2.onload = initialize;
    document.body.appendChild(script2);
  }, []);

  const handlePickClick = () => {
    if (tokenClient.current) {
      tokenClient.current.requestAccessToken();
    } else {
      console.error("❌ Token client not ready");
    }
  };

  const openPicker = () => {
    if (!window.google || !window.google.picker) {
      console.error("❌ Picker not loaded yet");
      return;
    }

    const view = new window.google.picker.DocsView()
      .setIncludeFolders(true)
      .setMimeTypes("application/pdf");

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(accessToken.current)
      .setDeveloperKey("AIzaSyBaCuq8dNmnjqndvCJ0GKlyotquqKZ_MUM")
      .setCallback((data) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const file = data.docs[0];
          onFilePicked({ fileId: file.id, fileName: file.name });
        }
      })
      .build();

    picker.setVisible(true);
  };

  return (
    <div>
      <button onClick={handlePickClick}>📂 Choose from Drive</button>
    </div>
  );
};

export default GoogleDrivePicker;
