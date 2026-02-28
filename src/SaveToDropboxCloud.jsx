import React from "react";
import "./test.css"; // 🔁 SAME CSS

export default function SaveToDropboxCloud({
  downloadUrl,
  fileName,
  label = "Dropbox"
}) {
  const handleSave = () => {
    if (!downloadUrl) {
      alert("❌ File URL not found");
      return;
    }

    const dropboxUrl = `https://www.dropbox.com/save?url=${encodeURIComponent(
      downloadUrl
    )}&filename=${encodeURIComponent(fileName)}`;

    window.open(dropboxUrl, "_blank");
  };

  return (
    <div className="gdb">
      <button
        onClick={handleSave}
        className="googleDrivesavebtn no-border-animation"
      >
        <img
          src="/dropbox.png"
          alt=""
          style={{ width: "20px", marginRight: 5 }}
        />
        {label}
      </button>
    </div>
  );
}