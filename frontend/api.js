/* API client – communicates with the FastAPI backend */

/* Change API_BASE if your backend runs on a different host or port. */
const API_BASE = "http://localhost:8000";

async function apiFetch(path, init) {
  const res = await fetch(API_BASE + path, init);
  if (!res.ok) {
    let detail = "Request failed.";
    try {
      const err = await res.json();
      if (err && err.detail) detail = err.detail;
    } catch (_) {}
    throw new Error(detail);
  }
  return res.json();
}

async function uploadResumeFile(file) {
  const form = new FormData();
  form.append("file", file);
  const data = await apiFetch("/resume/upload", {
    method: "POST",
    body: form,
  });
  return data.text;
}

async function pasteResume(text) {
  const data = await apiFetch("/resume/paste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return data.text;
}

async function pasteJD(text) {
  const data = await apiFetch("/jd/paste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return data.text;
}

async function fetchJDFromUrl(url) {
  const data = await apiFetch("/jd/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return data.text;
}

async function analyzeMatch(resumeText, jdText) {
  const data = await apiFetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text: resumeText, jd_text: jdText }),
  });
  return data.message;
}
