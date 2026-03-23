"use client";

interface ResultsPanelProps {
  resumeText: string | null;
  jdText: string | null;
  analyzeMessage: string | null;
  loading: boolean;
  onAnalyze: () => void;
}

export default function ResultsPanel({
  resumeText,
  jdText,
  analyzeMessage,
  loading,
  onAnalyze,
}: ResultsPanelProps) {
  const canAnalyze = Boolean(resumeText && jdText);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-700">🔍 Preview &amp; Results</h2>
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze || loading}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resume preview */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Resume Text
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 h-56 overflow-y-auto">
            {resumeText ? (
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                {resumeText}
              </pre>
            ) : (
              <p className="text-sm text-slate-400 italic">
                No resume loaded yet. Upload a file or paste text above.
              </p>
            )}
          </div>
        </div>

        {/* JD preview */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Job Description Text
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 h-56 overflow-y-auto">
            {jdText ? (
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                {jdText}
              </pre>
            ) : (
              <p className="text-sm text-slate-400 italic">
                No job description loaded yet. Paste or link one above.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Analyze result */}
      {analyzeMessage && (
        <div className="mt-4 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-3">
          <p className="text-sm text-indigo-700">{analyzeMessage}</p>
        </div>
      )}
    </section>
  );
}
