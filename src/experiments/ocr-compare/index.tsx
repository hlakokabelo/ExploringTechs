import { useState } from "react";
import TesseractOCR from "./TesseractOCR";
import ScribeOCR from "./ScribeOCR";
import "./ocr.css";

export default function OCRCompare() {
  const [method, setMethod] = useState<"tesseract" | "scribe">("tesseract");

  return (
    <div className="ocr-compare">
      <div className="tab-bar">
        <button
          className={method === "tesseract" ? "active" : ""}
          onClick={() => setMethod("tesseract")}
        >
          Tesseract.js <span className="badge">Images</span>
        </button>
        <button
          className={method === "scribe" ? "active" : ""}
          onClick={() => setMethod("scribe")}
        >
          Scribe.js <span className="badge">Images + PDFs</span>
        </button>
      </div>

      {method === "tesseract" ? <TesseractOCR /> : <ScribeOCR />}
    </div>
  );
}
