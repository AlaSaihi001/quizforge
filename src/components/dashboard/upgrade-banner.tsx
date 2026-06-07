// Banner d'upgrade affiché sur le Dashboard pour les users FREE

import { Crown, ArrowRight, Sparkles, Zap } from "lucide-react";
import { UpgradeButton } from "./upgrade-button";

const proFeatures = [
  { icon: Sparkles, text: "Unlimited generations" },
  { icon: Zap, text: "PDF export" },
  { icon: Crown, text: "Priority AI" },
];

export function UpgradeBanner() {
  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-white font-semibold text-sm">
                Upgrade to PRO
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Unlock unlimited generations and premium features.
            </p>

            {/* Feature list */}
            <div className="flex flex-wrap gap-3 mb-5">
              {proFeatures.map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-full"
                >
                  <f.icon className="w-3 h-3 text-violet-400" />
                  {f.text}
                </div>
              ))}
            </div>

            <UpgradeButton />
          </div>

          {/* Decorative price badge */}
          <div className="hidden sm:flex flex-col items-center justify-center bg-violet-600/20 border border-violet-500/30 rounded-2xl p-5 shrink-0">
            <p className="text-3xl font-bold text-white">$9</p>
            <p className="text-violet-400 text-xs mt-0.5">/month</p>
            <p className="text-slate-500 text-xs mt-2">Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
