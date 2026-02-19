import React, { useEffect } from "react";
import { useLoader } from "./LoaderContext";


const DropboxFileInput = ({ onFilePicked, setStatus, extensions = ['.pdf', '.csv','.docx','.html','.jpg','.png','.jpeg','.md','.odp','.odt','.pptx','.rtf','.tiff','.txt','.xlsx','.bmp','.webp','.gif'] }) => {
  const { setLoading } = useLoader();
  
  useEffect(() => {
    // Load Dropbox SDK if not already loaded
    if (!document.getElementById("dropboxjs")) {
      const script = document.createElement("script");
      script.src = "https://www.dropbox.com/static/api/2/dropins.js";
      script.id = "dropboxjs";
      script.type = "text/javascript";
      script.setAttribute("data-app-key", "j92akkp69vnhhm7"); // Replace with your Dropbox App Key
      document.body.appendChild(script);
    }
  }, []);

  const handleDropboxChoose = () => {
    const options = {
      linkType: "direct",
      multiselect: false,
      extensions, // Accept file types passed via props

      success: async function (files) {
        const file = files[0];
        console.log("📥 Dropbox file selected:", file);

        // Convert link to direct raw access
        let url = file.link;
        if (url.includes("?dl=0")) {
          url = url.replace("?dl=0", "?raw=1");
        }
        setLoading(true);

        try {
          const res = await fetch(url);
          if (!res.ok || !res.body) throw new Error("Stream not available");

          const contentLength = res.headers.get("Content-Length");
          const totalBytes = parseInt(contentLength) || null;

          const reader = res.body.getReader();
          const chunks = [];
          let receivedLength = 0;

          // Start reading the file in chunks
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

          // File download complete
          const blob = new Blob(chunks);
          const namedFile = new File([blob], file.name, { type: blob.type });

          onFilePicked(namedFile);
          setLoading(false);
          setStatus("Convert");
          console.log("✅ File download completed");
        } catch (error) {
          console.error("❌ Dropbox fetch failed:", error);
          alert("Failed to download Dropbox file.");
          setStatus("Upload");
        }
      },

      cancel: function () {
        console.log("❌ Dropbox picker cancelled");
        setStatus("Upload");
      }
    };

    if (window.Dropbox) {
      window.Dropbox.choose(options);
    } else {
      alert("Dropbox SDK not loaded yet.");
    }
  };

  return (
    <div>
      <div className="drivfileinputcontainer">

        <p onClick={handleDropboxChoose} className="googleDrivebtn">
          <img src="/dropbox.png" alt="" style={{ width: "20px", marginRight: '5px' }} /> Dropbox
        </p>
      </div>
    </div>
  );
};

export default DropboxFileInput;
