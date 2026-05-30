import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  FileText,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Brain,
  LayoutDashboard,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "MCQ Quiz",
    description:
      "Generate 10 multiple choice questions with detailed explanations automatically.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: Brain,
    title: "Flashcards",
    description:
      "Create question-answer pairs perfect for active recall and spaced repetition.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: FileText,
    title: "Smart Summary",
    description:
      "Extract key points and structure your notes into a clean, readable summary.",
    color: "bg-emerald-100 text-emerald-600",
  },
];

const pricingFree = [
  "10 generations per day",
  "MCQ, Flashcards & Summary",
  "English, French & Arabic",
  "Generation history",
];

const pricingPro = [
  "Unlimited generations",
  "PDF export",
  "Shareable links",
  "Priority AI processing",
  "Full history",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">QuizForge</span>
            <Badge variant="secondary" className="text-xs ml-1">
              AI
            </Badge>
          </div>
          <div className="flex items-center gap-3">
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
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <Badge
          variant="outline"
          className="mb-6 border-violet-200 text-violet-700 bg-violet-50 px-4 py-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          AI-powered exam preparation
        </Badge>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          Turn your notes into
          <br />
          <span className="text-violet-600">perfect quizzes</span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste your course content and get MCQ quizzes, flashcards, or
          summaries in seconds. Study smarter, not harder.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 h-12 text-base"
            >
              Start for free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-12 text-base border-slate-300"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              View dashboard
            </Button>
          </Link>
        </div>

        <p className="text-sm text-slate-400 mt-5">
          No credit card required · 10 free generations/day
        </p>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Three modes, one tool
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Choose how you want to study and let AI do the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}
                >
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Simple pricing
          </h2>
          <p className="text-slate-500">
            Start free, upgrade when you need more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* FREE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-3">
                Free
              </Badge>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-400">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {pricingFree.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button variant="outline" className="w-full border-slate-300">
                Get started free
              </Button>
            </Link>
          </div>

          {/* PRO */}
          <div className="bg-violet-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/20 text-white border-0">Popular</Badge>
            </div>
            <div className="mb-6">
              <Badge className="bg-white/20 text-white border-0 mb-3">
                Pro
              </Badge>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-violet-300">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {pricingPro.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-violet-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button className="w-full bg-white text-violet-700 hover:bg-violet-50">
                Upgrade to Pro
                <CreditCard className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700">
              QuizForge AI
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Built with Next.js, Prisma & OpenAI
          </p>
        </div>
      </footer>
    </div>
  );
}
