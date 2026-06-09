"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ajoute une ombre quand l'user scroll
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">QuizForge</span>
          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
            AI
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            How it works
          </a>

          <a
            href="#pricing"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* CTA buttons desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-600">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              Get started free
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm text-slate-600 py-2">
            Features
          </a>
          <a href="#how-it-works" className="block text-sm text-slate-600 py-2">
            How it works
          </a>
          <a href="#pricing" className="block text-sm text-slate-600 py-2">
            Pricing
          </a>
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Sign in
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button
                size="sm"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
