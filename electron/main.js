import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

console.log(pdfParse);

import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Tesseract from "tesseract.js";


import fs from "fs";

 const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {

// this is for debugging
console.log("MAIN STARTED");
console.log("__dirname =", __dirname);
console.log(
  "PRELOAD EXISTS =",
  fs.existsSync(path.join(__dirname, "preload.cjs"))
);
console.log(
  "PRELOAD PATH =",
  path.join(__dirname, "preload.cjs")
);


  const win = new BrowserWindow({
    width: 1200,
    height: 800,

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL("http://localhost:5173");
  win.webContents.openDevTools();
}

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });

  if (result.canceled) return [];

  const folderPath = result.filePaths[0];

  const files = fs.readdirSync(folderPath).map((file) => {
  const fullPath = path.join(folderPath, file);

  const stats = fs.statSync(fullPath);

  return {
    name: file,
    path: fullPath,
    size: stats.size,
    createdAt: stats.birthtime,
    extension: path.extname(file),
  };
});

  return {
    folderPath,
    files
  };
});

ipcMain.handle("select-image", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],

    filters: [
      {
        name: "Images",
        extensions: [
          "png",
          "jpg",
          "jpeg"
        ]
      }
    ]
  });

  if (result.canceled)
    return null;

  return result.filePaths[0];
});

ipcMain.handle("run-ocr", async (_, imagePath) => {
  try {
    console.log("OCR STARTED:", imagePath);

    const {
      data: { text },
    } = await Tesseract.recognize(
      imagePath,
      "eng"
    );

    return {
      success: true,
      text,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("extract-pdf-text", async (_, pdfPath) => {
  try {
    const buffer = fs.readFileSync(pdfPath);

    const data = await pdfParse(buffer);

    return {
      success: true,
      text: data.text,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
});

// this is for debugging
app.on("web-contents-created", (_, contents) => {
  contents.on("preload-error", (_, preloadPath, error) => {
    console.error("PRELOAD ERROR:");
    console.error(preloadPath);
    console.error(error);
  });
});

app.whenReady().then(createWindow);