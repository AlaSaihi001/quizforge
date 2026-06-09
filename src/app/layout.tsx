import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "QuizForge AI — AI-Powered Exam Prep",
    template: "%s · QuizForge AI",
    // %s sera remplacé par le titre de la page
    // Ex: "Dashboard · QuizForge AI"
  },
  description:
    "Generate MCQ quizzes, flashcards, and summaries from any course content using AI. Study smarter, not harder.",

  keywords: [
    "quiz generator",
    "AI study tool",
    "MCQ generator",
    "flashcards AI",
    "exam prep",
    "study assistant",
  ],

  authors: [{ name: "QuizForge AI" }],

  // Open Graph — apparaît quand tu partages sur Facebook, LinkedIn, etc.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quizforge.vercel.app",
    siteName: "QuizForge AI",
    title: "QuizForge AI — AI-Powered Exam Prep",
    description:
      "Generate MCQ quizzes, flashcards, and summaries from any course content using AI.",
    images: [
      {
        url: "/og-image.png", // on créera cette image au Step 3
        width: 1200,
        height: 630,
        alt: "QuizForge AI",
      },
    ],
  },

  // Twitter Card — apparaît quand tu partages sur Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "QuizForge AI — AI-Powered Exam Prep",
    description:
      "Generate MCQ quizzes, flashcards, and summaries from any course content using AI.",
    images: ["/og-image.png"],
  },

  // Robots — dit à Google comment indexer
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-slate-50`}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
