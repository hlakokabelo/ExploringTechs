import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const nativeCanvasPackages = [
  "@scribe.js/canvas-win32-x64-msvc",
  "@scribe.js/canvas-linux-x64-gnu",
  "@scribe.js/canvas-darwin-x64",
  "@scribe.js/canvas-darwin-arm64",
];

export default defineConfig({
  plugins: [react()],

  worker: {
    format: "es",
    rollupOptions: {
      external: nativeCanvasPackages,
    },
  },

  build: {
    rollupOptions: {
      external: nativeCanvasPackages,
    },
  },

  optimizeDeps: {
    exclude: ["scribe.js-ocr", "@scribe.js/canvas"],
  },
});
