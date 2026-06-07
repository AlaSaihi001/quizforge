"use client";

// Composant qui lit les query params et affiche un message
// après le retour de Stripe

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, X } from "lucide-react";

export function PaymentToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [toast, setToast] = useState<{
    type: "success" | "cancel";
    message: string;
  } | null>(null);

  useEffect(() => {
    // Lit les query params
    const upgraded = searchParams.get("upgraded");
    const canceled = searchParams.get("canceled");

    if (upgraded === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToast({
        type: "success",
        message: "Welcome to PRO! Your account has been upgraded.",
      });
    } else if (canceled === "true") {
      setToast({
        type: "cancel",
        message: "Payment canceled. You can upgrade anytime.",
      });
    }

    // Nettoie les query params de l'URL sans recharger la page
    if (upgraded || canceled) {
      router.replace("/dashboard", { scroll: false });
    }
  }, [searchParams, router]);

  if (!toast) return null;

  return (
    <div
      className={`
      fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-xl shadow-lg
      border max-w-sm animate-in slide-in-from-bottom-2
      ${
        toast.type === "success"
          ? "bg-emerald-50 border-emerald-200"
          : "bg-slate-100 border-slate-200"
      }
    `}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
      )}

      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            toast.type === "success" ? "text-emerald-800" : "text-slate-700"
          }`}
        >
          {toast.type === "success"
            ? "Payment successful!"
            : "Payment canceled"}
        </p>
        <p
          className={`text-xs mt-0.5 ${
            toast.type === "success" ? "text-emerald-600" : "text-slate-500"
          }`}
        >
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => setToast(null)}
        className="text-slate-400 hover:text-slate-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
