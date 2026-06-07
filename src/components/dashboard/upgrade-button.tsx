"use client";

// Bouton Upgrade vers PRO
// Appelle la route /api/stripe/checkout et redirige vers Stripe

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradeButtonProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline";
}

export function UpgradeButton({
  className,
  size = "default",
  variant = "default",
}: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpgrade() {
    setIsLoading(true);

    try {
      // Appelle notre route checkout
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        // Gestion des erreurs spécifiques
        if (data.error === "ALREADY_PRO") {
          alert("You are already on the PRO plan!");
          return;
        }
        throw new Error(data.message || "Failed to create checkout session");
      }

      // Redirige vers la page Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Upgrade error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
      size={size}
      variant={variant}
      className={cn(
        variant === "default" && "bg-violet-600 hover:bg-violet-700 text-white",
        className,
      )}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Redirecting...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Crown className="w-4 h-4" />
          Upgrade to PRO — $9/mo
        </span>
      )}
    </Button>
  );
}
