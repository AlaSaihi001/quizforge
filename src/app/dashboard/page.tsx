import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  FileText,
  Brain,
  BookOpen,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const modeConfig: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    bg: string;
    text: string;
    border: string;
  }
> = {
  MCQ: {
    label: "MCQ",
    icon: BookOpen,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  FLASHCARDS: {
    label: "Flashcards",
    icon: Brain,
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  SUMMARY: {
    label: "Summary",
    icon: FileText,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      credits: true,
      generations: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) redirect("/login");

  const totalGenerations = await prisma.generation.count({
    where: { userId: user.id },
  });

  const creditsLeft = (user.credits?.total || 10) - (user.credits?.used || 0);
  const isPro = user.plan === "PRO";

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── HEADER ─────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Good day, {user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Here is your activity overview
        </p>
      </div>

      {/* ── STATS ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Credits */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-violet-200 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm text-slate-500 font-medium">
              Credits left today
            </p>
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-600" />
            </div>
          </div>
          <p
            className={cn(
              "text-4xl font-bold mb-1",
              creditsLeft === 0 ? "text-red-600" : "text-slate-900",
            )}
          >
            {creditsLeft}
          </p>
          <p className="text-xs text-slate-400">
            {user.credits?.used || 0} used of {user.credits?.total || 10}
          </p>
        </div>

        {/* Total generations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-200 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm text-slate-500 font-medium">
              Total generations
            </p>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-1">
            {totalGenerations}
          </p>
          <p className="text-xs text-slate-400">All time</p>
        </div>

        {/* Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-amber-200 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm text-slate-500 font-medium">Current plan</p>
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center",
                isPro ? "bg-amber-50" : "bg-slate-100",
              )}
            >
              <Crown
                className={cn(
                  "w-4 h-4",
                  isPro ? "text-amber-500" : "text-slate-400",
                )}
              />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-1">{user.plan}</p>
          <p className="text-xs text-slate-400">
            {isPro ? "Unlimited access" : "10 credits/day"}
          </p>
        </div>
      </div>

      {/* ── QUICK ACTIONS ──────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { mode: "MCQ", label: "MCQ Quiz", desc: "10 questions" },
          { mode: "FLASHCARDS", label: "Flashcards", desc: "Q&A pairs" },
          { mode: "SUMMARY", label: "Summary", desc: "Key points" },
        ].map(({ mode, label, desc }) => {
          const cfg = modeConfig[mode];
          return (
            <Link key={mode} href="/dashboard/generate">
              <div
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm",
                  cfg.bg,
                  cfg.border,
                  "hover:brightness-95",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center bg-white/80",
                    cfg.border,
                    "border",
                  )}
                >
                  <cfg.icon className={cn("w-4 h-4", cfg.text)} />
                </div>
                <div>
                  <p className={cn("font-medium text-sm", cfg.text)}>{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <ArrowRight
                  className={cn("w-4 h-4 ml-auto", cfg.text, "opacity-50")}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── RECENT GENERATIONS ─────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Recent generations</h2>
          <Link href="/dashboard/history">
            <Button
              variant="ghost"
              size="sm"
              className="text-violet-600 hover:text-violet-700 text-sm"
            >
              View all <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

        {user.generations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center py-14">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">No generations yet</p>
            <p className="text-slate-400 text-sm mt-1 mb-5">
              Create your first quiz to get started
            </p>
            <Link href="/dashboard/generate">
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Generate now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {user.generations.map((gen) => {
              const cfg = modeConfig[gen.mode];
              return (
                <div
                  key={gen.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      cfg.bg,
                    )}
                  >
                    <cfg.icon className={cn("w-4 h-4", cfg.text)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs h-5 px-2",
                          cfg.bg,
                          cfg.text,
                          cfg.border,
                        )}
                      >
                        {gen.mode}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 truncate">
                      {gen.inputText.substring(0, 90)}...
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(gen.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── UPGRADE BANNER (FREE only) ─────────── */}
      {!isPro && (
        <div className="bg-slate-950 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-white font-semibold text-sm">
                Upgrade to PRO
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Unlimited generations, PDF export, shareable links
            </p>
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white shrink-0">
            Upgrade — $9/mo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
