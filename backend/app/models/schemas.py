from pydantic import BaseModel, AnyHttpUrl
from typing import Optional


class ResumeTextRequest(BaseModel):
    text: str


class JDTextRequest(BaseModel):
    text: str


class JDUrlRequest(BaseModel):
    url: AnyHttpUrl


class PreviewResponse(BaseModel):
    resume_text: Optional[str] = None
    jd_text: Optional[str] = None


class ParsedTextResponse(BaseModel):
    text: str
    source: str  # "file", "paste", "url"


class AnalyzeRequest(BaseModel):
    resume_text: str
    jd_text: str


class AnalyzeResponse(BaseModel):
    message: str
    resume_text: str
    jd_text: str
