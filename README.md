# Smart Search

AI-Powered Offline Document Search Engine

Smart Search is a privacy-first desktop application that allows users to search files based on their content rather than just file names.

The application extracts text from documents and images, generates metadata and tags, creates AI embeddings, and enables intelligent search across local files.

All processing happens locally on the user's device.

---

## Features

### File Upload

* Upload Individual Files
* Upload Entire Folders

### OCR Support

Currently Supported:

* PNG
* JPG
* JPEG

Uses Tesseract.js for text extraction.

### PDF Text Extraction

Supports:

* PDFs containing selectable text

Current Limitation:

* Scanned PDFs (image-based PDFs) are still under development.

### Automatic Tag Generation

Generates:

* Title Tags
* Keyword Tags

Example:

Resume.pdf

Tags:

* internship
* machine learning
* python
* developer

### Metadata Extraction

Automatically extracts:

* Names
* Dates
* Contact Information
* Categories

### AI Semantic Search

Uses embeddings to understand document meaning.

Example:

Searching:

machine learning internship

can find:

* Resume.pdf
* AI Internship Notes.pdf
* ML Roadmap.pdf

even if exact keywords do not match.

### Search Features

* Keyword Search
* Semantic Search
* Grid View
* List View
* Search History
* Pagination
* Recent Uploads

### Privacy First

* Fully Offline
* No Cloud Services
* No User Data Collection
* Local Database Storage

---

## Tech Stack

### Frontend

* React
* Vite
* CSS

### Desktop Framework

* Electron

### OCR

* Tesseract.js

### AI

* Xenova Transformers
* all-MiniLM-L6-v2 Embeddings

### Backend

* Node.js

### Storage

* Local JSON Database

---

## Installation

Clone Repository

```bash
git clone https://github.com/abhinav-codes123/lifeos.git
cd lifeos
```

Install Dependencies

```bash
npm install
```

Additional Packages

```bash
npm install tailwindcss @tailwindcss/vite
npm install tesseract.js
```

Run Development Server

```bash
npm run dev
```

Run Electron Application

```bash
npm run electron
```

---

## Build Desktop Application

Generate Production Build

```bash
npm run build
```

Generate Electron Release

```bash
npm run dist
```

Output:

```text
release/
├── SmartSearch.dmg
├── SmartSearch.exe
```

(depending on platform)

---

## Current Architecture

```text
User Upload
      │
      ▼
File Scanner
      │
      ▼
Text Extraction
(OCR / PDF Parser)
      │
      ▼
Tag Generation
      │
      ▼
Metadata Extraction
      │
      ▼
Embedding Generation
      │
      ▼
Local Database
      │
      ▼
Search Engine
      │
      ▼
Ranked Results
```

---

## Roadmap

### In Progress

* PDF → Image → OCR Fallback
* Multi-page PDF Support

### Planned

* DOCX Support
* PPTX Support
* XLSX Support
* SQLite Database
* Faster Indexing
* Android Version
* Advanced AI Search

---

## Vision

Smart Search aims to become a local AI-powered search engine for personal documents.

Instead of remembering:

* File Names
* Folder Locations

Users can simply describe what they are looking for:

"show documents related to machine learning internships"

and Smart Search will retrieve the most relevant files instantly.
