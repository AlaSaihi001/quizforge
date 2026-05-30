import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, FileText, Trash2 } from "lucide-react";
import Link from "next/link";

const modeColors: Record<string, string> = {
  MCQ: "bg-blue-100 text-blue-700 border-blue-200",
  FLASHCARDS: "bg-green-100 text-green-700 border-green-200",
  SUMMARY: "bg-amber-100 text-amber-700 border-amber-200",
};

const modeIcons: Record<string, string> = {
  MCQ: "📝",
  FLASHCARDS: "🃏",
  SUMMARY: "📋",
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
    // PRO users voient tout, FREE voient les 20 derniers
    take: user.plan === "PRO" ? undefined : 20,
  });

  return (
    <div className="space-y-6">
      {/* ── HEADER ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">History</h1>
          <p className="text-slate-500 mt-1">
            {generations.length} generation{generations.length !== 1 ? "s" : ""}
            {user.plan === "FREE" && " — last 20 (upgrade for full history)"}
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button>
            <Sparkles className="w-4 h-4 mr-2" />
            New Generation
          </Button>
        </Link>
      </div>

      {/* ── FILTRES par mode ───────────────────── */}
      {/* Juste visuels pour l'instant — la logique filtre viendra après */}
      <div className="flex gap-2">
        <Badge
          variant="outline"
          className="cursor-pointer bg-white hover:bg-slate-50 px-3 py-1"
        >
          All ({generations.length})
        </Badge>
        <Badge
          variant="outline"
          className="cursor-pointer bg-white hover:bg-slate-50 px-3 py-1 text-blue-600 border-blue-200"
        >
          MCQ ({generations.filter((g) => g.mode === "MCQ").length})
        </Badge>
        <Badge
          variant="outline"
          className="cursor-pointer bg-white hover:bg-slate-50 px-3 py-1 text-green-600 border-green-200"
        >
          Flashcards (
          {generations.filter((g) => g.mode === "FLASHCARDS").length})
        </Badge>
        <Badge
          variant="outline"
          className="cursor-pointer bg-white hover:bg-slate-50 px-3 py-1 text-amber-600 border-amber-200"
        >
          Summary ({generations.filter((g) => g.mode === "SUMMARY").length})
        </Badge>
      </div>

      {/* ── LISTE ──────────────────────────────── */}
      {generations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium text-lg">
              No generations yet
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Your history will appear here
            </p>
            <Link href="/dashboard/generate" className="mt-4">
              <Button>Create your first quiz</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {generations.map((gen) => (
            <Card
              key={gen.id}
              className="hover:shadow-md transition-all border-slate-200 group"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Icone + contenu */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="text-2xl shrink-0 mt-0.5">
                      {modeIcons[gen.mode]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={modeColors[gen.mode]}
                        >
                          {gen.mode}
                        </Badge>
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(gen.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {gen.inputText.substring(0, 150)}
                        {gen.inputText.length > 150 ? "..." : ""}
                      </p>
                    </div>
                  </div>

                  {/* Actions — visibles au hover */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button variant="outline" size="sm" className="text-xs">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
