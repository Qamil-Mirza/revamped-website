"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStepper } from "./hooks";

// "LLM brain surgery": Claude, sealed in a sandbox, reads Qwen's activations,
// cuts two attention heads, and re-runs Qwen to watch the answer change.
// A schematic of the loop, cycling through its four beats.

const CLAUDE = "#D97757";
const STEPS = ["Qwen answers", "Claude reads activations", "Claude edits weights", "Qwen answers again"];

// Claude, sitting inside the sandbox on the left.
const C = { x: 112, y: 150 };
// Qwen's 36 layers, stacked bottom (layer 0) to top (layer 35).
const STACK = { x: 366, w: 168, top: 64, bottom: 304 };
const LAYERS = 36;
const HEADS = 16;
const ROW = (STACK.bottom - STACK.top) / LAYERS;
const HEAD_W = STACK.w / HEADS;
const layerY = (l: number) => STACK.bottom - (l + 1) * ROW;
const CUTS = [
  { layer: 33, head: 10 },
  { layer: 32, head: 2 },
];

type Pt = { x: number; y: number };
function along(p0: Pt, c: Pt, p1: Pt, n: number) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    xs.push((1 - t) ** 2 * p0.x + 2 * (1 - t) * t * c.x + t ** 2 * p1.x);
    ys.push((1 - t) ** 2 * p0.y + 2 * (1 - t) * t * c.y + t ** 2 * p1.y);
  }
  return { xs, ys };
}

// Qwen -> Claude: activations flow out of the middle of the stack.
const READ = { from: { x: STACK.x - 6, y: 214 }, ctrl: { x: 270, y: 262 }, to: { x: C.x + 46, y: C.y + 22 } };
// Claude -> Qwen: the scalpel's route into layers 32-33.
const EDIT = { from: { x: C.x + 46, y: C.y - 26 }, ctrl: { x: 262, y: 40 }, to: { x: STACK.x + 2 * HEAD_W, y: layerY(32.5) + ROW / 2 } };
const path = (p: typeof READ) => `M${p.from.x} ${p.from.y} Q${p.ctrl.x} ${p.ctrl.y} ${p.to.x} ${p.to.y}`;

// Twelve tapered rays of uneven length, in Claude's colour.
const RAYS = [40, 30, 37, 27, 41, 31, 35, 28, 39, 30, 36, 26];

// A fixed pattern for the little activation readout, so it never shifts between renders.
// Server and browser trig can differ in the last digit, so round anything SSR'd.
const r2 = (n: number) => Math.round(n * 100) / 100;

const READOUT = Array.from({ length: 36 }, (_, i) => ((i * 37 + 11) % 10) / 10);

