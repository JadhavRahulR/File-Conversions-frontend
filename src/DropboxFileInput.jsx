import React, { useState } from "react";
import { useLoader } from "./LoaderContext";
import { loadDropboxSDK } from "./dropboxLoader";

const DropboxFileInput = ({
  onFilePicked,
  setStatus,
  extensions = [
    ".pdf",
    ".csv",
    ".docx",
    ".html",
    ".jpg",
    ".png",
    ".jpeg",
    ".md",
    ".odp",
    ".odt",
    ".pptx",
    ".rtf",
    ".tiff",
    ".txt",
    ".xlsx",
    ".bmp",
    ".webp",
    ".gif",
  ],
}) => {
  const { setLoading } = useLoader();
  const [loadingDropbox, setLoadingDropbox] = useState(false);

  const handleDropboxChoose = async () => {
    if (loadingDropbox) return;

    try {
      setLoadingDropbox(true);
      setStatus("Loading Dropbox...");

      // Load Dropbox SDK only when user clicks
      await loadDropboxSDK();

      if (!window.Dropbox) {
        throw new Error("Dropbox SDK is not available.");
      }

      const options = {
        linkType: "direct",
        multiselect: false,
        extensions,

        success: async function (files) {
          const file = files?.[0];

          if (!file) {
            setStatus("Upload");
            return;
          }

          console.log("📥 Dropbox file selected:", file);

          let url = file.link;

          if (url.includes("?dl=0")) {
            url = url.replace("?dl=0", "?raw=1");
          }

          setLoading(true);
          setStatus("Downloading...");

          try {
            const res = await fetch(url);

            if (!res.ok || !res.body) {
              throw new Error("Stream not available");
            }

            const contentLength = res.headers.get("Content-Length");
            const totalBytes = parseInt(contentLength, 10) || null;

            const reader = res.body.getReader();
            const chunks = [];

            let receivedLength = 0;

            while (true) {
              const { done, value } = await reader.read();

              if (done) break;

              chunks.push(value);
              receivedLength += value.length;

              if (totalBytes) {
                const percent = Math.round(
                  (receivedLength / totalBytes) * 100
                );

                setStatus(`Downloading... ${percent}%`);
              } else {
                setStatus(
                  `Downloading... ${Math.round(
                    receivedLength / 1024
                  )} KB`
                );
              }
            }

            const blob = new Blob(chunks);

            const namedFile = new File([blob], file.name, {
              type: blob.type || "",
            });

            onFilePicked(namedFile);

            setStatus("Convert");

            console.log("✅ File download completed");
          } catch (error) {
            console.error("❌ Dropbox fetch failed:", error);

            alert("Failed to download Dropbox file.");

            setStatus("Upload");
          } finally {
            setLoading(false);
          }
        },

        cancel: function () {
          console.log("❌ Dropbox picker cancelled");

          setStatus("Upload");
        },
      };

      window.Dropbox.choose(options);
    } catch (error) {
      console.error("❌ Dropbox SDK error:", error);

      alert("Dropbox failed to load.");

      setStatus("Upload");
    } finally {
      setLoadingDropbox(false);
    }
  };

  return (
    <div>
      <div className="drivfileinputcontainer">
        <p
          onClick={handleDropboxChoose}
          className="googleDrivebtn"
          style={{
            cursor: loadingDropbox ? "wait" : "pointer",
          }}
        >
          <img src="/dropbox.png" alt="" />

          {loadingDropbox ? "Loading ..." : "Dropbox"}
        </p>
      </div>
    </div>
  );
};

export default DropboxFileInput;