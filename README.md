# ResumeTailor (easy-jd)

A web application prototype for preparing resume and job-description text for comparison.

**Stack:** Python · FastAPI · HTML/CSS/JavaScript

**Status:** Resume/JD input and text-extraction workflows are present. The analysis endpoint and matching logic are placeholders; automated resume tailoring and AI analysis are not implemented.

## Workflow

Upload or paste a resume, supply a job description, and inspect the extracted text side by side. The project provides the input pipeline and interface for a future matching system.

## Features

- Upload a PDF or DOCX resume **or** paste resume text
- Paste a job description **or** provide a job posting URL (content is fetched and cleaned automatically)
- Side-by-side preview of the extracted resume and JD text
- One-click **Analyze** button (matching logic placeholder, ready for future AI integration)
- Simple, modern, responsive UI built with plain HTML, CSS, and JavaScript

---

## Project Structure

```
easy-jd/
├── backend/          # FastAPI backend (Python)
│   ├── app/
│   │   ├── main.py           # FastAPI app & CORS setup
│   │   ├── models/
│   │   │   └── schemas.py    # Pydantic request/response models
│   │   ├── routers/
│   │   │   ├── resume.py     # /resume/upload and /resume/paste
│   │   │   ├── jd.py         # /jd/paste and /jd/url
│   │   │   └── analyze.py    # /analyze (placeholder)
│   │   └── utils/
│   │       ├── pdf_parser.py   # PDF text extraction
│   │       ├── docx_parser.py  # DOCX text extraction
│   │       ├── url_fetcher.py  # Fetch & clean JD from a URL
│   │       └── matcher.py      # Placeholder matching/scoring logic
│   └── requirements.txt
└── frontend/         # Plain HTML / CSS / JavaScript frontend
    ├── index.html    # Main page
    ├── style.css     # Styles
    ├── api.js        # API client functions
    └── app.js        # Application logic
```

---

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`.

### Frontend

Open `frontend/index.html` directly in your browser, or serve it with any static file server:

```bash
cd frontend
python -m http.server 3000
# or: npx serve .
```

The app will be available at `http://localhost:3000`.

> **Note:** The frontend talks to the backend at `http://localhost:8000` by default.  
> To change the backend URL, edit the `API_BASE` constant at the top of `frontend/api.js`.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/resume/upload` | Upload a PDF/DOCX resume file |
| `POST` | `/resume/paste` | Submit resume as plain text |
| `POST` | `/jd/paste` | Submit job description as plain text |
| `POST` | `/jd/url` | Fetch & extract JD text from a URL |
| `POST` | `/analyze` | Placeholder: compare resume and JD |
| `GET`  | `/health` | Health check |
