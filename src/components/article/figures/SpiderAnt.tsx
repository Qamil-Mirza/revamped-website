"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStepper } from "./hooks";

const RUNS = [
  { title: "Normal run", inner: "spider", answer: "8", note: "J-lens read-out in the middle layers" },
  { title: "Intervention", inner: "ant", answer: "6", note: "swap the lens coordinates: spider → ant" },
];

export function SpiderAntFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useStepper(ref, RUNS.length, 2600, -1);

  return (
    <div ref={ref} className="p-4 md:p-6">
      <div className="mb-4 rounded-xl border border-[#dcdbd2] bg-[#faf9f5] px-4 py-3 text-[14px] text-[#2b2f29]">
        <span className="mr-2 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.12em] text-[#6b7067]">Prompt</span>
        The number of legs on the animal that spins webs is…
      </div>
      <div className="flex flex-col gap-2.5">
        {RUNS.map((run, i) => {
          // the intervention row starts like the normal run, then the swap lands
          const swapped = i === 0 || active === -1 || active === 1;
          const inner = swapped ? run.inner : RUNS[0].inner;
          const answer = swapped ? run.answer : RUNS[0].answer;
          return (
          <motion.div
            key={run.title}
            animate={{ opacity: active === -1 || active === i ? 1 : 0.45 }}
            className={cn(
              "grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border px-3.5 py-3 md:grid-cols-[150px_1fr_auto]",
              active === i ? "border-[#9fd9b0] bg-[#f3fbf5]" : "border-[#dcdbd2] bg-white",
            )}
          >
            <div className="col-span-2 md:col-span-1">
              <div className="text-[13px] font-semibold text-[#1c1f1a]">{run.title}</div>
              <div className="text-[11px] text-[#6b7067]">{run.note}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-[3px]">
                {[0, 1, 2, 3, 4].map((l) => (
                  <span key={l} className={cn("block h-1.5 w-14 rounded-full", l === 2 ? "bg-[#22c55e]" : "bg-[#e3e2da]")} />
                ))}
              </div>
              <span className="text-[#b9b8af]">→</span>
              <span className="relative inline-flex h-7 min-w-[72px] items-center justify-center overflow-hidden rounded-full border border-dashed border-[#9fd9b0] bg-[#eef8f1] px-3 font-[family-name:var(--font-geist-mono)] text-[13px] text-[#15803d]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={inner} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
                    {inner}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
            <div className="flex items-center gap-2 justify-self-end">
              <span className="text-[11px] text-[#6b7067]">legs</span>
              <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-[#1c1f1a] font-[family-name:var(--font-geist-mono)] text-[17px] font-semibold text-[#f5f4ee]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={answer} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ delay: 0.25 }}>
                    {answer}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
}
