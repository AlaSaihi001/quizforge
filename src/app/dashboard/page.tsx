import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, History, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      credits: true,
      // On prend seulement les 3 dernières générations pour le résumé
      generations: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  if (!user) redirect("/login");

  const totalGenerations = await prisma.generation.count({
    where: { userId: user.id },
  });

  // Couleurs pour les badges de mode
  const modeColors: Record<string, string> = {
    MCQ: "bg-blue-100 text-blue-700 border-blue-200",
    FLASHCARDS: "bg-green-100 text-green-700 border-green-200",
    SUMMARY: "bg-amber-100 text-amber-700 border-amber-200",
  };

  return (
    <div className="space-y-8">
      {/* ── TITRE ──────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Here is an overview of your activity
        </p>
      </div>

      {/* ── STATS CARDS ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Crédits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Credits Remaining
            </CardTitle>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {(user.credits?.total || 10) - (user.credits?.used || 0)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user.credits?.used || 0} used of {user.credits?.total || 10}
            </p>
          </CardContent>
        </Card>

        {/* Card Total Générations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Generations
            </CardTitle>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {totalGenerations}
            </div>
            <p className="text-xs text-slate-400 mt-1">All time</p>
          </CardContent>
        </Card>

        {/* Card Plan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Current Plan
            </CardTitle>
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <History className="w-4 h-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{user.plan}</div>
            <p className="text-xs text-slate-400 mt-1">
              {user.plan === "FREE"
                ? "Upgrade for unlimited"
                : "Unlimited access"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── RECENT GENERATIONS ─────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Generations
          </h2>
          <Link href="/dashboard/history">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              View all →
            </Button>
          </Link>
        </div>

        {user.generations.length === 0 ? (
          // Empty state — quand il n'y a pas encore de générations
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sparkles className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No generations yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Create your first quiz to get started
              </p>
              <Link href="/dashboard/generate" className="mt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Generate now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {user.generations.map((gen) => (
              <Card key={gen.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={modeColors[gen.mode]}>
                      {gen.mode}
                    </Badge>
                    <p className="text-sm text-slate-600 line-clamp-1 max-w-md">
                      {gen.inputText.substring(0, 80)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(gen.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── CTA UPGRADE (si FREE) ──────────────── */}
      {user.plan === "FREE" && (
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-semibold text-lg">Upgrade to PRO</p>
              <p className="text-blue-200 text-sm mt-1">
                Unlimited generations, PDF export, and more
              </p>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 shrink-0">
              Upgrade — $9/mo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
