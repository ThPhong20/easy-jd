import os
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

from app.models.schemas import ResumeTextRequest, ParsedTextResponse
from app.utils.pdf_parser import extract_text_from_pdf
from app.utils.docx_parser import extract_text_from_docx

router = APIRouter(prefix="/resume", tags=["resume"])

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
}
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/upload", response_model=ParsedTextResponse)
async def upload_resume(file: UploadFile = File(...)):
    """Upload a PDF or DOCX resume file and return its extracted text."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{ext}'. Please upload a PDF or DOCX file.",
        )

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds the 5 MB size limit.")

    try:
        if ext == ".pdf":
            text = extract_text_from_pdf(file_bytes)
        else:
            text = extract_text_from_docx(file_bytes)
    except Exception as exc:
        raise HTTPException(
            status_code=422, detail=f"Failed to parse file: {str(exc)}"
        ) from exc

    if not text:
        raise HTTPException(
            status_code=422, detail="Could not extract any text from the uploaded file."
        )

    return ParsedTextResponse(text=text, source="file")


@router.post("/paste", response_model=ParsedTextResponse)
async def paste_resume(body: ResumeTextRequest):
    """Accept pasted resume text and return it validated."""
    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    return ParsedTextResponse(text=text, source="paste")
