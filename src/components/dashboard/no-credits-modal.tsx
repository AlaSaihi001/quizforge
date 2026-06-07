"use client";

// Ce composant s'affiche automatiquement quand l'API retourne NO_CREDITS
// Il propose à l'utilisateur d'upgrader vers PRO

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Zap, RefreshCcw } from "lucide-react";

interface NoCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Heure du prochain reset — on l'affiche pour que l'user sache quand il peut réessayer
  resetTime?: string;
}

// Ce que l'user obtient avec PRO
const proFeatures = [
  { icon: Zap, text: "Unlimited generations per day" },
  { icon: Sparkles, text: "PDF export of all results" },
  { icon: Crown, text: "Priority AI processing" },
];

export function NoCreditsModal({
  isOpen,
  onClose,
  resetTime,
}: NoCreditsModalProps) {
  // Calcule dans combien de temps les crédits se resetent
  function getResetCountdown(): string {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // prochain minuit

    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) return `${minutes} minutes`;
    return `${hours}h ${minutes}min`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        {/* Header avec icône */}
        <DialogHeader className="text-center items-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4 mx-auto">
            <Crown className="w-8 h-8 text-amber-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            You have used all your credits
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-center mt-2">
            Your free credits reset in{" "}
            <span className="font-semibold text-slate-700">
              {getResetCountdown()}
            </span>
            . Upgrade to PRO for unlimited access.
          </DialogDescription>
        </DialogHeader>

        {/* Séparateur */}
        <div className="border-t border-slate-100 my-2" />

        {/* Features PRO */}
        <div className="space-y-3 py-2">
          {proFeatures.map((feature) => (
            <div key={feature.text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                <feature.icon className="w-4 h-4 text-violet-600" />
              </div>
              <p className="text-sm text-slate-700">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Prix */}
        <div className="bg-violet-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-violet-700">
            $9
            <span className="text-lg font-normal text-violet-500">/month</span>
          </p>
          <p className="text-xs text-violet-500 mt-1">Cancel anytime</p>
        </div>

        {/* Boutons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11"
            onClick={() => {
              // Stripe Checkout viendra en Week 8
              // Pour l'instant, on ferme juste le modal
              onClose();
              alert("Stripe coming in Week 8!");
            }}
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to PRO — $9/month
          </Button>

          <Button
            variant="ghost"
            className="w-full text-slate-500 hover:text-slate-700"
            onClick={onClose}
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-2" />
            Wait for reset in {getResetCountdown()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
