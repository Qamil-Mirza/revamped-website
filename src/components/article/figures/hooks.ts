"use client";

import { useEffect, useState, type RefObject } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Steps through `count` states on a timer while the figure is on screen.
// With reduced motion it parks on `restAt` so the figure shows its key state.
export function useStepper(ref: RefObject<Element | null>, count: number, intervalMs: number, restAt = count - 1): number {
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    const id = setInterval(() => setStep((s) => (s + 1) % count), intervalMs);
    return () => clearInterval(id);
  }, [reduced, inView, count, intervalMs]);

  return reduced ? restAt : step;
}

// Types `text` out one character at a time, holds, then starts over.
// Returns how many characters are visible.
export function useTypedLoop(ref: RefObject<Element | null>, text: string, charMs = 35, holdMs = 3200): number {
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    let n = 0;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      n = n >= text.length ? 0 : n + 1;
      setShown(n);
      id = setTimeout(tick, n >= text.length ? holdMs : charMs);
    };
    id = setTimeout(tick, 400);
    return () => clearTimeout(id);
  }, [reduced, inView, text, charMs, holdMs]);

  return reduced ? text.length : shown;
}

export function useOnceInView(ref: RefObject<Element | null>): boolean {
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  return reduced || inView;
}
