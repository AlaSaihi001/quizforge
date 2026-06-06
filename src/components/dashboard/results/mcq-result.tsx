"use client";

import { useState } from "react";
import { MCQResult } from "@/lib/parsers";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D"] as const;

export function MCQResultDisplay({ data }: { data: MCQResult }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const score = Object.entries(answers).filter(
    ([id, ans]) =>
      data.questions.find((q) => q.id === Number(id))?.correct === ans,
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-900">
            {data.questions.length} questions
          </p>
          {Object.keys(answers).length > 0 && (
            <p className="text-sm text-slate-500 mt-0.5">
              Score: {score}/{Object.keys(answers).length}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="text-xs"
        >
          {showAll ? (
            <>
              <EyeOff className="w-3.5 h-3.5 mr-1.5" />
              Hide answers
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Show all answers
            </>
          )}
        </Button>
      </div>

      {/* Questions */}
      {data.questions.map((q) => {
        const selected = answers[q.id];
        const isRevealed = revealed[q.id] || showAll;

        return (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-slate-200 p-5"
          >
            {/* Question text */}
            <div className="flex items-start gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {q.id}
              </span>
              <p className="text-slate-800 text-sm font-medium leading-relaxed">
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2 ml-10">
              {LETTERS.map((letter) => {
                const isSelected = selected === letter;
                const isCorrect = q.correct === letter;

                let style =
                  "border-slate-200 bg-slate-50 hover:border-slate-300 cursor-pointer";
                if (isRevealed) {
                  if (isCorrect) style = "border-emerald-300 bg-emerald-50";
                  else if (isSelected) style = "border-red-300 bg-red-50";
                  else style = "border-slate-100 bg-slate-50 opacity-40";
                } else if (isSelected) {
                  style = "border-violet-400 bg-violet-50";
                }

                return (
                  <button
                    key={letter}
                    onClick={() => {
                      if (isRevealed) return;
                      setAnswers((p) => ({ ...p, [q.id]: letter }));
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all text-sm",
                      style,
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        isRevealed && isCorrect
                          ? "bg-emerald-500 text-white"
                          : isRevealed && isSelected
                            ? "bg-red-500 text-white"
                            : isSelected
                              ? "bg-violet-500 text-white"
                              : "bg-white border border-slate-300 text-slate-600",
                      )}
                    >
                      {letter}
                    </span>
                    <span className="text-slate-700">{q.options[letter]}</span>
                    {isRevealed && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                    )}
                    {isRevealed && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Reveal button + explanation */}
            <div className="ml-10 mt-3">
              {!isRevealed ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!selected}
                  onClick={() => setRevealed((p) => ({ ...p, [q.id]: true }))}
                  className="text-xs text-slate-500 px-0"
                >
                  {selected ? "Reveal answer" : "Select an answer first"}
                </Button>
              ) : (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 leading-relaxed mt-2">
                  <span className="font-semibold">
                    {selected
                      ? selected === q.correct
                        ? "✓ Correct! "
                        : "✗ Wrong. "
                      : `Answer: ${q.correct}. `}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
