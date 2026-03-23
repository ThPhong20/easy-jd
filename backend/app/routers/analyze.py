from fastapi import APIRouter, HTTPException

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.utils.matcher import compute_match_score

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("", response_model=AnalyzeResponse)
async def analyze(body: AnalyzeRequest):
    """
    Placeholder endpoint for resume-JD matching.

    Currently returns the submitted texts back along with a placeholder message.
    Full matching logic will be implemented in a future version.
    """
    resume_text = body.resume_text.strip()
    jd_text = body.jd_text.strip()

    if not resume_text:
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not jd_text:
        raise HTTPException(status_code=400, detail="Job description text cannot be empty.")

    # Placeholder — real scoring will be added later
    result = compute_match_score(resume_text, jd_text)

    return AnalyzeResponse(
        message=result["message"],
        resume_text=resume_text,
        jd_text=jd_text,
    )
