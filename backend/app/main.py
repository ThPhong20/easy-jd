from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import resume, jd, analyze

app = FastAPI(
    title="ResumeTailor API",
    description="API for tailoring resumes to job descriptions.",
    version="0.1.0",
)

# Allow the static frontend served locally (e.g. python -m http.server 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)
app.include_router(jd.router)
app.include_router(analyze.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
