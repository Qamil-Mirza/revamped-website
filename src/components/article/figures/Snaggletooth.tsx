"use client";

import { useRef } from "react";
import { useTypedLoop } from "./hooks";

const NOTE = "user mentioned buying a rare blue Snaggletooth action figure from a thrift store a few weeks ago.";
const ANSWER = "Answer: unknown";
const SEP = "\n";
const OUTPUT = NOTE + SEP + ANSWER;
const KEY = "rare blue Snaggletooth action figure";

function highlight(text: string) {
  const i = text.indexOf(KEY);
  if (i === -1) {
    // the key phrase is still being typed: highlight whatever part of it is visible
    const start = NOTE.indexOf(KEY);
    if (text.length > start) {
      return (
        <>
          {text.slice(0, start)}
          <mark className="rounded bg-[#bbf7d0] px-0.5 text-[#15803d]">{text.slice(start)}</mark>
        </>
      );
    }
    return text;
  }
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-[#bbf7d0] px-0.5 text-[#15803d]">{KEY}</mark>
      {text.slice(i + KEY.length)}
    </>
  );
}

export function SnaggletoothFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useTypedLoop(ref, OUTPUT, 28, 3600);
  const note = OUTPUT.slice(0, Math.min(shown, NOTE.length));
  const answer = shown > NOTE.length + SEP.length ? OUTPUT.slice(NOTE.length + SEP.length, shown) : "";
  const typing = shown < OUTPUT.length;

  return (
    <div ref={ref} className="grid gap-3 p-4 md:grid-cols-2 md:p-6">
      <div className="flex flex-col gap-3">
        <Box label="Question">What type of action figure did I buy from a thrift store?</Box>
        <Box label="Memory supplied" tone="evidence">
          …just got a <mark className="rounded bg-[#bbf7d0] px-0.5 font-semibold text-[#15803d]">{KEY}</mark> from a thrift
          store a few weeks ago.
        </Box>
      </div>
      <div className="flex min-h-[188px] flex-col rounded-xl bg-[#1c1f1a] px-4 py-3 text-[14px] leading-relaxed text-[#f5f4ee]">
        <div className="mb-1.5 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.12em] text-[#9aa096]">
          Model output · Qwen2.5-3B-Instruct
        </div>
        <div className="text-[#d6d5cc]">
          <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#9aa096]">note: </span>
          {highlight(note)}
          {typing && !answer && <Caret />}
        </div>
        {answer && (
          <div className="mt-3 font-[family-name:var(--font-geist-mono)] text-[15px]">
            {answer.startsWith("Answer: ") ? (
              <>
                Answer:{" "}
                <span className="rounded-md border border-[#f5f4ee]/40 px-1.5 py-0.5">{answer.slice("Answer: ".length)}</span>
              </>
            ) : (
              answer
            )}
            {typing && <Caret />}
          </div>
        )}
      </div>
    </div>
  );
}

function Box({ label, tone = "plain", children }: { label: string; tone?: "plain" | "evidence"; children: React.ReactNode }) {
  return (
    <div
      className={
        tone === "evidence"
          ? "rounded-xl border border-dashed border-[#9fd9b0] bg-[#f3fbf5] px-4 py-3 text-[14px] leading-relaxed text-[#3f443c]"
          : "rounded-xl border border-[#dcdbd2] bg-[#faf9f5] px-4 py-3 text-[14px] leading-relaxed text-[#2b2f29]"
      }
    >
      <div
        className={`mb-1.5 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.12em] ${tone === "evidence" ? "text-[#15803d]" : "text-[#6b7067]"}`}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

export function Caret() {
  return <span className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] animate-pulse bg-[#22c55e]" />;
}
