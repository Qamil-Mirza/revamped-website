"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { PanelKey, SpaceNode } from "./types";
import { TERMINAL_PANELS } from "./panels/terminal";
import { BootSequence } from "./terminal/crt";

interface NodePanelProps {
  node: SpaceNode | null;
  onClose: () => void;
}

const MONO = "font-[family-name:var(--font-geist-mono)]";

/** Short typed boot lines shown before each node's content streams in. */
const BOOT_LINES: Record<PanelKey, string[]> = {
  bio: ["INITIATING UPLINK...", "RESOLVING IDENTITY", "ACCESS GRANTED"],
  education: ["INITIATING UPLINK...", "READING EDUCATION.TXT", "ACCESS GRANTED"],
  experience: ["INITIATING UPLINK...", "READING EXPERIENCE.LOG", "ACCESS GRANTED"],
  tech: ["INITIATING UPLINK...", "QUERYING PACKAGE DATABASE", "ALL SYSTEMS NOMINAL"],
  projects: ["INITIATING UPLINK...", "SCANNING ~/PROJECTS", "ACCESS GRANTED"],
  contact: ["INITIATING UPLINK...", "READING CONTACT.TXT", "CHANNELS LIVE"],
};

/**
 * Holographic CRT terminal overlay that streams a node's content over the
 * dimmed space scene. Closes on Esc, backdrop click, or the close button, and
 * traps focus while open. The phosphor color is set per-node via --phosphor.
 */
export default function NodePanel({ node, onClose }: NodePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!node) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("button, a[href]")?.focus();
    });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
      previouslyFocused.current?.focus?.();
    };
  }, [node, onClose]);

  const Content = node ? TERMINAL_PANELS[node.id] : null;

  return (
    <AnimatePresence>
      {node && Content && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop kept light so the frozen starfield glows through. */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={node.label}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="crt-scanlines crt-glare crt-flicker crt-border-strong relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border"
            style={
              {
                "--phosphor": node.color,
                background:
                  "linear-gradient(180deg, rgba(6,10,9,0.92) 0%, rgba(3,6,8,0.94) 100%)",
                boxShadow: `0 0 2px ${node.color}, 0 0 40px -8px ${node.color}, inset 0 0 60px -30px ${node.color}`,
              } as CSSProperties
            }
          >
            {/* Header / window bar */}
            <div className="crt-border relative z-[3] flex items-center justify-between border-b px-4 py-2.5">
              <div
                className={`crt-text ${MONO} flex items-center gap-2 text-xs uppercase tracking-[0.22em]`}
              >
                <span
                  className="inline-block h-2 w-2 animate-pulse rounded-full"
                  style={{ background: node.color }}
                  aria-hidden="true"
                />
                {node.label}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`crt-text ${MONO} hidden text-[10px] opacity-60 sm:inline`}
                >
                  LINK ESTABLISHED
                </span>
                <button
                  onClick={onClose}
                  aria-label="Close terminal and return to cockpit"
                  className={`crt-text ${MONO} text-xs opacity-70 transition-opacity hover:opacity-100`}
                >
                  [ X ]
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="relative z-[3] overflow-y-auto px-5 py-5">
              <BootSequence lines={BOOT_LINES[node.id]}>
                <Content />
              </BootSequence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
