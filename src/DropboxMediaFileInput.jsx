import React, { useEffect } from "react";
import { useLoader } from "./LoaderContext";


const DropboxMediaFileInput = ({
  onFilePicked,
  setStatus,
  extensions = [
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
}) => {
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
      multiselect: true,
      extensions, // Accept file types passed via props

      success: async function (files) {
  const selectedFiles = [];

  try {
    setLoading(true);

    for (const file of files) {
      let url = file.link;

      if (url.includes("?dl=0")) {
        url = url.replace("?dl=0", "?raw=1");
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();

      selectedFiles.push(
        new File(
          [blob],
          file.name,
          { type: blob.type }
        )
      );
    }

    onFilePicked(selectedFiles);
    setStatus("Files loaded!");
  } catch (error) {
    console.error(error);
    setStatus("Upload");
  } finally {
    setLoading(false);
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

export default DropboxMediaFileInput;
