import { useEffect , useState } from "react";
import {  classifyDocument } from "./utils/classifier";
import { scanFiles } from "./utils/scanner";
import "./App.css"

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
  <div className="app">

    <h1 className="title">
      LifeOS
    </h1>

    <div className="section">

      <h2 className="section-title">
        Upload & Processing
      </h2>

      <div className="btn-row">

        <button
          onClick={handleFolderSelect}
          className="btn btn-primary"
        >
          Upload Folder
        </button>

        <button
          onClick={handleFileSelect}
          className="btn btn-secondary"
        >
          Upload Files
        </button>

      </div>

      <div className="progress">

        <div
          className="progress-bar"
          style={{
            width: `${uploadProgress}%`
          }}
        />

      </div>

      <div
        style={{
          marginTop: "20px"
        }}
      >
        <h3>
          Recent Uploads
        </h3>

        {
          scannedFiles
            .slice(-4)
            .reverse()
            .map(file => (

              <div
                key={file.filePath}
                style={{
                  marginTop: "8px",
                  color: "#9ca3af"
                }}
              >
                ✓ {file.fileName}
              </div>

            ))
        }
      </div>

    </div>

    <div className="search-row">

      <input
        value={query}
        onChange={(e) =>
          setQuery(
            e.target.value
          )
        }
        placeholder="Search files..."
        className="search-input"
      />

      <button
        onClick={search}
        className="btn btn-primary"
      >
        Search
      </button>

    </div>

    <div className="chips">

      {
        recentSearches.map(
          item => (

            <div
              key={item}
              className="chip"
            >
              {item}
            </div>

          )
        )
      }

    </div>

    <div className="results-header">

      <h2>
        Results
      </h2>

      <div
        style={{
          display: "flex",
          gap: "10px"
        }}
      >

        <button
          onClick={() =>
            setViewMode(
              "grid"
            )
          }
          className={
            viewMode === "grid"
              ? "btn btn-primary"
              : "btn btn-secondary"
          }
        >
          Grid
        </button>

        <button
          onClick={() =>
            setViewMode(
              "list"
            )
          }
          className={
            viewMode === "list"
              ? "btn btn-primary"
              : "btn btn-secondary"
          }
        >
          List
        </button>

      </div>

    </div>

    {
      viewMode === "grid"
      ? (

        <div className="grid-view">

          {
            results.map(
              doc => (

                <div
                  key={
                    doc.filePath
                  }
                  className="card"
                  onClick={() =>
                    window
                      .electronAPI
                      .openFile(
                        doc.filePath
                      )
                  }
                >

                  <div className="thumbnail">

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
                          style={{
                            fontSize:
                              "60px"
                          }}
                        >
                          📄
                        </div>
                      )
                    }

                  </div>

                  <h3 className="file-name">
                    {doc.fileName}
                  </h3>

                  <p className="preview">
                    {doc.preview}
                  </p>

                </div>

              )
            )
          }

        </div>

      )
      : (

        <div className="list-view">

          {
            results.map(
              doc => (

                <div
                  key={
                    doc.filePath
                  }
                  className="card"
                  onClick={() =>
                    window
                      .electronAPI
                      .openFile(
                        doc.filePath
                      )
                  }
                >

                  <h3 className="file-name">
                    {doc.fileName}
                  </h3>

                  <p className="preview">
                    {doc.preview}
                  </p>

                </div>

              )
            )
          }

        </div>

      )
    }

  </div>
);
}

export default App;