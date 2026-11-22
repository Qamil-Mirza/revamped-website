// Where along Qwen's 36 layers the answer becomes readable to the logit lens,
// plus the headline numbers from the lens study. A summary, not one trace.
const LAYERS = 36;
const READABLE = [30, 31, 32, 33];

const STATS = [
  { value: "91%", text: "of false abstentions already have the right answer in the model’s own note" },
  { value: "64%", text: "still have the right answer in the final layer’s top-10 predictions" },
  { value: "99.8%", text: "agreement between the logit lens and the fitted Jacobian lens on Qwen" },
];

export function LateAnswerFigure() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]">
        <span>Layer 0</span>
        <span>Layer 35</span>
      </div>
      <div className="mt-1.5 flex gap-[2px]" role="img" aria-label="The right answer becomes readable only in layers 30 to 33 of 36.">
        {Array.from({ length: LAYERS }, (_, l) => (
          <span
            key={l}
            title={`Layer ${l}`}
            className={`h-8 flex-1 rounded-[3px] ${READABLE.includes(l) ? "bg-[#15803d]" : "bg-[#ecebe4]"}`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <span className="text-right text-[12.5px] leading-snug text-[#15803d] md:mr-[5.5%]">
          answer becomes readable
          <br />
          layers 30–33
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.value} className="rounded-xl border border-[#dcdbd2] bg-[#faf9f5] p-3.5">
            <div className="text-[26px] font-semibold leading-none tracking-[-0.02em] text-[#1c1f1a]">{s.value}</div>
            <div className="mt-2 text-[12.5px] leading-snug text-[#6b7067]">{s.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
