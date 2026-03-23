"use client";

import { useRef, useState } from "react";
import { uploadResumeFile, pasteResume } from "@/lib/api";

interface ResumeInputProps {
  onResumeReady: (text: string) => void;
}

type Mode = "upload" | "paste";

export default function ResumeInput({ onResumeReady }: ResumeInputProps) {
  const [mode, setMode] = useState<Mode>("upload");
  const [pasteText, setPasteText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError(null);
    setLoading(true);
    try {
      const text = await uploadResumeFile(file);
      onResumeReady(text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasteSubmit = async () => {
    if (!pasteText.trim()) {
      setError("Please paste your resume text.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const text = await pasteResume(pasteText);
      onResumeReady(text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        📄 Resume
      </h2>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-5">
        {(["upload", "paste"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              mode === m
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {m === "upload" ? "Upload File" : "Paste Text"}
          </button>
        ))}
      </div>

      {mode === "upload" ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-slate-500 text-sm">
            {fileName ? (
              <span className="font-medium text-indigo-600">{fileName}</span>
            ) : (
              <>
                Drop your resume here or{" "}
                <span className="text-indigo-600 font-medium">browse</span>
              </>
            )}
          </p>
          <p className="text-xs text-slate-400 mt-1">PDF or DOCX · max 5 MB</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <textarea
            rows={8}
            placeholder="Paste your resume text here…"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handlePasteSubmit}
            disabled={loading}
            className="self-end px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? "Processing…" : "Use This Resume"}
          </button>
        </div>
      )}

      {loading && mode === "upload" && (
        <p className="mt-3 text-sm text-indigo-500">Parsing file…</p>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      )}
    </section>
  );
}
