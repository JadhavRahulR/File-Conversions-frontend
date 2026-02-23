// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  assetsInclude: ["**/*.wasm"],

  build: {
    target: "esnext",
  },

  // ✅ REQUIRED for @jsquash/avif (WebWorker + code-splitting)
  worker: {
    format: "es",
  },

  optimizeDeps: {
    exclude: ["@jsquash/avif"],
  },

  server: {
    fs: { strict: false },

    // 👇 IMPORTANT: disable COEP for Dropbox / Drive in dev
    headers:
      mode === "development"
        ? {}
        : {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
          },
  },
}));