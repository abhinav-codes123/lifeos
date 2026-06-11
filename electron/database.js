import fs from "fs";
import path from "path";

const DB_PATH =
  path.join(
    process.cwd(),
    "electron",
    "data",
    "documents.json"
  );

function ensureDB() {

  const dir =
    path.dirname(
      DB_PATH
    );

  if (
    !fs.existsSync(dir)
  ) {

    fs.mkdirSync(
      dir,
      { recursive: true }
    );
  }

  if (
    !fs.existsSync(
      DB_PATH
    )
  ) {

    fs.writeFileSync(
      DB_PATH,
      "[]"
    );
  }
}

export function insertDocument(
  document
) {

  const docs =
    getAllDocuments();

  const index =
    docs.findIndex(
      doc =>
        doc.filePath ===
        document.filePath
    );

  if (
    index !== -1
  ) {

    docs[index] =
      document;

  } else {

    docs.push(
      document
    );
  }

  fs.writeFileSync(
    DB_PATH,
    JSON.stringify(
      docs,
      null,
      2
    )
  );
}
// export function insertDocument(
//   document
// ) {

//   let docs = [];

//   try {

//     const data =
//       fs.readFileSync(
//         DB_PATH,
//         "utf8"
//       );

//     if (
//       data.trim()
//     ) {

//       docs =
//         JSON.parse(
//           data
//         );
//     }

//   } catch {

//     docs = [];
//   }

//   docs.push(
//     document
//   );

//   fs.writeFileSync(
//     DB_PATH,
//     JSON.stringify(
//       docs,
//       null,
//       2
//     )
//   );
// }

export function getAllDocuments() {

  try {

    const data =
      fs.readFileSync(
        DB_PATH,
        "utf8"
      );

    if (
      !data.trim()
    ) {

      return [];
    }

    return JSON.parse(
      data
    );

  } catch (error) {

    console.error(
      error
    );

    return [];
  }
}

export function searchDocuments(query) {

  query =
    query.toLowerCase();

  const docs =
    getAllDocuments();

  return docs
    .map(doc => {

      let score = 0;

      // file name
      if (
        doc.fileName
          ?.toLowerCase()
          .includes(query)
      ) {
        score += 100;
      }

      // title tags
      if (
        doc.titleTags
          ?.some(tag =>
            tag
              .toLowerCase()
              .includes(query)
          )
      ) {
        score += 50;
      }

      // keyword tags
      if (
        doc.keywordTags
          ?.some(tag =>
            tag
              .toLowerCase()
              .includes(query)
          )
      ) {
        score += 20;
      }

      // metadata
      if (
        JSON.stringify(
          doc.metadata
        )
        .toLowerCase()
        .includes(query)
      ) {
        score += 30;
      }

      // OCR fallback
      if (
        doc.ocrText
          ?.toLowerCase()
          .includes(query)
      ) {
        score += 5;
      }

      return {
        ...doc,
        score
      };
    })
    .filter(
      doc =>
        doc.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    );
}

ensureDB();