"use client";

import { useEffect, useRef } from "react";

/**
 * Runs a requestAnimationFrame loop that invokes `callback` with the delta time
 * in seconds (clamped to avoid large jumps after tab switches). The loop is
 * paused whenever `running` is false (e.g. while a content panel is open) and
 * always reads the latest callback without re-subscribing.
 */
export function useGameLoop(
  callback: (dt: number) => void,
  running: boolean
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!running) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      callbackRef.current(dt);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);
}
