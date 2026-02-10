"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import HoloTooltip from "./holo-tooltip";

// Types
interface StarState {
  alpha: number;
  angle: number;
  iX?: number;
  iY?: number;
  active: boolean;
  x: number;
  vX: number;
  y: number;
  vY: number;
  size: number;
  iVX?: number;
  iVY?: number;
}

interface AppState {
  stars: Star[];
  bgAlpha: number;
  sizeInc: number;
  velocity: number;
  jumping?: boolean;
  initiating?: boolean;
  initiateTimestamp?: number;
}

// Constants
const ACTIVE_PROBABILITY = 0;
const BASE_SIZE = 1;
const VELOCITY_INC = 1.01;
const VELOCITY_INIT_INC = 1.025;
const JUMP_VELOCITY_INC = 1.25;
const JUMP_SIZE_INC = 1.15;
const SIZE_INC = 1.01;
const RAD = Math.PI / 180;
const WARP_COLORS: [number, number, number][] = [
  [197, 239, 247],
  [25, 181, 254],
  [77, 5, 232],
  [165, 55, 253],
  [255, 255, 255],
];

/**
 * Utility function for returning a random integer in a given range
 */
const randomInRange = (max: number, min: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Simple tween utility to replace TweenMax
 */
const animateValue = (
  obj: any,
  prop: string,
  target: number,
  duration: number,
  onComplete?: () => void
) => {
  const start = obj[prop];
  const change = target - start;
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);

    // Easing function (ease out)
    const easeOut = 1 - Math.pow(1 - progress, 3);

    obj[prop] = start + change * easeOut;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  };

  requestAnimationFrame(animate);
};

/**
 * Class for storing the particle metadata
 */
class Star {
  STATE: StarState;

  constructor() {
    this.STATE = {
      alpha: Math.random(),
      angle: randomInRange(0, 360) * RAD,
      active: false,
      x: 0,
      vX: 0,
      y: 0,
      vY: 0,
      size: BASE_SIZE,
    };
    this.reset();
  }

  reset = () => {
    // Don't reset if window is not available (SSR)
    if (typeof window === 'undefined') return;

    const angle = randomInRange(0, 360) * (Math.PI / 180);
    const vX = Math.cos(angle);
    const vY = Math.sin(angle);
    const travelled =
      Math.random() > 0.5
        ? Math.random() * Math.max(window.innerWidth, window.innerHeight) +
          Math.random() * (window.innerWidth * 0.24)
        : Math.random() * (window.innerWidth * 0.25);

    this.STATE = {
      ...this.STATE,
      iX: undefined,
      iY: undefined,
      active: travelled ? true : false,
      x: Math.floor(vX * travelled) + window.innerWidth / 2,
      vX,
      y: Math.floor(vY * travelled) + window.innerHeight / 2,
      vY,
      size: BASE_SIZE,
    };
  };
}

const generateStarPool = (size: number): Star[] =>
  new Array(size).fill(null).map(() => new Star());

interface HyperspaceJumpProps {
  pageUrl?: string;
}

