"use client";

// Bouton pour accéder au Customer Portal Stripe
// Visible seulement pour les users PRO

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleManage() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to open portal");
      }

      if (data.url) {
        window.location.href = data.url;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Portal error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleManage}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="text-sm border-slate-300"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
          Opening...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Settings className="w-3.5 h-3.5" />
          Manage subscription
        </span>
      )}
    </Button>
  );
}
