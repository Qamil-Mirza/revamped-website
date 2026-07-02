"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import DrinkCard from "@/components/ui/DrinkCard";
import { selectFeatured, todayInOwnerTz, type Drink } from "@/lib/drinks-logic";

// Fixed slots around the centered card. Side slots are hidden on mobile and
// appear from the `sm` breakpoint up. Keeping the slots fixed — rather than
// re-keying cards by id across a flex row with `layout` — is what keeps paging
// smooth: only a slot's *contents* cross-fade/slide, so nothing is projected
// across a display:none box, which is what caused the old diagonal "snap".
const SLOTS = [-1, 0, 1] as const;

// Refined ease-out (no bounce).
const EASE = [0.22, 1, 0.36, 1] as const;

export default function DrinksCarousel() {
  const [drinks, setDrinks] = useState<Drink[] | null>(null);
  const [center, setCenter] = useState(0);
  const [direction, setDirection] = useState(0);
  const drinksRef = useRef<Drink[] | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let active = true;
    fetch("/api/drinks")
      .then((r) => r.json())
      .then((data: { drinks: Drink[] }) => {
        if (!active) return;
        const { ordered, featuredIndex } = selectFeatured(data.drinks, todayInOwnerTz());
        // Display oldest -> newest, left to right (the featured / most-recent
        // drink sits on the right). `ordered` is newest-first, so reverse it
        // and remap the featured position into the reversed array.
        const displayed = [...ordered].reverse();
        setDrinks(displayed);
        drinksRef.current = displayed;
        setCenter(featuredIndex < 0 ? 0 : displayed.length - 1 - featuredIndex);
      })
      .catch(() => {
        if (!active) return;
        drinksRef.current = [];
        setDrinks([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const move = useCallback((dir: number) => {
    const d = drinksRef.current;
    if (!d || d.length === 0) return;
    setDirection(dir >= 0 ? 1 : -1);
    setCenter((c) => Math.min(Math.max(c + dir, 0), d.length - 1));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  if (drinks === null) {
    return (
      <div className="mx-auto h-72 w-full max-w-md animate-pulse rounded-2xl bg-white/5" />
    );
  }

  if (drinks.length === 0) {
    return (
      <p className="text-center text-primaryText/60">No drinks brewed yet — check back soon.</p>
    );
  }

  // Content slides in from the direction of travel and out the opposite side,
  // with a fade. Reduced-motion users get a plain, quick cross-fade.
  const cardVariants: Variants = reduce
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 48 : -48 }),
        center: { opacity: 1, x: 0 },
        exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -48 : 48 }),
      };

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="flex items-center justify-center gap-4 py-6"
        role="group"
        aria-label="Drink carousel"
      >
        {SLOTS.map((pos) => {
          const i = center + pos;
          const isCenter = pos === 0;
          const drink = i >= 0 && i < drinks.length ? drinks[i] : null;
          return (
            // Fixed-width slot: size + dim are static per slot (coverflow depth),
            // so the layout never shifts. Empty end slots reserve their width to
            // keep the featured card perfectly centered.
            <div
              key={pos}
              className={
                isCenter
                  ? "relative w-64 sm:w-72 z-10"
                  : "relative hidden w-48 opacity-50 sm:block"
              }
            >
              <AnimatePresence custom={direction} initial={false} mode="popLayout">
                {drink && (
                  <motion.div
                    key={drink.id}
                    custom={direction}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: reduce ? 0.15 : 0.42, ease: EASE }}
                    onClick={isCenter ? undefined : () => move(pos)}
                    style={{ cursor: isCenter ? "default" : "pointer" }}
                    role={isCenter ? undefined : "button"}
                    tabIndex={isCenter ? undefined : 0}
                    onKeyDown={
                      isCenter
                        ? undefined
                        : (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              move(pos);
                            }
                          }
                    }
                  >
                    <DrinkCard drink={drink} featured={isCenter} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={center === 0}
          aria-label="Previous drink"
          className="rounded-full border border-white/20 px-4 py-2 text-primaryText disabled:opacity-30"
        >
          ←
        </button>
        <span className="text-sm text-primaryText/60">
          {center + 1} / {drinks.length}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={center === drinks.length - 1}
          aria-label="Next drink"
          className="rounded-full border border-white/20 px-4 py-2 text-primaryText disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
}
