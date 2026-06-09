"use client";

// Next.js appelle ce composant automatiquement quand une erreur
// non gérée se produit dans n'importe quelle page

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void; // Fonction pour réessayer
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Envoie l'erreur à Sentry automatiquement
    Sentry.captureException(error);
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Icône */}
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-500 mb-2">
          An unexpected error occurred. We have been notified and will fix it
          soon.
        </p>

        {/* Error digest pour le debugging */}
        {error.digest && (
          <p className="text-xs text-slate-400 font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={reset}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-300">
              <Home className="w-4 h-4 mr-2" />
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
