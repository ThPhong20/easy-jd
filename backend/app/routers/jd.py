from fastapi import APIRouter, HTTPException

from app.models.schemas import JDTextRequest, JDUrlRequest, ParsedTextResponse
from app.utils.url_fetcher import fetch_and_clean_jd

router = APIRouter(prefix="/jd", tags=["jd"])


@router.post("/paste", response_model=ParsedTextResponse)
async def paste_jd(body: JDTextRequest):
    """Accept pasted job description text."""
    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Job description text cannot be empty.")
    return ParsedTextResponse(text=text, source="paste")


@router.post("/url", response_model=ParsedTextResponse)
async def fetch_jd_from_url(body: JDUrlRequest):
    """Fetch a job description from a URL and return cleaned text."""
    url = str(body.url)

    try:
        text = await fetch_and_clean_jd(url)
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Failed to fetch URL: {str(exc)}"
        ) from exc

    if not text:
        raise HTTPException(
            status_code=422, detail="Could not extract any text from the provided URL."
        )

    return ParsedTextResponse(text=text, source="url")
