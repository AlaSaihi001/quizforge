"use client";

import { useState } from "react";

type Mode = "MCQ" | "FLASHCARDS" | "SUMMARY";

const modes: {
  value: Mode;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "MCQ",
    label: "MCQ Quiz",
    description: "Multiple choice questions",
    color: "blue",
  },
  {
    value: "FLASHCARDS",
    label: "Flashcards",
    description: "Question & answer pairs",
    color: "green",
  },
  {
    value: "SUMMARY",
    label: "Summary",
    description: "Key points & overview",
    color: "amber",
  },
];

export default function GeneratePage() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<Mode>("MCQ");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit() {
    if (inputText.trim().length < 50)
      return alert("Please enter at least 50 characters");
    setIsLoading(true);
    setResult(null);

    // Simulation pour l'instant — OpenAI viendra en Week 6
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setResult("AI result will appear here in Week 6 when we connect OpenAI!");
    setIsLoading(false);
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">Generate Quiz</h1>
      <p className="text-gray-500 mt-1 text-sm">
        Paste your course content and choose a generation mode
      </p>

      {/* Mode Selector */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              mode === m.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <p
              className={`font-semibold text-sm ${mode === m.value ? "text-blue-700" : "text-gray-700"}`}
            >
              {m.label}
            </p>
            <p className="text-xs text-gray-400 mt-1">{m.description}</p>
          </button>
        ))}
      </div>

      {/* Language Selector */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 border border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
        >
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="ar">🇹🇳 العربية</option>
        </select>
      </div>

      {/* Textarea */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Course Content
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your course content here... (minimum 50 characters)"
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
        />
        <p className="text-xs text-gray-800 mt-1 text-right">
          {inputText.length} characters
          {inputText.length < 50 && inputText.length > 0 && (
            <span className="text-red-400">
              {" "}
              — {50 - inputText.length} more needed
            </span>
          )}
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || inputText.length < 50}
        className={`mt-4 w-full py-3 rounded-xl font-semibold text-white transition-colors ${
          isLoading || inputText.length < 50
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span> Generating {mode}...
          </span>
        ) : (
          `Generate ${mode}`
        )}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl">
          <h3 className="font-semibold text-green-800 mb-2">✅ Result</h3>
          <p className="text-green-700 text-sm">{result}</p>
        </div>
      )}
    </div>
  );
}
