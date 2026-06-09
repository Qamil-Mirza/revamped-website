"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Home, LayoutGrid, Rocket } from "lucide-react";
import { SPACE_NODES, DOCK_RANGE } from "./nodes";
import type { PanelKey, SpaceNode, Vec2 } from "./types";
import {
  createStarLayers,
  drawAsteroidBelt,
  drawExplosion,
  drawNode,
  drawShip,
  drawStarfield,
  type StarLayer,
} from "./drawing";
import {
  BELT_RADIUS,
  RESPAWN_DELAY,
  WARN_DISTANCE,
  createAsteroids,
  type Asteroid,
} from "./boundary";
import { useGameLoop } from "./useGameLoop";
import { useShipControls } from "./useShipControls";
import NodePanel from "./NodePanel";
import Radar from "./Radar";
import Joystick from "./Joystick";

// Physics tuning (units are world-pixels and seconds).
const TURN_SPEED = 3.0;
const THRUST_ACC = 620;
const BOOST_MULT = 1.8;
const FRICTION = 1.15;
const MAX_SPEED = 470;
const MAX_BOOST_SPEED = 770;

interface ShipState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
}

interface GameRef {
  ship: ShipState;
  trail: Vec2[];
  lastTrail: Vec2;
  time: number;
  hudAccum: number;
  layers: StarLayer[];
  asteroids: Asteroid[];
  width: number;
  height: number;
  dpr: number;
  dockCooldownId: PanelKey | null;
  /** Whether the ship is mid-destruction (controls + docking suspended). */
  dead: boolean;
  /** Seconds elapsed since destruction; drives the explosion + respawn timer. */
  deathTimer: number;
}

interface SpaceSceneProps {
  /** Switches the page to the classic tabbed about layout. */
  onClassicView: () => void;
}

