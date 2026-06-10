import { useState } from "react";
import {  classifyDocument } from "./utils/classifier";

function App() {
  const [files, setFiles] = useState([]);

  const handleFolderSelect = async () => {
    const result = await window.electronAPI.selectFolder();

    if (!result) return;

    setFiles(result.files);
  };

function getCategory(extension) {
  const ext = extension.toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext))
    return "Image";

  if ([".pdf"].includes(ext))
    return "PDF";

  return "Other";
}

const testOCR = async () => {
  try {
    const imagePath =
      await window
        .electronAPI
        .selectImage();

    if (!imagePath)
      return;

    console.log(
      "Selected:",
      imagePath
    );

    const result =
      await window
        .electronAPI
        .runOCR(
          imagePath
        );
    console.log(result);

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>LifeOS</h1>

      <button onClick={handleFolderSelect}>
        Select Folder
      </button>

      <ul>
        <button onClick={testOCR}>
          Test OCR
        </button>
        {files.map((file, index) => (
          
          // <li key={index}>{file}</li>
          <li key={index}>
            {file.name}
            {" - "}
            {getCategory(file.extension)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;