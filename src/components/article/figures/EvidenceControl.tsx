"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStepOnce } from "./hooks";

// Schematic: which layers light up is illustrative. The point is that the answer
// token keeps appearing in the read-out after the supporting evidence is removed.
const LAYERS = 8;
const RUNS = [
  { title: "Evidence present", evidence: true, lit: [3, 4, 5, 6] },
  { title: "Evidence removed (control)", evidence: false, lit: [4, 5, 6] },
];

export function EvidenceControlFigure() {
  const ref = useRef<HTMLDivElement>(null);
  // 0: nothing yet. 1: read-out with evidence. 2: evidence removed. 3: read-out without it.
  const step = useStepOnce(ref, 4, 1700);

  return (
    <div ref={ref} className="flex flex-col gap-3 p-4 md:p-6">
      {RUNS.map((run, r) => {
        const evidenceGone = !run.evidence && step >= 2;
        const showLit = r === 0 ? step >= 1 : step >= 3;
        return (
          <div key={run.title} className="rounded-xl border border-[#dcdbd2] bg-[#faf9f5] p-3">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13px] font-semibold text-[#1c1f1a]">{run.title}</span>
              <motion.span
                animate={{ opacity: evidenceGone ? 0.45 : 1 }}
                className={cn(
                  "rounded-md border border-dashed px-2 py-0.5 text-[12px]",
                  evidenceGone ? "border-[#b9b8af] text-[#a3a29a] line-through" : "border-[#9fd9b0] bg-[#f3fbf5] text-[#15803d]",
                )}
              >
                supporting evidence
              </motion.span>
            </div>
            <div className="mb-1 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]">
              Lens read-out by layer
            </div>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: LAYERS }, (_, i) => {
                const on = showLit && run.lit.includes(i);
                return (
                  <motion.div
                    key={i}
                    animate={{ backgroundColor: on ? "#22c55e" : "#ffffff", borderColor: on ? "#15803d" : "#dcdbd2" }}
                    transition={{ delay: on ? (i - run.lit[0]) * 0.12 : 0 }}
                    className="flex h-9 items-center justify-center rounded-md border text-[10px] text-white md:text-[11px]"
                    title={on ? "answer token appears in the read-out" : undefined}
                  >
                    {on && <span className="hidden md:inline">answer</span>}
                    {on && <span className="md:hidden">✓</span>}
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-[#a3a29a]">
              <span>layer 1</span>
              <span>layer 8</span>
            </div>
          </div>
        );
      })}
      <motion.div
        animate={{ opacity: step >= 3 ? 1 : 0 }}
        className="rounded-lg bg-[#1c1f1a] px-3 py-2 text-[13px] text-[#f5f4ee]"
      >
        The answer token still shows up without the evidence, so seeing it isn’t proof the model derived it.
      </motion.div>
    </div>
  );
}
