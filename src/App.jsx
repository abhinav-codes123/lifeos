import { useState } from "react";
import {  classifyDocument } from "./utils/classifier";
import { scanFiles } from "./utils/scanner";

function App() {
  const [files, setFiles] = useState([]);
  const [scannedFiles,setScannedFiles] = useState([]);

  const handleFolderSelect = async () => {
    const result = await window.electronAPI.selectFolder();

    if (!result) return;

    setFiles(result.files);
  };

const scanFolder =
  async () => {

    const results =await scanFiles(files,window.electronAPI.runOCR,classifyDocument
      );

    setScannedFiles(
      results
    );
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

    const category =
      classifyDocument(
        result.text
      );

      console.log(
        "CATEGORY:"
      );

      console.log(
        category
      );

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
      <button onClick={scanFolder}>
        Scan Folder
      </button>
      <button onClick={testOCR}>
          Test OCR
        </button>

      {
        scannedFiles.map(
          (file, index) => (
            <div key={index}>

              <h3>
                {file.name}
              </h3>

              <p>
                {file.category}
              </p>

            </div>
          )
        )
      }
      <ul>
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