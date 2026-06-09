"use client";

import type { SpaceNode, PanelKey } from "./types";
import { BELT_RADIUS } from "./boundary";

interface RadarProps {
  ship: { x: number; y: number; angle: number };
  nodes: SpaceNode[];
  nearbyId: PanelKey | null;
  /** 0..1 proximity to the asteroid belt; tints the radar red as it rises. */
  danger?: number;
}

const SIZE = 128;
const CENTER = SIZE / 2;
const RING = CENTER - 6;
/** World units mapped to the radar edge (a touch beyond the belt). */
const WORLD_RANGE = 1380;

/** Corner minimap showing node positions, the belt, and the jet's heading. */
export default function Radar({ ship, nodes, nearbyId, danger = 0 }: RadarProps) {
  const scale = RING / WORLD_RANGE;
  // The belt is centered on the world origin, which sits opposite the ship.
  const beltCx = CENTER - ship.x * scale;
  const beltCy = CENTER - ship.y * scale;
  const beltR = BELT_RADIUS * scale;

  return (
    <div className="pointer-events-none absolute right-4 top-4 z-30 select-none sm:right-6 sm:top-6">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="Navigation radar"
      >
        <defs>
          <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(25,181,254,0.12)" />
            <stop offset="100%" stopColor="rgba(8,12,24,0.85)" />
          </radialGradient>
          <clipPath id="radarClip">
            <circle cx={CENTER} cy={CENTER} r={RING} />
          </clipPath>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={RING} fill="url(#radarBg)" />

        {/* Asteroid belt boundary, clipped to the radar face. */}
        <circle
          cx={beltCx}
          cy={beltCy}
          r={beltR}
          fill="none"
          stroke={`rgba(${150 + danger * 90}, ${130 - danger * 90}, ${130 - danger * 90}, ${0.5 + danger * 0.4})`}
          strokeWidth={danger > 0.4 ? 2 : 1.5}
          strokeDasharray="3 4"
          clipPath="url(#radarClip)"
        />

        <circle
          cx={CENTER}
          cy={CENTER}
          r={RING}
          fill="none"
          stroke={`rgba(${120 + danger * 135}, ${200 - danger * 160}, ${255 - danger * 215}, ${0.4 + danger * 0.4})`}
          strokeWidth={1}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RING * 0.55}
          fill="none"
          stroke="rgba(120,200,255,0.18)"
          strokeWidth={1}
        />
        <line
          x1={CENTER}
          y1={CENTER - RING}
          x2={CENTER}
          y2={CENTER + RING}
          stroke="rgba(120,200,255,0.15)"
          strokeWidth={1}
        />
        <line
          x1={CENTER - RING}
          y1={CENTER}
          x2={CENTER + RING}
          y2={CENTER}
          stroke="rgba(120,200,255,0.15)"
          strokeWidth={1}
        />

        {nodes.map((node) => {
          const dx = (node.position.x - ship.x) * scale;
          const dy = (node.position.y - ship.y) * scale;
          const dist = Math.hypot(dx, dy);
          const clamped = dist > RING - 4;
          const k = clamped ? (RING - 4) / dist : 1;
          const px = CENTER + dx * k;
          const py = CENTER + dy * k;
          const isNear = node.id === nearbyId;
          return (
            <circle
              key={node.id}
              cx={px}
              cy={py}
              r={isNear ? 4.5 : 3}
              fill={node.color}
              opacity={clamped ? 0.45 : 1}
            >
              {isNear && (
                <animate
                  attributeName="r"
                  values="3;5.5;3"
                  dur="1s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          );
        })}

        {/* Jet heading marker at center. */}
        <g transform={`rotate(${(ship.angle * 180) / Math.PI + 90} ${CENTER} ${CENTER})`}>
          <path
            d={`M ${CENTER} ${CENTER - 7} L ${CENTER + 5} ${CENTER + 5} L ${CENTER} ${CENTER + 2} L ${CENTER - 5} ${CENTER + 5} Z`}
            fill="rgba(235,245,255,0.95)"
            stroke="rgba(25,181,254,0.9)"
            strokeWidth={0.8}
          />
        </g>
      </svg>
    </div>
  );
}
