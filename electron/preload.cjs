const { contextBridge, ipcRenderer } = require("electron");

console.log("PRELOAD LOADED");

contextBridge.exposeInMainWorld(
  "electronAPI",
  {
    selectFolder: () =>
      ipcRenderer.invoke(
        "select-folder"
      ),

    selectImage: () =>
      ipcRenderer.invoke(
        "select-image"
      ),

    runOCR: (imagePath) =>
      ipcRenderer.invoke(
        "run-ocr",
        imagePath
      )
  }
);