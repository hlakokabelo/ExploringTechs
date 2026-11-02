import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import scribe from "scribe.js-ocr";

const ScribeOCR: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setText("");
    setFileType(file.type);
    setFileName(file.name);

    // Only generate a visual preview for images
    if (file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
    } else {
      setImage(null);
    }

    runOCR(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  const runOCR = async (file: File) => {
    setIsLoading(true);

    try {
      const doc = await scribe.openDocument([file]);
      await doc.recognize({ langs: ["eng"] });

      const exported = await doc.exportData("txt");
      setText(typeof exported === "string" ? exported : "No text extracted.");

      await doc.close();
    } catch (error) {
      console.error("Scribe OCR Error:", error);
      setText("Error extracting text. Please check the console for details.");
    } finally {
      setIsLoading(false);
      // Always release workers & memory between runs
      await scribe.terminate();
    }
  };

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
