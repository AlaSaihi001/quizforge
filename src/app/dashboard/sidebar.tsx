"use client";
// "use client" car on utilise usePathname() qui est un hook

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Sparkles,
  History,
  LogOut,
  Zap,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Définition des liens de navigation
const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/generate",
    label: "Generate",
    icon: Sparkles,
  },
  {
    href: "/dashboard/history",
    label: "History",
    icon: History,
  },
];

// Les props que ce composant reçoit depuis le layout
interface SidebarProps {
  userName: string;
  userEmail: string;
  userPlan: string;
  creditsUsed: number;
  creditsTotal: number;
}

export function Sidebar({
  userName,
  userEmail,
  userPlan,
  creditsUsed,
  creditsTotal,
}: SidebarProps) {
  const pathname = usePathname();
  // usePathname() retourne l'URL actuelle ex: "/dashboard/generate"
  // On l'utilise pour savoir quel lien est "actif"

  const creditsPercent = Math.round((creditsUsed / creditsTotal) * 100);
  const isPro = userPlan === "PRO";

  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-screen sticky top-0">
      {/* ── LOGO ─────────────────────────────── */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">QuizForge</h1>
            <p className="text-slate-500 text-xs">AI Exam Generator</p>
          </div>
        </div>
      </div>

      {/* ── USER INFO ────────────────────────── */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar avec initiales */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {userName}
            </p>
            <p className="text-slate-400 text-xs truncate">{userEmail}</p>
          </div>
        </div>

        {/* Badge plan */}
        <Badge
          className={cn(
            "text-xs",
            isPro
              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
              : "bg-slate-700 text-slate-400 border-slate-600",
          )}
          variant="outline"
        >
          {isPro ? (
            <>
              <Crown className="w-3 h-3 mr-1" /> PRO
            </>
          ) : (
            "FREE"
          )}
        </Badge>
      </div>

      {/* ── CREDITS ──────────────────────────── */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-xs">Credits used</span>
          <span className="text-white text-xs font-medium">
            {creditsUsed}/{creditsTotal}
          </span>
        </div>
        <Progress
          value={creditsPercent}
          className={cn(
            "h-1.5",
            creditsPercent >= 80 ? "[&>div]:bg-red-500" : "[&>div]:bg-blue-500",
          )}
        />
        {creditsPercent >= 80 && (
          <p className="text-red-400 text-xs mt-1">Running low!</p>
        )}
      </div>

      {/* ── NAVIGATION ───────────────────────── */}
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => {
          // Un lien est "actif" si l'URL actuelle correspond exactement
          // ou si c'est une sous-page (ex: /dashboard/generate/result)
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-blue-600 text-white font-medium"
                  : "text-slate-400 hover:text-white hover:bg-slate-800",
              )}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* ── UPGRADE + LOGOUT ─────────────────── */}
      <div className="p-4 space-y-2 border-t border-slate-800">
        {/* Bouton Upgrade visible seulement pour les FREE */}
        {!isPro && (
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm"
            size="lg"
          >
            <Crown className="w-3.5 h-3.5 mr-2" />
            Upgrade to PRO
          </Button>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full text-slate-400 hover:text-white hover:bg-slate-800 justify-start text-sm"
          size="lg"
          onClick={() => signOut({ callbackUrl: "/login" })}
          // signOut redirige vers /login après déconnexion
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
