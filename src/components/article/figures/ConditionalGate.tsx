"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStepOnce } from "./hooks";

// Schematic of the intended behaviour, not a measurement. Bar heights are
// illustrative. Both memories mention Leeds, so only the relationship can drive the gate.
const BASE = [10, 18, 8, 22, 14, 6, 16, 24, 12, 20, 9, 15];
const PUSH = [8, 5, 10, 4, 7, 11, 6, 3, 9, 5, 10, 7];

const ROWS = [
  { memory: <>Maya lives in Leeds.</>, aboutMaya: true, answer: "Leeds" },
  {
    memory: (
      <>
        Maya’s <mark className="rounded bg-[#bbf7d0] px-0.5 text-[#15803d]">friend</mark> lives in Leeds.
      </>
    ),
    aboutMaya: false,
    answer: "unknown",
  },
];

const LABEL = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]";
const COLUMNS = "md:grid-cols-[1fr_1.3fr_1.2fr_auto]";

export function ConditionalGateFigure() {
  const ref = useRef<HTMLDivElement>(null);
  // 0: memories. 1: signals read. 2: gate decides. 3: push added or withheld. 4: answers. 5: the contrast.
  const step = useStepOnce(ref, 6, 1200);

  return (
    <div ref={ref} className="p-4 md:p-6">
      <div className="mb-3 text-[14px] text-[#1c1f1a]">
        <span className={cn(LABEL, "mr-2")}>Question</span>
        Where does Maya live?
      </div>
      <div className={cn("mb-2 hidden gap-4 px-3 md:grid", COLUMNS, LABEL)}>
        <span>Memory</span>
        <span>Signals inside the model</span>
        <span>Gate and push</span>
        <span className="w-[92px]">Goal</span>
      </div>
      <div className="flex flex-col gap-2">
        {ROWS.map((row) => (
          <div key={row.answer} className={cn("grid gap-3 rounded-xl border border-[#dcdbd2] bg-[#faf9f5] px-3 py-3 md:items-center md:gap-4", COLUMNS)}>
            <div className="text-[14px] font-medium leading-snug text-[#1c1f1a]">{row.memory}</div>

            <div className="flex flex-col gap-1 text-[12.5px]">
              <Signal label="Mentions Leeds" value="yes" shown={step >= 1} />
              <Signal label="Fact is about Maya" value={row.aboutMaya ? "yes" : "no"} shown={step >= 1} tone={row.aboutMaya ? "open" : "shut"} />
            </div>

            <div>
              <div className="flex h-10 items-end gap-[3px]" aria-hidden>
                {BASE.map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col justify-end">
                    <motion.div
                      initial={false}
                      animate={{ scaleY: row.aboutMaya && step >= 3 ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.02 }}
                      style={{ height: PUSH[i], originY: 1 }}
                      className="rounded-t-[1px] bg-[#22c55e]"
                    />
                    <div style={{ height: h }} className="bg-[#c9c8bf]" />
                  </div>
                ))}
              </div>
              <motion.div initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} className="mt-1.5 text-[12px] leading-snug text-[#6b7067]">
                {row.aboutMaya ? (
                  <span className="font-medium text-[#15803d]">Gate opens, push added</span>
                ) : (
                  <span className="font-medium text-[#1c1f1a]">Gate stays shut, no push</span>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 4 }}
              className="w-[92px] rounded-lg bg-[#1c1f1a] px-2 py-1 text-center font-[family-name:var(--font-geist-mono)] text-[12.5px] font-semibold text-[#f5f4ee]"
            >
              {row.answer}
            </motion.div>
          </div>
        ))}
      </div>
      <motion.div initial={false} animate={{ opacity: step >= 5 ? 1 : 0 }} className="mt-3 text-[13px] leading-snug text-[#2b2f29]">
        Without a gate, the same push can say “Leeds” both times, even with insufficient evidence.
      </motion.div>
    </div>
  );
}

function Signal({ label, value, shown, tone }: { label: string; value: string; shown: boolean; tone?: "open" | "shut" }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={tone ? "text-[#1c1f1a]" : "text-[#6b7067]"}>{label}</span>
      <motion.span
        initial={false}
        animate={{ opacity: shown ? 1 : 0 }}
        className={cn(
          "rounded px-1.5 py-[1px] font-[family-name:var(--font-geist-mono)] text-[11px] font-semibold",
          tone === "open" && "bg-[#22c55e] text-white",
          tone === "shut" && "bg-[#1c1f1a] text-[#f5f4ee]",
          !tone && "bg-[#ecebe4] text-[#6b7067]",
        )}
      >
        {value}
      </motion.span>
    </div>
  );
}
