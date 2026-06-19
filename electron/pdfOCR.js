import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";
import os from "os";

export async function pdfToImage(pdfPath) {

  const pdfData =
    new Uint8Array(
      fs.readFileSync(pdfPath)
    );

  const pdf =
    await pdfjsLib.getDocument({
      data: pdfData
    }).promise;

  const page =
    await pdf.getPage(1);

  const viewport =
    page.getViewport({
      scale: 2
    });

  const canvas =
    createCanvas(
      viewport.width,
      viewport.height
    );

  const context =
    canvas.getContext("2d");

  await page.render({
    canvasContext: context,
    viewport
  }).promise;

  const imagePath =
    path.join(
      os.tmpdir(),
      `pdf-${Date.now()}.png`
    );

  fs.writeFileSync(
    imagePath,
    canvas.toBuffer("image/png")
  );

  return imagePath;
}