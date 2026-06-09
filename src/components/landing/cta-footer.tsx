import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

export function LandingCTAFooter() {
  return (
    <>
      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to study smarter?
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join students using QuizForge to ace their exams. Start free, no
            credit card required.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white h-12 px-10 text-base"
            >
              Get started for free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">
              QuizForge AI
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Register
            </Link>
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* Credit */}
          <p className="text-slate-500 text-sm">
            Built with Next.js, Prisma & Groq AI
          </p>
        </div>
      </footer>
    </>
  );
}
