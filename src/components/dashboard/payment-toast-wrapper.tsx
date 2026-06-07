import { Suspense } from "react";
import { PaymentToast } from "@/components/dashboard/payment-toast";

// Suspense est requis car useSearchParams() a besoin d'un boundary
export function PaymentToastWrapper() {
  return (
    <Suspense fallback={null}>
      <PaymentToast />
    </Suspense>
  );
}
