import { lazy, type LazyExoticComponent, type ComponentType } from "react";

export interface tech {
  /** URL slug — also the folder name under src/techs/ */
  id: string;
  title: string;
  description: string;
  /** Emoji or single character shown on the card */
  icon: string;
  /** Tech stack shown as small pills on the card */
  tags: string[];
  /** Lazy-loaded so heavy deps (like scribe.js) only load when visited */
  component: LazyExoticComponent<ComponentType>;
}

export const techs: tech[] = [
  {
    id: "ocr-compare",
    title: "OCR Comparison",
    description:
      "Extract text from images and PDFs. Compare Tesseract.js vs Scribe.js side-by-side.",
    icon: "🔍",
    tags: ["tesseract.js", "scribe.js", "pdf", "drag & drop"],
    component: lazy(() => import("./ocr-compare")),
  },
  // Add more techs here — one entry per folder below.
  // {
  //   id: 'barcode-scanner',
  //   title: 'Barcode Scanner',
  //   description: 'Detect 1D and 2D barcodes from camera or uploaded image.',
  //   icon: '📷',
  //   tags: ['zxing', 'camera'],
  //   component: lazy(() => import('./barcode-scanner')),
  // },
];
