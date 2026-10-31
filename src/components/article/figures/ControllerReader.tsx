"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStepper } from "./hooks";

const ROWS = [
  { kept: ["car wash $15", "parking $50"], dropped: [], reader: "adds 15 + 50", answer: "$65", ok: true, verdict: "Both did their jobs" },
  { kept: ["car wash $15"], dropped: ["parking $50"], reader: "can't add what's missing", answer: "unknown", ok: false, verdict: "Controller's fault" },
  { kept: ["car wash $15", "parking $50"], dropped: [], reader: "adds 15 + 50", answer: "$55", ok: false, verdict: "Reader's fault" },
];

export function ControllerReaderFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useStepper(ref, ROWS.length, 2400, -1);

  return (
    <div ref={ref} className="p-4 md:p-6">
      <div className="mb-3 hidden grid-cols-[1.3fr_1fr_0.7fr_1fr] gap-3 px-3 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067] md:grid">
        <span>Controller keeps</span>
        <span>Reader</span>
        <span>Answer</span>
        <span>Whose failure?</span>
      </div>
      <div className="flex flex-col gap-2">
        {ROWS.map((row, i) => (
          <motion.div
            key={i}
            animate={{ opacity: active === -1 || active === i ? 1 : 0.45 }}
            className={cn(
              "grid grid-cols-2 items-center gap-x-3 gap-y-2 rounded-xl border px-3 py-2.5 text-[13px] md:grid-cols-[1.3fr_1fr_0.7fr_1fr]",
              active === i ? "border-[#9fd9b0] bg-[#f3fbf5]" : "border-[#dcdbd2] bg-[#faf9f5]",
            )}
          >
            <div className="col-span-2 flex flex-wrap gap-1.5 md:col-span-1">
              {row.kept.map((k) => (
                <span key={k} className="rounded-md bg-white px-1.5 py-0.5 text-[#1c1f1a] shadow-[0_0_0_1px_#cfe9d6]">
                  {k}
                </span>
              ))}
              {row.dropped.map((k) => (
                <span key={k} className="rounded-md px-1.5 py-0.5 text-[#a3a29a] line-through shadow-[0_0_0_1px_#e6e5dd]">
                  {k}
                </span>
              ))}
            </div>
            <div className="text-[#6b7067]">→ {row.reader}</div>
            <div className="font-[family-name:var(--font-geist-mono)] text-[15px] font-semibold text-[#1c1f1a]">
              {row.answer}
            </div>
            <div className={cn("flex items-center gap-1.5", row.ok ? "text-[#15803d]" : "text-[#1c1f1a]")}>
              <span
                aria-hidden
                className={cn(
                  "grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold",
                  row.ok ? "bg-[#22c55e] text-white" : "bg-[#1c1f1a] text-[#f5f4ee]",
                )}
              >
                {row.ok ? "✓" : "✕"}
              </span>
              {row.verdict}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
