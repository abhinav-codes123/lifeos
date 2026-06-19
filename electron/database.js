import { app } from "electron";
import fs from "fs";
import path from "path";
import { getEmbedding } from "./ai/embedding.js";
import { cosineSimilarity } from "./ai/similarity.js";

const DATA_DIR =
  app.isPackaged
    ? path.join(
        app.getPath(
          "userData"
        ),
        "data"
      )
    : path.join(
        process.cwd(),
        "electron",
        "data"
      );

const DB_PATH =
  path.join(
    DATA_DIR,
    "documents.json"
  );

function generatePreview( text, query) {

  if (!text)
    return "";

  const lowerText =
    text.toLowerCase();

  const lowerQuery =
    query.toLowerCase();

  const index =
    lowerText.indexOf(
      lowerQuery
    );

  if (
    index === -1
  ) {
    return "";
  }

  const start =
    Math.max(
      0,
      index - 40
    );

  const end =
    Math.min(
      text.length,
      index + 60
    );

  return text.slice(
    start,
    end
  );
}

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

export async function searchDocuments(query) {

  const originalQuery =
    query;

  query =
    query.toLowerCase();

  const docs =
    getAllDocuments();

  const queryEmbedding =
    await getEmbedding(
      originalQuery
    );

  return docs

    .map(doc => {

      let score = 0;

      let semanticScore = 0;

      if (
        doc.embedding &&
        doc.embedding.length
      ) {

        semanticScore =
          cosineSimilarity(
            queryEmbedding,
            doc.embedding
          );
      }

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

      // text
      if (
        doc.text
          ?.toLowerCase()
          .includes(query)
      ) {
        score += 5;
      }

      score += semanticScore * 100;

      console.log( doc.fileName, semanticScore);

      let preview =
        generatePreview(
          doc.text,
          query
        );

      if (!preview) {

        preview =
          doc.titleTags
            ?.join(" | ");
      }

      return {

        ...doc,

        score,

        semanticScore,

        preview

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