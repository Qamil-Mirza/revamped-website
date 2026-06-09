import type { SpaceNode, Vec2 } from "./types";
import type { Asteroid } from "./boundary";
import { BELT_RADIUS, BELT_THICKNESS } from "./boundary";

/** Warp palette carried over from the hyperspace jump for visual continuity. */
export const WARP_PALETTE = [
  "rgb(197, 239, 247)",
  "rgb(25, 181, 254)",
  "rgb(77, 5, 232)",
  "rgb(165, 55, 253)",
  "rgb(255, 255, 255)",
];

export interface StarLayer {
  factor: number;
  stars: { x: number; y: number; size: number; color: string; alpha: number }[];
  tileW: number;
  tileH: number;
}

/** Turn an `rgb(r, g, b)` string into `rgba(r, g, b, a)`. */
export function rgba(rgb: string, alpha: number): string {
  const inner = rgb.slice(rgb.indexOf("(") + 1, rgb.indexOf(")"));
  return `rgba(${inner}, ${alpha})`;
}

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

/** Positive modulo so star wrapping works for negative camera offsets. */
const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Build three parallax layers sized to the viewport. Each layer tiles exactly
 * one screen, so wrapping the star positions against the camera offset yields a
 * seamless, infinite starfield.
 */
export function createStarLayers(width: number, height: number): StarLayer[] {
  const area = width * height;
  const defs = [
    { factor: 0.15, density: 9000, size: [0.5, 1.2], bright: 0.5, tint: 0.05 },
    { factor: 0.4, density: 14000, size: [0.8, 1.8], bright: 0.7, tint: 0.18 },
    { factor: 0.85, density: 26000, size: [1.2, 2.6], bright: 0.95, tint: 0.4 },
  ];

  return defs.map((def) => {
    const count = Math.max(24, Math.round(area / def.density));
    const stars = new Array(count).fill(null).map(() => {
      const tinted = Math.random() < def.tint;
      const color = tinted
        ? WARP_PALETTE[Math.floor(Math.random() * WARP_PALETTE.length)]
        : "rgb(255, 255, 255)";
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: randomInRange(def.size[0], def.size[1]),
        color,
        alpha: randomInRange(def.bright * 0.4, def.bright),
      };
    });
    return { factor: def.factor, stars, tileW: width, tileH: height };
  });
}

