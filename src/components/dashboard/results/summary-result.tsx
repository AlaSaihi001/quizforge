import { SummaryResult } from "@/lib/parsers";
import { BookOpen, Tag } from "lucide-react";

export function SummaryResultDisplay({ data }: { data: SummaryResult }) {
  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">{data.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          {data.overview}
        </p>
      </div>

      {/* Key Points */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="font-semibold text-slate-900 text-sm">Key Points</p>
          <span className="ml-auto text-xs text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">
            {data.key_points.length}
          </span>
        </div>
        <div className="space-y-3">
          {data.key_points.map((kp) => (
            <div
              key={kp.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {kp.id}
              </span>
              <div>
                <p className="text-sm font-semibold text-emerald-900 mb-0.5">
                  {kp.point}
                </p>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  {kp.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Terms */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="font-semibold text-slate-900 text-sm">
            Important Terms
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.important_terms.map((term, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-blue-200 bg-blue-50"
            >
              <p className="text-sm font-semibold text-blue-900 mb-1">
                {term.term}
              </p>
              <p className="text-xs text-blue-700/80 leading-relaxed">
                {term.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="p-4 rounded-xl bg-slate-900">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
          Conclusion
        </p>
        <p className="text-slate-200 text-sm leading-relaxed">
          {data.conclusion}
        </p>
      </div>
    </div>
  );
}
