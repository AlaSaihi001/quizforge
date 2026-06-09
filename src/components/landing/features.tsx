import {
  BookOpen,
  Brain,
  FileText,
  Globe,
  Link2,
  Download,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "MCQ Quiz",
    description:
      "10 multiple choice questions with 4 options each, correct answers, and detailed explanations.",
    tag: "Most popular",
    tagColor: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Brain,
    title: "Flashcards",
    description:
      "Question-answer pairs optimized for active recall and spaced repetition learning.",
    tag: null,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: FileText,
    title: "Smart Summary",
    description:
      "Structured overview with key points, important terms, and a conclusion from your content.",
    tag: null,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: Globe,
    title: "3 Languages",
    description:
      "Generate in English, French, or Arabic. Perfect for students in Tunisia and MENA.",
    tag: null,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: Link2,
    title: "Share links",
    description:
      "Every generation gets a unique public link. Share with classmates without requiring an account.",
    tag: null,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: Download,
    title: "PDF Export",
    description:
      "Download formatted PDFs of your quizzes and summaries to study offline. PRO feature.",
    tag: "PRO",
    tagColor: "bg-amber-100 text-amber-700",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
            Everything you need
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            Built for serious students
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            All the tools you need to turn passive reading into active learning.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all"
            >
              {/* Icon + Tag */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.iconBg}`}
                >
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                {f.tag && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${f.tagColor}`}
                  >
                    {f.tag}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
