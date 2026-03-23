"use client";

import { useState } from "react";
import { pasteJD, fetchJDFromUrl } from "@/lib/api";

interface JDInputProps {
  onJDReady: (text: string) => void;
}

type Tab = "paste" | "url";

export default function JDInput({ onJDReady }: JDInputProps) {
  const [tab, setTab] = useState<Tab>("paste");
  const [pasteText, setPasteText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasteSubmit = async () => {
    if (!pasteText.trim()) {
      setError("Please paste a job description.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const text = await pasteJD(pasteText);
      onJDReady(text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const text = await fetchJDFromUrl(url.trim());
      onJDReady(text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        💼 Job Description
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["paste", "url"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(null); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === t
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t === "paste" ? "Paste JD" : "Paste JD Link"}
          </button>
        ))}
      </div>

      {tab === "paste" ? (
        <div className="flex flex-col gap-3">
          <textarea
            rows={8}
            placeholder="Paste the job description here…"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handlePasteSubmit}
            disabled={loading}
            className="self-end px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? "Processing…" : "Use This JD"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            type="url"
            placeholder="https://company.com/jobs/example-role"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleUrlSubmit}
            disabled={loading}
            className="self-end px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? "Fetching…" : "Fetch JD"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      )}
    </section>
  );
}
