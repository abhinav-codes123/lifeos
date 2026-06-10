export async function scanFiles(
  files,
  runOCR,
  classifyDocument
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


  const category =
    classifyDocument(
      text
    );

    // for console
    console.log("OCR TEXT:");
    console.log(text);
    console.log("-------------");

    console.log(
        file.name,
        category
    );

  results.push({
    name: file.name,
    category,
    text,
  });
}

  return results;
}