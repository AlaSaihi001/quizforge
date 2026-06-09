"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/lib/actions/onboarding.action";
import { useRouter } from "next/navigation";
import {
  ClipboardPaste,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// Les 3 étapes de l'onboarding
const steps = [
  {
    number: 1,
    icon: ClipboardPaste,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Paste your course content",
    description:
      "Start by pasting any educational text — lecture notes, textbook chapters, or study materials. The more content you provide, the better the quiz quality.",
    tip: "💡 Tip: Minimum 50 characters for best results",
  },
  {
    number: 2,
    icon: SlidersHorizontal,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    title: "Choose your generation mode",
    description:
      "Select from three powerful modes: MCQ Quiz for practice tests, Flashcards for memorization, or Summary for structured revision.",
    tip: "💡 Tip: Start with MCQ to test your knowledge",
  },
  {
    number: 3,
    icon: Sparkles,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Study, share, or export",
    description:
      "Practice interactively in the app, share your quiz with classmates via a unique link, or export as a PDF for offline studying.",
    tip: "💡 Tip: Share links work without an account",
  },
];

interface OnboardingModalProps {
  isOpen: boolean;
}

export function OnboardingModal({ isOpen }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  async function handleNext() {
    if (isLastStep) {
      // Complète l'onboarding et redirige vers Generate
      setIsClosing(true);
      await completeOnboarding();
      router.push("/dashboard/generate");
      router.refresh();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleSkip() {
    setIsClosing(true);
    completeOnboarding();
    router.refresh();
  }

  return (
    <Dialog open={isOpen && !isClosing} onOpenChange={() => {}}>
      {/* onOpenChange vide → empêche la fermeture en cliquant en dehors */}
      <DialogContent
        className="sm:max-w-md border-0 shadow-2xl [&>button]:hidden"
        // Enlève le bouton X par défaut
        showCloseButton
      >
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-300 rounded-full ${
                i === currentStep
                  ? "w-6 h-2 bg-violet-600"
                  : i < currentStep
                    ? "w-2 h-2 bg-violet-300"
                    : "w-2 h-2 bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="text-center px-2">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${step.iconBg}`}
          >
            <step.icon className={`w-8 h-8 ${step.iconColor}`} />
          </div>

          {/* Step number */}
          <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">
            Step {step.number} of {steps.length}
          </p>

          {/* Title */}
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-slate-500 leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Tip */}
          <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-600 mb-6">
            {step.tip}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-slate-400 hover:text-slate-600 text-xs"
          >
            Skip tour
          </Button>

          <Button
            onClick={handleNext}
            disabled={isClosing}
            className="bg-violet-600 hover:bg-violet-700 text-white flex-1"
          >
            {isClosing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Starting...
              </span>
            ) : isLastStep ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Start generating!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
