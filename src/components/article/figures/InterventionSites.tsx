"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStepper } from "./hooks";

// Schematic network. Which nodes and edges are highlighted is illustrative.
// The point is where each intervention acts and how long it lasts.
const LAYERS = [
  { x: 24, ys: [46, 82, 118] },
  { x: 102, ys: [28, 64, 100, 136] },
  { x: 180, ys: [28, 64, 100, 136] },
  { x: 258, ys: [64, 100] },
];
const STEERED_LAYER = 2;
const isEditedEdge = (layer: number, from: number, to: number) => layer === 1 && (from === 1 || from === 2) && (to === 1 || to === 2);

const INPUTS = [
  { memory: "Maya lives in Leeds.", nudged: true },
  { memory: "Maya’s friend lives in Leeds.", nudged: false },
];

export function InterventionSitesFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const run = useStepper(ref, INPUTS.length, 2800, 0);
  const input = INPUTS[run];

  return (
    <div ref={ref} className="p-4 md:p-6">
      <div className="mb-4 grid gap-1.5 sm:grid-cols-2">
        {INPUTS.map((item, i) => (
          <div
            key={item.memory}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-[13px] transition-colors duration-300",
              i === run ? "border-[#1c1f1a] bg-[#1c1f1a] text-[#f5f4ee]" : "border-[#dcdbd2] bg-white text-[#a3a29a]",
            )}
          >
            {item.memory}
          </div>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        <Panel
          title="Conditional steering"
          note={input.nudged ? "Gate open. Activations nudged, for this run only." : "Gate shut. Activations left alone."}
          weights="unchanged"
        >
          <Network run={run} steered={input.nudged} edited={false} label="Network with one layer of activations nudged during this run" />
        </Panel>
        <Panel title="Weight edit" note="Parameters changed once, so the edit is in place for every input." weights="edited">
          <Network run={run} steered={false} edited label="Network with a group of connections permanently changed" />
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, note, weights, children }: { title: string; note: string; weights: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-[14px] font-semibold text-[#1c1f1a]">{title}</span>
        <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]">
          Weights {weights}
        </span>
      </div>
      {children}
      <div className="mt-1 min-h-[2.6em] text-[12.5px] leading-snug text-[#6b7067]">{note}</div>
    </div>
  );
}

function Network({ run, steered, edited, label }: { run: number; steered: boolean; edited: boolean; label: string }) {
  return (
    <svg viewBox="0 0 282 164" className="block w-full" role="img" aria-label={label}>
      {LAYERS.slice(0, -1).map((layer, l) =>
        layer.ys.map((y1, from) =>
          LAYERS[l + 1].ys.map((y2, to) => {
            const hot = edited && isEditedEdge(l, from, to);
            return (
              <line
                key={`${l}-${from}-${to}`}
                x1={layer.x}
                y1={y1}
                x2={LAYERS[l + 1].x}
                y2={y2}
                stroke={hot ? "#22c55e" : "#dcdbd2"}
                strokeWidth={hot ? 2.5 : 1}
              />
            );
          }),
        ),
      )}
      {LAYERS.map((layer, l) =>
        layer.ys.map((y, n) => (
          // Remounting on each run replays the activity sweeping through the layers.
          <motion.circle
            key={`${run}-${l}-${n}`}
            cx={layer.x}
            cy={y}
            r={8}
            stroke={steered && l === STEERED_LAYER ? "#15803d" : "#9a9990"}
            strokeWidth={1.25}
            initial={{ fill: "#ffffff" }}
            animate={{ fill: steered && l === STEERED_LAYER ? "#22c55e" : "#d9d8cf" }}
            transition={{ duration: 0.3, delay: 0.15 + l * 0.28 }}
          />
        )),
      )}
      <text x={steered ? LAYERS[STEERED_LAYER].x : 141} y={12} textAnchor="middle" className="fill-[#15803d] font-[family-name:var(--font-geist-mono)] text-[10px]">
        {steered ? "push added here" : edited ? "connections edited here" : ""}
      </text>
    </svg>
  );
}
