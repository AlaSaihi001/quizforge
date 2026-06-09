import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, Brain, FileText } from "lucide-react";

export function LandingHero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge annonce */}
        <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-sm px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Llama 3.3 · Free to start</span>
        </div>

        {/* Titre principal */}
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          Turn your notes into
          <br />
          <span className="text-violet-600">perfect study material</span>
        </h1>

        {/* Sous-titre */}
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste any course content and get MCQ quizzes, flashcards, or
          structured summaries in seconds. Study smarter, not harder.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white h-12 px-8 text-base shadow-lg shadow-violet-200"
            >
              Start for free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base border-slate-300"
            >
              Sign in
            </Button>
          </Link>
        </div>

        <p className="text-sm text-slate-400 mb-16">
          No credit card required · 10 free generations per day
        </p>

        {/* Preview UI — fausse interface pour montrer le produit */}
        <div className="relative max-w-3xl mx-auto overflow-hidden">
          {/* Glow effect derrière */}
          <div className="absolute -inset-4 bg-violet-100/50 rounded-3xl blur-2xl" />

          {/* Fausse interface */}
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            {/* Fausse barre d'onglets */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-4">
                <div className="bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 text-left">
                  quizforge.vercel.app/dashboard/generate
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              {/* Mode selector */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  {
                    icon: BookOpen,
                    label: "MCQ Quiz",
                    active: true,
                    color: "border-blue-500 bg-blue-50",
                  },
                  {
                    icon: Brain,
                    label: "Flashcards",
                    active: false,
                    color: "border-slate-200 bg-white",
                  },
                  {
                    icon: FileText,
                    label: "Summary",
                    active: false,
                    color: "border-slate-200 bg-white",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 ${m.color}`}
                  >
                    <m.icon
                      className={`w-4 h-4 ${m.active ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <span
                      className={`text-sm font-medium ${m.active ? "text-blue-700" : "text-slate-500"}`}
                    >
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Fausse textarea */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-left">
                <p className="text-sm text-slate-400 leading-relaxed">
                  The French Revolution began in 1789 with the financial crisis
                  and social inequality under King Louis XVI. The storming of
                  the Bastille on July 14th marked the beginning of radical
                  political change in France...
                </p>
              </div>

              {/* Faux bouton */}
              <div className="w-full h-11 bg-violet-600 rounded-xl flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-semibold">
                  Generate MCQ Quiz
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
