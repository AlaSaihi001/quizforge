// PAS de "use client"
import type { Metadata } from "next";
import GeneratePageClient from "@/components/dashboard/generate-page-client";

export const metadata: Metadata = {
  title: "Generate",
  description: "Generate MCQ quizzes, flashcards, and summaries.",
  robots: { index: false, follow: false },
};

export default function GeneratePage() {
  return <GeneratePageClient />;
}
