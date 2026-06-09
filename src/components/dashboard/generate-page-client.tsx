"use client";

import { useEffect, useState } from "react";
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
import { ProGate } from "@/components/dashboard/pro-gate";
import { PDFDownloadButton } from "@/components/dashboard/pdf-download-button";
import { ShareButton } from "@/components/dashboard/share-button";

// ── CHANGEMENT 1 : nouveaux imports ──────────────────────────────────────────
import { NoCreditsModal } from "@/components/dashboard/no-credits-modal";
import { RateLimitBanner } from "@/components/dashboard/rate-limit-toast";
import type { Metadata } from "next";

type Mode = "MCQ" | "FLASHCARDS" | "SUMMARY";

const modes = [
  {
    value: "MCQ" as Mode,
    icon: BookOpen,
    label: "MCQ Quiz",
    description: "10 questions with 4 options each",
    badge: "Most popular",
    accentBg: "bg-blue-600",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    lightBorder: "border-blue-200",
    activeBorder: "border-blue-500",
    activeBg: "bg-blue-50",
  },
  {
    value: "FLASHCARDS" as Mode,
    icon: Brain,
    label: "Flashcards",
    description: "Q&A pairs for active recall",
    badge: null,
    accentBg: "bg-violet-600",
    lightBg: "bg-violet-50",
    lightText: "text-violet-700",
    lightBorder: "border-violet-200",
    activeBorder: "border-violet-500",
    activeBg: "bg-violet-50",
  },
  {
    value: "SUMMARY" as Mode,
    icon: FileText,
    label: "Summary",
    description: "Key points & overview",
    badge: null,
    accentBg: "bg-emerald-600",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    lightBorder: "border-emerald-200",
    activeBorder: "border-emerald-500",
    activeBg: "bg-emerald-50",
  },
];

const languages = [
  { value: "en", flag: "🇬🇧", label: "English" },
  { value: "fr", flag: "🇫🇷", label: "Français" },
  { value: "ar", flag: "🇹🇳", label: "العربية" },
];

export const metadata: Metadata = {
  title: "Generate",
  description:
    "Generate MCQ quizzes, flashcards, and summaries from your course content.",
  robots: { index: false, follow: false },
};

