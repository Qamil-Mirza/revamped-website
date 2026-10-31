"use client";

import { useRef } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { useStepper } from "./hooks";

type Tier = "active" | "archived" | "deleted";

// Each step a new memory arrives; the active tier holds three, so something
// has to be archived or deleted to make room.
const STEPS: Record<Tier, string[]>[] = [
  { active: ["CS170 midterm", "oat latte", "ramen spot"], archived: [], deleted: [] },
  { active: ["oat latte", "ramen spot", "thesis repo"], archived: ["CS170 midterm"], deleted: [] },
  { active: ["ramen spot", "thesis repo", "thrift-store find"], archived: ["CS170 midterm"], deleted: ["oat latte"] },
  { active: ["thesis repo", "thrift-store find", "dentist Tue"], archived: ["CS170 midterm", "ramen spot"], deleted: ["oat latte"] },
];

const TIERS: { id: Tier; title: string; note: string }[] = [
  { id: "active", title: "Active", note: "visible to the model · budget 3" },
  { id: "archived", title: "Archived", note: "stored, retrievable later" },
  { id: "deleted", title: "Deleted", note: "gone for good" },
];

export function MemoryTiersFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStepper(ref, STEPS.length, 1900);
  const state = STEPS[step];

  return (
    <div ref={ref} className="p-4 md:p-6">
      <LayoutGroup>
        <div className="grid grid-cols-3 gap-2.5 md:gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={
                tier.id === "active"
                  ? "rounded-xl border border-[#9fd9b0] bg-[#f3fbf5] p-2.5 md:p-3"
                  : "rounded-xl border border-[#dcdbd2] bg-[#faf9f5] p-2.5 md:p-3"
              }
            >
              <div className="text-[13px] font-semibold text-[#1c1f1a] md:text-sm">{tier.title}</div>
              <div className="mb-3 font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.08em] text-[#6b7067] md:text-[10px]">
                {tier.note}
              </div>
              <div className="flex min-h-[118px] flex-col gap-1.5">
                {state[tier.id].map((item) => (
                  <motion.div
                    layout
                    layoutId={item}
                    key={item}
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                    className={
                      tier.id === "active"
                        ? "rounded-lg bg-white px-2 py-1.5 text-[12px] text-[#1c1f1a] shadow-[0_0_0_1px_#cfe9d6] md:text-[13px]"
                        : tier.id === "archived"
                          ? "rounded-lg bg-white px-2 py-1.5 text-[12px] text-[#6b7067] shadow-[0_0_0_1px_#dcdbd2] md:text-[13px]"
                          : "rounded-lg px-2 py-1.5 text-[12px] text-[#a3a29a] line-through shadow-[0_0_0_1px_#e6e5dd] md:text-[13px]"
                    }
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
