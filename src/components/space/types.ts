export type Vec2 = { x: number; y: number };

/** Visual archetype used to draw a node on the canvas. */
export type NodeVisual =
  | "star"
  | "planet"
  | "wormhole"
  | "tech"
  | "nebula"
  | "beacon";

/** Identifier for the content panel a node opens. */
export type PanelKey =
  | "bio"
  | "education"
  | "experience"
  | "tech"
  | "projects"
  | "contact";

export interface SpaceNode {
  id: PanelKey;
  /** Short label rendered under the node and in the radar. */
  label: string;
  /** One-line hint shown in the dock prompt. */
  hint: string;
  visual: NodeVisual;
  /** Fixed world-space position (origin is the jet spawn point). */
  position: Vec2;
  /** Visual radius of the node body in world units. */
  radius: number;
  /** Primary accent color (CSS rgb string). */
  color: string;
}

/** Shared control intent written by keyboard + joystick, read by the game loop. */
export interface ShipControls {
  /** -1 (left) .. 1 (right) rotation intent for keyboard tank-style steering. */
  turn: number;
  /** -1 (reverse) .. 1 (forward) thrust intent for keyboard steering. */
  thrust: number;
  /** Absolute aim vector (e.g. from a joystick); null when not aiming. */
  aim: Vec2 | null;
  /** Whether the boost key/button is held. */
  boost: boolean;
}
