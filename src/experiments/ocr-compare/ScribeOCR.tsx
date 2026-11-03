import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import scribe from "scribe.js-ocr";

import { useScribeStore } from "./store/scribeStore";
scribe.opt.workerN = 2;

const ScribeOCR: React.FC = () => {
  const imageUrl = useScribeStore((s) => s.imageUrl);
  const fileType = useScribeStore((s) => s.fileType);
  const fileName = useScribeStore((s) => s.fileName);
  const text = useScribeStore((s) => s.text);
  const isLoading = useScribeStore((s) => s.isLoading);
  const duration = useScribeStore((s) => s.duration);
  const error = useScribeStore((s) => s.error);

  const setFile = useScribeStore((s) => s.setFile);
  const setText = useScribeStore((s) => s.setText);
  const setLoading = useScribeStore((s) => s.setLoading);
  const setDuration = useScribeStore((s) => s.setDuration);
  const setError = useScribeStore((s) => s.setError);

  const runOCR = useCallback(
    async (file: File) => {
      setLoading(true);
      setDuration(null);
      setError(null);

      const startTime = performance.now();

      let doc: Awaited<ReturnType<typeof scribe.openDocument>> | undefined;

      try {
        const timings: Record<string, number> = {};

        let start = performance.now();

        doc = await scribe.openDocument([file]);

        timings.openDocument = performance.now() - start;

        start = performance.now();

        await doc.recognize({ langs: ["eng"] });

        timings.recognize = performance.now() - start;

        start = performance.now();

        const exported = await doc.exportData("txt");

        timings.export = performance.now() - start;

        console.table(timings);
        setText(
          typeof exported === "string" && exported.trim()
            ? exported
            : "No text extracted.",
        );
      } catch (err) {
        console.error("Scribe OCR Error:", err);
        setError("Error extracting text. Please try again.");
      } finally {
        try {
          await doc?.close();
        } catch (err) {
          console.error("Document cleanup error:", err);
        }

        setDuration(performance.now() - startTime);
        setLoading(false);
      }
    },
    [setText, setLoading, setDuration, setError],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setFile(file);
      runOCR(file);
    },
    [setFile, runOCR],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div className="method-container">
      <h2>Scribe.js</h2>
      <p className="method-subtitle">
        Powered by Tesseract under the hood — with native PDF support.
      </p>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag &amp; drop an image or PDF here, or click to select</p>
        )}
      </div>

      {imageUrl && (
        <div className="preview">
          <img src={imageUrl} alt="Preview" />
        </div>
      )}

      {fileType === "application/pdf" && (
        <p className="pdf-notice">📕 PDF loaded: {fileName}</p>
      )}

      {isLoading && (
        <div className="loading">
          <p>Processing...</p>
          <p className="loading-note">
            Scribe.js is analyzing the file. PDFs may take a moment.
          </p>
        </div>
      )}

      {duration !== null && (
        <div className="processing-stats">
          <span>⏱ Processing time </span>
          <strong>{(duration / 1000).toFixed(2)} seconds</strong>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {text && (
        <div className="output">
          <h3>Extracted Text:</h3>
          <textarea value={text} readOnly rows={12} />
        </div>
      )}
    </div>
  );
};

export default ScribeOCR;
