const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed." }));
    throw new Error((err as { detail?: string }).detail ?? "Request failed.");
  }
  return res.json() as Promise<T>;
}

export async function uploadResumeFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const data = await apiFetch<{ text: string }>("/resume/upload", {
    method: "POST",
    body: form,
  });
  return data.text;
}

export async function pasteResume(text: string): Promise<string> {
  const data = await apiFetch<{ text: string }>("/resume/paste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return data.text;
}

export async function pasteJD(text: string): Promise<string> {
  const data = await apiFetch<{ text: string }>("/jd/paste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return data.text;
}

export async function fetchJDFromUrl(url: string): Promise<string> {
  const data = await apiFetch<{ text: string }>("/jd/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return data.text;
}

export async function analyzeMatch(
  resumeText: string,
  jdText: string
): Promise<string> {
  const data = await apiFetch<{ message: string }>("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text: resumeText, jd_text: jdText }),
  });
  return data.message;
}
