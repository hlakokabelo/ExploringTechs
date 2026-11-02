import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      "scribe.js-ocr",
      // If the error persists, also exclude the native canvas package:
      // '@scribe.js/canvas-win32-x64-msvc',
    ],
  },
});
