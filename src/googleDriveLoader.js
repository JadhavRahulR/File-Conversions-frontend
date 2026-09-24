
// ==========================================================
// GOOGLE DRIVE SHARED SDK LOADER
// ==========================================================
// Google APIs page load par load nahi hongi.
// DriveFileInput / SaveToGoogleDrive jab zarurat hogi tab
// loadGoogleDriveSDK() call karenge.
//
// Multiple components same time par SDK request karein,
// tab bhi scripts sirf ONE TIME load hongi.
// ==========================================================

let googleDriveSDKPromise = null;

// ==========================================================
// LOAD SINGLE SCRIPT
// ==========================================================

const loadScript = (src, id) => {
  return new Promise((resolve, reject) => {
    // Script already exists
    const existingScript = document.getElementById(id);

    if (existingScript) {
      // Already loaded
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }

      // Currently loading
      existingScript.addEventListener("load", resolve, {
        once: true,
      });

      existingScript.addEventListener("error", reject, {
        once: true,
      });

      return;
    }

    const script = document.createElement("script");

    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };

    script.onerror = () => {
      script.remove();
      reject(
        new Error(`Failed to load Google script: ${src}`)
      );
    };

    document.head.appendChild(script);
  });
};

// ==========================================================
// LOAD GOOGLE DRIVE SDK
// ==========================================================

export const loadGoogleDriveSDK = async ({
  picker = false,
  client = false,
} = {}) => {
  // If SDK is already loading/loaded, reuse the same Promise.
  if (!googleDriveSDKPromise) {
    googleDriveSDKPromise = (async () => {
      // ----------------------------------------------------
      // Google API client
      // ----------------------------------------------------

      await loadScript(
        "https://apis.google.com/js/api.js",
        "google-api-client-script"
      );

      // ----------------------------------------------------
      // Google Identity Services
      // ----------------------------------------------------

      await loadScript(
        "https://accounts.google.com/gsi/client",
        "google-identity-services-script"
      );

      // ----------------------------------------------------
      // Google Picker
      // ----------------------------------------------------

      if (picker) {
        await new Promise((resolve, reject) => {
          if (!window.gapi) {
            reject(
              new Error("Google API client is unavailable")
            );
            return;
          }

          window.gapi.load("picker", {
            callback: resolve,

            onerror: () => {
              reject(
                new Error(
                  "Google Picker failed to load"
                )
              );
            },
          });
        });
      }

      // ----------------------------------------------------
      // Google Drive API client
      // ----------------------------------------------------

      if (client) {
        await new Promise((resolve, reject) => {
          if (!window.gapi) {
            reject(
              new Error("Google API client is unavailable")
            );
            return;
          }

          window.gapi.load("client", async () => {
            try {
              await window.gapi.client.load(
                "drive",
                "v3"
              );

              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
      }

      // ----------------------------------------------------
      // Verify Google Identity Services
      // ----------------------------------------------------

      if (
        !window.google?.accounts?.oauth2
      ) {
        throw new Error(
          "Google Identity Services failed to initialize"
        );
      }
    })().catch((error) => {
      // If loading fails, allow a future click to retry.
      googleDriveSDKPromise = null;

      throw error;
    });
  }

  return googleDriveSDKPromise;
};