export function drawStarfield(
  ctx: CanvasRenderingContext2D,
  layers: StarLayer[],
  camera: Vec2,
  time: number,
  /** 0 = calm dots, 1 = full hyperspace streaks radiating from center. */
  warp = 0
) {
  const warping = warp > 0.01;
  if (warping) ctx.lineCap = "round";

  for (const layer of layers) {
    const cx = layer.tileW / 2;
    const cy = layer.tileH / 2;
    for (const star of layer.stars) {
      const x = mod(star.x - camera.x * layer.factor, layer.tileW);
      const y = mod(star.y - camera.y * layer.factor, layer.tileH);

      if (warping) {
        // Streak radially outward from the vanishing point at screen center;
        // outer/faster layers and farther stars get longer tails.
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const len = warp * (dist * 0.55 + 22) * (0.5 + layer.factor);
        ctx.strokeStyle = rgba(star.color, Math.min(1, star.alpha + warp * 0.5));
        ctx.lineWidth = star.size * (1 + warp * 0.8);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (dx / dist) * len, y + (dy / dist) * len);
        ctx.stroke();
        continue;
      }

      // Gentle twinkle on the brightest layer only.
      const twinkle =
        layer.factor > 0.8
          ? 0.75 + 0.25 * Math.sin(time * 2 + star.x + star.y)
          : 1;
      ctx.beginPath();
      ctx.fillStyle = rgba(star.color, star.alpha * twinkle);
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Draw a node glyph centered at (sx, sy). `proximity` (0..1) brightens the body
 * and reveals the docking ring as the jet approaches.
 */
export function drawNode(
  ctx: CanvasRenderingContext2D,
  node: SpaceNode,
  sx: number,
  sy: number,
  time: number,
  proximity: number
) {
  ctx.save();
  ctx.translate(sx, sy);
  const r = node.radius;
  const pulse = 0.85 + 0.15 * Math.sin(time * 1.6 + node.position.x);

  // Outer glow shared by every node type.
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.6);
  glow.addColorStop(0, rgba(node.color, 0.35 + proximity * 0.25));
  glow.addColorStop(1, rgba(node.color, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, r * 2.6, 0, Math.PI * 2);
  ctx.fill();

  switch (node.visual) {
    case "star":
      drawStarGlyph(ctx, r * pulse, node.color, time);
      break;
    case "planet":
      drawPlanetGlyph(ctx, r, node.color, time);
      break;
    case "wormhole":
      drawWormholeGlyph(ctx, r, node.color, time);
      break;
    case "tech":
      drawTechGlyph(ctx, r, node.color, time);
      break;
    case "nebula":
      drawNebulaGlyph(ctx, r, node.color, time);
      break;
    case "beacon":
      drawBeaconGlyph(ctx, r, node.color, time);
      break;
  }

  // Docking ring when in range.
  if (proximity > 0) {
    ctx.strokeStyle = rgba(node.color, 0.4 + proximity * 0.5);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 8]);
    ctx.lineDashOffset = -time * 30;
    ctx.beginPath();
    ctx.arc(0, 0, r + 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();

  // Label sits just below the glyph, in screen space.
  ctx.save();
  ctx.font =
    "600 13px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = rgba("rgb(255, 255, 255)", 0.55 + proximity * 0.45);
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.shadowBlur = 6;
  ctx.fillText(node.label.toUpperCase(), sx, sy + r + 18);
  ctx.restore();
}

function drawStarGlyph(
  ctx: CanvasRenderingContext2D,
  r: number,
  color: string,
  time: number
) {
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  core.addColorStop(0, "rgba(255,255,255,1)");
  core.addColorStop(0.5, rgba(color, 0.95));
  core.addColorStop(1, rgba(color, 0.2));
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Four-point sparkle.
  ctx.save();
  ctx.rotate(time * 0.2);
  ctx.strokeStyle = rgba(color, 0.8);
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r * 1.9);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlanetGlyph(
  ctx: CanvasRenderingContext2D,
  r: number,
  color: string,
  time: number
) {
  const body = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  body.addColorStop(0, rgba(color, 1));
  body.addColorStop(1, rgba(color, 0.35));
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.rotate(-0.5 + Math.sin(time * 0.3) * 0.05);
  ctx.strokeStyle = rgba(color, 0.85);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.7, r * 0.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawWormholeGlyph(
  ctx: CanvasRenderingContext2D,
  r: number,
  color: string,
  time: number
) {
  for (let i = 0; i < 5; i++) {
    const t = i / 5;
    ctx.save();
    ctx.rotate(time * (0.6 + t) + i);
    ctx.strokeStyle = rgba(color, 0.7 - t * 0.5);
    ctx.lineWidth = 3 - t * 1.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * (1 - t * 0.8), r * (0.5 - t * 0.35), 0, 0, Math.PI * 1.6);
    ctx.stroke();
    ctx.restore();
  }
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
  core.addColorStop(0, "rgba(255,255,255,0.9)");
  core.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawTechGlyph(
  ctx: CanvasRenderingContext2D,
  r: number,
  color: string,
  time: number
) {
  ctx.save();
  ctx.rotate(time * 0.4);
  ctx.strokeStyle = rgba(color, 0.9);
  ctx.fillStyle = rgba(color, 0.18);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Orbiting satellites.
  for (let i = 0; i < 3; i++) {
    const a = time * 1.2 + (i / 3) * Math.PI * 2;
    const px = Math.cos(a) * r * 1.7;
    const py = Math.sin(a) * r * 1.7;
    ctx.fillStyle = rgba(color, 0.95);
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNebulaGlyph(
  ctx: CanvasRenderingContext2D,
  r: number,
  color: string,
  time: number
) {
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + time * 0.15;
    const dist = r * (0.4 + (i % 3) * 0.25);
    const px = Math.cos(a) * dist;
    const py = Math.sin(a) * dist;
    const blobR = r * (0.5 + (i % 2) * 0.3);
    const g = ctx.createRadialGradient(px, py, 0, px, py, blobR);
    g.addColorStop(0, rgba(color, 0.45));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, blobR, 0, Math.PI * 2);
    ctx.fill();
  }
  // Scattered "asteroid" points.
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const px = Math.cos(a) * r * 0.8;
    const py = Math.sin(a) * r * 0.8;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(px, py, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBeaconGlyph(
  ctx: CanvasRenderingContext2D,
  r: number,
  color: string,
  time: number
) {
  // Expanding signal rings.
  for (let i = 0; i < 3; i++) {
    const phase = (time * 0.6 + i / 3) % 1;
    ctx.strokeStyle = rgba(color, (1 - phase) * 0.7);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r * (0.6 + phase * 1.6), 0, Math.PI * 2);
    ctx.stroke();
  }
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.7);
  core.addColorStop(0, "rgba(255,255,255,1)");
  core.addColorStop(1, rgba(color, 0.2));
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw the jet at the screen center, rotated to `angle`. The engine trail is a
 * list of recent world positions converted to screen space relative to the
 * camera, fading from newest to oldest.
 */
export function drawShip(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  angle: number,
  thrustAmount: number,
  boosting: boolean,
  trail: Vec2[],
  camera: Vec2
) {
  // Engine trail (oldest first).
  if (trail.length > 1) {
    for (let i = 1; i < trail.length; i++) {
      const a = i / trail.length;
      const p0 = trail[i - 1];
      const p1 = trail[i];
      ctx.strokeStyle = boosting
        ? `rgba(165, 55, 253, ${a * 0.5})`
        : `rgba(25, 181, 254, ${a * 0.4})`;
      ctx.lineWidth = a * 4;
      ctx.beginPath();
      ctx.moveTo(centerX + (p0.x - camera.x), centerY + (p0.y - camera.y));
      ctx.lineTo(centerX + (p1.x - camera.x), centerY + (p1.y - camera.y));
      ctx.stroke();
    }
  }

  ctx.save();
  ctx.translate(centerX, centerY);
  // Sprite is drawn pointing up; rotate so "up" aligns with the heading angle.
  ctx.rotate(angle + Math.PI / 2);

  // Engine flame, scaled by current thrust.
  if (thrustAmount > 0.01) {
    const flameLen = 14 + thrustAmount * (boosting ? 36 : 20);
    const flame = ctx.createLinearGradient(0, 8, 0, 8 + flameLen);
    flame.addColorStop(0, boosting ? "rgba(255,255,255,0.95)" : "rgba(150,220,255,0.9)");
    flame.addColorStop(1, boosting ? "rgba(165,55,253,0)" : "rgba(25,181,254,0)");
    ctx.fillStyle = flame;
    ctx.beginPath();
    ctx.moveTo(-5, 8);
    ctx.lineTo(5, 8);
    ctx.lineTo(0, 8 + flameLen);
    ctx.closePath();
    ctx.fill();
  }

  // Hull (X-wing-ish silhouette).
  ctx.fillStyle = "rgba(235, 245, 255, 0.95)";
  ctx.strokeStyle = "rgba(25, 181, 254, 0.9)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(10, 10);
  ctx.lineTo(3, 6);
  ctx.lineTo(0, 12);
  ctx.lineTo(-3, 6);
  ctx.lineTo(-10, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cockpit glint.
  ctx.fillStyle = "rgba(25, 181, 254, 0.9)";
  ctx.beginPath();
  ctx.arc(0, -4, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw the asteroid belt that walls off the arena. Rocks are world-space
 * objects converted to screen space relative to the camera; only those on
 * screen are drawn. A faint dusty band sits behind them for cohesion.
 */
export function drawAsteroidBelt(
  ctx: CanvasRenderingContext2D,
  asteroids: Asteroid[],
  camera: Vec2,
  time: number,
  width: number,
  height: number,
  centerX: number,
  centerY: number
) {
  // Dusty band behind the rocks (only worth drawing when near the edge).
  const camDist = Math.hypot(camera.x, camera.y);
  if (camDist > BELT_RADIUS - Math.max(width, height)) {
    const bx = centerX - camera.x;
    const by = centerY - camera.y;
    const inner = BELT_RADIUS - 30;
    const outer = BELT_RADIUS + BELT_THICKNESS + 40;
    const band = ctx.createRadialGradient(bx, by, inner, bx, by, outer);
    band.addColorStop(0, "rgba(120, 110, 130, 0)");
    band.addColorStop(0.5, "rgba(120, 110, 130, 0.12)");
    band.addColorStop(1, "rgba(120, 110, 130, 0)");
    ctx.save();
    ctx.fillStyle = band;
    ctx.beginPath();
    ctx.arc(bx, by, outer, 0, Math.PI * 2);
    ctx.arc(bx, by, inner, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
  }

  for (const rock of asteroids) {
    const sx = centerX + (rock.x - camera.x);
    const sy = centerY + (rock.y - camera.y);
    const margin = rock.size + 8;
    if (
      sx < -margin ||
      sx > width + margin ||
      sy < -margin ||
      sy > height + margin
    )
      continue;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rock.phase + time * rock.spin);

    const g = Math.round(110 + rock.shade * 90);
    ctx.fillStyle = `rgb(${g}, ${g - 8}, ${g + 6})`;
    ctx.strokeStyle = `rgba(${g + 40}, ${g + 30}, ${g + 50}, 0.6)`;
    ctx.lineWidth = 1;

    const n = rock.verts.length;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = rock.size * rock.verts[i];
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tiny crater highlight for a hint of form.
    ctx.fillStyle = `rgba(${g + 30}, ${g + 24}, ${g + 36}, 0.5)`;
    ctx.beginPath();
    ctx.arc(-rock.size * 0.25, -rock.size * 0.25, rock.size * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

/** Deterministic spray directions for explosion debris. */
const EXPLOSION_DIRS = new Array(22).fill(0).map((_, i) => {
  const a = (i / 22) * Math.PI * 2 + (i % 3) * 0.4;
  const speed = 160 + ((i * 53) % 140);
  return { dx: Math.cos(a) * speed, dy: Math.sin(a) * speed };
});

/**
 * Draw the ship destruction burst at (cx, cy). `t` is seconds since the ship
 * was destroyed; `duration` controls the fade. Combines a white flash, an
 * expanding shock ring, and outward-flying debris.
 */
export function drawExplosion(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  duration: number
) {
  const p = Math.min(1, t / duration);
  const fade = 1 - p;

  // Initial white flash.
  if (p < 0.35) {
    const f = 1 - p / 0.35;
    const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70 + p * 120);
    flash.addColorStop(0, `rgba(255,255,255,${0.9 * f})`);
    flash.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = flash;
    ctx.beginPath();
    ctx.arc(cx, cy, 70 + p * 120, 0, Math.PI * 2);
    ctx.fill();
  }

  // Expanding shock ring.
  const ringR = 20 + p * 150;
  ctx.strokeStyle = `rgba(255, 170, 90, ${fade * 0.8})`;
  ctx.lineWidth = 3 * fade + 0.5;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Debris.
  for (const d of EXPLOSION_DIRS) {
    const px = cx + d.dx * p;
    const py = cy + d.dy * p;
    ctx.fillStyle = `rgba(255, ${Math.round(150 + fade * 90)}, 80, ${fade})`;
    ctx.beginPath();
    ctx.arc(px, py, 2.4 * fade + 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
}
