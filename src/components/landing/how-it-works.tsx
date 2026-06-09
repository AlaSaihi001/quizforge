import { ClipboardPaste, SlidersHorizontal, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardPaste,
    title: "Paste your content",
    description:
      "Copy any text — lecture notes, textbook chapters, PDFs, articles. The more content, the better the results.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Choose your mode",
    description:
      "Select MCQ for practice tests, Flashcards for memorization, or Summary for quick review. Pick your language too.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    number: "03",
    icon: Download,
    title: "Study or export",
    description:
      "Practice directly in the app, share with classmates via a link, or export as a PDF to study offline.",
    color: "bg-emerald-100 text-emerald-600",
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
            Simple process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            From notes to quiz in 3 steps
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            No setup, no configuration. Paste, choose, and study.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Ligne de connexion entre les steps (desktop) */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-linear-to-r from-blue-200 via-violet-200 to-emerald-200" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              {/* Numéro + icône */}
              <div className="relative mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${step.color}`}
                >
                  <step.icon className="w-7 h-7" />
                </div>
                {/* Numéro flottant */}
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
