"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function GeneratePage() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<Mode>("MCQ");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const charCount = inputText.length;
  const isReady = charCount >= 50 && !isLoading;
  const selectedMode = modes.find((m) => m.value === mode)!;

  async function handleGenerate() {
    if (!isReady) return;
    setIsLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    setResult("OpenAI integration comes in Week 6!");
    setIsLoading(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* ── HEADER ─────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Generate</h1>
        <p className="text-slate-500 text-sm mt-1">
          Paste your content and choose a mode
        </p>
      </div>

      {/* ── STEP 1 : MODE ──────────────────────── */}
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
                    ? `${m.activeBorder} ${m.activeBg}`
                    : "border-slate-200 hover:border-slate-300 bg-white",
                )}
              >
                {/* Badge "Most popular" */}
                {m.badge && (
                  <span className="absolute -top-2 left-3 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                    {m.badge}
                  </span>
                )}

                {/* Icone */}
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

                {/* Check mark quand actif */}
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

      {/* ── STEP 2 : LANGUE ────────────────────── */}
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

      {/* ── STEP 3 : CONTENU ───────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          3 — Your content
        </p>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your course notes, lecture content, textbook chapter... The more content, the better the results."
          className="min-h-44 resize-none text-sm border-slate-300 focus:border-violet-400 leading-relaxed"
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

          {charCount > 0 && (
            <button
              onClick={() => setInputText("")}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── GENERATE BUTTON ────────────────────── */}
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
            Generating {mode}...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Generate {selectedMode.label}
            <ChevronRight className="w-4 h-4 ml-auto" />
          </span>
        )}
      </Button>

      {/* ── RESULT ─────────────────────────────── */}
      {result && (
        <div className="bg-white rounded-2xl border border-emerald-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 border-b border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-800 font-medium text-sm">
              Generation complete
            </span>
            <Badge
              variant="outline"
              className="ml-auto text-xs border-emerald-200 text-emerald-600"
            >
              {mode}
            </Badge>
          </div>
          <div className="p-5">
            <p className="text-slate-600 text-sm">{result}</p>
          </div>
        </div>
      )}
    </div>
  );
}
