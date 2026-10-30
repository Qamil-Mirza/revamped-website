import { describe, it, expect, vi, afterEach } from "vitest";
import {
  LAB_EXAMPLES,
  PREVIOUS_RESEARCH,
  runSequence,
  staticFrame,
  tokensFor,
  type FlowToken,
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

  it("keeps question tokens in the upper lanes", () => {
    for (const ex of LAB_EXAMPLES) {
      for (const t of tokensFor(ex).filter((t) => t.kind === "question")) {
        expect(t.lane).toBeLessThanOrEqual(1);
      }
    }
  });

  it("static frame is fully filled in", () => {
    expect(staticFrame(LAB_EXAMPLES[0])).toEqual({
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
    const controller = new AbortController();
    const done = runSequence(
      LAB_EXAMPLES,
      { onFrame: () => {}, onFlow: (t) => flows.push(t) },
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
  });
});
