import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Tesseract from "tesseract.js";
import { useOCRStore } from "./store/ocrStore";

const TesseractOCR: React.FC = () => {
  const imageUrl = useOCRStore((s) => s.imageUrl);
  const text = useOCRStore((s) => s.text);
  const isLoading = useOCRStore((s) => s.isLoading);
  const progress = useOCRStore((s) => s.progress);
  const error = useOCRStore((s) => s.error);
  const duration = useOCRStore((s) => s.duration);

  const setImage = useOCRStore((s) => s.setImage);
  const setText = useOCRStore((s) => s.setText);
  const setDuration = useOCRStore((s) => s.setDuration);

  const setLoading = useOCRStore((s) => s.setLoading);
  const setProgress = useOCRStore((s) => s.setProgress);
  const setError = useOCRStore((s) => s.setError);

  const runOCR = async (file: File) => {
    setLoading(true);
    setDuration(null);
    setProgress(0);
    setError(null);
    const startTime = performance.now();

    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      setText(result.data.text);
    } catch (err) {
      console.error("Tesseract OCR Error:", err);
      setError("Error extracting text. Please try again.");
    } finally {
      setLoading(false);
      setProgress(0);
      setDuration(performance.now() - startTime);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setImage(file);
      runOCR(file);
    },
    [setImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
  });

  return (
    <div className="method-container">
      <h2>Tesseract.js</h2>
      <p className="method-subtitle">Fast, lightweight OCR for images.</p>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag &amp; drop an image here, or click to select</p>
        )}
      </div>

      {imageUrl && (
        <div className="preview">
          <img src={imageUrl} alt="Preview" />
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <p>Processing... {progress}%</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {duration !== null && (
        <div className="processing-stats">
          <span>⏱ Processing time </span>
          <strong>{(duration / 1000).toFixed(2)} seconds</strong>
        </div>
      )}

      {text && (
        <div className="output">
          <h3>Extracted Text:</h3>
          <textarea value={text} readOnly rows={12} />
        </div>
      )}
    </div>
  );
};

export default TesseractOCR;
