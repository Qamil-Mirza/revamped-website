import { cn } from "@/lib/utils";

type StageTone = "original" | "changed" | "kept" | "regenerated";
type Stage = { tag: string; tone: StageTone; body: React.ReactNode };
type Run = { condition: string; instructions: Stage; note: Stage; output: string; ok: boolean };

const ORIGINAL_INSTRUCTIONS: Stage = {
  tag: "original",
  tone: "original",
  body: "Write a brief note, then answer. Reply “unknown” if the memory isn’t enough.",
};

const ADDED_INSTRUCTION: Stage = {
  tag: "instruction added",
  tone: "changed",
  body: (
    <>
      Original prompt, plus: <q className="italic">Based on the note above, give the answer as a short phrase. Do not reply unknown.</q>
    </>
  ),
};

const hl = (s: string) => <mark className="rounded bg-[#bbf7d0] px-0.5 text-[#15803d]">{s}</mark>;

const SNAG_NOTE = <>…buying a {hl("rare blue Snaggletooth action figure")} from a thrift store…</>;
const CAR_NOTE = <>…{hl("$15")} on a car wash… {hl("$50")} on a parking ticket…</>;

const CASES: { question: string; kind: string; runs: Run[] }[] = [
  {
    question: "What type of action figure did I buy from a thrift store?",
    kind: "Direct extraction: the answer is already in the note",
    runs: [
      {
        condition: "Original prompt",
        instructions: ORIGINAL_INSTRUCTIONS,
        note: { tag: "model’s note", tone: "original", body: SNAG_NOTE },
        output: "unknown",
        ok: false,
      },
      {
        condition: "Keep the note and continue",
        instructions: ADDED_INSTRUCTION,
        note: { tag: "kept as written", tone: "kept", body: SNAG_NOTE },
        output: "Snaggletooth action figure",
        ok: true,
      },
    ],
  },
  {
    question: "How much did I spend on car wash and parking ticket?",
    kind: "Composition: the note has $15 and $50; the answer needs addition",
    runs: [
      {
        condition: "Original prompt",
        instructions: ORIGINAL_INSTRUCTIONS,
        note: { tag: "model’s note", tone: "original", body: CAR_NOTE },
        output: "unknown",
        ok: false,
      },
      {
        condition: "Keep the existing note and continue",
        instructions: ADDED_INSTRUCTION,
        note: { tag: "kept as written", tone: "kept", body: CAR_NOTE },
        output: "$65",
        ok: true,
      },
      {
        condition: "Generate a fresh response",
        instructions: {
          tag: "instructions rewritten",
          tone: "changed",
          body: "Give a best guess; “unknown” is no longer allowed.",
        },
        note: {
          tag: "regenerated",
          tone: "regenerated",
          body: "The original note is discarded. A new note and answer are generated from the same evidence.",
        },
        output: "$55",
        ok: false,
      },
    ],
  },
];

// Two cards side by side, one per example. Each run reads top to bottom:
// the condition and its answer, then how the instructions and note changed.
export function InterventionsFigure() {
  return (
    <div className="grid p-4 md:grid-cols-2 md:p-5">
      {CASES.map((c, i) => (
        <div
          key={c.question}
          className={cn(
            "flex flex-col",
            // a rule between the two examples: vertical side by side, horizontal when stacked
            i === 0 ? "pb-4 md:pb-0 md:pr-5" : "border-t border-[#dcdbd2] pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0",
          )}
        >
          <div className="text-[14px] font-medium leading-snug text-[#1c1f1a]">{c.question}</div>
          <div className="mb-3 mt-0.5 text-[12px] text-[#6b7067]">{c.kind}</div>
          <div className="flex flex-1 flex-col gap-2">
            {c.runs.map((run) => (
              <div key={run.condition} className="rounded-xl border border-[#dcdbd2] bg-[#faf9f5] p-2.5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-[#1c1f1a]">{run.condition}</span>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1c1f1a] px-2 py-1 font-[family-name:var(--font-geist-mono)] text-[12px] font-semibold text-[#f5f4ee]">
                    {run.output}
                    <span
                      aria-label={run.ok ? "correct" : "incorrect"}
                      className={cn(
                        "grid h-4 w-4 place-items-center rounded-full text-[10px]",
                        run.ok ? "bg-[#22c55e] text-white" : "bg-[#f5f4ee] text-[#1c1f1a]",
                      )}
                    >
                      {run.ok ? "✓" : "✕"}
                    </span>
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <StageBox label="Instructions" stage={run.instructions} />
                  <StageBox label="Note" stage={run.note} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const TONES: Record<StageTone, { box: string; tag: string }> = {
  original: { box: "border-[#dcdbd2] bg-white text-[#2b2f29]", tag: "bg-[#ecebe4] text-[#6b7067]" },
  changed: { box: "border-[#9fd9b0] bg-white text-[#2b2f29]", tag: "bg-[#22c55e] text-white" },
  kept: { box: "border-[#9fd9b0] bg-white text-[#2b2f29]", tag: "bg-[#dcfce7] text-[#15803d]" },
  regenerated: { box: "border-dashed border-[#b9b8af] bg-white text-[#6b7067]", tag: "bg-[#1c1f1a] text-[#f5f4ee]" },
};

function StageBox({ label, stage }: { label: string; stage: Stage }) {
  const tone = TONES[stage.tone];
  return (
    <div className={cn("rounded-lg border px-2.5 py-2 text-[12.5px] leading-snug", tone.box)}>
      <div className="mb-1 flex items-center gap-1.5">
        <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]">
          {label}
        </span>
        <span className={cn("rounded px-1.5 py-[1px] font-[family-name:var(--font-geist-mono)] text-[9.5px] uppercase tracking-[0.06em]", tone.tag)}>
          {stage.tag}
        </span>
      </div>
      {stage.body}
    </div>
  );
}
