// Server Component — vérifie le statut en DB
// Passe le résultat au Client Component

import { checkOnboardingStatus } from "@/lib/actions/onboarding.action";
import { OnboardingModal } from "./onboarding-modal";

export async function OnboardingWrapper() {
  const isCompleted = await checkOnboardingStatus();

  // Si déjà complété → n'affiche rien
  if (isCompleted) return null;

  // Sinon → affiche le modal
  return <OnboardingModal isOpen={true} />;
}
