/* Main application logic – replaces React components with vanilla JS */

/* ── App state ──────────────────────────────────────────── */
let resumeText = null;
let jdText = null;
let analyzing = false;

/* ── Resume section ─────────────────────────────────────── */
function switchResumeMode(mode) {
  const uploadArea = document.getElementById("resume-upload-area");
  const pasteArea  = document.getElementById("resume-paste-area");
  const tabUpload  = document.getElementById("resume-tab-upload");
  const tabPaste   = document.getElementById("resume-tab-paste");
  const errorEl    = document.getElementById("resume-error");

  errorEl.textContent = "";
  errorEl.classList.add("hidden");

  if (mode === "upload") {
    uploadArea.classList.remove("hidden");
    pasteArea.classList.add("hidden");
    tabUpload.classList.add("active");
    tabPaste.classList.remove("active");
  } else {
    uploadArea.classList.add("hidden");
    pasteArea.classList.remove("hidden");
    tabUpload.classList.remove("active");
    tabPaste.classList.add("active");
  }
}

async function handleResumeFileChange(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const fileLabel  = document.getElementById("resume-file-label");
  const loadingEl  = document.getElementById("resume-loading");
  const errorEl    = document.getElementById("resume-error");

  fileLabel.innerHTML = `<span class="link-text">${file.name}</span>`;
  errorEl.textContent = "";
  errorEl.classList.add("hidden");
  loadingEl.classList.remove("hidden");

  try {
    const text = await uploadResumeFile(file);
    setResumeText(text);
  } catch (err) {
    showResumeError(err.message || "Upload failed.");
  } finally {
    loadingEl.classList.add("hidden");
  }
}

async function handleResumePasteSubmit() {
  const textarea = document.getElementById("resume-paste-text");
  const btn      = document.getElementById("resume-paste-btn");
  const errorEl  = document.getElementById("resume-error");
  const text     = textarea.value.trim();

  if (!text) {
    showResumeError("Please paste your resume text.");
    return;
  }

  errorEl.textContent = "";
  errorEl.classList.add("hidden");
  btn.disabled = true;
  btn.textContent = "Processing\u2026";

  try {
    const result = await pasteResume(text);
    setResumeText(result);
  } catch (err) {
    showResumeError(err.message || "Failed.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Use This Resume";
  }
}

function showResumeError(message) {
  const errorEl = document.getElementById("resume-error");
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

/* ── JD section ─────────────────────────────────────────── */
function switchJDMode(mode) {
  const pasteArea = document.getElementById("jd-paste-area");
  const urlArea   = document.getElementById("jd-url-area");
  const tabPaste  = document.getElementById("jd-tab-paste");
  const tabUrl    = document.getElementById("jd-tab-url");
  const errorEl   = document.getElementById("jd-error");

  errorEl.textContent = "";
  errorEl.classList.add("hidden");

  if (mode === "paste") {
    pasteArea.classList.remove("hidden");
    urlArea.classList.add("hidden");
    tabPaste.classList.add("active");
    tabUrl.classList.remove("active");
  } else {
    pasteArea.classList.add("hidden");
    urlArea.classList.remove("hidden");
    tabPaste.classList.remove("active");
    tabUrl.classList.add("active");
  }
}

async function handleJDPasteSubmit() {
  const textarea = document.getElementById("jd-paste-text");
  const btn      = document.getElementById("jd-paste-btn");
  const errorEl  = document.getElementById("jd-error");
  const text     = textarea.value.trim();

  if (!text) {
    showJDError("Please paste a job description.");
    return;
  }

  errorEl.textContent = "";
  errorEl.classList.add("hidden");
  btn.disabled = true;
  btn.textContent = "Processing\u2026";

  try {
    const result = await pasteJD(text);
    setJDText(result);
  } catch (err) {
    showJDError(err.message || "Failed.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Use This JD";
  }
}

async function handleJDUrlSubmit() {
  const input   = document.getElementById("jd-url-input");
  const btn     = document.getElementById("jd-url-btn");
  const errorEl = document.getElementById("jd-error");
  const url     = input.value.trim();

  if (!url) {
    showJDError("Please enter a URL.");
    return;
  }

  errorEl.textContent = "";
  errorEl.classList.add("hidden");
  btn.disabled = true;
  btn.textContent = "Fetching\u2026";

  try {
    const result = await fetchJDFromUrl(url);
    setJDText(result);
  } catch (err) {
    showJDError(err.message || "Failed to fetch URL.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Fetch JD";
  }
}

function showJDError(message) {
  const errorEl = document.getElementById("jd-error");
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

/* ── State updaters ─────────────────────────────────────── */
function setResumeText(text) {
  resumeText = text;

  // Update badge
  const badge = document.getElementById("badge-resume");
  badge.textContent = "\u2713 Resume loaded";
  badge.classList.remove("badge-inactive");
  badge.classList.add("badge-active");

  // Update preview
  const preview      = document.getElementById("resume-preview");
  const previewEmpty = document.getElementById("resume-preview-empty");
  preview.textContent = text;
  preview.classList.remove("hidden");
  previewEmpty.classList.add("hidden");

  // Clear any analyze message
  clearAnalyzeResult();
  updateAnalyzeButton();
}

function setJDText(text) {
  jdText = text;

  // Update badge
  const badge = document.getElementById("badge-jd");
  badge.textContent = "\u2713 Job description loaded";
  badge.classList.remove("badge-inactive");
  badge.classList.add("badge-active");

  // Update preview
  const preview      = document.getElementById("jd-preview");
  const previewEmpty = document.getElementById("jd-preview-empty");
  preview.textContent = text;
  preview.classList.remove("hidden");
  previewEmpty.classList.add("hidden");

  // Clear any analyze message
  clearAnalyzeResult();
  updateAnalyzeButton();
}

function updateAnalyzeButton() {
  const btn = document.getElementById("analyze-btn");
  btn.disabled = !(resumeText && jdText) || analyzing;
}

function clearAnalyzeResult() {
  const resultEl = document.getElementById("analyze-result");
  resultEl.classList.add("hidden");
  document.getElementById("analyze-message").textContent = "";
}

/* ── Analyze ────────────────────────────────────────────── */
async function handleAnalyze() {
  if (!resumeText || !jdText) return;

  const btn = document.getElementById("analyze-btn");
  analyzing = true;
  btn.disabled = true;
  btn.textContent = "Analyzing\u2026";
  clearAnalyzeResult();

  try {
    const message = await analyzeMatch(resumeText, jdText);
    showAnalyzeResult(message);
  } catch (err) {
    showAnalyzeResult(err.message || "Analysis failed.");
  } finally {
    analyzing = false;
    btn.textContent = "Analyze";
    updateAnalyzeButton();
  }
}

function showAnalyzeResult(message) {
  const resultEl  = document.getElementById("analyze-result");
  const messageEl = document.getElementById("analyze-message");
  messageEl.textContent = message;
  resultEl.classList.remove("hidden");
}
