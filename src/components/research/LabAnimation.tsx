"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LAB_EXAMPLES,
  runSequence,
  staticFrame,
  type FlowToken,
  type LabFrame,
} from "@/lib/research";
import styles from "./research.module.css";

const LAYERS = [
  { pos: "20%", label: "layer 1" },
  { pos: "35%" },
  { pos: "50%", label: "layer 12" },
  { pos: "65%" },
  { pos: "80%", label: "layer 24" },
];

// Desktop lanes are px from the top of the river; mobile lanes are % from the left.
const LANES_X = [58, 102, 168, 212];
const LANES_Y = ["2%", "24%", "52%", "60%"];
// Falling tokens cover less distance than drifting ones, so space them further apart
// in time or they stack on top of each other.
const STAGGER_Y = 2.2;

const FLOW_X_MS = 4400;
const FLOW_Y_MS = 4200;

const GLOW: Keyframe[] = [
  { offset: 0, background: "#eef8f1", color: "#15803d", boxShadow: "none" },
  { offset: 0.3, background: "#22c55e", color: "#fff", boxShadow: "0 0 18px rgba(34,197,94,.55)" },
  { offset: 0.55, background: "#22c55e", color: "#fff", boxShadow: "0 0 18px rgba(34,197,94,.55)" },
  { offset: 0.8, background: "#ecebe4", color: "#c4c3bb", boxShadow: "none" },
  { offset: 1, background: "#ecebe4", color: "#c4c3bb", boxShadow: "none" },
];

function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}

export function LabAnimation() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const visible = usePageVisible();
  const [frame, setFrame] = useState<LabFrame | null>(null);
  const riverRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"x" | "y">("x");

  orientationRef.current = isDesktop === false ? "y" : "x";

  // Tokens from the old orientation would fly the wrong way, so clear them on switch.
  useEffect(() => {
    riverRef.current?.querySelectorAll("[data-token]").forEach((el) => el.remove());
  }, [isDesktop]);

  useEffect(() => {
    if (reducedMotion === null) return;
    if (reducedMotion) {
      setFrame(staticFrame(LAB_EXAMPLES[0]));
      return;
    }
    if (!visible) return;

    const controller = new AbortController();
    const river = riverRef.current;

    const spawn = (tokens: FlowToken[]) => {
      if (!river) return;
      const horizontal = orientationRef.current === "x";
      for (const token of tokens) {
        const el = document.createElement("span");
        el.dataset.token = "";
        el.className = cn(styles.token, token.kind === "evidence" && styles.tokenEvidence);
        el.textContent = token.text;
        if (horizontal) el.style.top = `${LANES_X[token.lane]}px`;
        else el.style.left = LANES_Y[token.lane];
        river.appendChild(el);

        const duration = horizontal ? FLOW_X_MS : FLOW_Y_MS;
        const delay = horizontal ? token.delayMs : token.delayMs * STAGGER_Y;
        const timing = { duration, delay, fill: "both" as const };
        const motion = el.animate(
          horizontal
            ? [{ transform: "translateX(-140px)" }, { transform: `translateX(${river.clientWidth + 20}px)` }]
            : [{ transform: "translateY(-30px)" }, { transform: `translateY(${river.clientHeight + 10}px)` }],
          { ...timing, easing: "linear" },
        );
        if (token.isAnswer) el.animate(GLOW, timing);
        motion.onfinish = () => el.remove();
      }
    };

    runSequence(LAB_EXAMPLES, { onFrame: setFrame, onFlow: spawn }, controller.signal);
    return () => {
      controller.abort();
      river?.querySelectorAll("[data-token]").forEach((el) => el.remove());
    };
  }, [reducedMotion, visible]);

  const example = frame?.example ?? LAB_EXAMPLES[0];
  const typingQuestion = !!frame && frame.question.length < example.question.length && frame.question.length > 0;
  const typingReply = !!frame && frame.reply.length > 0 && frame.reply.length < example.reply.length;
  const [before, answer, after] = example.evidence;

  return (
    <div className="border-y border-[#dcdbd2] font-[family-name:var(--font-geist-sans)]">
      <div
        className={cn(
          "mx-auto flex max-w-[1200px] flex-col gap-2.5 px-[18px] py-[22px]",
          "md:grid md:h-[320px] md:grid-cols-[210px_1fr_160px] md:items-center md:gap-0 md:px-9 md:py-0",
          "lg:grid-cols-[290px_1fr_210px]",
        )}
      >
        {/* Inputs */}
        <div className="flex flex-col gap-2.5 md:gap-3">
          <div data-lab-box className="h-[72px] md:h-[80px] overflow-hidden rounded-[14px] border border-[#dcdbd2] bg-white px-3.5 py-2.5 text-[13px] leading-[1.45] md:text-[12px] lg:text-[13px]">
            <Label>Question</Label>
            <div>
              {frame?.question}
              {typingQuestion && <span className={styles.caret} />}
            </div>
          </div>

          <div
            data-lab-box
            className={cn(
              "h-[96px] overflow-hidden rounded-[14px] border border-dashed border-[#9fd9b0] bg-[#f3fbf5] px-3.5 py-2.5 text-[13px] leading-[1.45] text-[#3f443c] transition-all duration-400 md:text-[12px] lg:text-[13px]",
              frame?.evidenceVisible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
            )}
          >
            <Label className="text-[#15803d]">
              <span>Retrieved evidence</span>
              {!frame?.evidenceLoading && (
                <span className="normal-case tracking-normal text-[#6b7067]">{example.source}</span>
              )}
            </Label>
            {frame?.evidenceLoading ? (
              <>
                <div className={styles.shimmer} style={{ width: "92%" }} />
                <div className={styles.shimmer} style={{ width: "70%" }} />
              </>
            ) : (
              <div>
                {before}
                <span className="rounded-[3px] bg-[#bbf7d0] px-0.5 font-semibold text-[#15803d]">{answer}</span>
                {after}
              </div>
            )}
          </div>
        </div>

        {/* Layers */}
        <div
          ref={riverRef}
          aria-hidden
          className={cn(
            "relative h-[230px] overflow-hidden font-[family-name:var(--font-geist-mono)] md:h-full",
            styles.labRiver,
          )}
        >
          {LAYERS.map((layer) => (
            <div key={layer.pos} className={styles.layer} style={{ "--pos": layer.pos } as React.CSSProperties} />
          ))}
          {LAYERS.filter((l) => l.label).map((layer) => (
            <span
              key={layer.label}
              className={styles.layerLabel}
              style={{ "--pos": layer.pos } as React.CSSProperties}
            >
              {layer.label}
            </span>
          ))}
          {reducedMotion && (
            <span
              className={cn(styles.token, styles.tokenSpent)}
              style={isDesktop ? { top: LANES_X[2], left: "66%" } : { left: LANES_Y[2], top: "66%" }}
            >
              {answer}
            </span>
          )}
        </div>

        {/* Reply */}
        <div data-lab-box className="h-[60px] overflow-hidden rounded-[14px] bg-[#1c1f1a] px-3.5 py-2.5 text-[13px] leading-[1.45] text-[#f5f4ee] md:h-[80px] md:text-[12px] lg:h-[72px] lg:text-[13px]">
          <Label className="text-[#9aa096]">Model</Label>
          <div>
            {frame?.reply}
            {typingReply && <span className={styles.caret} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mb-1.5 flex justify-between font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]",
        className,
      )}
    >
      {children}
    </div>
  );
}
