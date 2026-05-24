import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // Récupère les crédits de l'utilisateur connecté
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { credits: true },
  });

  const creditsUsed = user?.credits?.used ?? 0;
  const creditsTotal = user?.credits?.total ?? 10;
  const creditsPercent = Math.round((creditsUsed / creditsTotal) * 100);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col p-5 shrink-0">
        {/* Logo */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">⚡ QuizForge</h2>
          <p className="text-slate-400 text-xs mt-1">AI Exam Generator</p>
        </div>

        {/* User info */}
        <div className="bg-slate-800 rounded-xl p-3 mb-5">
          <p className="text-white text-sm font-medium truncate">
            {session.user.name || session.user.email}
          </p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
              user?.plan === "PRO"
                ? "bg-amber-500 text-white"
                : "bg-slate-600 text-slate-300"
            }`}
          >
            {user?.plan === "PRO" ? "⭐ PRO" : "FREE"}
          </span>
        </div>

        {/* Credits bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Credits</span>
            <span>
              {creditsUsed}/{creditsTotal}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                creditsPercent >= 80 ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${creditsPercent}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
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

        {/* Upgrade + Logout */}
        <div className="flex flex-col gap-2 mt-4">
          {user?.plan === "FREE" && (
            <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors">
              ⭐ Upgrade to PRO
            </button>
          )}

          <Link
            href="/api/auth/signout"
            className="flex items-center justify-center w-full py-2 bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white text-sm rounded-lg transition-colors"
          >
            🚪 Logout
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
