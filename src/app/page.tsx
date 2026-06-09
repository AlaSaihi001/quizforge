import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingStats } from "@/components/landing/stats";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingFeatures } from "@/components/landing/features";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingCTAFooter } from "@/components/landing/cta-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <LandingHero />
      <LandingStats />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingPricing />
      <LandingCTAFooter />
    </div>
  );
}
