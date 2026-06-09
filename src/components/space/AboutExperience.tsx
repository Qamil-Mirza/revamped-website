"use client";

import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import SpaceScene from "./SpaceScene";
import LegacyAbout from "./LegacyAbout";

type Mode = "space" | "classic";

/**
 * Chooses between the interactive space scene and the classic tabbed layout.
 * Defaults to the classic layout when the user prefers reduced motion, and lets
 * anyone toggle between the two.
 */
export default function AboutExperience() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("space");

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) setMode("classic");
    setMounted(true);
  }, []);

  // Avoid SSR/hydration mismatch from media queries: paint deep space first.
  if (!mounted) {
    return <div className="fixed inset-0 bg-[#05060d]" aria-hidden="true" />;
  }

  if (mode === "classic") {
    return (
      <div className="relative">
        <LegacyAbout />
        <button
          onClick={() => setMode("space")}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-[#19b5fe]/40 bg-[#0a0f1f]/90 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-transform hover:scale-105"
        >
          <Rocket className="h-4 w-4 text-[#19b5fe]" />
          Launch cockpit
        </button>
      </div>
    );
  }

  return <SpaceScene onClassicView={() => setMode("classic")} />;
}
