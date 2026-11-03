import React, { useCallback, useState } from "react";
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
  const [timings, setTimings] = useState<Record<string, number>>({});

  const runOCR = useCallback(
    async (file: File) => {
      setLoading(true);
      setDuration(null);
      setError(null);

      const startTime = performance.now();

      let doc: Awaited<ReturnType<typeof scribe.openDocument>> | undefined;

      try {
        let start = performance.now();

        doc = await scribe.openDocument([file]);

        setTimings((prev) => ({
          ...prev,
          openDocument: performance.now() - start,
        }));

        start = performance.now();

        await doc.recognize({ langs: ["eng"] });

        setTimings((prev) => ({
          ...prev,
          recognize: performance.now() - start,
        }));

        start = performance.now();

        const exported = await doc.exportData("txt");

        setTimings((prev) => ({ ...prev, export: performance.now() - start }));

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
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
          Processing Timings
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Open document : </span>
            <span className="font-mono font-medium">
              {timings.openDocument?.toFixed(2) ?? "—"} ms
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">OCR recognition : </span>
            <span className="font-mono font-medium">
              {timings.recognize?.toFixed(2) ?? "—"} ms
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Export text : </span>
            <span className="font-mono font-medium">
              {timings.export?.toFixed(2) ?? "—"} ms
            </span>
          </div>

          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
            <div className="flex justify-between font-semibold">
              <span>Total : </span>
              <span className="font-mono">
                {timings.openDocument !== undefined &&
                timings.recognize !== undefined &&
                timings.export !== undefined
                  ? (
                      timings.openDocument +
                      timings.recognize +
                      timings.export
                    ).toFixed(2)
                  : "—"}{" "}
                ms
              </span>
            </div>
          </div>
        </div>
      </div>
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