const HyperspaceJump: React.FC<HyperspaceJumpProps> = ({ pageUrl }) => {
  const router = useRouter();

  // STATES
  const [showTooltip, setShowTooltip] = React.useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<AppState>({
    stars: [], // Initialize empty, will be populated on mount
    bgAlpha: 0,
    sizeInc: SIZE_INC,
    velocity: VELOCITY_INC,
  });
  const animationRef = useRef<number | null>(null);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  }, []);

  // Initialize stars on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      stateRef.current.stars = generateStarPool(300);
    }
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { bgAlpha, velocity, sizeInc, initiating, jumping, stars } =
      stateRef.current;

    // Clear the canvas
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (bgAlpha > 0) {
      context.fillStyle = `rgba(31, 58, 157, ${bgAlpha})`;
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    // Add new star
    const nonActive = stars.filter((s) => !s.STATE.active);
    if (!initiating && nonActive.length > 0) {
      nonActive[0].STATE.active = true;
    }

    // Update and draw stars
    for (const star of stars.filter((s) => s.STATE.active)) {
      const { active, x, y, iX, iY, iVX, iVY, size, vX, vY } = star.STATE;

      // Check if star needs deactivating
      if (
        ((iX || x) < 0 ||
          (iX || x) > window.innerWidth ||
          (iY || y) < 0 ||
          (iY || y) > window.innerHeight) &&
        active &&
        !initiating
      ) {
        star.reset();
      } else if (active) {
        const newIX = initiating ? iX : (iX || 0) + (iVX || 0);
        const newIY = initiating ? iY : (iY || 0) + (iVY || 0);
        const newX = x + vX;
        const newY = y + vY;

        // Check if it overtakes the original line
        const caught =
          (newIX !== undefined &&
            ((vX < 0 && newIX < x) || (vX > 0 && newIX > x))) ||
          (newIY !== undefined &&
            ((vY < 0 && newIY < y) || (vY > 0 && newIY > y)));

        star.STATE = {
          ...star.STATE,
          iX: caught ? undefined : newIX,
          iY: caught ? undefined : newIY,
          iVX: caught ? undefined : (iVX || 0) * VELOCITY_INIT_INC,
          iVY: caught ? undefined : (iVY || 0) * VELOCITY_INIT_INC,
          x: newX,
          vX: star.STATE.vX * velocity,
          y: newY,
          vY: star.STATE.vY * velocity,
          size: initiating ? size : size * (iX || iY ? SIZE_INC : sizeInc),
        };

        let color = `rgba(255, 255, 255, ${star.STATE.alpha})`;
        if (jumping) {
          const [r, g, b] =
            WARP_COLORS[randomInRange(WARP_COLORS.length - 1, 0)];
          color = `rgba(${r}, ${g}, ${b}, ${star.STATE.alpha})`;
        }

        context.strokeStyle = color;
        context.lineWidth = size;
        context.beginPath();
        context.moveTo(star.STATE.iX || x, star.STATE.iY || y);
        context.lineTo(star.STATE.x, star.STATE.y);
        context.stroke();
      }
    }

    animationRef.current = requestAnimationFrame(render);
  }, []);

  const initiate = useCallback(() => {
    if (stateRef.current.jumping || stateRef.current.initiating) return;

    // Hide tooltip when user starts interacting
    setShowTooltip(false);

    stateRef.current = {
      ...stateRef.current,
      initiating: true,
      initiateTimestamp: Date.now(),
    };

    animateValue(stateRef.current, "velocity", VELOCITY_INIT_INC, 0.25);
    animateValue(stateRef.current, "bgAlpha", 0.3, 0.25);

    // Stop XY origin from moving
    for (const star of stateRef.current.stars.filter((s) => s.STATE.active)) {
      star.STATE = {
        ...star.STATE,
        iX: star.STATE.x,
        iY: star.STATE.y,
        iVX: star.STATE.vX,
        iVY: star.STATE.vY,
      };
    }
  }, []);

  const jump = useCallback(() => {
    stateRef.current = {
      ...stateRef.current,
      bgAlpha: 0,
      jumping: true,
    };

    animateValue(stateRef.current, "velocity", JUMP_VELOCITY_INC, 0.25);
    animateValue(stateRef.current, "bgAlpha", 0.75, 0.25);
    animateValue(stateRef.current, "sizeInc", JUMP_SIZE_INC, 0.25);

    setTimeout(() => {
      stateRef.current = {
        ...stateRef.current,
        jumping: false,
      };
      animateValue(stateRef.current, "bgAlpha", 0, 0.25);
      animateValue(stateRef.current, "velocity", VELOCITY_INC, 0.25);
      animateValue(stateRef.current, "sizeInc", SIZE_INC, 0.25);

      setTimeout(() => {
        router.push(pageUrl || "/hyperspace");
      }, 500);
    }, 2500);
  }, [pageUrl, router]);

  const enter = useCallback(() => {
    if (stateRef.current.jumping) return;

    const { initiateTimestamp } = stateRef.current;
    stateRef.current = {
      ...stateRef.current,
      initiating: false,
      initiateTimestamp: undefined,
    };

    if (initiateTimestamp && Date.now() - initiateTimestamp > 600) {
      jump();
    } else {
      animateValue(stateRef.current, "velocity", VELOCITY_INC, 0.25);
      animateValue(stateRef.current, "bgAlpha", 0, 0.25);
    }
  }, [jump]);

  const reset = useCallback(() => {
    stateRef.current = {
      ...stateRef.current,
      stars: generateStarPool(300),
    };
    setupCanvas();
  }, [setupCanvas]);

  useEffect(() => {
    setupCanvas();
    render();

    const handleResize = () => {
      reset();
    };

    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [render, reset, setupCanvas]);

  return (
    <div
      style={{
        background: "radial-gradient(#000, #111), #000",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
      className="relative fixed inset-0 z-50"
    >
      {showTooltip && <HoloTooltip />}
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => {
          // Only trigger on left-click (button 0)
          if (e.button === 0) {
            initiate();
          }
        }}
        onMouseUp={(e) => {
          // Only trigger on left-click (button 0)
          if (e.button === 0) {
            enter();
          }
        }}
        onTouchStart={initiate}
        onTouchEnd={enter}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          position: "fixed",
          height: "100vh",
          width: "100vw",
          cursor: "pointer",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default HyperspaceJump;
