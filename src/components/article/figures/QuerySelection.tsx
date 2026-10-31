"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useOnceInView } from "./hooks";

// Schematic: blocks stand for chunks of prompt; green ones hold evidence the
// question needs. Only the ~1/3 token ratio and ~10 point gain are measured.
const RECENCY = Array.from({ length: 30 }, (_, i) => [4, 17, 26].includes(i));
const QUERY_AWARE = Array.from({ length: 10 }, (_, i) => i < 7);

export function QuerySelectionFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useOnceInView(ref);

  return (
    <div ref={ref} className="flex flex-col gap-5 p-4 md:p-6">
      <Row title="Recency baseline" note="keeps the latest memories" blocks={RECENCY} shown={shown} />
      <Row title="Query-aware selection" note="picks evidence once the question is known" blocks={QUERY_AWARE} shown={shown} />
      <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-[#ecebe4] pt-3 text-[13px] text-[#1c1f1a]">
        <span>
          <strong className="font-semibold">≈ ⅓</strong> <span className="text-[#6b7067]">of the prompt tokens</span>
        </span>
        <span>
          <strong className="font-semibold">≈ +10 points</strong> <span className="text-[#6b7067]">answer accuracy on LongMemEval</span>
        </span>
      </div>
    </div>
  );
}

function Row({ title, note, blocks, shown }: { title: string; note: string; blocks: boolean[]; shown: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold text-[#1c1f1a]">{title}</span>
        <span className="text-right text-[11px] text-[#6b7067]">{note}</span>
      </div>
      <div className="flex gap-[3px]">
        {blocks.map((relevant, i) => (
          <motion.span
            key={i}
            className="h-6 w-[calc((100%-87px)/30)] rounded-[3px]"
            style={{ background: relevant ? "#22c55e" : "#e3e2da" }}
            initial={{ opacity: 0, y: 6 }}
            animate={shown ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.025, duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
