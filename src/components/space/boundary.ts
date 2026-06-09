/**
 * The asteroid belt that walls off the explorable arena. The jet spawns at the
 * world origin (0, 0); the navigable nodes sit within ~850 units of it, so the
 * belt is placed well beyond them. Flying into the belt destroys the ship and
 * triggers a respawn back at the origin.
 */

/** Distance from origin at which the ship hits the belt and is destroyed. */
export const BELT_RADIUS = 1200;
/** Radial thickness of the debris band (purely visual). */
export const BELT_THICKNESS = 150;
/**
 * How far inside the belt the "danger" feedback starts ramping up (red edge
 * glow + radar tint). Not a hard stop — just a heads-up before destruction.
 */
export const WARN_DISTANCE = 260;
/** Seconds the destruction sequence plays before respawning at the origin. */
export const RESPAWN_DELAY = 1.15;

export interface Asteroid {
  /** Fixed world-space position on the ring. */
  x: number;
  y: number;
  /** Base radius of the rock in world units. */
  size: number;
  /** Grey shade 0..1 (multiplied into the rock fill). */
  shade: number;
  /** Radians/second of self-rotation. */
  spin: number;
  /** Initial rotation offset. */
  phase: number;
  /** Per-vertex radial multipliers giving each rock a lumpy silhouette. */
  verts: number[];
}

/** Small deterministic PRNG (mulberry32) so the field is identical every run. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate the belt as a dense ring of irregular rocks. Deterministic so the
 * canvas and the radar always agree and the field doesn't flicker on re-render.
 */
export function createAsteroids(count = 230): Asteroid[] {
  const rand = mulberry32(0x5eed1234);
  const rocks: Asteroid[] = [];
  for (let i = 0; i < count; i++) {
    // Spread roughly evenly around the ring with a little jitter.
    const angle = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.12;
    const dist = BELT_RADIUS + rand() * BELT_THICKNESS;
    const vertCount = 7 + Math.floor(rand() * 4);
    const verts = new Array(vertCount)
      .fill(0)
      .map(() => 0.68 + rand() * 0.32);
    rocks.push({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 4 + rand() * 11,
      shade: 0.4 + rand() * 0.45,
      spin: (rand() - 0.5) * 0.6,
      phase: rand() * Math.PI * 2,
      verts,
    });
  }
  return rocks;
}
