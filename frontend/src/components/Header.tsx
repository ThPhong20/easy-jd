export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          RT
        </div>
        <span className="text-xl font-semibold text-slate-800 tracking-tight">
          ResumeTailor
        </span>
      </div>
    </header>
  );
}
