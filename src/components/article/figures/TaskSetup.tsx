const LABEL = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]";

const MEMORY = ["Alice lives in Leeds.", "Alice works as a chef.", "Alice’s supervisor is Bob.", "Bob works in Brighton."];

const TYPES = [
  { name: "Direct lookup", question: "Where does Alice live?", answer: "Leeds" },
  { name: "Two-step", question: "In which city does Alice’s supervisor work?", answer: "Brighton" },
  { name: "Update", question: "Alice moved to York. Where does she live now?", answer: "York" },
];

export function TaskSetupFigure() {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-[0.8fr_1.2fr] md:p-6">
      <div className="rounded-xl border border-[#dcdbd2] bg-[#faf9f5] p-4">
        <div className={`${LABEL} mb-2`}>Memory</div>
        <ul className="flex flex-col gap-1.5 text-[13.5px] text-[#1c1f1a]">
          {MEMORY.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        {TYPES.map((t) => (
          <div key={t.name} className="rounded-xl border border-[#dcdbd2] px-4 py-2.5">
            <div className={LABEL}>{t.name}</div>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 text-[13.5px]">
              <span className="text-[#2b2f29]">{t.question}</span>
              <span className="font-semibold text-[#15803d]">{t.answer}</span>
            </div>
          </div>
        ))}
        <div className="rounded-xl border border-dashed border-[#b9b8af] bg-[#faf9f5] px-4 py-2.5">
          <div className={LABEL}>Unanswerable twin</div>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 text-[13.5px]">
            <span className="text-[#2b2f29]">Where does Bob live? (the memory only says where he works)</span>
            <span className="font-semibold text-[#1c1f1a]">unknown</span>
          </div>
        </div>
      </div>
    </div>
  );
}
