// The probe pipeline, then where its AUROC lands on a chance-to-perfect axis.
const BOX = "rounded-xl border border-[#dcdbd2] bg-[#faf9f5] px-3 py-2.5 text-center text-[13px] leading-snug text-[#1c1f1a]";
const W = 600;
const PAD = 30;
const x = (v: number) => PAD + ((v - 0.5) / 0.5) * (W - PAD * 2);

export function ProbeFigure() {
  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
        <div className={BOX}>Hidden state at a middle layer</div>
        <span className="text-[#6b7067]">→</span>
        <div className={BOX}>Logistic regression</div>
        <span className="text-[#6b7067]">→</span>
        <div className={`${BOX} border-[#9fd9b0] bg-[#f3fbf5] font-semibold text-[#15803d]`}>Answerable?</div>
      </div>

      <svg
        viewBox={`0 0 ${W} 110`}
        className="mt-6 w-full"
        role="img"
        aria-label="Probe AUROC was between 0.994 and 0.999 for all five model families, where 0.5 is chance."
      >
        <line x1={x(0.5)} x2={x(1)} y1="58" y2="58" stroke="#dcdbd2" strokeWidth="2" />
        {[0.5, 0.6, 0.7, 0.8, 0.9, 1].map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1="52" y2="64" stroke="#dcdbd2" />
            <text x={t === 0.5 ? x(t) - 4 : x(t)} y="84" textAnchor={t === 0.5 ? "start" : "middle"} className="fill-[#6b7067] text-[13px]">
              {t === 0.5 ? "0.5 chance" : t.toFixed(1)}
            </text>
          </g>
        ))}
        <rect x={x(0.994) - 4} y="48" width={x(0.999) - x(0.994) + 8} height="20" rx="4" fill="#15803d">
          <title>AUROC 0.994–0.999 across 5 families</title>
        </rect>
        <text x={x(0.997) - 8} y="30" textAnchor="end" className="fill-[#1c1f1a] text-[15px] font-semibold">
          0.994–0.999
        </text>
        <text x={x(0.997) - 8} y="104" textAnchor="end" className="fill-[#6b7067] text-[13px]">
          all 5 families
        </text>
        <text x={x(0.5)} y="104" className="fill-[#6b7067] text-[13px]">
          probe AUROC
        </text>
      </svg>
    </div>
  );
}
