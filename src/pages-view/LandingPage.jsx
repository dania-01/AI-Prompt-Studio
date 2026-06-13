"use client";

import { LandingNav } from "@/sections/landing/LandingNav";
import { LandingHero } from "@/sections/landing/LandingHero";
import { FeaturesSection } from "@/sections/landing/FeaturesSection";
import { HowItWorksSection } from "@/sections/landing/HowItWorksSection";
import { ModelsSection } from "@/sections/landing/ModelsSection";
import { FooterSection } from "@/sections/landing/FooterSection";

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#faf9ff] text-zinc-900 dark:bg-[#05050f] dark:text-zinc-100">

      {/* Dot grid background */}
      <div className="bg-dot-grid pointer-events-none fixed inset-0 -z-10 opacity-50 dark:opacity-100" />

      {/* Global ambient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-80 -top-80 h-[800px] w-[800px] rounded-full bg-violet-500/8 blur-[140px] dark:bg-violet-600/12" />
        <div className="absolute -bottom-80 -left-80 h-[700px] w-[700px] rounded-full bg-indigo-600/6 blur-[130px] dark:bg-indigo-600/10" />
      </div>

      <LandingNav />
      <LandingHero />
      <FeaturesSection />
      <HowItWorksSection />
      <ModelsSection />
      <FooterSection />
    </div>
  );
}
