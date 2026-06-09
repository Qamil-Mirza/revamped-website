"use client";

import { useRef, useState } from "react";
import type { Vec2 } from "./types";

interface JoystickProps {
  /** Receives a normalized vector (magnitude 0..1) while dragging, null on release. */
  onChange: (vec: Vec2 | null) => void;
}

const BASE = 120;
const KNOB = 52;
const MAX = (BASE - KNOB) / 2;

/** On-screen virtual joystick for steering + thrust on touch devices. */
export default function Joystick({ onChange }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const origin = useRef<Vec2>({ x: 0, y: 0 });
  const [knob, setKnob] = useState<Vec2>({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMove = (clientX: number, clientY: number) => {
    let dx = clientX - origin.current.x;
    let dy = clientY - origin.current.y;
    const dist = Math.hypot(dx, dy);
    if (dist > MAX) {
      dx = (dx / dist) * MAX;
      dy = (dy / dist) * MAX;
    }
    setKnob({ x: dx, y: dy });
    onChange({ x: dx / MAX, y: dy / MAX });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const rect = baseRef.current?.getBoundingClientRect();
    if (!rect) return;
    origin.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    setActive(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!active) return;
    handleMove(e.clientX, e.clientY);
  };

  const reset = () => {
    setActive(false);
    setKnob({ x: 0, y: 0 });
    onChange(null);
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={reset}
      onPointerCancel={reset}
      className="absolute bottom-6 right-6 z-30 touch-none rounded-full border border-white/20 bg-white/5 backdrop-blur-md"
      style={{ width: BASE, height: BASE }}
      aria-label="Steering joystick"
    >
      <div
        className="absolute left-1/2 top-1/2 rounded-full border border-white/30 bg-gradient-to-br from-white/30 to-white/5 shadow-lg transition-transform"
        style={{
          width: KNOB,
          height: KNOB,
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
          transitionDuration: active ? "0ms" : "150ms",
        }}
      />
    </div>
  );
}
