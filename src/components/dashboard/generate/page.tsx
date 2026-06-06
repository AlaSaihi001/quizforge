"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  BookOpen,
  Brain,
  FileText,
  Globe,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  parseGenerationResult,
  type MCQResult,
  type FlashcardsResult,
  type SummaryResult,
} from "@/lib/parsers";
import { MCQResultDisplay } from "@/components/dashboard/results/mcq-result";
import { FlashcardsResultDisplay } from "@/components/dashboard/results/flashcards-result";
import { SummaryResultDisplay } from "@/components/dashboard/results/summary-result";

type Mode = "MCQ" | "FLASHCARDS" | "SUMMARY";

const modes = [
  {
    value: "MCQ" as Mode,
    icon: BookOpen,
    label: "MCQ Quiz",
    description: "10 questions + answers",
    accentBg: "bg-blue-600",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    activeBorder: "border-blue-500",
  },
  {
    value: "FLASHCARDS" as Mode,
    icon: Brain,
    label: "Flashcards",
    description: "Q&A pairs for recall",
    accentBg: "bg-violet-600",
    lightBg: "bg-violet-50",
    lightText: "text-violet-700",
    activeBorder: "border-violet-500",
  },
  {
    value: "SUMMARY" as Mode,
    icon: FileText,
    label: "Summary",
    description: "Structured key points",
    accentBg: "bg-emerald-600",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    activeBorder: "border-emerald-500",
  },
];

const errorMessages: Record<string, string> = {
  UNAUTHORIZED: "You must be logged in.",
  NO_CREDITS: "No credits left today. Resets at midnight.",
  TEXT_TOO_SHORT: "Enter at least 50 characters.",
  INVALID_MODE: "Invalid mode selected.",
  default: "Something went wrong. Please try again.",
};

export default function GeneratePage() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<Mode>("MCQ");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<
    MCQResult | FlashcardsResult | SummaryResult | null
  >(null);
  const [resultMode, setResultMode] = useState<Mode | null>(null);

  const charCount = inputText.length;
  const isReady = charCount >= 50 && !isLoading;
  const selectedMode = modes.find((m) => m.value === mode)!;

  async function handleGenerate() {
    if (!isReady) return;

    setIsLoading(true);
    setStreamedText("");
    setResult(null);
    setResultMode(null);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText, mode, language }),
      });

      // Erreur HTTP (pas un stream)
      if (!response.ok) {
        const data = await response.json();
        setError(errorMessages[data.error] ?? errorMessages.default);
        setIsLoading(false);
        return;
      }

      // ── LECTURE DU STREAM ─────────────────────────────────────────────────
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setError("Stream unavailable");
        setIsLoading(false);
        return;
      }

      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        if (chunk.startsWith("ERROR:")) {
          setError(errorMessages.default);
          setIsLoading(false);
          return;
        }

        fullText += chunk;
        setStreamedText(fullText);
      }

      // ── PARSE LE RÉSULTAT ─────────────────────────────────────────────────
      const parsed = parseGenerationResult(fullText, mode);

      if (parsed) {
        setResult(parsed);
        setResultMode(mode);
        setStreamedText("");
      } else {
        // JSON invalide — affiche le texte brut
        setError("Could not parse the AI response. Raw output shown below.");
      }
    } catch (err) {
      console.error(err);
      setError(errorMessages.default);
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setResultMode(null);
    setStreamedText("");
    setError(null);
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Generate</h1>
        <p className="text-slate-500 text-sm mt-1">
          Powered by Groq · Llama 3.3 70B
        </p>
      </div>

      {/* Form — caché si résultat */}
      {!result && (
        <>
          {/* STEP 1 — MODE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              1 — Choose mode
            </p>
            <div className="grid grid-cols-3 gap-3">
              {modes.map((m) => {
                const isActive = mode === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => setMode(m.value)}
                    className={cn(
                      "relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all",
                      isActive
                        ? `${m.activeBorder} ${m.lightBg}`
                        : "border-slate-200 bg-white hover:border-slate-300",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center mb-3",
                        isActive ? m.accentBg : "bg-slate-100",
                      )}
                    >
                      <m.icon
                        className={cn(
                          "w-4 h-4",
                          isActive ? "text-white" : "text-slate-500",
                        )}
                      />
                    </div>
                    <p
                      className={cn(
                        "font-semibold text-sm mb-0.5",
                        isActive ? m.lightText : "text-slate-700",
                      )}
                    >
                      {m.label}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {m.description}
                    </p>
                    {isActive && (
                      <CheckCircle2
                        className={cn(
                          "w-4 h-4 absolute top-3 right-3",
                          m.lightText,
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2 — LANGUE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              2 — Language
            </p>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-44 h-9 border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="ar">🇹🇳 العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* STEP 3 — CONTENU */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              3 — Your content
            </p>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your course notes, lecture content, textbook chapter..."
              className="min-h-44 resize-none text-sm border-slate-300 focus:border-violet-400 leading-relaxed"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between mt-2.5">
              <span
                className={cn(
                  "text-xs",
                  charCount === 0
                    ? "text-slate-400"
                    : charCount < 50
                      ? "text-red-500"
                      : "text-emerald-600",
                )}
              >
                {charCount === 0
                  ? "Minimum 50 characters"
                  : charCount < 50
                    ? `${50 - charCount} more needed`
                    : `✓ ${charCount} characters`}
              </span>
              {charCount > 0 && !isLoading && (
                <button
                  onClick={() => setInputText("")}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* BOUTON GENERATE */}
          <Button
            onClick={handleGenerate}
            disabled={!isReady}
            className={cn(
              "w-full h-12 text-sm font-semibold transition-all",
              isReady
                ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200"
                : "bg-slate-200 text-slate-400 cursor-not-allowed",
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating {selectedMode.label}...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate {selectedMode.label}
                <ChevronRight className="w-4 h-4 ml-auto" />
              </span>
            )}
          </Button>
        </>
      )}

      {/* STREAMING EN COURS */}
      {isLoading && streamedText && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <p className="text-sm text-slate-500 font-medium">
              AI is generating...
            </p>
          </div>
          <pre className="text-xs text-slate-500 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto">
            {streamedText}
          </pre>
        </div>
      )}

      {/* ERREUR */}
      {error && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 mb-1">
                Generation failed
              </p>
              <p className="text-sm text-red-600">{error}</p>
              {streamedText && (
                <pre className="mt-3 text-xs text-red-700 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto bg-red-100 p-3 rounded-lg">
                  {streamedText}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RÉSULTAT */}
      {result && resultMode && (
        <div className="space-y-4">
          {/* Header résultat */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-slate-900">
                Generation complete
              </span>
              <Badge
                variant="outline"
                className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                {resultMode}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className="text-xs"
            >
              <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
              New generation
            </Button>
          </div>

          {resultMode === "MCQ" && (
            <MCQResultDisplay data={result as MCQResult} />
          )}
          {resultMode === "FLASHCARDS" && (
            <FlashcardsResultDisplay data={result as FlashcardsResult} />
          )}
          {resultMode === "SUMMARY" && (
            <SummaryResultDisplay data={result as SummaryResult} />
          )}
        </div>
      )}
    </div>
  );
}
