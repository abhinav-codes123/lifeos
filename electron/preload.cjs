const { contextBridge, ipcRenderer } = require("electron");

console.log("PRELOAD LOADED");

contextBridge.exposeInMainWorld(
  "electronAPI",
  {
    selectFolder: () =>
      ipcRenderer.invoke(
        "select-folder"
      ),

    getImageData:
    (imagePath) =>
      ipcRenderer.invoke(
        "get-image-data",
        imagePath
      ),

    selectFiles: () =>
      ipcRenderer.invoke(
        "select-files"
      ),

    selectImage: () =>
      ipcRenderer.invoke(
        "select-image"
      ),

    runOCR: (imagePath) =>
      ipcRenderer.invoke(
        "run-ocr",
        imagePath
      ),
    extractPDFText: (pdfPath) =>
      ipcRenderer.invoke(
        "extract-pdf-text",
        pdfPath
      ),
      saveDocument: (document) =>
      ipcRenderer.invoke(
        "save-document",
        document
      ),

    getDocuments: () =>
      ipcRenderer.invoke(
        "get-documents"
      ),
    searchDocuments:
    (query) =>
      ipcRenderer.invoke(
        "search-documents",
        query
      ),
    openFile:
    (filePath) =>
      ipcRenderer.invoke(
        "open-file",
        filePath
      ),
  }
);