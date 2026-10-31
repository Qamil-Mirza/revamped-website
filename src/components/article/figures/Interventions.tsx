import { cn } from "@/lib/utils";

type Run = { condition: string; output: string; ok: boolean };

const CASES: { question: string; kind: string; runs: Run[] }[] = [
  {
    question: "What type of action figure did I buy from a thrift store?",
    kind: "Direct extraction: the answer is already in the note",
    runs: [
      { condition: "Original prompt", output: "unknown", ok: false },
      { condition: "Same note, new final instruction", output: "Snaggletooth action figure", ok: true },
    ],
  },
  {
    question: "How much did I spend on car wash and parking ticket?",
    kind: "Composition: the note has $15 and $50; the answer needs addition",
    runs: [
      { condition: "Original prompt", output: "unknown", ok: false },
      { condition: "Same note, new final instruction", output: "$65", ok: true },
      { condition: "Changed prompt, regenerated", output: "$55", ok: false },
    ],
  },
];

export function InterventionsFigure() {
  return (
    <div className="grid gap-3 p-4 md:grid-cols-2 md:p-6">
      {CASES.map((c) => (
        <div key={c.question} className="rounded-xl border border-[#dcdbd2] bg-[#faf9f5] p-3.5">
          <div className="text-[14px] font-medium leading-snug text-[#1c1f1a]">{c.question}</div>
          <div className="mb-3 mt-1 text-[12px] text-[#6b7067]">{c.kind}</div>
          <div className="flex flex-col gap-1.5">
            {c.runs.map((r) => (
              <div key={r.condition} className="flex items-center justify-between gap-3 rounded-lg bg-white px-2.5 py-2 text-[13px] shadow-[0_0_0_1px_#ecebe4]">
                <span className="text-[#6b7067]">{r.condition}</span>
                <span className={cn("flex items-center gap-1.5 font-[family-name:var(--font-geist-mono)] font-semibold", r.ok ? "text-[#15803d]" : "text-[#1c1f1a]")}>
                  {r.output}
                  <span
                    aria-label={r.ok ? "correct" : "incorrect"}
                    className={cn(
                      "grid h-4 w-4 place-items-center rounded-full text-[10px]",
                      r.ok ? "bg-[#22c55e] text-white" : "bg-[#1c1f1a] text-[#f5f4ee]",
                    )}
                  >
                    {r.ok ? "✓" : "✕"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
