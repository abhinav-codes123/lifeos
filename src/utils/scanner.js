import { extractMetadata } from "./extractMetadata.js";
import { generateTitleTags, generateKeywordTags } from "./tagGenerator";

export async function scanFiles(
  files,
  runOCR,
  classifyDocument,
) {

  const results = [];

  for (const file of files) {

  const ext =
    file.extension.toLowerCase();

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

    // for console
    const metadata =
    extractMetadata(
        text,
        category
    );
    // console.log(
    // metadata
    // );
    console.log("CATEGORY:", category);
    console.log("METADATA:", metadata);

    console.log("OCR TEXT:");
    console.log(text);
    console.log("-------------");

    console.log(
        file.name,
        category
    );

  results.push({
    filePath: file.path,
    fileName: file.name,
    titleTags,
    keywordTags,
    metadata,
    ocrText: text,
    scannedAt:new Date().toISOString()
});
}

  return results;
}