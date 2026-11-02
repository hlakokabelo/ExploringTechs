import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Tesseract from "tesseract.js";

const TesseractOCR: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setText("");
    runOCR(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      // Images ONLY — no PDF allowed here
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
  });

  const runOCR = async (file: File) => {
    setIsLoading(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      setText(result.data.text);
    } catch (error) {
      console.error("Tesseract OCR Error:", error);
      setText("Error extracting text. Please try again.");
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

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

      {image && (
        <div className="preview">
          <img src={image} alt="Preview" />
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <p>Processing... {progress}%</p>
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
