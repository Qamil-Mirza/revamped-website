"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useStepper } from "./hooks";

const ITEMS = Array.from({ length: 8 }, (_, i) => ({ id: i, x: 48 + i * 56 }));
const QUESTIONS = [
  { id: "q1", x: 540, needs: [1, 4] },
  { id: "q2", x: 608, needs: [2, 4, 6] },
];
const LINE_Y = 168;

// Step 0: just the timeline. Steps 1-2: each future question reaches back to the
// memories it needs. Step 3: everything never needed is marked safe to delete.
export function OracleFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStepper(ref, 4, 1800);
  const shownQuestions = QUESTIONS.slice(0, Math.min(step, QUESTIONS.length));
  const needed = new Set(shownQuestions.flatMap((q) => q.needs));

  return (
    <div ref={ref} className="px-2 py-4 md:px-6">
      <svg viewBox="0 0 660 236" className="w-full" role="img" aria-label="A timeline of eight memories; two future questions each point back to the memories they need, and the rest are marked safe to delete.">
        <line x1="24" x2="640" y1={LINE_Y} y2={LINE_Y} stroke="#dcdbd2" strokeWidth="1.5" />
        <line x1="500" x2="500" y1="24" y2="200" stroke="#dcdbd2" strokeDasharray="4 5" />
        <text x="490" y="218" textAnchor="end" className="fill-[#6b7067] text-[16px]">now</text>
        <text x="510" y="218" className="fill-[#15803d] text-[16px]">future</text>

        {shownQuestions.flatMap((q) =>
          q.needs.map((i) => {
            const item = ITEMS[i];
            return (
              <motion.path
                key={`${q.id}-${i}`}
                d={`M ${item.x} ${LINE_Y - 12} Q ${(item.x + q.x) / 2} ${20} ${q.x} ${LINE_Y - 64}`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            );
          }),
        )}

        {ITEMS.map((item) => {
          const isNeeded = needed.has(item.id);
          const safe = step === 3 && !isNeeded;
          return (
            <g key={item.id}>
              <motion.circle
                cx={item.x}
                cy={LINE_Y}
                r="9"
                animate={{ fill: isNeeded ? "#22c55e" : safe ? "#ecebe4" : "#ffffff", stroke: isNeeded ? "#15803d" : "#b9b8af" }}
                strokeWidth="1.5"
              />
              <text x={item.x} y={LINE_Y + 32} textAnchor="middle" className="fill-[#6b7067] text-[15px]">
                m{item.id + 1}
              </text>
              {safe && (
                <motion.text
                  x={item.x}
                  y={LINE_Y - 18}
                  textAnchor="middle"
                  className="fill-[#a3a29a] text-[13px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  delete
                </motion.text>
              )}
            </g>
          );
        })}

        {QUESTIONS.map((q, i) => (
          <motion.g key={q.id} animate={{ opacity: i < shownQuestions.length ? 1 : 0.25 }}>
            <rect x={q.x - 28} y={LINE_Y - 92} width="56" height="30" rx="15" fill="#1c1f1a" />
            <text x={q.x} y={LINE_Y - 72} textAnchor="middle" className="fill-[#f5f4ee] text-[15px]">
              {q.id}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
