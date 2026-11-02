import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import scribe from "scribe.js-ocr";

const ScribeOCR: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [duration, setDuration] = useState<number | null>(null);

  const runOCR = useCallback(async (file: File) => {
    setIsLoading(true);
    setDuration(null);

    const startTime = performance.now();

    let doc: Awaited<ReturnType<typeof scribe.openDocument>> | undefined;

    try {
      doc = await scribe.openDocument([file]);

      await doc.recognize({ langs: ["eng"] });

      const exported = await doc.exportData("txt");

      setText(
        typeof exported === "string" && exported.trim()
          ? exported
          : "No text extracted.",
      );
    } catch (error) {
      console.error("Scribe OCR Error:", error);
      setText("Error extracting text. Please try again.");
    } finally {
      try {
        await doc?.close();
      } catch (error) {
        console.error("Document cleanup error:", error);
      }

      try {
        await scribe.terminate();
      } catch (error) {
        console.error("Scribe termination error:", error);
      }

      const endTime = performance.now();

      setDuration(endTime - startTime);
      setIsLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setText("");
      setFileType(file.type);
      setFileName(file.name);

      setImage(
        file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      );

      runOCR(file);
    },
    [runOCR],
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

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);
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

      {image && (
        <div className="preview">
          <img src={image} alt="Preview" />
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
