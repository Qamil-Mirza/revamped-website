"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useStepper } from "./hooks";

const LAYERS = 8;
const STACK_X = 40;
const STACK_W = 150;
const layerY = (i: number) => 236 - i * 26; // layer 0 at the bottom

// Schematic: a read-out point climbs the layer stack. At each layer the logit lens
// decodes the activation as-is; the J-lens first maps it toward the final layer.
export function LensFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useStepper(ref, LAYERS - 2, 1300, 3) + 1;
  const y = layerY(active) + 9;

  return (
    <div ref={ref} className="px-2 py-4 md:px-6">
      <svg viewBox="0 0 640 300" className="w-full" role="img" aria-label="Schematic of a layer stack. At an intermediate layer, the logit lens unembeds the activation directly, while the J-lens first applies a layer-specific Jacobian.">
        <text x={STACK_X + STACK_W / 2} y="276" textAnchor="middle" className="fill-[#6b7067] text-[15px]">prompt in</text>
        <text x={STACK_X + STACK_W / 2} y="18" textAnchor="middle" className="fill-[#6b7067] text-[15px]">next token out</text>
        {Array.from({ length: LAYERS }, (_, i) => (
          <motion.rect
            key={i}
            x={STACK_X}
            y={layerY(i)}
            width={STACK_W}
            height="18"
            rx="5"
            animate={{ fill: i === active ? "#22c55e" : "#ecebe4" }}
            transition={{ duration: 0.3 }}
          />
        ))}
        <text x={STACK_X - 10} y={layerY(active) + 15} textAnchor="end" className="fill-[#15803d] text-[18px]">ℓ</text>

        <motion.g animate={{ y: y - 140 }} transition={{ type: "spring", stiffness: 120, damping: 20 }}>
          <circle cx={STACK_X + STACK_W + 10} cy="140" r="4" fill="#15803d" />
          <path d={`M ${STACK_X + STACK_W + 14} 140 C 260 140, 270 92, 318 92`} fill="none" stroke="#b9b8af" strokeWidth="1.5" />
          <path d={`M ${STACK_X + STACK_W + 14} 140 C 260 140, 270 188, 318 188`} fill="none" stroke="#22c55e" strokeWidth="1.5" />

          <rect x="320" y="70" width="290" height="44" rx="10" fill="#faf9f5" stroke="#dcdbd2" />
          <text x="340" y="99" className="fill-[#1c1f1a] text-[20px] font-semibold">Logit lens</text>

          <rect x="320" y="166" width="290" height="44" rx="10" fill="#f3fbf5" stroke="#9fd9b0" />
          <text x="340" y="195" className="fill-[#15803d] text-[20px] font-semibold">J-lens</text>
        </motion.g>
      </svg>
      <div className="mt-2 grid gap-2 text-[13px] md:grid-cols-2">
        <div className="rounded-lg border border-[#dcdbd2] bg-[#faf9f5] px-3 py-2 text-[#2b2f29]">
          <span className="font-semibold text-[#1c1f1a]">Logit lens:</span>{" "}
          <span className="font-[family-name:var(--font-geist-mono)] text-[12px]">unembed(h)</span>, decode the activation as-is.
        </div>
        <div className="rounded-lg border border-[#9fd9b0] bg-[#f3fbf5] px-3 py-2 text-[#3f443c]">
          <span className="font-semibold text-[#15803d]">J-lens:</span>{" "}
          <span className="font-[family-name:var(--font-geist-mono)] text-[12px]">unembed(Jℓ · h)</span>, map toward the final layer first.
        </div>
      </div>
    </div>
  );
}
