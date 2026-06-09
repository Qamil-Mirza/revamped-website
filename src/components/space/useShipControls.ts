"use client";

import { useEffect, useRef } from "react";
import type { ShipControls, Vec2 } from "./types";

/**
 * Tracks keyboard input and exposes a mutable controls ref read by the game
 * loop. The same ref is mutated by the on-screen joystick (via `setAim`) so the
 * loop has a single source of truth for steering intent.
 *
 * Keyboard mapping:
 *  - W / ArrowUp     -> thrust forward
 *  - S / ArrowDown   -> reverse
 *  - A / ArrowLeft   -> rotate left
 *  - D / ArrowRight  -> rotate right
 *  - Space / Shift   -> boost
 */
export function useShipControls(enabled: boolean) {
  const controls = useRef<ShipControls>({
    turn: 0,
    thrust: 0,
    aim: null,
    boost: false,
  });
  const keys = useRef<Set<string>>(new Set());

  // Joystick writes its normalized vector here; null clears it.
  const setAim = (aim: Vec2 | null) => {
    controls.current.aim = aim;
  };
  const setBoost = (boost: boolean) => {
    controls.current.boost = boost;
  };

  useEffect(() => {
    if (!enabled) return;

    const recompute = () => {
      const k = keys.current;
      let turn = 0;
      let thrust = 0;
      if (k.has("a") || k.has("arrowleft")) turn -= 1;
      if (k.has("d") || k.has("arrowright")) turn += 1;
      if (k.has("w") || k.has("arrowup")) thrust += 1;
      if (k.has("s") || k.has("arrowdown")) thrust -= 1;
      controls.current.turn = turn;
      controls.current.thrust = thrust;
      controls.current.boost = k.has(" ") || k.has("shift");
    };

    const isGameKey = (key: string) =>
      [
        "w",
        "a",
        "s",
        "d",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        " ",
        "shift",
      ].includes(key);

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!isGameKey(key)) return;
      // Prevent the page from scrolling while piloting.
      if (key === " " || key.startsWith("arrow")) e.preventDefault();
      keys.current.add(key);
      recompute();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!isGameKey(key)) return;
      keys.current.delete(key);
      recompute();
    };

    const clearAll = () => {
      keys.current.clear();
      recompute();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearAll);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearAll);
      clearAll();
    };
  }, [enabled]);

  return { controls, setAim, setBoost };
}
