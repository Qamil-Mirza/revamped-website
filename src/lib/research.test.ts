import { describe, it, expect, vi, afterEach } from "vitest";
import {
  LAB_EXAMPLES,
  HERO,
  JOURNAL,
  PREVIOUS_RESEARCH,
  runSequence,
  staticFrame,
  tokensFor,
  type FlowToken,
  type LabExample,
  type LabFrame,
} from "./research";

const tiny = {
  charMs: 1,
  afterQuestionMs: 1,
  evidenceLoadingMs: 1,
  afterEvidenceMs: 1,
  flowMs: 1,
  replyCharMs: 1,
  holdMs: 1,
};

afterEach(() => {
  vi.useRealTimers();
});

describe("lab examples", () => {
  it("never puts the answer in the question", () => {
    for (const ex of LAB_EXAMPLES) {
      expect(ex.question.toLowerCase()).not.toContain(ex.evidence[1].toLowerCase());
    }
  });

  it("has exactly one answer token, and it comes from the evidence", () => {
    for (const ex of LAB_EXAMPLES) {
      const answers = tokensFor(ex).filter((t) => t.isAnswer);
      expect(answers).toHaveLength(1);
      expect(answers[0].kind).toBe("evidence");
      expect(answers[0].lane).toBeGreaterThanOrEqual(2);
    }
  });

  it("never puts two tokens in one lane close enough to overlap", () => {
    for (const ex of LAB_EXAMPLES) {
      const tokens = tokensFor(ex);
      for (const a of tokens) {
        for (const b of tokens) {
          if (a !== b && a.lane === b.lane) {
            expect(Math.abs(a.delayMs - b.delayMs), `${a.text} / ${b.text}`).toBeGreaterThanOrEqual(640);
          }
        }
      }
    }
  });

  it("gives the answer a lane of its own", () => {
    for (const ex of LAB_EXAMPLES) {
      const tokens = tokensFor(ex);
      const answer = tokens.find((t) => t.isAnswer)!;
      expect(tokens.filter((t) => t.lane === answer.lane)).toHaveLength(1);
    }
  });

  it("keeps question tokens in the upper lanes", () => {
    for (const ex of LAB_EXAMPLES) {
      for (const t of tokensFor(ex).filter((t) => t.kind === "question")) {
        expect(t.lane).toBeLessThanOrEqual(1);
      }
    }
  });

  it("static frame is fully filled in", () => {
    expect(staticFrame(LAB_EXAMPLES[0])).toEqual({
      example: LAB_EXAMPLES[0],
      question: "What is the capital of Australia?",
      evidenceVisible: true,
      evidenceLoading: false,
      reply: "I don't know.",
    });
  });
});

describe("previous research", () => {
  it("lists previous research exactly as specified", () => {
    expect(PREVIOUS_RESEARCH.map((r) => r.href)).toEqual([
      "https://neurips.cc/virtual/2025/loc/san-diego/130758",
      "/documents/Gilead_Analyst_Sentiment_Poster_SP26.pdf",
      "https://github.com/Qamil-Mirza/badss-2025-options-alpha-strategy",
    ]);
    expect(PREVIOUS_RESEARCH[0].when).toBe("NeurIPS 2025 · AI4Science");
  });
});

describe("research journal", () => {
  it("starts with the memory write-up as entry 1", () => {
    expect(JOURNAL[0]).toMatchObject({
      number: 1,
      date: "October 30, 2026",
      title: "More Than Reasoning: What Memory Experiments Taught Me About Language Models",
      href: "/research/more-than-reasoning",
    });
  });

  it("lists entries newest first with unique, increasing numbers", () => {
    const numbers = JOURNAL.map((e) => e.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => b - a));
    expect(new Set(numbers).size).toBe(numbers.length);
  });
});

describe("hero", () => {
  it("links to the memory write-up instead of the repo", () => {
    expect(HERO.linkHref).toBe("/research/more-than-reasoning");
    expect(HERO.linkLabel).toBe("Read the write-up: More Than Reasoning →");
  });
});

describe("runSequence", () => {
  it("stops calling hooks once aborted", async () => {
    vi.useFakeTimers();
    const onFrame = vi.fn();
    const onFlow = vi.fn();
    const controller = new AbortController();
    const done = runSequence(LAB_EXAMPLES, { onFrame, onFlow }, controller.signal, tiny);

    while (onFlow.mock.calls.length === 0) await vi.advanceTimersByTimeAsync(1);
    controller.abort();
    const frames = onFrame.mock.calls.length;
    const flows = onFlow.mock.calls.length;

    await vi.advanceTimersByTimeAsync(10_000);
    await expect(done).resolves.toBeUndefined();
    expect(onFrame.mock.calls.length).toBe(frames);
    expect(onFlow.mock.calls.length).toBe(flows);
  });

  it("cycles through examples in order", async () => {
    vi.useFakeTimers();
    const flows: FlowToken[][] = [];
    const examplesAtFlow: LabExample[] = [];
    let lastFrame: LabFrame | undefined;
    const controller = new AbortController();
    const done = runSequence(
      LAB_EXAMPLES,
      {
        onFrame: (f) => (lastFrame = f),
        onFlow: (t) => {
          flows.push(t);
          examplesAtFlow.push(lastFrame!.example);
        },
      },
      controller.signal,
      tiny,
    );

    while (flows.length < LAB_EXAMPLES.length + 1) await vi.advanceTimersByTimeAsync(1);
    controller.abort();
    await done;

    const order = LAB_EXAMPLES.map((ex) => tokensFor(ex));
    expect(flows[0]).toEqual(order[0]);
    expect(flows[1]).toEqual(order[1]);
    expect(flows[LAB_EXAMPLES.length]).toEqual(order[0]);
    // each frame says which example it belongs to, so the UI can show its evidence
    expect(examplesAtFlow[1]).toBe(LAB_EXAMPLES[1]);
  });
});
