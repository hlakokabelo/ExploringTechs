import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  worker: {
    format: "es",
    rollupOptions: {
      external: ["@scribe.js/canvas-win32-x64-msvc"],
    },
  },

  build: {
    rollupOptions: {
      external: ["@scribe.js/canvas-win32-x64-msvc"],
    },
  },

  optimizeDeps: {
    exclude: ["scribe.js-ocr", "@scribe.js/canvas-win32-x64-msvc"],
  },
});
