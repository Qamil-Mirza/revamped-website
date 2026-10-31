"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStepper } from "./hooks";

const RUNGS = [
  { q: "Did the model answer correctly?", measures: "Observable performance" },
  { q: "Can we recover an expected intermediate concept?", measures: "What a particular interpretability method can reveal" },
  { q: "Does changing that representation alter the answer as predicted?", measures: "Evidence about its causal role" },
];

// Between each pair of rungs: the inference you can't make.
const GAPS = [
  "A correct answer doesn’t mean the intermediate is visible through our lens.",
  "A visible answer token doesn’t mean the model derived it from the evidence.",
  "Changing the output doesn’t prove our whole explanation of the original failure.",
];

export function ThreeQuestionsFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useStepper(ref, RUNGS.length, 2200, -1);

  return (
    <div ref={ref} className="flex flex-col p-4 md:p-6">
      {RUNGS.map((rung, i) => (
        <div key={rung.q}>
          <motion.div
            animate={{ opacity: active === -1 || active === i ? 1 : 0.5 }}
            className={cn(
              "grid grid-cols-[28px_1fr] items-start gap-3 rounded-xl border p-3",
              active === i ? "border-[#9fd9b0] bg-[#f3fbf5]" : "border-[#dcdbd2] bg-[#faf9f5]",
            )}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1c1f1a] font-[family-name:var(--font-geist-mono)] text-[12px] text-[#f5f4ee]">
              {i + 1}
            </span>
            <div>
              <div className="text-[14px] font-semibold leading-snug text-[#1c1f1a]">{rung.q}</div>
              <div className="mt-0.5 text-[12.5px] text-[#6b7067]">Tells us: {rung.measures}</div>
            </div>
          </motion.div>
          <motion.div
            animate={{ opacity: active === -1 || active === i ? 1 : 0.45 }}
            className="ml-[26px] flex items-start gap-2.5 border-l-2 border-dashed border-[#dcdbd2] py-2.5 pl-4 text-[12.5px] text-[#2b2f29]"
          >
            <span className="mt-[1px] font-[family-name:var(--font-geist-mono)] text-[14px] font-semibold text-[#1c1f1a]">⇏</span>
            {GAPS[i]}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
