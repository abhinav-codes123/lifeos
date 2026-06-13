import { useEffect , useState } from "react";
import {  classifyDocument } from "./utils/classifier";
import { scanFiles } from "./utils/scanner";

function App() {
  const [files, setFiles] = useState([]);
  const [scannedFiles,setScannedFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ processingFiles, setProcessingFiles] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [viewMode,setViewMode] = useState("grid");

  const handleFolderSelect =
    async () => {

  const result =
    await window
      .electronAPI
      .selectFolder();

  if (!result)
    return;

  setFiles(
    result.files
  );

  const results =
    await scanFiles(
      result.files,
      window.electronAPI.runOCR,
      classifyDocument
    );

  for (
    const document
    of results
  ) {

    await window
      .electronAPI
      .saveDocument(
        document
      );
  }

  setScannedFiles(
    results
  );
};

const scanFolder =
  async () => {

    const results =
    await scanFiles(
      files,
      window.electronAPI.runOCR,
      classifyDocument
    );

  for (
    const document
    of results
  ) {

    await window
      .electronAPI
      .saveDocument(
        document
      );
  }

  setScannedFiles(
    results
  );
};

function ImageThumbnail({
  path
}) {

  const [
    imageSrc,
    setImageSrc
  ] = useState(null);

  useEffect(() => {

    async function load() {

      const data =
        await window
          .electronAPI
          .getImageData(path);

      setImageSrc(data);
    }

    load();

  }, [path]);

  if (!imageSrc) {
    return (
      <div
        style={{
          width: "100px",
          height: "100px",
          background: "#222"
        }}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt=""
      style={{
        width: "100px",
        height: "100px",
        objectFit: "cover",
        borderRadius: "8px"
      }}
    />
  );
}

function getCategory(extension) {
  const ext = extension.toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext))
    return "Image";

  if ([".pdf"].includes(ext))
    return "PDF";

  return "Other";
}

const loadDocuments =
  async () => {

    const docs =
      await window
        .electronAPI
        .getDocuments();

    console.log(
      "DOCUMENTS:"
    );

    console.log(
      docs
    );
};

const search =
  async () => {

    const docs =
      await window
        .electronAPI
        .searchDocuments(
          query
        );

    console.log(docs);

    setResults(
  docs
);

if (
  query.trim()
) {

  setRecentSearches(
    prev => [

      query,

      ...prev.filter(
        item =>
          item !== query
      )

    ].slice(0, 5)
  );
}
};

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

const handleFileSelect =
async () => {

  const files =
    await window
      .electronAPI
      .selectFiles();

  if (!files.length)
    return;

  const results =
    await scanFiles(
      files,
      window
        .electronAPI
        .runOCR,
      classifyDocument
    );

  for (
    const document
    of results
  ) {

    await window
      .electronAPI
      .saveDocument(
        document
      );
  }

  setScannedFiles(
    results
  );
};

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-5xl font-bold mb-8">
          LifeOS
        </h1>
        <div className="
          border
          border-zinc-700
          rounded-2xl
          p-8
          mb-8
        ">
          <h2 className="text-2xl font-bold mb-4">
            Upload & Processing
          </h2>

          <div className="flex gap-4 mb-6">

            <button
              onClick={handleFolderSelect}
              className="
                px-6 py-3
                bg-blue-600
                rounded-xl
              "
            >
              Upload Folder
            </button>

            <button
              onClick={handleFileSelect}
              className="
                px-6 py-3
                bg-zinc-800
                rounded-xl
              "
            >
              Upload Files
            </button>

          </div>

          <div className="
            h-3
            bg-zinc-800
            rounded-full
            overflow-hidden
          ">
            <div
              className="h-full bg-blue-500"
              style={{
                width:
                  `${uploadProgress}%`
              }}
            />
          </div>

          <div className="mt-6">

  <h3 className="mb-2">
    Recent Uploads
  </h3>

  {
    scannedFiles
      .slice(-4)
      .reverse()
      .map(file => (

        <div
          key={file.filePath}
          className="
            text-sm
            text-zinc-400
            mb-1
          "
        >
          ✓ {file.fileName}
        </div>

      ))
  }

</div>

        </div>
        {/* Upload Section */}
        <div className="mb-8">

          <div className="flex gap-3">

            <input
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              placeholder="Search files..."
              className="
                flex-1
                p-4
                rounded-xl
                bg-zinc-900
                border
                border-zinc-700
              "
            />

            <button
              onClick={search}
              className="
                px-8
                bg-blue-600
                rounded-xl
              "
            >
              Search
            </button>

          </div>

        </div>
        {/* Search Section */}

        {/* Results Section */}
        <div className="flex gap-2 flex-wrap mt-4">

  {
    recentSearches.map(
      (item) => (

        <div
          key={item}
          className="
            bg-zinc-800
            px-3 py-1
            rounded-full
          "
        >
          {item}
        </div>

      )
    )
  }

</div>

<div className="
  flex justify-between
  items-center
  mb-6
">

  <h2 className="text-2xl font-bold">
    Results
  </h2>

  <div className="flex gap-2">

    <button
      onClick={() =>
        setViewMode("grid")
      }
      className={
        viewMode === "grid"
          ? "bg-blue-600 px-4 py-2 rounded"
          : "bg-zinc-800 px-4 py-2 rounded"
      }
    >
      Grid
    </button>

    <button
      onClick={() =>
        setViewMode("list")
      }
      className={
        viewMode === "list"
          ? "bg-blue-600 px-4 py-2 rounded"
          : "bg-zinc-800 px-4 py-2 rounded"
      }
    >
      List
    </button>

  </div>

</div>

