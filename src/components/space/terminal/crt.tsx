"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

/* Stagger variants shared by all terminal content so blocks fade in in order. */
export const revealContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const revealItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

/** A single block that participates in the parent stagger reveal. */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={revealItem} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Types a short set of boot/status lines, then swaps to the real content with a
 * staggered fade. Clicking during boot skips ahead; reduced motion shows the
 * content immediately.
 */
export function BootSequence({
  lines,
  children,
}: {
  lines: string[];
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) {
      setShown(lines.length);
      setDone(true);
      return;
    }
    if (shown >= lines.length) {
      const t = setTimeout(() => setDone(true), 260);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), 170);
    return () => clearTimeout(t);
  }, [shown, lines.length, reduce]);

  const skip = () => {
    setShown(lines.length);
    setDone(true);
  };

  if (!done) {
    return (
      <div
        onClick={skip}
        className="crt-text cursor-pointer font-[family-name:var(--font-geist-mono)] text-sm leading-relaxed"
      >
        {lines.slice(0, shown).map((line, i) => (
          <div key={i}>
            <span className="opacity-50">{">"}</span> {line}
          </div>
        ))}
        <span aria-hidden="true">
          <span className="opacity-50">{">"}</span>{" "}
          <span className="crt-cursor">█</span>
        </span>
      </div>
    );
  }

  return (
    <motion.div
      variants={revealContainer}
      initial="hidden"
      animate="show"
      className="font-[family-name:var(--font-geist-mono)]"
    >
      {children}
    </motion.div>
  );
}

/** A shell prompt line, e.g. `visitor@qamil.systems:~$ cat who_i_am.log`. */
export function Prompt({ command }: { command: string }) {
  return (
    <div className="crt-text font-[family-name:var(--font-geist-mono)] text-sm">
      <span className="opacity-60">visitor@qamil.systems:~$</span> {command}
      <span className="crt-cursor"> █</span>
    </div>
  );
}

/** Uppercase, letter-spaced section heading. */
export function THeading({ children }: { children: ReactNode }) {
  return (
    <div className="crt-text font-[family-name:var(--font-geist-mono)] text-xs font-semibold uppercase tracking-[0.28em] opacity-90">
      {children}
    </div>
  );
}

/** Full-width ASCII rule. */
export function TDivider() {
  return (
    <div
      aria-hidden="true"
      className="crt-text select-none overflow-hidden whitespace-nowrap font-[family-name:var(--font-geist-mono)] text-xs opacity-40"
    >
      {"─".repeat(200)}
    </div>
  );
}

/** Bracketed tag chip, e.g. `[ PyTorch ]`. */
export function TTag({ children }: { children: ReactNode }) {
  return (
    <span className="crt-text crt-border inline-block border px-1.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[11px] tracking-wide opacity-90">
      {children}
    </span>
  );
}

/** A `>`-prefixed bullet list. */
export function TList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 font-[family-name:var(--font-geist-mono)] text-sm leading-relaxed">
      {items.map((item, i) => (
        <li key={i} className="crt-text flex gap-2">
          <span className="mt-0.5 select-none opacity-50">{">"}</span>
          <span className="opacity-95">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Field row: `LABEL ... value`, used in record-style readouts. */
export function TField({ label, value }: { label: string; value: string }) {
  return (
    <div className="crt-text flex flex-wrap gap-x-2 font-[family-name:var(--font-geist-mono)] text-sm">
      <span className="opacity-50">{label}:</span>
      <span className="opacity-95">{value}</span>
    </div>
  );
}

/** Portrait with a phosphor duotone + scanline CRT treatment. */
export function CrtImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="crt-scanlines crt-border relative aspect-[4/5] w-full overflow-hidden border">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 320px"
        className="object-cover object-bottom"
        style={{ filter: "grayscale(1) contrast(1.15) brightness(0.85)" }}
      />
      {/* Phosphor tint */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ background: "var(--phosphor, #40ff94)", opacity: 0.4 }}
        aria-hidden="true"
      />
      {/* Darken for contrast with text */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0) 50%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
