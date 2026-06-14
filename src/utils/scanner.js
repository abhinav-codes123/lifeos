import { extractMetadata } from "./extractMetadata.js";
import {
  generateTitleTags,
  generateKeywordTags
} from "./tagGenerator";

export async function scanFiles(
  files,
  runOCR,
  classifyDocument,
  onProgress
) {

  const results = [];

  for (
    let i = 0;
    i < files.length;
    i++
  ) {

    const file =
      files[i];

console.log(
  "FILE:",
  file
);

    const ext =
      (
        file.extension ||
        ""
      ).toLowerCase();

    let text = "";

    if (
      [".png", ".jpg", ".jpeg"]
        .includes(ext)
    ) {

      const result =
        await runOCR(
          file.path
        );

      if (!result.success)
        continue;

      text = result.text;
    }

    else if (
      ext === ".pdf"
    ) {

      const result =
        await window
          .electronAPI
          .extractPDFText(
            file.path
          );

      if (!result.success)
        continue;

      text = result.text;
    }

    const titleTags =
      generateTitleTags(
        text
      );

    const keywordTags =
      generateKeywordTags(
        text
      );

    const category =
      classifyDocument(
        text
      );

    const metadata =
      extractMetadata(
        text,
        category
      );

    console.log(
      "CATEGORY:",
      category
    );

    console.log(
      "METADATA:",
      metadata
    );

    console.log(
      "OCR TEXT:"
    );

    console.log(
      text
    );

    console.log(
      "-------------"
    );

    console.log(
      file.name,
      category
    );

    results.push({

      filePath:
        file.path,

      fileName:
        file.name,

      titleTags,

      keywordTags,

      metadata,

      text,

      scannedAt:
        new Date()
          .toISOString()

    });

    // Progress Update
    if (onProgress) {

      const progress =
        Math.round(
          ((i + 1) /
            files.length) *
            100
        );

      onProgress(
        progress
      );
    }
  }

  return results;
}