export default function SpaceScene({ onClassicView }: SpaceSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<GameRef>({
    ship: { x: 0, y: 0, vx: 0, vy: 0, angle: -Math.PI / 2 },
    trail: [],
    lastTrail: { x: 0, y: 0 },
    time: 0,
    hudAccum: 0,
    layers: [],
    asteroids: createAsteroids(),
    width: 0,
    height: 0,
    dpr: 1,
    dockCooldownId: null,
    dead: false,
    deathTimer: 0,
  });

  const [activeNode, setActiveNode] = useState<SpaceNode | null>(null);
  const [nearbyNode, setNearbyNode] = useState<SpaceNode | null>(null);
  const [hudShip, setHudShip] = useState({ x: 0, y: 0, angle: -Math.PI / 2 });
  const [isTouch, setIsTouch] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [isDead, setIsDead] = useState(false);
  const [danger, setDanger] = useState(0);
  const dangerRef = useRef(0);

  const activeNodeRef = useRef<SpaceNode | null>(null);
  activeNodeRef.current = activeNode;
  const nearbyRef = useRef<PanelKey | null>(null);

  const { controls, setAim } = useShipControls(activeNode === null);

  const openNode = useCallback((node: SpaceNode) => {
    setActiveNode(node);
    setShowHint(false);
    game.current.dockCooldownId = node.id;
    // Bleed off speed so we don't fly straight back in on close.
    game.current.ship.vx *= 0.1;
    game.current.ship.vy *= 0.1;
  }, []);

  const closeNode = useCallback(() => {
    const node = activeNodeRef.current;
    if (node) {
      // Drift gently away from the node on exit.
      const ship = game.current.ship;
      const dx = ship.x - node.position.x;
      const dy = ship.y - node.position.y;
      const d = Math.hypot(dx, dy) || 1;
      ship.vx = (dx / d) * 120;
      ship.vy = (dy / d) * 120;
    }
    setActiveNode(null);
  }, []);

  // Detect coarse pointer (touch) to decide whether to show the joystick.
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Auto-dismiss the intro hint.
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Press "E" to dock at the node currently in range.
  useEffect(() => {
    if (activeNode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e" && nearbyNode) {
        e.preventDefault();
        openNode(nearbyNode);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeNode, nearbyNode, openNode]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    game.current.width = w;
    game.current.height = h;
    game.current.dpr = dpr;
    game.current.layers = createStarLayers(w, h);
  }, []);

  useEffect(() => {
    setupCanvas();
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupCanvas, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [setupCanvas]);

  const update = useCallback(
    (dt: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const g = game.current;
      const { ship } = g;
      g.time += dt;

      const boost = controls.current.boost;
      let thrustAmount = 0;
      const proximity = new Map<PanelKey, number>();

      if (g.dead) {
        // --- Destruction sequence: hold position, then respawn at origin. ---
        g.deathTimer += dt;
        ship.vx = 0;
        ship.vy = 0;
        if (g.deathTimer >= RESPAWN_DELAY) {
          ship.x = 0;
          ship.y = 0;
          ship.angle = -Math.PI / 2;
          g.trail.length = 0;
          g.lastTrail = { x: 0, y: 0 };
          g.dockCooldownId = null;
          g.dead = false;
          g.deathTimer = 0;
          setIsDead(false);
        }
      } else {
        // --- Steering ---
        const aim = controls.current.aim;
        if (aim && Math.hypot(aim.x, aim.y) > 0.15) {
          // Joystick: steer toward the stick direction, thrust by magnitude.
          const target = Math.atan2(aim.y, aim.x);
          let diff = target - ship.angle;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          const maxStep = TURN_SPEED * 1.4 * dt;
          ship.angle += Math.max(-maxStep, Math.min(maxStep, diff));
          thrustAmount = Math.min(1, Math.hypot(aim.x, aim.y));
        } else {
          // Keyboard: tank-style rotate + forward/back thrust.
          ship.angle += controls.current.turn * TURN_SPEED * dt;
          thrustAmount = controls.current.thrust;
        }

        const accel = THRUST_ACC * (boost ? BOOST_MULT : 1);
        ship.vx += Math.cos(ship.angle) * accel * thrustAmount * dt;
        ship.vy += Math.sin(ship.angle) * accel * thrustAmount * dt;

        // --- Nearest node + proximity damping ---
        let nearest: SpaceNode | null = null;
        let nearestDist = Infinity;
        for (const node of SPACE_NODES) {
          const dx = node.position.x - ship.x;
          const dy = node.position.y - ship.y;
          const dist = Math.hypot(dx, dy);
          const p = Math.max(
            0,
            Math.min(1, 1 - (dist - node.radius) / DOCK_RANGE)
          );
          proximity.set(node.id, p);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = node;
          }
        }

        const nearProx = nearest ? proximity.get(nearest.id) ?? 0 : 0;
        const friction = FRICTION + nearProx * 2.4;
        const damp = Math.max(0, 1 - friction * dt);
        ship.vx *= damp;
        ship.vy *= damp;

        // Clamp speed.
        const speed = Math.hypot(ship.vx, ship.vy);
        const cap = boost ? MAX_BOOST_SPEED : MAX_SPEED;
        if (speed > cap) {
          ship.vx = (ship.vx / speed) * cap;
          ship.vy = (ship.vy / speed) * cap;
        }

        ship.x += ship.vx * dt;
        ship.y += ship.vy * dt;

        // --- Boundary: hitting the belt destroys the ship. ---
        if (Math.hypot(ship.x, ship.y) >= BELT_RADIUS) {
          g.dead = true;
          g.deathTimer = 0;
          ship.vx = 0;
          ship.vy = 0;
          g.trail.length = 0;
          nearbyRef.current = null;
          setNearbyNode(null);
          setIsDead(true);
        } else {
          // --- Trail ---
          const movedFromLast = Math.hypot(
            ship.x - g.lastTrail.x,
            ship.y - g.lastTrail.y
          );
          if (movedFromLast > 7) {
            g.trail.push({ x: ship.x, y: ship.y });
            if (g.trail.length > 22) g.trail.shift();
            g.lastTrail = { x: ship.x, y: ship.y };
          }

          // --- Docking ---
          const inRange = nearest && nearestDist <= nearest.radius + DOCK_RANGE;
          // Clear cooldown once we leave the node's range.
          if (
            g.dockCooldownId &&
            (!inRange || (nearest && nearest.id !== g.dockCooldownId))
          ) {
            g.dockCooldownId = null;
          }
          // Auto-dock when the jet overlaps the node body.
          if (
            nearest &&
            nearestDist <= nearest.radius &&
            g.dockCooldownId !== nearest.id &&
            !activeNodeRef.current
          ) {
            openNode(nearest);
          }

          // Report nearby node to React only on change.
          const reportedId = inRange && nearest ? nearest.id : null;
          if (reportedId !== nearbyRef.current) {
            nearbyRef.current = reportedId;
            setNearbyNode(reportedId ? (nearest as SpaceNode) : null);
          }
        }
      }

      // Danger ramps up across the last stretch before the belt.
      const distFromCenter = Math.hypot(ship.x, ship.y);
      const dangerNow = Math.max(
        0,
        Math.min(1, (distFromCenter - (BELT_RADIUS - WARN_DISTANCE)) / WARN_DISTANCE)
      );

      // --- Draw ---
      const { width: w, height: h } = g;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#05060d";
      ctx.fillRect(0, 0, w, h);

      drawStarfield(ctx, g.layers, ship, g.time);

      const cx = w / 2;
      const cy = h / 2;

      drawAsteroidBelt(ctx, g.asteroids, ship, g.time, w, h, cx, cy);

      for (const node of SPACE_NODES) {
        const sx = cx + (node.position.x - ship.x);
        const sy = cy + (node.position.y - ship.y);
        // Skip nodes well off-screen.
        if (sx < -200 || sx > w + 200 || sy < -200 || sy > h + 200) continue;
        drawNode(ctx, node, sx, sy, g.time, proximity.get(node.id) ?? 0);
      }

      if (g.dead) {
        drawExplosion(ctx, cx, cy, g.deathTimer, RESPAWN_DELAY);
      } else {
        drawShip(
          ctx,
          cx,
          cy,
          ship.angle,
          Math.max(0, thrustAmount),
          boost && thrustAmount > 0,
          g.trail,
          ship
        );
      }

      // --- Throttled HUD update for the radar (~14fps) ---
      g.hudAccum += dt;
      if (g.hudAccum > 0.07) {
        g.hudAccum = 0;
        setHudShip({ x: ship.x, y: ship.y, angle: ship.angle });
        if (Math.abs(dangerNow - dangerRef.current) > 0.02) {
          dangerRef.current = dangerNow;
          setDanger(dangerNow);
        }
      }
    },
    [controls, openNode]
  );

  useGameLoop(update, activeNode === null);

  const dockPrompt = nearbyNode && !activeNode;

  return (
    <div className="dark fixed inset-0 z-0 overflow-hidden bg-[#05060d]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Boundary-proximity warning glow on the screen edge. */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: danger,
          background:
            "radial-gradient(circle at center, transparent 50%, rgba(255,40,40,0.45) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Destruction / respawn overlay */}
      <AnimatePresence>
        {isDead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            role="status"
            aria-live="assertive"
          >
            <div className="rounded-2xl border border-red-500/40 bg-black/60 px-6 py-4 text-center backdrop-blur-md">
              <div className="text-base font-bold uppercase tracking-[0.3em] text-red-400">
                Ship Destroyed
              </div>
              <p className="mt-1 text-xs tracking-wide text-red-200/70">
                Reinitializing at origin...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-left controls */}
      <div className="absolute left-4 top-4 z-30 flex items-center gap-2 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <button
          onClick={onClassicView}
          className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Classic view
        </button>
      </div>

      <Radar
        ship={hudShip}
        nodes={SPACE_NODES}
        nearbyId={nearbyRef.current}
        danger={danger}
      />

      {/* Intro hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-none absolute left-1/2 top-24 z-30 -translate-x-1/2 text-center"
          >
            <div className="rounded-2xl border border-white/15 bg-black/50 px-5 py-3 backdrop-blur-md">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white">
                <Rocket className="h-4 w-4 text-[#19b5fe]" />
                {isTouch ? "Use the joystick to fly" : "W A S D / arrows to fly"}
              </div>
              <p className="mt-1 text-xs text-blue-200/70">
                Fly into a glowing node to explore that part of who I am
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock prompt */}
      <AnimatePresence>
        {dockPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
          >
            <button
              onClick={() => nearbyNode && openNode(nearbyNode)}
              className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-transform hover:scale-105"
              style={{
                borderColor: nearbyNode!.color,
                background: `${nearbyNode!.color.replace("rgb", "rgba").replace(")", ", 0.18)")}`,
                boxShadow: `0 0 24px -6px ${nearbyNode!.color}`,
              }}
            >
              <span
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ background: nearbyNode!.color }}
              />
              Dock at {nearbyNode!.label}
              {!isTouch && (
                <kbd className="ml-1 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-bold">
                  E
                </kbd>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isTouch && <Joystick onChange={setAim} />}

      <NodePanel node={activeNode} onClose={closeNode} />
    </div>
  );
}
