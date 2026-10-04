let dropboxSDKPromise;

export function loadDropboxSDK() {
  if (window.Dropbox) {
    return Promise.resolve();
  }

  if (dropboxSDKPromise) {
    return dropboxSDKPromise;
  }

  dropboxSDKPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById("dropboxjs");

    if (existingScript) {
      existingScript.addEventListener("load", resolve);
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");

    script.id = "dropboxjs";
    script.src = "https://www.dropbox.com/static/api/2/dropins.js";
    script.type = "text/javascript";
    script.setAttribute(
      "data-app-key",
      "j92akkp69vnhhm7"
    );

    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });

  return dropboxSDKPromise;
}