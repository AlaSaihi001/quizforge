"use client";

import { useState } from "react";
import { FlashcardsResult } from "@/lib/parsers";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlashcardsResultDisplay({ data }: { data: FlashcardsResult }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [view, setView] = useState<"cards" | "list">("cards");

  const card = data.flashcards[index];
  const total = data.flashcards.length;

  function goNext() {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i + 1) % total), 100);
  }

  function goPrev() {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i - 1 + total) % total), 100);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-900">{total} flashcards</p>
        <div className="flex gap-2">
          {(["cards", "list"] as const).map((v) => (
            <Button
              key={v}
              size="sm"
              variant={view === v ? "default" : "outline"}
              onClick={() => setView(v)}
              className={cn(
                "text-xs capitalize",
                view === v && "bg-violet-600 hover:bg-violet-700",
              )}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      {view === "cards" ? (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {index + 1}/{total}
            </span>
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${((index + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <button
            onClick={() => setFlipped(!flipped)}
            className={cn(
              "w-full min-h-56 rounded-2xl border-2 p-8 flex flex-col items-center justify-center text-center transition-all",
              flipped
                ? "bg-violet-600 border-violet-600"
                : "bg-white border-slate-200 hover:border-violet-300",
            )}
          >
            <span
              className={cn(
                "text-xs font-medium mb-4 px-3 py-1 rounded-full border",
                flipped
                  ? "border-white/30 text-white"
                  : "border-slate-200 text-slate-400",
              )}
            >
              {flipped ? "Answer" : "Question"}
            </span>

            <p
              className={cn(
                "text-lg font-medium leading-relaxed",
                flipped ? "text-white" : "text-slate-800",
              )}
            >
              {flipped ? card.back : card.front}
            </p>

            {!flipped && card.hint && (
              <p className="text-xs text-slate-400 mt-3 italic">
                💡 {card.hint}
              </p>
            )}

            <p
              className={cn(
                "text-xs mt-5 flex items-center gap-1",
                flipped ? "text-white/50" : "text-slate-400",
              )}
            >
              <RotateCcw className="w-3 h-3" /> Click to flip
            </p>
          </button>

          {/* Navigation */}
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrev}
              disabled={index === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goNext}
              disabled={index === total - 1}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {data.flashcards.map((fc) => (
            <div
              key={fc.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex"
            >
              <div className="flex-1 p-4 border-r border-slate-200">
                <p className="text-xs text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                  Question
                </p>
                <p className="text-sm text-slate-800 font-medium">{fc.front}</p>
                {fc.hint && (
                  <p className="text-xs text-slate-400 italic mt-2">
                    💡 {fc.hint}
                  </p>
                )}
              </div>
              <div className="flex-1 p-4 bg-violet-50">
                <p className="text-xs text-violet-500 font-semibold mb-1.5 uppercase tracking-wider">
                  Answer
                </p>
                <p className="text-sm text-violet-900">{fc.back}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
