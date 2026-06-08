"use client";

import { useState } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { MCQResult, FlashcardsResult, SummaryResult } from "@/lib/parsers";

interface PDFDownloadButtonProps {
  data: MCQResult | FlashcardsResult | SummaryResult;
  mode: "MCQ" | "FLASHCARDS" | "SUMMARY";
  title?: string;
}

export function PDFDownloadButton({
  data,
  mode,
  title = "QuizForge",
}: PDFDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    setIsLoading(true);

    try {
      // Import dynamique UNIQUEMENT au moment du clic
      // Évite les erreurs SSR et de chargement
      const { pdf } = await import("@react-pdf/renderer");

      // Import du bon template selon le mode
      let document: React.ReactElement<DocumentProps>;

      if (mode === "MCQ") {
        const { MCQPDF } = await import("@/components/pdf/mcq-pdf");
        document = <MCQPDF data={data as MCQResult} title={title} />;
      } else if (mode === "FLASHCARDS") {
        const { FlashcardsPDF } =
          await import("@/components/pdf/flashcards-pdf");
        document = (
          <FlashcardsPDF data={data as FlashcardsResult} title={title} />
        );
      } else {
        const { SummaryPDF } = await import("@/components/pdf/summary-pdf");
        document = <SummaryPDF data={data as SummaryResult} />;
      }

      // Génère le PDF en blob
      const blob = await pdf(document).toBlob();

      // Crée un lien de téléchargement et clique dessus
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `quizforge-${mode.toLowerCase()}-${Date.now()}.pdf`;
      link.click();

      // Nettoie l'URL créée
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isLoading}
      className="text-xs border-violet-200 text-violet-700 hover:bg-violet-50"
    >
      {isLoading ? (
        <span className="flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Preparing PDF...
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </span>
      )}
    </Button>
  );
}
