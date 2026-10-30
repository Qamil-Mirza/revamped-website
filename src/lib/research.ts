// Content and sequencing for the /research page. Kept free of React so the
// animation's timing and the copy can be unit tested.

export type LabExample = {
  question: string;
  source: string;
  evidence: [before: string, answer: string, after: string];
  questionTokens: string[];
  evidenceTokens: string[];
  reply: string;
};

export const LAB_EXAMPLES: LabExample[] = [
  {
    question: "What is the capital of Australia?",
    source: "encyclopedia",
    evidence: ["", "Canberra", " has been Australia's capital since 1913."],
    questionTokens: ["What is", "the capital", "of Australia?"],
    evidenceTokens: ["Canberra", "Australia's capital", "since 1913"],
    reply: "I don't know.",
  },
  {
    question: "When did Marie Curie win the Chemistry Nobel?",
    source: "nobelprize.org",
    evidence: ["Curie received the Nobel Prize in Chemistry in ", "1911", "."],
    questionTokens: ["When did", "Marie Curie", "win?"],
    evidenceTokens: ["Nobel Prize", "in Chemistry", "1911"],
    reply: "I'm not sure about that.",
  },
  {
    question: "Who wrote Pride and Prejudice?",
    source: "library catalog",
    evidence: ["", "Jane Austen", " published Pride and Prejudice in 1813."],
    questionTokens: ["Who wrote", "Pride and", "Prejudice?"],
    evidenceTokens: ["Jane Austen", "published", "in 1813"],
    reply: "I can't answer that.",
  },
  {
    question: "What day is the team meeting?",
    source: "inbox · Sam",
    evidence: ["Heads up, the team meeting has moved to ", "Thursday", "."],
    questionTokens: ["What day", "is the", "team meeting?"],
    evidenceTokens: ["team meeting", "moved to", "Thursday"],
    reply: "I don't have that information.",
  },
];

export type FlowToken = {
  text: string;
  kind: "question" | "evidence";
  isAnswer: boolean;
  lane: number;
  delayMs: number;
};

const TOKEN_STAGGER_MS = 320;
const EVIDENCE_OFFSET_MS = 160;
// Question words ride lanes 0-1, evidence lanes 2-3. The answer always gets
// lane 2 so it sits in the same spot every loop.
const QUESTION_LANES = [0, 1, 0];
const EVIDENCE_LANES = [3, 2, 3];

export function tokensFor(example: LabExample): FlowToken[] {
  const answer = example.evidence[1];
  const question = example.questionTokens.map<FlowToken>((text, i) => ({
    text,
    kind: "question",
    isAnswer: false,
    lane: QUESTION_LANES[i % QUESTION_LANES.length],
    delayMs: i * TOKEN_STAGGER_MS,
  }));
  const evidence = example.evidenceTokens.map<FlowToken>((text, i) => {
    const isAnswer = text === answer;
    return {
      text,
      kind: "evidence",
      isAnswer,
      lane: isAnswer ? 2 : EVIDENCE_LANES[i % EVIDENCE_LANES.length],
      delayMs: EVIDENCE_OFFSET_MS + i * TOKEN_STAGGER_MS,
    };
  });
  return [...question, ...evidence];
}

export type LabFrame = {
  question: string;
  evidenceVisible: boolean;
  evidenceLoading: boolean;
  reply: string;
};

export function staticFrame(example: LabExample): LabFrame {
  return {
    question: example.question,
    evidenceVisible: true,
    evidenceLoading: false,
    reply: example.reply,
  };
}

export type SequenceHooks = {
  onFrame(frame: LabFrame): void;
  onFlow(tokens: FlowToken[]): void;
};

export type Timing = {
  charMs: number;
  afterQuestionMs: number;
  evidenceLoadingMs: number;
  afterEvidenceMs: number;
  flowMs: number;
  replyCharMs: number;
  holdMs: number;
};

export const DEFAULT_TIMING: Timing = {
  charMs: 30,
  afterQuestionMs: 250,
  evidenceLoadingMs: 900,
  afterEvidenceMs: 500,
  flowMs: 4900,
  replyCharMs: 35,
  holdMs: 2400,
};

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const id = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(signal.reason);
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

// Plays the examples on a loop until the signal aborts, then resolves without
// calling either hook again.
export async function runSequence(
  examples: LabExample[],
  hooks: SequenceHooks,
  signal: AbortSignal,
  timing: Partial<Timing> = {},
): Promise<void> {
  const t = { ...DEFAULT_TIMING, ...timing };
  const empty: LabFrame = { question: "", evidenceVisible: false, evidenceLoading: false, reply: "" };

  try {
    for (let n = 0; ; n = (n + 1) % examples.length) {
      const ex = examples[n];
      let frame = { ...empty };
      const show = (next: Partial<LabFrame>) => {
        if (signal.aborted) return;
        frame = { ...frame, ...next };
        hooks.onFrame(frame);
      };

      show({});
      for (let i = 1; i <= ex.question.length; i++) {
        await sleep(t.charMs, signal);
        show({ question: ex.question.slice(0, i) });
      }
      await sleep(t.afterQuestionMs, signal);
      show({ evidenceVisible: true, evidenceLoading: true });
      await sleep(t.evidenceLoadingMs, signal);
      show({ evidenceLoading: false });
      await sleep(t.afterEvidenceMs, signal);
      if (signal.aborted) return;
      hooks.onFlow(tokensFor(ex));
      await sleep(t.flowMs, signal);
      for (let i = 1; i <= ex.reply.length; i++) {
        await sleep(t.replyCharMs, signal);
        show({ reply: ex.reply.slice(0, i) });
      }
      await sleep(t.holdMs, signal);
    }
  } catch (err) {
    if (signal.aborted) return;
    throw err;
  }
}

export type ResearchItem = {
  when: string;
  title: string;
  summary: string;
  href: string;
};

export const PREVIOUS_RESEARCH: ResearchItem[] = [
  {
    when: "NeurIPS 2025 · AI4Science",
    title: "A Multi-Modal Deep Learning Model for Drug Potency Prediction",
    summary:
      "Protein–ligand interaction fingerprints from docking and co-folding, fed into directed message-passing networks.",
    href: "https://neurips.cc/virtual/2025/loc/san-diego/130758",
  },
  {
    when: "Spring 2026 · Gilead",
    title: "Can Analysts Predict Markets?",
    summary:
      "LLM sentiment from sell-side research reports, tested against walk-forward forecasts of Gilead's stock price.",
    href: "/documents/Gilead_Analyst_Sentiment_Poster_SP26.pdf",
  },
  {
    when: "2025 · Wells Fargo",
    title: "Optimizing Equity Derivative Hedging Strategies",
    summary: "A mixed-integer program that keeps a $10M exposure floor at minimum option premium.",
    href: "https://github.com/Qamil-Mirza/badss-2025-options-alpha-strategy",
  },
];

export const HERO = {
  headline: "Why do small models refuse answers they've already been given?",
  lede:
    "I'm tracing how small language models work their way to an answer, and why they still abstain when retrieval has put the answer right in front of them. This grew out of my earlier work on memory and retrieval in LLMs.",
  meta: "Honors thesis · Fall 2026",
  repoLabel: "llm-memctl on GitHub ↗",
  repoHref: "https://github.com/Qamil-Mirza/llm-memctl",
};
