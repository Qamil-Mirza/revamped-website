"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useOnceInView } from "./hooks";

// Horizontal bars on a shared 0-max axis, each value labelled directly.
// One hue: the bar the point is about is dark green, context bars are lighter
// green or gray, so the reading never depends on telling two greens apart.
export type HBar = { label: string; value: number; display?: string; tone?: "accent" | "light" | "muted" };
export type HBarGroup = { title?: string; bars: HBar[] };

const FILL = { accent: "#15803d", light: "#5fb87c", muted: "#b9b8af" };
const LABEL = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]";

export function HBars({ groups, max = 100, axisLabel }: { groups: HBarGroup[]; max?: number; axisLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useOnceInView(ref);

  return (
    <div ref={ref} className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.title ?? group.bars[0].label}>
          {group.title && <div className={`${LABEL} mb-2.5`}>{group.title}</div>}
          <div className="flex flex-col gap-2.5">
            {group.bars.map((bar, i) => {
              const width = Math.max(0, Math.min(1, bar.value / max)) * 100;
              const text = bar.display ?? `${bar.value}%`;
              return (
                <div
                  key={bar.label}
                  title={`${bar.label}: ${text}`}
                  className="grid grid-cols-[minmax(0,7.5rem)_1fr_auto] items-center gap-3 md:grid-cols-[minmax(0,11rem)_1fr_auto]"
                >
                  <span className="text-[13px] leading-tight text-[#2b2f29]">{bar.label}</span>
                  <div className="relative h-3 rounded-[4px] bg-[#f0efe8]">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-[4px]"
                      style={{ backgroundColor: FILL[bar.tone ?? "accent"] }}
                      initial={{ width: 0 }}
                      animate={{ width: shown ? `${width}%` : 0 }}
                      transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className="min-w-[3.25rem] text-right font-[family-name:var(--font-geist-mono)] text-[12.5px] font-semibold text-[#1c1f1a]">
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {axisLabel && <div className="text-[12px] text-[#6b7067]">{axisLabel}</div>}
    </div>
  );
}
