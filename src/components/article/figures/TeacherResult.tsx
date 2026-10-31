"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOnceInView } from "./hooks";

// One before/after pair, so a dumbbell on a 0-1 axis: one hue, two shades,
// both values labelled directly (the lighter shade is under 3:1 on the surface).
const BEFORE = { value: 0.335, label: "Teacher picks one action", color: "#5fb87c" };
const AFTER = { value: 0.851, label: "Teacher accepts any good action", color: "#15803d" };
const W = 600;
const PAD = 40;
const x = (v: number) => PAD + v * (W - PAD * 2);

export function TeacherResultFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useOnceInView(ref);
  const [hover, setHover] = useState<null | typeof BEFORE>(null);

  return (
    <div ref={ref} className="relative px-3 py-5 md:px-6">
      <svg viewBox={`0 0 ${W} 160`} className="w-full" role="img" aria-label="Average success rose from 0.335 to 0.851 at a 2% active-memory budget.">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1="40" y2="104" stroke="#ecebe4" />
            <text x={x(t)} y="128" textAnchor="middle" className="fill-[#6b7067] text-[14px]">
              {t}
            </text>
          </g>
        ))}
        <text x={PAD} y="152" className="fill-[#6b7067] text-[14px]">average success</text>

        <motion.line
          y1="72"
          y2="72"
          stroke="#cfe9d6"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ x1: x(BEFORE.value), x2: x(BEFORE.value) }}
          animate={shown ? { x1: x(BEFORE.value), x2: x(AFTER.value) } : {}}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
        />
        {[BEFORE, AFTER].map((d, i) => (
          <motion.g
            key={d.label}
            initial={{ opacity: i === 0 ? 1 : 0 }}
            animate={shown ? { opacity: 1 } : {}}
            transition={{ delay: i === 0 ? 0 : 1.2 }}
            onMouseEnter={() => setHover(d)}
            onMouseLeave={() => setHover(null)}
            className="cursor-default"
          >
            <circle cx={x(d.value)} cy="72" r="16" fill="transparent" />
            <circle cx={x(d.value)} cy="72" r="8" fill={d.color} stroke="#ffffff" strokeWidth="2" />
            <text x={x(d.value)} y="26" textAnchor="middle" className="fill-[#1c1f1a] text-[20px] font-semibold">
              {d.value.toFixed(3)}
            </text>
            <text x={x(d.value)} y="48" textAnchor="middle" className="fill-[#6b7067] text-[14px]">
              {d.label}
            </text>
          </motion.g>
        ))}
      </svg>
      {hover && (
        <div
          className="pointer-events-none absolute rounded-lg border border-[#dcdbd2] bg-white px-3 py-2 text-[12px] text-[#1c1f1a] shadow-sm"
          style={{ left: `${(x(hover.value) / W) * 100}%`, top: 8, transform: "translateX(-50%)" }}
        >
          <div className="font-semibold">{hover.value.toFixed(3)}</div>
          <div className="text-[#6b7067]">{hover.label} · 2% budget · mean of 3 seeds</div>
        </div>
      )}
    </div>
  );
}
