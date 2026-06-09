import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X, Crown } from "lucide-react";

const freePlan = [
  { text: "10 generations per day", included: true },
  { text: "MCQ, Flashcards & Summary", included: true },
  { text: "English, French & Arabic", included: true },
  { text: "Share links", included: true },
  { text: "Generation history", included: true },
  { text: "PDF export", included: false },
  { text: "Unlimited generations", included: false },
];

const proPlan = [
  { text: "Unlimited generations", included: true },
  { text: "MCQ, Flashcards & Summary", included: true },
  { text: "English, French & Arabic", included: true },
  { text: "Share links", included: true },
  { text: "Full history", included: true },
  { text: "PDF export", included: true },
  { text: "Priority AI processing", included: true },
];

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            Start free, upgrade when ready
          </h2>
          <p className="text-slate-500">No hidden fees. Cancel anytime.</p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* FREE */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Free
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-slate-900">$0</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">
                Perfect to get started
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {freePlan.map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  {item.included ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span
                    className={`text-sm ${item.included ? "text-slate-700" : "text-slate-400"}`}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/register">
              <Button
                variant="outline"
                className="w-full border-slate-300 hover:border-slate-400"
              >
                Get started free
              </Button>
            </Link>
          </div>

          {/* PRO */}
          <div className="relative bg-violet-600 rounded-2xl p-8 overflow-hidden">
            {/* Badge Popular */}
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Most popular
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-amber-300" />
                <p className="text-sm font-semibold text-violet-200 uppercase tracking-wider">
                  Pro
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">$9</span>
                <span className="text-violet-300">/month</span>
              </div>
              <p className="text-violet-300 text-sm mt-2">
                For serious learners
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {proPlan.map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span className="text-sm text-violet-100">{item.text}</span>
                </li>
              ))}
            </ul>

            <Link href="/register">
              <Button className="w-full bg-white text-violet-700 hover:bg-violet-50 font-semibold">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to PRO
              </Button>
            </Link>

            <p className="text-violet-300 text-xs text-center mt-3">
              Cancel anytime · No commitment
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
