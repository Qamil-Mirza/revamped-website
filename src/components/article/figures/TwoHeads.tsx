import { HBars } from "./HBars";

// Qwen 2.5 3B's 576 attention heads as a 36-layer by 16-head grid, with the
// pair from my head search filled and the agent's pair ringed (they share L33h10).
const LAYERS = 36;
const HEADS = 16;
const CELL = 15;
const LEFT = 34;
const TOP = 8;
const W = LEFT + LAYERS * CELL + 8;
const H = TOP + HEADS * CELL + 34;

const MINE = new Set(["28-2", "33-10"]);
const AGENT = new Set(["32-2", "33-10"]);

export function TwoHeadsFigure() {
  return (
    <div className="px-3 pt-4 md:px-6 md:pt-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="A grid of 576 attention heads. My search's top pair is layer 28 head 2 and layer 33 head 10. The agent's pair is layer 32 head 2 and layer 33 head 10."
      >
        {Array.from({ length: LAYERS }, (_, l) =>
          Array.from({ length: HEADS }, (_, h) => {
            const key = `${l}-${h}`;
            const mine = MINE.has(key);
            const agent = AGENT.has(key);
            return (
              <rect
                key={key}
                x={LEFT + l * CELL + 1}
                y={TOP + (HEADS - 1 - h) * CELL + 1}
                width={CELL - 2}
                height={CELL - 2}
                rx="2"
                fill={mine ? "#15803d" : "#ecebe4"}
                stroke={agent ? "#1c1f1a" : "none"}
                strokeWidth={agent ? 2 : 0}
              >
                <title>{`Layer ${l}, head ${h}${mine ? " (my search)" : ""}${agent ? " (agent’s edit)" : ""}`}</title>
              </rect>
            );
          }),
        )}
        {[0, 28, 32, 33, 35].map((l) => (
          <text
            key={l}
            x={LEFT + l * CELL + CELL / 2}
            y={TOP + HEADS * CELL + 16}
            textAnchor="middle"
            className={l >= 28 && l <= 33 ? "fill-[#1c1f1a] text-[10px] font-semibold" : "fill-[#6b7067] text-[10px]"}
          >
            {l}
          </text>
        ))}
        <text x={LEFT} y={TOP + HEADS * CELL + 31} className="fill-[#6b7067] text-[11px]">
          layer →
        </text>
        {[0, 2, 10, 15].map((h) => (
          <text key={h} x={LEFT - 6} y={TOP + (HEADS - 1 - h) * CELL + CELL / 2 + 3.5} textAnchor="end" className="fill-[#6b7067] text-[10px]">
            h{h}
          </text>
        ))}
      </svg>

      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-[#2b2f29]">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-[2px] bg-[#15803d]" /> Top pair from my head search
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-[2px] border-2 border-[#1c1f1a] bg-[#ecebe4]" /> The agent’s pair
        </span>
      </div>
      <div className="mt-6 pb-5 md:pb-6">
        <HBars
          groups={[
            {
              title: "False abstentions released, held-out questions",
              bars: [
                { label: "Zero L28h2 + L33h10", value: 96.7 },
                { label: "Best of 20 random pairs", value: 11.2, tone: "muted" },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