export function EditLoopFigure() {
  const ref = useRef<HTMLDivElement>(null);
  // 0: Qwen says unknown. 1: Claude reads activations. 2: Claude cuts. 3: Qwen re-runs.
  const step = useStepper(ref, 4, 2200, 3);
  const reading = step === 1;
  const cut = step >= 2;
  const fixed = step === 3;

  return (
    <div ref={ref} className="p-4 md:p-6">
      <ol className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s} className={cn("flex items-center gap-2 text-[12.5px] transition-colors", i === step ? "text-[#1c1f1a]" : "text-[#9aa096]")}>
            <span
              className={cn(
                "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-geist-mono)] text-[10px] font-semibold transition-colors",
                i === step ? "bg-[#1c1f1a] text-white" : "bg-[#ecebe4] text-[#6b7067]",
              )}
            >
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <svg
        viewBox="0 0 600 380"
        className="w-full"
        role="img"
        aria-label="Claude, inside a sandbox, reads Qwen's activations, cuts two attention heads in layers 32 and 33, and re-runs Qwen. Qwen's answer changes from unknown to York."
      >
        {/* The sandbox */}
        <rect x="20" y="58" width="190" height="262" rx="16" fill="#faf9f5" stroke="#b9b8af" strokeDasharray="5 5" />
        <text x="36" y="80" className="fill-[#6b7067] font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em]">
          sandbox
        </text>

        {/* Claude */}
        <motion.g
          animate={{ rotate: reading || step === 2 ? 30 : 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          {RAYS.map((len, i) => {
            const a = ((i * 30 + (i % 2 ? 9 : 0)) * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={r2(C.x + Math.cos(a) * 7)}
                y1={r2(C.y + Math.sin(a) * 7)}
                x2={r2(C.x + Math.cos(a) * len)}
                y2={r2(C.y + Math.sin(a) * len)}
                stroke={CLAUDE}
                strokeWidth="7.5"
                strokeLinecap="round"
              />
            );
          })}
        </motion.g>
        <text x={C.x} y="214" textAnchor="middle" className="fill-[#1c1f1a] text-[21px] font-semibold">
          Claude
        </text>
        <text x={C.x} y="233" textAnchor="middle" className="fill-[#6b7067] text-[14px]">
          Opus 5.5
        </text>

        {/* What Claude sees: a readout that fills in while it reads */}
        <text x="48" y="262" className="fill-[#6b7067] font-[family-name:var(--font-geist-mono)] text-[9.5px] uppercase tracking-[0.1em]">
          activations
        </text>
        {READOUT.map((v, i) => (
          <motion.rect
            key={i}
            x={48 + (i % 12) * 11}
            y={270 + Math.floor(i / 12) * 11}
            width="9"
            height="9"
            rx="2"
            initial={false}
            animate={{ fill: step >= 1 ? `rgba(21,128,61,${0.15 + v * 0.75})` : "#ecebe4" }}
            transition={{ duration: 0.3, delay: reading ? (i % 12) * 0.06 : 0 }}
          />
        ))}

        {/* The two lines of contact */}
        <path d={path(EDIT)} fill="none" stroke={cut ? CLAUDE : "#dcdbd2"} strokeWidth="1.5" strokeDasharray="4 4" />
        <path d={path(READ)} fill="none" stroke={reading ? "#15803d" : "#dcdbd2"} strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="258" y="38" textAnchor="middle" className="fill-[#1c1f1a] text-[16px] font-semibold">
          edits weights
        </text>
        <text x="270" y="282" textAnchor="middle" className="fill-[#1c1f1a] text-[16px] font-semibold">
          reads activations
        </text>

        {reading &&
          [0, 0.4, 0.8].map((d) => {
            const { xs, ys } = along(READ.from, READ.ctrl, READ.to, 12);
            return (
              <motion.circle
                key={d}
                r="4"
                fill="#15803d"
                initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
                animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.2, delay: d, repeat: Infinity, ease: "linear" }}
              />
            );
          })}

        {step === 2 &&
          (() => {
            const { xs, ys } = along(EDIT.from, EDIT.ctrl, EDIT.to, 12);
            return (
              <motion.g initial={{ x: xs[0], y: ys[0] }} animate={{ x: xs, y: ys }} transition={{ duration: 1.1, ease: "easeInOut" }}>
                <g transform="rotate(32)">
                  <rect x="-30" y="-3.5" width="20" height="7" rx="3" fill="#1c1f1a" />
                  <path d="M-11 -3.5 L5 -1.5 Q11 0 5 2.5 L-11 3.5 Z" fill="#d6d9d2" stroke="#6b7067" strokeWidth="1" />
                </g>
              </motion.g>
            );
          })()}

        {/* Qwen */}
        <rect x={STACK.x} y="16" width={STACK.w} height="32" rx="9" fill={fixed ? "#f3fbf5" : "#1c1f1a"} stroke={fixed ? "#15803d" : "#1c1f1a"} />
        <text x={STACK.x + STACK.w / 2} y="38" textAnchor="middle" className={cn("text-[16px] font-semibold", fixed ? "fill-[#15803d]" : "fill-[#f5f4ee]")}>
          {fixed ? "Answer: York" : step === 0 ? "Answer: unknown" : "…"}
        </text>

        {Array.from({ length: LAYERS }, (_, l) => (
          <rect key={l} x={STACK.x} y={layerY(l) + 0.8} width={STACK.w} height={ROW - 1.6} rx="1.5" fill="#e4e3da" />
        ))}
        {reading && (
          <motion.rect
            x={STACK.x - 3}
            width={STACK.w + 6}
            height="28"
            rx="4"
            fill="#22c55e"
            initial={{ y: STACK.bottom - 28, opacity: 0.3 }}
            animate={{ y: STACK.top, opacity: [0.3, 0.3, 0] }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        )}
        {CUTS.map(({ layer, head }) => (
          <g key={`${layer}-${head}`}>
            <motion.rect
              x={STACK.x + head * HEAD_W + 0.5}
              y={layerY(layer) + 0.3}
              width={HEAD_W - 1}
              height={ROW - 0.6}
              rx="1.5"
              initial={false}
              animate={{ fill: cut ? "#f6c9b6" : "#e4e3da", stroke: cut ? CLAUDE : "rgba(0,0,0,0)" }}
              transition={{ delay: step === 2 ? 1.05 : 0, duration: 0.25 }}
              strokeWidth="2"
            />
            <motion.text
              x={STACK.x + STACK.w + 8}
              y={layerY(layer) + ROW / 2 + (layer === 33 ? -3 : 7)}
              className="fill-[#1c1f1a] font-[family-name:var(--font-geist-mono)] text-[12px] font-semibold"
              initial={false}
              animate={{ opacity: cut ? 1 : 0 }}
              transition={{ delay: step === 2 ? 1.05 : 0 }}
            >
              L{layer} h{head}
            </motion.text>
          </g>
        ))}

        <rect x={STACK.x} y="316" width={STACK.w} height="30" rx="9" fill="#faf9f5" stroke="#dcdbd2" />
        <text x={STACK.x + STACK.w / 2} y="336" textAnchor="middle" className="fill-[#2b2f29] text-[14.5px]">
          Where does Henry live?
        </text>
        <text x={STACK.x + STACK.w / 2} y="370" textAnchor="middle" className="fill-[#6b7067] text-[14px]">
          Qwen 2.5 3B · 36 layers
        </text>
      </svg>
    </div>
  );
}