{
  viewMode === "grid" ? (

    <div
      className="
        grid
        gap-4
      "
      style={{
        gridTemplateColumns:
          "repeat(auto-fill, minmax(250px, 1fr))"
      }}
    >
      {results.map(doc => (

        <div
          key={doc.filePath}
          className="
            bg-zinc-900
            rounded-xl
            p-4
            h-72
            overflow-hidden
          "
        >
          <div
            className="
              h-36
              bg-zinc-950
              rounded-lg
              mb-3
              flex
              items-center
              justify-center
              border
              border-zinc-800
            "
          >

          {
            doc.filePath?.match(
              /\.(png|jpg|jpeg)$/i
            )
            ? (
              <ImageThumbnail
                path={
                  doc.filePath
                }
              />
            )
            : (
              <div
                className="
                  text-6xl
                "
              >
                📄
              </div>
            )
          }

          </div>

          <h3
            className="
              font-semibold
              text-lg
              mb-2
            "
          >
            {doc.fileName}
</h3>

          <p
            className="
              text-zinc-400
              text-sm
              line-clamp-3
            "
          >
            {doc.preview}
          </p>

        </div>

      ))}
    </div>

  ) : (

    <div className="space-y-4">

      {results.map(doc => (

        <div
          key={doc.filePath}
          className="
            flex
            items-center
            justify-between
            bg-zinc-900
            rounded-xl
            p-4
          "
        >

          <div>

            <h3
              className="
                font-semibold
                text-lg
                mb-2
              "
            >
              {doc.fileName}
            </h3>

            <p
              className="
                text-zinc-400
                text-sm
                line-clamp-3
              "
            >
              {doc.preview}
            </p>

          </div>

          <button
            onClick={() =>
              window
                .electronAPI
                .openFile(
                  doc.filePath
                )
            }
          >
            Open
          </button>

        </div>

      ))}

    </div>

  )
}

      </div>

    </div>
);

//   return (
//     // <div style={{ padding: "20px" }}>
//     <div className="flex h-screen bg-gray-100">
//       {/* <h1>LifeOS</h1>

//       <button onClick={handleFolderSelect}>
//         Select Folder
//       </button>
//       <button onClick={scanFolder}>
//         Scan Folder
//       </button>
//       <button onClick={loadDocuments}>
//         Load DB
//       </button> */}
//       <div className="w-64 bg-white border-r p-4">
//         <h1 className="text-3xl font-bold mb-6">
//           LifeOS
//         </h1>

//         <button
//           onClick={handleFolderSelect}
//           className="w-full mb-2 p-2 bg-blue-500 text-white rounded"
//         >
//           Select Folder
//         </button>

//         <button
//           onClick={scanFolder}
//           className="w-full mb-2 p-2 bg-green-500 text-white rounded"
//         >
//           Scan Folder
//         </button>

// </div>

// <div className="flex gap-2 mb-6">

//   <input
//     type="text"
//     value={query}
//     onChange={(e) =>
//       setQuery(e.target.value)
//     }
//     placeholder="Search files..."
//     className="
//       flex-1
//       p-3
//       border
//       rounded
//     "
//   />

//   <button
//     onClick={search}
//     className="
//       px-6
//       bg-blue-500
//       text-white
//       rounded
//     "
//   >
//     Search
//   </button>

// </div>
//       {/* <input type="text" value={query} onChange={e =>
//           setQuery(
//             e.target.value
//           )
//         } placeholder="Search..." />

//       <button
//         onClick={search}
//       >
//         Search
//       </button>
//       <button onClick={testOCR}>
//           Test OCR
//         </button> */}
// <div className="mt-6">
//         {
//   results.map((doc) => (
//     <div
//       key={doc.filePath}
//       className="
//         bg-white
//         rounded-lg
//         shadow-md
//         p-4
//         mb-4
//         border
//       "
//     >
//       <h3
//         className="
//           text-lg
//           font-semibold
//           text-gray-800
//         "
//       >
//         {doc.fileName}
//       </h3>

//       <p
//         className="
//           text-gray-600
//           mt-2
//           text-sm
//         "
//       >
//         {doc.preview}
//       </p>

//       <div
//         className="
//           flex
//           justify-between
//           items-center
//           mt-4
//         "
//       >
//         <button
//           onClick={() =>
//             window.electronAPI.openFile(
//               doc.filePath
//             )
//           }
//           className="
//             px-4
//             py-2
//             bg-blue-500
//             text-white
//             rounded
//             hover:bg-blue-600
//           "
//         >
//           Open File
//         </button>

//         <span
//           className="
//             text-xs
//             text-gray-500
//           "
//         >
//           Score: {doc.score}
//         </span>
//       </div>
//     </div>
//   ))
// }
// </div>


//       {/* {
//   results.map(
//     doc => (
//       <div
//         key={
//           doc.filePath
//         }
//       >
//         <h3>
//           {
//             doc.fileName
//           }
//         </h3>
//          <p>{doc.preview}</p>
//         <button
//           onClick={() =>
//             window
//               .electronAPI
//               .openFile(
//                 doc.filePath
//               )
//           }>
//           Open
//         </button>

//         <p>
//           Score:
//           {doc.score}
//         </p>
//       </div>
//     )
//   )
// } */}

//       {/* {
//         scannedFiles.map(
//           (file, index) => (
//             <div key={index}>

//               <h3>
//                 {file.name}
//               </h3>

//               <p>
//                 {file.category}
//               </p>

//             </div>
//           )
//         )
//       } */}
//       {/* <ul>
//         {files.map((file, index) => (
          
//           // <li key={index}>{file}</li>
//           <li key={index}>
//             {file.name}
//             {" - "}
//             {getCategory(file.extension)}
//           </li>
//         ))}
//       </ul> */}
//     </div>
//   );
}

export default App;