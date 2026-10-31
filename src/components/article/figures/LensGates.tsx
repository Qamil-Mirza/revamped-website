import { cn } from "@/lib/utils";

type Result = { label: string; passed: boolean };

const ROWS: { model: string; results: Result[] | string }[] = [
  {
    model: "Qwen 3B · J-lens",
    results: [
      { label: "Answer-rank improvement", passed: true },
      { label: "Aggregate intermediate recovery", passed: false },
    ],
  },
  { model: "Other small models", results: "Passed their respective evaluation gates" },
];

export function LensGatesFigure() {
  return (
    <div className="flex flex-col gap-2.5 p-4 md:p-6">
      {ROWS.map((row) => (
        <div
          key={row.model}
          className="grid items-center gap-2 rounded-xl border border-[#dcdbd2] bg-[#faf9f5] p-3 md:grid-cols-[170px_1fr]"
        >
          <div className="text-[14px] font-semibold text-[#1c1f1a]">{row.model}</div>
          <div className="flex flex-wrap gap-2">
            {typeof row.results === "string" ? (
              <Badge label={row.results} passed />
            ) : (
              row.results.map((r) => <Badge key={r.label} label={r.label} passed={r.passed} />)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Badge({ label, passed }: Result) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border bg-white px-2.5 py-1.5 text-[13px]",
        passed ? "border-[#9fd9b0] text-[#1c1f1a]" : "border-[#1c1f1a] text-[#1c1f1a]",
      )}
    >
      <span
        className={cn(
          "grid h-4 w-4 place-items-center rounded-full text-[10px]",
          passed ? "bg-[#22c55e] text-white" : "bg-[#1c1f1a] text-[#f5f4ee]",
        )}
      >
        {passed ? "✓" : "✕"}
      </span>
      {label}
      <span className={cn("font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.08em]", passed ? "text-[#15803d]" : "text-[#6b7067]")}>
        {passed ? "passed" : "failed"}
      </span>
    </span>
  );
}
