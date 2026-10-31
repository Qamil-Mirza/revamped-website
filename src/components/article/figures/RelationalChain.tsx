"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStepper } from "./hooks";

// Step 0: the facts. 1: first hop. 2: second hop, answer Leeds.
// 3: change one fact (Leeds → Bristol) and the answer should follow.
export function RelationalChainFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStepper(ref, 4, 1700, 2);
  const city = step === 3 ? "Bristol" : "Leeds";

  return (
    <div ref={ref} className="p-4 md:p-6">
      <div className="mb-4 flex flex-wrap gap-2 text-[13px]">
        <Fact>Maya’s supervisor is Alex.</Fact>
        <Fact changed={step === 3}>
          Alex works in <Swap value={city} />.
        </Fact>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <Node lit={step >= 1}>Maya</Node>
        <Edge lit={step >= 1} label="supervisor" />
        <Node lit={step >= 1}>Alex</Node>
        <Edge lit={step >= 2} label="works in" />
        <Node lit={step >= 2} answer>
          <Swap value={city} />
        </Node>
      </div>
      <div className="mt-4 text-[13px] text-[#6b7067]">
        Q: Where does Maya’s supervisor work?{" "}
        <span className="font-[family-name:var(--font-geist-mono)] font-semibold text-[#1c1f1a]">
          {step >= 2 ? <Swap value={city} /> : "…"}
        </span>
      </div>
    </div>
  );
}

function Fact({ children, changed = false }: { children: React.ReactNode; changed?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-lg border px-2.5 py-1.5 transition-colors",
        changed ? "border-[#9fd9b0] bg-[#f3fbf5] text-[#15803d]" : "border-[#dcdbd2] bg-[#faf9f5] text-[#2b2f29]",
      )}
    >
      {children}
    </span>
  );
}

function Node({ children, lit, answer = false }: { children: React.ReactNode; lit: boolean; answer?: boolean }) {
  return (
    <motion.span
      animate={{
        backgroundColor: lit ? (answer ? "#22c55e" : "#f3fbf5") : "#ffffff",
        color: lit && answer ? "#ffffff" : "#1c1f1a",
        borderColor: lit ? "#9fd9b0" : "#dcdbd2",
      }}
      className="inline-flex min-w-[72px] justify-center rounded-full border px-3 py-1.5 text-[14px] font-medium"
    >
      {children}
    </motion.span>
  );
}

function Edge({ lit, label }: { lit: boolean; label: string }) {
  return (
    <span className="flex flex-col items-center">
      <span className="text-[10px] text-[#6b7067]">{label}</span>
      <span className="relative block h-[2px] w-10 overflow-hidden rounded bg-[#e3e2da] md:w-16">
        <motion.span className="absolute inset-y-0 left-0 bg-[#22c55e]" animate={{ width: lit ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
      </span>
    </span>
  );
}

function Swap({ value }: { value: string }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
