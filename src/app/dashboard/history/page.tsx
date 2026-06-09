import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Clock,
  FileText,
  Brain,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/dashboard/share-button";
import type { Metadata } from "next";

const modeConfig: Record<
  string,
  {
    icon: React.ElementType;
    bg: string;
    text: string;
    border: string;
    label: string;
  }
> = {
  MCQ: {
    icon: BookOpen,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    label: "MCQ",
  },
  FLASHCARDS: {
    icon: Brain,
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    label: "Flashcards",
  },
  SUMMARY: {
    icon: FileText,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    label: "Summary",
  },
};

export const metadata: Metadata = {
  title: "History",
  description: "View all your generated study materials.",
  robots: { index: false, follow: false },
};
export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  const generations = await prisma.generation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: user.plan === "PRO" ? undefined : 20,
  });

  const counts = {
    all: generations.length,
    MCQ: generations.filter((g) => g.mode === "MCQ").length,
    FLASHCARDS: generations.filter((g) => g.mode === "FLASHCARDS").length,
    SUMMARY: generations.filter((g) => g.mode === "SUMMARY").length,
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* ── HEADER ─────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">History</h1>
          <p className="text-slate-500 text-sm mt-1">
            {counts.all} generation{counts.all !== 1 ? "s" : ""}
            {user.plan === "FREE" && counts.all === 20 && (
              <span className="text-amber-600">
                {" "}
                · showing last 20 — upgrade for full history
              </span>
            )}
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            New
          </Button>
        </Link>
      </div>

      {/* ── FILTER CHIPS ───────────────────────── */}
      <div className="flex gap-2 flex-wrap overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-medium cursor-pointer">
          All
          <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
            {counts.all}
          </span>
        </div>
        {(["MCQ", "FLASHCARDS", "SUMMARY"] as const).map((mode) => {
          const cfg = modeConfig[mode];
          return (
            <div
              key={mode}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-colors hover:brightness-95",
                cfg.bg,
                cfg.text,
                cfg.border,
              )}
            >
              {cfg.label}
              <span
                className={cn("px-1.5 py-0.5 rounded-full text-xs bg-white/60")}
              >
                {counts[mode]}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── CONTENT ────────────────────────────── */}
      {generations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-600 font-medium text-lg">
            No generations yet
          </p>
          <p className="text-slate-400 text-sm mt-1 mb-6">
            Your history will appear here once you start
          </p>
          <Link href="/dashboard/generate">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              Create your first quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {generations.map((gen) => {
            const cfg = modeConfig[gen.mode];
            return (
              <div
                key={gen.id}
                className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                {/* Mode icon */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                    cfg.bg,
                  )}
                >
                  <cfg.icon className={cn("w-4 h-4", cfg.text)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs h-5 px-2 font-medium",
                        cfg.bg,
                        cfg.text,
                        cfg.border,
                      )}
                    >
                      {cfg.label}
                    </Badge>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(gen.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {gen.inputText.substring(0, 160)}
                    {gen.inputText.length > 160 ? "..." : ""}
                  </p>
                </div>

                {/* Arrow on hover */}
                <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {gen.shareToken && (
                    <ShareButton shareToken={gen.shareToken} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