export default function GeneratePageClient() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<Mode>("MCQ");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string>("FREE");
  const [generationToken, setGenerationToken] = useState<string | null>(null);

  const [result, setResult] = useState<
    MCQResult | FlashcardsResult | SummaryResult | null
  >(null);
  const [resultMode, setResultMode] = useState<Mode | null>(null);

  // ── CHANGEMENT 2 : nouveaux états pour les modals ────────────────────────
  const [showNoCreditsModal, setShowNoCreditsModal] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    retryAfter: number;
  } | null>(null);

  const charCount = inputText.length;
  const isReady = charCount >= 50 && !isLoading;
  const selectedMode = modes.find((m) => m.value === mode)!;

  useEffect(() => {
    fetch("/api/generate")
      .then((r) => r.json())
      .then((data) => {
        if (data.plan) setUserPlan(data.plan);
      })
      .catch(() => {});
  }, []);

  async function handleGenerate() {
    if (!isReady) return;

    setIsLoading(true);
    setStreamedText("");
    setResult(null);
    setResultMode(null);
    setError(null);
    // ── CHANGEMENT 3 : reset du rate limit info au début ─────────────────
    setRateLimitInfo(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText, mode, language }),
      });

      if (!response.ok) {
        const data = await response.json();

        // ── CHANGEMENT 4 : gestion spécifique NO_CREDITS et RATE_LIMITED ──
        if (data.error === "NO_CREDITS") {
          setShowNoCreditsModal(true);
          setIsLoading(false);
          return;
        }

        if (data.error === "RATE_LIMITED") {
          setRateLimitInfo({ retryAfter: data.retryAfter });
          setIsLoading(false);
          return;
        }

        // Autres erreurs
        const errorMessages: Record<string, string> = {
          UNAUTHORIZED: "You must be logged in to generate content.",
          TEXT_TOO_SHORT: "Please enter at least 50 characters.",
          INVALID_MODE: "Invalid mode selected.",
          default: "Something went wrong. Please try again.",
        };
        setError(errorMessages[data.error] ?? errorMessages.default);
        setIsLoading(false);
        return;
      }

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
          setError("Something went wrong during generation.");
          setIsLoading(false);
          return;
        }

        fullText += chunk;
        setStreamedText(fullText);
      }

      const parsed = parseGenerationResult(fullText, mode);

      if (parsed) {
        setResult(parsed);
        setResultMode(mode);
        setStreamedText("");
      } else {
        setError("Could not format the AI response. Raw output shown below.");
      }
      if (parsed) {
        setResult(parsed);
        setResultMode(mode);
        setStreamedText("");

        // Récupère le token de la génération qu'on vient de créer
        // en lisant la dernière génération de l'user
        try {
          const res = await fetch("/api/generations/latest");
          const data = await res.json();
          if (data.shareToken) setGenerationToken(data.shareToken);
        } catch {}
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setResultMode(null);
    setStreamedText("");
    setError(null);
    // ── CHANGEMENT 5 : reset du rate limit info ───────────────────────────
    setRateLimitInfo(null);
    setInputText("");
    setGenerationToken(null);
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* ── CHANGEMENT 6 : Modal No Credits ────────────────────────────────── */}
      <NoCreditsModal
        isOpen={showNoCreditsModal}
        onClose={() => setShowNoCreditsModal(false)}
      />

      {/* ── RÉSULTAT FINAL ─────────────────────── */}
      {result && resultMode && (
        <div className="space-y-4">
          {/* Header résultat */}
          <div className="flex items-center justify-between flex-wrap gap-3">
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

            <div className="flex items-center gap-2">
              {/* Share button */}
              {generationToken && <ShareButton shareToken={generationToken} />}

              {/* Bouton PDF — gated pour PRO */}
              {/* PDF Export — gated PRO */}
              <ProGate isPro={userPlan === "PRO"} featureName="" description="">
                <PDFDownloadButton
                  data={result}
                  mode={resultMode}
                  title="QuizForge Generation"
                />
              </ProGate>

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
          </div>

          {/* Composant résultat selon le mode */}
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
      {/* ── CHANGEMENT 7 : Banner Rate Limit ───────────────────────────────── */}
      {rateLimitInfo && (
        <RateLimitBanner
          retryAfter={rateLimitInfo.retryAfter}
          onDismiss={() => setRateLimitInfo(null)}
        />
      )}

      {/* ── FORM — caché si résultat ────────────── */}
      {!result && (
        <>
          {/* STEP 1 — MODE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              1 — Choose mode
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {modes.map((m) => {
                const isActive = mode === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => setMode(m.value)}
                    className={cn(
                      "relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all",
                      isActive
                        ? `${m.activeBorder} ${m.activeBg}`
                        : "border-slate-200 hover:border-slate-300 bg-white",
                    )}
                  >
                    {m.badge && (
                      <span className="absolute -top-2 left-3 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                        {m.badge}
                      </span>
                    )}

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
                  {languages.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.flag} {l.label}
                    </SelectItem>
                  ))}
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
              placeholder="Paste your course notes, lecture content, textbook chapter... The more content, the better the results."
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
                    ? `${50 - charCount} more characters needed`
                    : `✓ ${charCount} characters — ready!`}
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

      {/* ── STREAMING EN COURS ─────────────────── */}
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

      {/* ── ERREUR ─────────────────────────────── */}
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
                <pre className="mt-3 text-xs text-red-700 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto bg-red-100 p-3 rounded-lg">
                  {streamedText}
                </pre>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="mt-4 text-xs"
          >
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
