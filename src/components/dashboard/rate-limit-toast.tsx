"use client";

// Toast simple pour le rate limiting
// S'affiche quand l'user fait trop de requêtes trop vite

import { AlertTriangle } from "lucide-react";

interface RateLimitToastProps {
  retryAfter: number; // en secondes
  onDismiss: () => void;
}

export function RateLimitBanner({
  retryAfter,
  onDismiss,
}: RateLimitToastProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-800">Slow down!</p>
        <p className="text-sm text-amber-700 mt-0.5">
          Too many requests. Please wait{" "}
          <span className="font-semibold">{retryAfter} seconds</span> before
          trying again.
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-amber-400 hover:text-amber-600 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
