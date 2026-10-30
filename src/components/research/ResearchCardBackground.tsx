import { cn } from "@/lib/utils";
import styles from "./research.module.css";

// Question words on top, evidence below. Same-lane tokens are spaced apart in time.
const TOKENS = [
  { text: "What is", delay: "0s", rest: "8%" },
  { text: "the capital?", delay: "-3s", rest: "52%" },
  { text: "Canberra", delay: "-1s", rest: "38%", evidence: true, answer: true },
  { text: "since 1913", delay: "-4s", rest: "8%", evidence: true },
];

// A small, CSS-only version of the research page's layers animation.
export function ResearchCardBackground() {
  return (
    <div className="absolute inset-0 bg-[#f5f4ee]">
      <div
        aria-hidden
        className={cn(
          // sits above the card's text and dims when the text lifts on hover
          "absolute inset-x-0 bottom-[108px] top-3 max-h-[160px] min-h-[34px] overflow-hidden font-[family-name:var(--font-geist-mono)] transition-opacity duration-300 group-hover:opacity-30",
          styles.riverX,
          styles.cardStrip,
        )}
      >
        {["25%", "50%", "75%"].map((left) => (
          <div key={left} className="absolute inset-y-0 w-px bg-[#dcdbd2]" style={{ left }} />
        ))}
        {TOKENS.map((t) => (
          <span
            key={t.text}
            className={cn(
              styles.token,
              styles.cardToken,
              t.evidence ? styles.cardLaneEvidence : styles.cardLaneQuestion,
              t.evidence && styles.tokenEvidence,
              t.answer ? styles.flowXAnswer : styles.flowX,
            )}
            style={{ animationDelay: t.answer ? `${t.delay}, ${t.delay}` : t.delay, "--rest": t.rest } as React.CSSProperties}
          >
            {t.text}
          </span>
        ))}
      </div>
    </div>
  );
}
