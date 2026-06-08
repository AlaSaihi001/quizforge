"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Check } from "lucide-react";

interface ShareButtonProps {
  shareToken: string;
}

export function ShareButton({ shareToken }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/share/${shareToken}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      // Reset après 2 secondes
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback si clipboard API non disponible
      prompt("Copy this link:", url);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="text-xs h-7 px-2.5"
    >
      {copied ? (
        <span className="flex items-center gap-1 text-emerald-600">
          <Check className="w-3 h-3" />
          Copied!
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <Link2 className="w-3 h-3" />
          Share
        </span>
      )}
    </Button>
  );
}
