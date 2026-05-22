export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col p-5 gap-4 shrink-0">
        {/* Logo */}
        <div className="mb-2">
          <h2 className="text-xl font-bold text-white">⚡ QuizForge</h2>
          <p className="text-slate-400 text-xs mt-1">AI Exam Generator</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm"
          >
            🏠 Dashboard
          </a>

          <a
            href="/dashboard/generate"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm"
          >
            ✨ Generate
          </a>

          <a
            href="/dashboard/history"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm"
          >
            📚 History
          </a>
        </nav>

        {/* Spacer */}
        <div className="mt-auto">
          <a
            href="/api/auth/signout"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
          >
            🚪 Logout
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto bg-black-800">
        {children}
      </main>
    </div>
  );
}
