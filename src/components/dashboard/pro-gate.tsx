// Ce composant enveloppe n'importe quelle feature PRO
// Si l'user est FREE → affiche un overlay avec CTA upgrade
// Si l'user est PRO → affiche le contenu normalement

import { Crown, Lock } from "lucide-react";
import { UpgradeButton } from "./upgrade-button";

interface ProGateProps {
  isPro: boolean;
  children: React.ReactNode;
  featureName: string; // ex: "PDF Export"
  description: string; // ex: "Download your quiz as a PDF"
}

export function ProGate({
  isPro,
  children,
  featureName,
  description,
}: ProGateProps) {
  // Si l'user est PRO, on affiche directement le contenu
  if (isPro) return <>{children}</>;

  // Sinon on affiche le contenu flou + l'overlay
  return (
    <div className="relative">
      {/* Contenu flou en arrière-plan */}
      <div className="pointer-events-none select-none blur-sm opacity-50">
        {children}
      </div>

      {/* Overlay PRO */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200   ">
        <div className="text-center p-4 max-w-sm">
          {/* Titre */}
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-3 h-3 text-amber-500" />
            <span className="font-bold text-slate-900 text-sm">PDF</span>
          </div>

          <p className="font-semibold text-slate-800 mb-1">{featureName}</p>
          <p className="text-slate-500 text-sm mb-5">{description}</p>
        </div>
      </div>
    </div>
  );
}
