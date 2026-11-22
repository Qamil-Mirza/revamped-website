// How the thesis drifted, as a left-to-right line (top-to-bottom on phones).
const STEPS = [
  { title: "A memory controller for long tasks", detail: "An RL policy over what the reader model sees" },
  { title: "The reader gets the facts and still fails", detail: "" },
  { title: "It writes the answer, then says “unknown”", detail: "" },
  { title: "Two attention heads", detail: "" },
];

export function RabbitHoleFigure() {
  return (
    <ol className="grid gap-0 p-5 md:grid-cols-4 md:gap-4 md:p-6">
      {STEPS.map((step, i) => {
        const last = i === STEPS.length - 1;
        return (
          <li key={step.title} className="relative pb-5 pl-7 last:pb-0 md:pb-0 md:pl-0 md:pt-7">
            {/* connector: vertical on phones, horizontal from md up */}
            {!last && <span className="absolute left-[7px] top-4 h-full w-px bg-[#cfe9d6] md:left-4 md:top-[7px] md:h-px md:w-[calc(100%+1rem)]" />}
            <span
              className={`absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 md:top-0 ${
                last ? "border-[#15803d] bg-[#22c55e]" : "border-[#5fb87c] bg-white"
              }`}
            />
            <div className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]">
              {i === 0 ? "Started" : last ? "Ended up" : "Then"}
            </div>
            <div className="mt-1 text-[14px] font-semibold leading-snug text-[#1c1f1a]">{step.title}</div>
            {step.detail && <div className="mt-1 text-[12.5px] leading-snug text-[#6b7067]">{step.detail}</div>}
          </li>
        );
      })}
    </ol>
  );
}
