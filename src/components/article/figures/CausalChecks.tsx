"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStepOnce } from "./hooks";

type Version = "original" | "edited";
type Row = { name: string; weights: Version; activation: Version; note: string; expected: string; test: boolean };

const ROWS: Row[] = [
  { name: "Original model", weights: "original", activation: "original", note: "", expected: "Baseline behavior", test: false },
  { name: "Edited model", weights: "edited", activation: "edited", note: "", expected: "The edit’s effect", test: false },
  { name: "Transfer test", weights: "original", activation: "edited", note: "transferred in", expected: "Effect should appear", test: true },
  { name: "Hold test", weights: "edited", activation: "original", note: "held at original value", expected: "Effect should disappear", test: true },
];

const LABEL = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]";
const COLUMNS = "md:grid-cols-[1fr_0.8fr_1.2fr_1fr]";

export function CausalChecksFigure() {
  const ref = useRef<HTMLDivElement>(null);
  // 0: the two reference models. 1: add the transfer test. 2: add the hold test.
  const step = useStepOnce(ref, 3, 1500);

  return (
    <div ref={ref} className="p-4 md:p-6">
      <div className={cn("mb-2 hidden gap-3 px-3 md:grid", COLUMNS, LABEL)}>
        <span />
        <span>Weights</span>
        <span>Named activation</span>
        <span>Expected</span>
      </div>
      <div className="flex flex-col gap-2">
        {ROWS.map((row, i) => {
          const shown = !row.test || step >= i - 1;
          return (
            <motion.div
              key={row.name}
              initial={false}
              animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "grid grid-cols-2 items-start gap-x-3 gap-y-2 rounded-xl border px-3 py-2.5 text-[13px] md:items-center",
                COLUMNS,
                row.test ? "border-[#9fd9b0] bg-[#f3fbf5]" : "border-[#dcdbd2] bg-[#faf9f5]",
              )}
            >
              <div className="col-span-2 font-semibold text-[#1c1f1a] md:col-span-1">{row.name}</div>
              <Chip version={row.weights} caption="Weights" />
              <Chip version={row.activation} caption="Activation" note={row.note} />
              <div className={cn("col-span-2 md:col-span-1", row.test ? "font-medium text-[#15803d]" : "text-[#6b7067]")}>{row.expected}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ version, caption, note }: { version: Version; caption: string; note?: string }) {
  return (
    <div>
      <div className={cn(LABEL, "mb-1 md:hidden")}>{caption}</div>
      <span
        className={cn(
          "inline-block rounded-md border px-2 py-0.5 text-[12.5px]",
          version === "edited" ? "border-[#15803d] bg-[#22c55e] font-medium text-white" : "border-[#b9b8af] bg-white text-[#2b2f29]",
        )}
      >
        {version}
      </span>
      {note && <div className="mt-1 text-[11.5px] leading-tight text-[#6b7067]">{note}</div>}
    </div>
  );
}
