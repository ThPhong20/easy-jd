"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ResumeInput from "@/components/ResumeInput";
import JDInput from "@/components/JDInput";
import ResultsPanel from "@/components/ResultsPanel";
import { analyzeMatch } from "@/lib/api";

export default function Home() {
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [jdText, setJDText] = useState<string | null>(null);
  const [analyzeMessage, setAnalyzeMessage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText || !jdText) return;
    setAnalyzing(true);
    setAnalyzeMessage(null);
    try {
      const msg = await analyzeMatch(resumeText, jdText);
      setAnalyzeMessage(msg);
    } catch (err: unknown) {
      setAnalyzeMessage(
        err instanceof Error ? err.message : "Analysis failed."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <section className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Tailor your resume to any job
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Upload your resume and paste (or link) a job description. ResumeTailor
            will help you see how well they match and guide you to close the gap.
          </p>
        </section>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResumeInput onResumeReady={(text) => { setResumeText(text); setAnalyzeMessage(null); }} />
          <JDInput onJDReady={(text) => { setJDText(text); setAnalyzeMessage(null); }} />
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-3 justify-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              resumeText
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {resumeText ? "✓ Resume loaded" : "Resume not loaded"}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              jdText
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {jdText ? "✓ Job description loaded" : "Job description not loaded"}
          </span>
        </div>

        {/* Results */}
        <ResultsPanel
          resumeText={resumeText}
          jdText={jdText}
          analyzeMessage={analyzeMessage}
          loading={analyzing}
          onAnalyze={handleAnalyze}
        />
      </main>
    </>
  );
}
