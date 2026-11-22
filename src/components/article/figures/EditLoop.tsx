// The agent's sandboxed weight-editing loop, and the test we ran outside it.
const LABEL = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]";

const STEPS = [
  { title: "Opus 5.5, in a sandbox", detail: "No internet, only numpy and a tokenizer, no gradients." },
  { title: "Analysis", detail: "Writes numpy code over saved activations and outputs." },
  { title: "Forward-pass service", detail: "Runs Qwen on development questions, with or without a candidate edit. Metered by passes, tokens and cost." },
  {
    title: "Propose an edit",
    detail: "A small change to existing weights, such as zeroing two heads’ outputs or a rank-1 update. The harness refuses anything outside the limits.",
  },
  { title: "Submit (at most 3)", detail: "Then back to analysis." },
];

export function EditLoopFigure() {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-[1.25fr_1fr] md:p-6">
      <div>
        <div className={`${LABEL} mb-2.5`}>The agent’s loop</div>
        <ol className="relative flex flex-col gap-2">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className={`relative flex gap-3 rounded-xl border px-3 py-2.5 ${
                i === 0 ? "border-[#1c1f1a] bg-[#1c1f1a] text-[#f5f4ee]" : "border-[#dcdbd2] bg-[#faf9f5] text-[#1c1f1a]"
              }`}
            >
              <span className={`font-[family-name:var(--font-geist-mono)] text-[12px] font-semibold ${i === 0 ? "text-[#9aa096]" : "text-[#15803d]"}`}>
                {i + 1}
              </span>
              <div>
                <div className="text-[13.5px] font-semibold leading-snug">{s.title}</div>
                <div className={`mt-0.5 text-[12.5px] leading-snug ${i === 0 ? "text-[#c9cdc4]" : "text-[#6b7067]"}`}>{s.detail}</div>
              </div>
              {i === STEPS.length - 1 && (
                <span className="ml-auto self-center text-[18px] text-[#15803d]" aria-label="loops back to step 2">
                  ↺
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col">
        <div className={`${LABEL} mb-2.5`}>Then, outside the loop</div>
        <div className="flex-1 rounded-xl border border-[#9fd9b0] bg-[#f3fbf5] p-4 text-[13.5px] leading-relaxed text-[#1c1f1a]">
          <strong className="font-semibold">We</strong> test each submitted edit on sealed held-out questions the agent never saw, against:
          <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-[#15803d]">
            <li>20 random edits of the same shape</li>
            <li>a plain “less unknown” bias</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
