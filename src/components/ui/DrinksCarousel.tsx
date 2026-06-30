"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DrinkCard from "@/components/ui/DrinkCard";
import { selectFeatured, todayInOwnerTz, type Drink } from "@/lib/drinks-logic";

export default function DrinksCarousel() {
  const [drinks, setDrinks] = useState<Drink[] | null>(null);
  const [center, setCenter] = useState(0);
  const drinksRef = useRef<Drink[] | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/drinks")
      .then((r) => r.json())
      .then((data: { drinks: Drink[] }) => {
        if (!active) return;
        const { ordered, featuredIndex } = selectFeatured(data.drinks, todayInOwnerTz());
        setDrinks(ordered);
        drinksRef.current = ordered;
        setCenter(featuredIndex < 0 ? 0 : featuredIndex);
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

  const move = useCallback((dir: -1 | 1) => {
    const d = drinksRef.current;
    if (!d || d.length === 0) return;
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

  const visible = [center - 1, center, center + 1].filter(
    (i) => i >= 0 && i < drinks.length,
  );

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="flex items-center justify-center gap-4 py-6"
        role="group"
        aria-label="Drink carousel"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((i) => {
            const isCenter = i === center;
            return (
              <motion.div
                key={drinks[i].id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isCenter ? 1 : 0.45,
                  scale: isCenter ? 1 : 0.8,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className={isCenter ? "w-64 sm:w-72 z-10" : "hidden w-48 sm:block"}
                onClick={() => !isCenter && setCenter(i)}
                style={{ cursor: isCenter ? "default" : "pointer" }}
                role={isCenter ? undefined : "button"}
                tabIndex={isCenter ? undefined : 0}
                onKeyDown={(e) => {
                  if (!isCenter && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    setCenter(i);
                  }
                }}
              >
                <DrinkCard drink={drinks[i]} featured={isCenter} />
              </motion.div>
            );
          })}
        </AnimatePresence>
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
