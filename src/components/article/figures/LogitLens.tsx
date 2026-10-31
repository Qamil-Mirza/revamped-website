"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useStepper } from "./hooks";

const LAYERS = 8;
const layerX = (i: number) => 64 + i * 72;
const STREAM_Y = 84;
const UNEMBED = { x: 250, y: 158, w: 160, h: 34 };
const BARS = 7;
const BAR_W = 26;
const BARS_X = 330 - (BARS * (BAR_W + 8) - 8) / 2;
const BARS_BASE = 300;
const BAR_MAX = 74;
// Schematic only: a flat-ish read-out early on that sharpens onto one token by
// the last layer. These are not measured distributions.
const NOISE = [0.5, 0.62, 0.55, 0.58, 0.44, 0.6, 0.48];
const PEAK = 3;

function readout(layer: number): number[] {
  const s = Math.pow(layer / (LAYERS - 1), 1.6);
  return NOISE.map((n, j) => (1 - s) * n + s * (j === PEAK ? 1 : 0.1));
}

export function LogitLensFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useStepper(ref, LAYERS, 1200, 4);
  const bars = readout(active);
  const top = bars.indexOf(Math.max(...bars));
  const last = active === LAYERS - 1;

  return (
    <div ref={ref} className="px-2 py-4 md:px-6">
      <svg
        viewBox="0 0 660 330"
        className="w-full"
        role="img"
        aria-label="Schematic of the logit lens. The activation at each layer is decoded with the final layer's unembedding; early read-outs are diffuse and later ones concentrate on one token."
      >
        {/* residual stream through the layers */}
        <line x1="24" x2="636" y1={STREAM_Y} y2={STREAM_Y} stroke="#dcdbd2" strokeWidth="2" />
        <path d={`M 628 ${STREAM_Y - 6} L 640 ${STREAM_Y} L 628 ${STREAM_Y + 6}`} fill="none" stroke="#b9b8af" strokeWidth="2" />
        <text x="24" y="28" className="fill-[#6b7067] text-[15px]">layers →</text>

        {Array.from({ length: LAYERS }, (_, i) => (
          <g key={i}>
            <motion.rect
              x={layerX(i) - 20}
              y={STREAM_Y - 34}
              width="40"
              height="68"
              rx="9"
              animate={{ fill: i === active ? "#22c55e" : i < active ? "#dcfce7" : "#f3f2ec", stroke: i === active ? "#15803d" : "#dcdbd2" }}
              transition={{ duration: 0.3 }}
            />
            <text x={layerX(i)} y={STREAM_Y + 56} textAnchor="middle" className="fill-[#6b7067] text-[14px]">
              {i + 1}
            </text>
          </g>
        ))}

        {/* tap the active layer and decode it */}
        <motion.path
          animate={{ d: `M ${layerX(active)} ${STREAM_Y + 36} C ${layerX(active)} 140, 330 120, 330 ${UNEMBED.y}` }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <rect x={UNEMBED.x} y={UNEMBED.y} width={UNEMBED.w} height={UNEMBED.h} rx="10" fill="#1c1f1a" />
        <text x="330" y={UNEMBED.y + 22} textAnchor="middle" className="fill-[#f5f4ee] text-[15px]">
          unembed
        </text>
        <text x={UNEMBED.x + UNEMBED.w + 12} y={UNEMBED.y + 22} className="fill-[#6b7067] text-[13px]">
          (the final layer’s)
        </text>

        {/* vocabulary scores */}
        {bars.map((b, j) => (
          <motion.rect
            key={j}
            x={BARS_X + j * (BAR_W + 8)}
            width={BAR_W}
            rx="4"
            animate={{ attrY: BARS_BASE - b * BAR_MAX, height: b * BAR_MAX, fill: j === top && active >= 3 ? "#22c55e" : "#d9d8cf" }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
          />
        ))}
        <line x1={BARS_X - 8} x2={BARS_X + BARS * (BAR_W + 8)} y1={BARS_BASE} y2={BARS_BASE} stroke="#dcdbd2" />
        <text x={BARS_X - 16} y={BARS_BASE - 30} textAnchor="end" className="fill-[#6b7067] text-[13px]">
          vocabulary
        </text>
        <text x={BARS_X - 16} y={BARS_BASE - 12} textAnchor="end" className="fill-[#6b7067] text-[13px]">
          scores
        </text>
        <text x={BARS_X + BARS * (BAR_W + 8) + 8} y={BARS_BASE - 20} className="fill-[#15803d] text-[14px]">
          {last ? "the model’s prediction" : `read-out at layer ${active + 1}`}
        </text>
      </svg>
    </div>
  );
}
