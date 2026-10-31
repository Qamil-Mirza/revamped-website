"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useStepper } from "./hooks";

// Schematic, not to scale: answers move both ways under an intervention.
// Some wrong answers become right; some right answers become wrong.
const FLOWS = [
  { from: "Wrong", to: "Right", label: "recovered", color: "#22c55e", y1: 150, y2: 60 },
  { from: "Right", to: "Wrong", label: "new errors", color: "#1c1f1a", y1: 60, y2: 150 },
];

export function InterventionTradeoffFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useStepper(ref, 3, 1500, 2);

  return (
    <div ref={ref} className="px-2 py-4 md:px-6">
      <svg
        viewBox="0 0 600 220"
        className="w-full"
        role="img"
        aria-label="Schematic: an intervention turns some wrong answers right, and some right answers wrong."
      >
        <text x="110" y="24" textAnchor="middle" className="fill-[#6b7067] text-[15px]">before</text>
        <text x="490" y="24" textAnchor="middle" className="fill-[#6b7067] text-[15px]">after intervention</text>
        {[
          { x: 110, label: "Right", y: 60 },
          { x: 110, label: "Wrong", y: 150 },
          { x: 490, label: "Right", y: 60 },
          { x: 490, label: "Wrong", y: 150 },
        ].map((b) => (
          <g key={`${b.x}-${b.label}`}>
            <rect
              x={b.x - 70}
              y={b.y - 22}
              width="140"
              height="44"
              rx="12"
              fill={b.label === "Right" ? "#f3fbf5" : "#faf9f5"}
              stroke={b.label === "Right" ? "#9fd9b0" : "#dcdbd2"}
            />
            <text x={b.x} y={b.y + 6} textAnchor="middle" className="fill-[#1c1f1a] text-[17px] font-semibold">
              {b.label}
            </text>
          </g>
        ))}

        {FLOWS.map((f, i) => {
          const d = `M 185 ${f.y1} C 300 ${f.y1}, 300 ${f.y2}, 415 ${f.y2}`;
          const on = step >= i + 1;
          return (
            <g key={f.label}>
              <motion.path
                d={d}
                fill="none"
                stroke={f.color}
                strokeWidth="2.5"
                initial={false}
                animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
              <motion.path
                d={`M 405 ${f.y2 - 6} L 415 ${f.y2} L 405 ${f.y2 + 6}`}
                fill="none"
                stroke={f.color}
                strokeWidth="2.5"
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ delay: on ? 0.8 : 0 }}
              />
              <motion.text
                x="300"
                y={i === 0 ? 40 : 184}
                textAnchor="middle"
                className="text-[15px] font-semibold"
                fill={f.color === "#22c55e" ? "#15803d" : f.color}
                animate={{ opacity: on ? 1 : 0 }}
              >
                {f.label}
              </motion.text>
            </g>
          );
        })}
        <text x="300" y="208" textAnchor="middle" className="fill-[#a3a29a] text-[12px]">schematic · not to scale</text>
      </svg>
    </div>
  );
}
