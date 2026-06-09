"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
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
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/generate", label: "Generate", icon: Sparkles },
  { href: "/dashboard/history", label: "History", icon: History },
];

interface SidebarProps {
  userName: string;
  userEmail: string;
  userPlan: string;
  creditsUsed: number;
  creditsTotal: number;
}

interface SidebarContentProps {
  userName: string;
  userEmail: string;
  isPro: boolean;
  creditsLeft: number;
  creditsPercent: number;
  creditsUsed: number;
  creditsTotal: number;
  pathname: string | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function SidebarContent({
  userName,
  userEmail,
  isPro,
  creditsLeft,
  creditsPercent,
  creditsUsed,
  creditsTotal,
  pathname,
  setIsOpen,
}: SidebarContentProps) {
  return (
    <>
      {/* ── LOGO ─────────────────────────────── */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">
              QuizForge
            </p>
            <p className="text-slate-500 text-xs mt-0.5">AI Generator</p>
          </div>
        </div>
        {/* Bouton fermer — mobile seulement */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── USER CARD ──────────────────────────── */}
      <div className="p-4 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80">
          <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate leading-none mb-0.5">
              {userName}
            </p>
            <p className="text-slate-500 text-xs truncate">{userEmail}</p>
          </div>
          {isPro ? (
            <div className="shrink-0 flex items-center gap-1 bg-amber-500/10 text-amber-400 text-xs px-2 py-0.5 rounded-full border border-amber-500/20">
              <Crown className="w-3 h-3" />
              PRO
            </div>
          ) : (
            <div className="shrink-0 text-slate-500 text-xs px-2 py-0.5 rounded-full border border-slate-700">
              FREE
            </div>
          )}
        </div>
      </div>

      {/* ── NAVIGATION ─────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group",
                isActive
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60",
              )}
            >
              <link.icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform",
                  !isActive && "group-hover:scale-110",
                )}
              />
              <span className="font-medium">{link.label}</span>
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── CREDITS BAR ────────────────────────── */}
      <div className="px-4 py-3 border-t border-slate-800/60 shrink-0">
        <div className="p-3 rounded-xl bg-slate-900/80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-xs font-medium">
              Daily credits
            </span>
            <span
              className={cn(
                "text-xs font-semibold",
                creditsLeft === 0
                  ? "text-red-400"
                  : creditsPercent >= 70
                    ? "text-amber-400"
                    : "text-slate-300",
              )}
            >
              {creditsLeft} left
            </span>
          </div>
          <Progress
            value={creditsPercent}
            className={cn(
              "h-1.5 bg-slate-800",
              creditsPercent >= 80
                ? "[&>div]:bg-red-500"
                : creditsPercent >= 50
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-violet-500",
            )}
          />
          <p className="text-slate-600 text-xs mt-1.5">
            {creditsUsed}/{creditsTotal} used · Resets daily
          </p>
        </div>
      </div>

      {/* ── UPGRADE + LOGOUT ───────────────────── */}
      <div className="p-3 border-t border-slate-800/60 space-y-2 shrink-0">
        {!isPro && (
          <button className="w-full flex items-center justify-between px-3 py-2.5 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 text-violet-400 hover:text-violet-300 rounded-xl text-sm font-medium transition-colors">
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Upgrade to PRO
            </span>
            <span className="text-xs bg-violet-600/20 px-2 py-0.5 rounded-full">
              $9/mo
            </span>
          </button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 text-sm h-9"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-4 h-4 mr-2.5" />
          Sign out
        </Button>
      </div>
    </>
  );
}

export function Sidebar({
  userName,
  userEmail,
  userPlan,
  creditsUsed,
  creditsTotal,
}: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const creditsLeft = creditsTotal - creditsUsed;
  const creditsPercent = Math.round((creditsUsed / creditsTotal) * 100);
  const isPro = userPlan === "PRO";

  return (
    <>
      {/* ── SIDEBAR DESKTOP (lg+) ──────────────── */}
      <aside className="hidden lg:flex w-64 bg-slate-950 flex-col h-screen sticky top-0 shrink-0">
        <SidebarContent
          userName={userName}
          userEmail={userEmail}
          isPro={isPro}
          creditsLeft={creditsLeft}
          creditsPercent={creditsPercent}
          creditsUsed={creditsUsed}
          creditsTotal={creditsTotal}
          pathname={pathname}
          setIsOpen={setIsOpen}
        />
      </aside>

      {/* ── TOPBAR MOBILE (< lg) ───────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-950 border-b border-slate-800 h-14 flex items-center px-4 gap-3">
        {/* Bouton hamburger */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo centré */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">QuizForge</span>
        </div>

        {/* Plan badge */}
        <div className="ml-auto">
          {isPro ? (
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-500/20">
              <Crown className="w-3 h-3" />
              PRO
            </div>
          ) : (
            <div className="text-slate-500 text-xs px-2 py-1 rounded-full border border-slate-700">
              FREE
            </div>
          )}
        </div>
      </div>

      {/* ── OVERLAY MOBILE ─────────────────────── */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={() => setIsOpen(false)}
        >
          {/* Fond sombre */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Sidebar panel */}
          <aside
            className="relative w-72 bg-slate-950 flex flex-col h-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              userName={userName}
              userEmail={userEmail}
              isPro={isPro}
              creditsLeft={creditsLeft}
              creditsPercent={creditsPercent}
              creditsUsed={creditsUsed}
              creditsTotal={creditsTotal}
              pathname={pathname}
              setIsOpen={setIsOpen}
            />
          </aside>
        </div>
      )}
    </>
  );
}
