"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Sparkles, FileText, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

// Pour Select, il faut l'installer d'abord :
// npx shadcn@latest add select

type Mode = "MCQ" | "FLASHCARDS" | "SUMMARY";

const modes = [
  {
    value: "MCQ" as Mode,
    label: "MCQ Quiz",
    description: "10 multiple choice questions with answers",
    icon: "📝",
    color: "border-blue-200 bg-blue-50",
    activeColor: "border-blue-500 bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    value: "FLASHCARDS" as Mode,
    label: "Flashcards",
    description: "Question & answer pairs to memorize",
    icon: "🃏",
    color: "border-green-200 bg-green-50",
    activeColor: "border-green-500 bg-green-50",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    value: "SUMMARY" as Mode,
    label: "Summary",
    description: "Key points and structured overview",
    icon: "📋",
    color: "border-amber-200 bg-amber-50",
    activeColor: "border-amber-500 bg-amber-50",
    badgeColor: "bg-amber-100 text-amber-700",
  },
];

export default function GeneratePage() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<Mode>("MCQ");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const charCount = inputText.length;
  const isReady = charCount >= 50 && !isLoading;

  async function handleGenerate() {
    if (!isReady) return;
    setIsLoading(true);
    setResult(null);

    // Simulation — OpenAI vient en Week 6
    await new Promise((r) => setTimeout(r, 2000));
    setResult("AI result will appear here in Week 6!");
    setIsLoading(false);
  }

  return (
    <div className="max-w-3xl space-y-6 ">
      {/* ── HEADER ─────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Generate Quiz</h1>
        <p className="text-slate-500 mt-1">
          Paste your course content and choose a generation mode
        </p>
      </div>

      {/* ── STEP 1 : Choisir le mode ───────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              1
            </span>
            Choose a mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {modes.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm",
                  mode === m.value
                    ? m.activeColor + " border-2"
                    : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <p
                  className={cn(
                    "font-semibold text-sm",
                    mode === m.value ? "text-slate-800" : "text-slate-700",
                  )}
                >
                  {m.label}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── STEP 2 : Langue ────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
            Select language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇬🇧 English</SelectItem>
              <SelectItem value="fr">🇫🇷 Français</SelectItem>
              <SelectItem value="ar">🇹🇳 العربية</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ── STEP 3 : Contenu ───────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
            Paste your content
          </CardTitle>
          <CardDescription>
            Minimum 50 characters. The more content, the better the results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your course content, lecture notes, textbook chapter..."
            className="min-h-40 resize-none text-sm leading-relaxed"
          />
          <div className="flex justify-between items-center">
            <span
              className={cn(
                "text-xs",
                charCount < 50 && charCount > 0
                  ? "text-red-500"
                  : "text-slate-400",
              )}
            >
              {charCount} characters
              {charCount < 50 &&
                charCount > 0 &&
                ` — ${50 - charCount} more needed`}
            </span>
            {charCount >= 50 && (
              <span className="text-xs text-green-600">
                ✓ Ready to generate
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── BOUTON GENERATE ────────────────────── */}
      <Button
        onClick={handleGenerate}
        disabled={!isReady}
        className="w-full h-12 text-base font-semibold"
        size="lg"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating {mode}...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate {mode}
          </span>
        )}
      </Button>

      {/* ── RÉSULTAT ───────────────────────────── */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-base text-green-800 flex items-center gap-2">
              <span>✅</span> Generation Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 text-sm">{result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
