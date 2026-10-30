import { cn } from "@/lib/utils";
import styles from "./research.module.css";

// Two lanes, question words on top and evidence below, so it still reads when
// the card is short. Same-lane tokens are spaced apart in time.
const TOKENS = [
  { text: "What is", top: "4%", delay: "0s", rest: "8%" },
  { text: "the capital?", top: "4%", delay: "-3s", rest: "52%" },
  { text: "Canberra", top: "54%", delay: "-1s", rest: "38%", evidence: true, answer: true },
  { text: "since 1913", top: "54%", delay: "-4s", rest: "8%", evidence: true },
];

// A small, CSS-only version of the research page's layers animation.
export function ResearchCardBackground() {
  return (
    <div className="absolute inset-0 bg-[#f5f4ee]">
      <div
        aria-hidden
        className={cn(
          // sits above the card's text and dims when the text lifts on hover
          "absolute inset-x-0 bottom-[112px] top-4 max-h-[160px] overflow-hidden font-[family-name:var(--font-geist-mono)] transition-opacity duration-300 group-hover:opacity-30",
          styles.riverX,
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
              t.evidence && styles.tokenEvidence,
              t.answer ? styles.flowXAnswer : styles.flowX,
            )}
            style={{ top: t.top, animationDelay: t.answer ? `${t.delay}, ${t.delay}` : t.delay, "--rest": t.rest } as React.CSSProperties}
          >
            {t.text}
          </span>
        ))}
      </div>
    </div>
  );
}
