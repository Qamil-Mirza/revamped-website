import { cn } from "@/lib/utils";

export const QUESTION_GROUPS = [
  {
    title: "Why Qwen does it",
    questions: ["Does the answer get lost?", "What inside Qwen causes the refusal?", "Under what scenarios does Qwen abstain?"],
  },
  {
    title: "Beyond Qwen",
    questions: ["Do other models falsely abstain too?", "Is there a trade-off with answering the unanswerable?", "Can we fix it?"],
  },
];

const LABEL = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em]";

export function SixQuestionsFigure() {
  return (
    <div className="grid gap-3 p-4 md:grid-cols-2 md:p-6">
      {QUESTION_GROUPS.map((group, g) => (
        <div key={group.title} className="rounded-xl border border-[#dcdbd2] bg-[#faf9f5] p-4">
          <div className={cn(LABEL, "mb-3 text-[#15803d]")}>{group.title}</div>
          <ol className="flex flex-col gap-2.5">
            {group.questions.map((q, i) => (
              <li key={q} className="flex gap-3 text-[14px] leading-snug text-[#1c1f1a]">
                <span className="font-[family-name:var(--font-geist-mono)] text-[12px] font-semibold text-[#6b7067]">{g * 3 + i + 1}</span>
                {q}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

// A question's section heading, topped with a small "you are here" marker.
export function QuestionHeading({ n, children }: { n: number; children: React.ReactNode }) {
  const group = QUESTION_GROUPS[n <= 3 ? 0 : 1];
  return (
    <div className="mb-3 mt-14">
      <div className="flex items-center gap-3">
        <div className="grid grid-cols-[repeat(3,8px)] grid-rows-2 gap-[3px]" aria-hidden>
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <span key={k} className={cn("h-2 w-2 rounded-[2px]", k === n ? "bg-[#15803d]" : "bg-[#dcdbd2]")} />
          ))}
        </div>
        <span className={cn(LABEL, "text-[#6b7067]")}>
          Question {n} of 6 · {group.title}
        </span>
      </div>
      <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-[#1c1f1a] md:text-[22px]">{children}</h3>
    </div>
  );
}
