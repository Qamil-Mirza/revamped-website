import type { SpaceNode } from "./types";

/**
 * World-space layout of the navigable nodes. The jet spawns at the origin
 * (0, 0) and the nodes sit on a rough hexagonal ring around it so every facet
 * requires a short flight to reach. Y grows downward (canvas convention).
 */
export const SPACE_NODES: SpaceNode[] = [
  {
    id: "bio",
    label: "Who I Am",
    hint: "The story so far",
    visual: "star",
    position: { x: 0, y: -760 },
    radius: 40,
    color: "rgb(255, 224, 130)",
  },
  {
    id: "education",
    label: "Education",
    hint: "Where I studied",
    visual: "planet",
    position: { x: 700, y: -380 },
    radius: 42,
    color: "rgb(80, 170, 255)",
  },
  {
    id: "experience",
    label: "Experience",
    hint: "Where I've worked",
    visual: "wormhole",
    position: { x: 700, y: 380 },
    radius: 46,
    color: "rgb(165, 110, 255)",
  },
  {
    id: "contact",
    label: "Contact",
    hint: "Let's connect",
    visual: "beacon",
    position: { x: 0, y: 760 },
    radius: 36,
    color: "rgb(64, 255, 148)",
  },
  {
    id: "projects",
    label: "Projects & Research",
    hint: "Things I've built",
    visual: "nebula",
    position: { x: -700, y: 380 },
    radius: 50,
    color: "rgb(255, 105, 180)",
  },
  {
    id: "tech",
    label: "Tech Stack",
    hint: "Tools of the trade",
    visual: "tech",
    position: { x: -700, y: -380 },
    radius: 40,
    color: "rgb(45, 226, 230)",
  },
];

/** Extra distance beyond a node's body within which docking is offered. */
export const DOCK_RANGE = 90;
