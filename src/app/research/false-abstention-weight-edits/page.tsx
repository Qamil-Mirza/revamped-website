import { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/ui/nav-bar";
import { articleFontVariable, BODY_FONT, H2, P, Strong } from "@/components/article/prose";
import { cn } from "@/lib/utils";

const REPORT_HREF = "/documents/Agent_Proposed_Weight_Edits_Technical_Report.pdf";
const LINK_CLASS = "text-[#15803d] underline decoration-[#9fd9b0] underline-offset-2 hover:decoration-[#15803d]";
const MONO_LABEL = "font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.12em] text-[#6b7067]";

export const metadata: Metadata = {
  title: "Evaluating Agent-Proposed Weight Edits for False Abstention | Qamil Mirza",
  description:
    "A preliminary technical report on whether weight edits proposed by a Claude agent fix false abstention in Qwen2.5-3B-Instruct, shared early to invite scrutiny.",
  alternates: {
    canonical: "https://qamil-mirza.com/research/false-abstention-weight-edits",
  },
};

function ReportButton() {
  return (
    <a
      href={REPORT_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[#1c1f1a] px-5 py-2.5 text-[14px] font-medium text-[#f5f4ee] transition-colors hover:bg-[#15803d]"
    >
      Read the technical report (PDF) <span aria-hidden>↗</span>
    </a>
  );
}

const KNOWN_PROBLEMS: { title: string; body: React.ReactNode }[] = [
  {
    title: "The prompt invites “unknown”, and removing the option removes most failures.",
    body: (
      <>
        On the made-up questions, taking out the “unknown” instruction lets the model answer 145 of 150 of its false abstentions
        correctly. The two abstention rules in the prompt also disagree. Until a rerun with one consistent abstention rule reports,
        every controlled-task result has to be read as “under this prompt”.
      </>
    ),
  },
  {
    title: "The clearest results come from made-up questions, and they shrink on real chats.",
    body: (
      <>
        About 9 in 10 notes name the answer on the made-up questions, against about 4 in 10 on LongMemEval. The edit fixes 8 in 10
        made-up cases but about 1 in 3 real ones. Any headline number has to say which data it comes from.
      </>
    ),
  },
  {
    title: "One model, and the habit depends on the model family.",
    body: (
      <>
        Everything mechanistic is on Qwen2.5-3B, which says “unknown” with the evidence in view far more often (30%) than Llama, Gemma
        or Phi (2 to 10%). The findings describe this model and must not be stated as general.
      </>
    ),
  },
  {
    title: "The type A versus type B contrast was never tested on type A.",
    body: (
      <>
        Type A failures are ones where the model never uses the evidence. Type B failures are ones where it uses the evidence and
        abstains anyway. The swap test never became valid, and the patching study’s entry rule only admitted failures where the
        evidence was used. “Most failures are type B” is supported, but no experiment could have found type A. That makes it a
        one-sided result, not a comparison.
      </>
    ),
  },
  {
    title: "The weight edit did not beat the simplest fix.",
    body: (
      <>
        Lowering the score of “unknown” by a fixed amount released about as many answers, and the edit was neither shown better nor
        shown equivalent. Where it was better, giving fewer answers to unanswerable questions, it was on made-up city questions, with a
        write direction built from city words.
      </>
    ),
  },
  {
    title: "Prior work already describes part of the mechanism.",
    body: (
      <>
        <a href="https://arxiv.org/abs/2507.16199" target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          Ling et al. (arXiv 2507.16199)
        </a>{" "}
        report that an “unknown” option suppresses answers the model can give, with the answer kept in middle layers and overridden
        late. My controlled-task picture is close to theirs. It has to be cited as prior work, not presented as new.
      </>
    ),
  },
];

export default function FalseAbstentionWeightEditsPage() {
  return (
    <div className={`${articleFontVariable} min-h-screen bg-[#f5f4ee] font-[family-name:var(--font-geist-sans)] text-[#1c1f1a]`}>
      <NavBar variant="light" />

      <article className="mx-auto max-w-[680px] px-[18px] pb-24 pt-10 md:px-0 md:pt-16">
        <Link href="/research" className={cn(MONO_LABEL, "hover:text-[#15803d]")}>
          ← Research
        </Link>

        <div className={cn(MONO_LABEL, "mt-8 text-[#15803d]")}>Technical report · Preliminary</div>
        <h1 className="mb-4 mt-3 text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] md:text-[46px]">
          Evaluating Agent-Proposed Weight Edits for False Abstention
        </h1>
        <p className="text-[18px] italic leading-relaxed text-[#6b7067] md:text-[19px]">
          A controlled case study in Qwen2.5-3B-Instruct
        </p>
        <div className={cn(MONO_LABEL, "mt-6 tracking-[0.08em]")}>Qamil Mirza · November 8, 2026</div>

        <div className="mt-7 border-b border-[#dcdbd2] pb-8">
          <ReportButton />
        </div>

        <div className="mt-8 rounded-xl border border-[#dcdbd2] bg-white px-5 py-4">
          <div className={cn(MONO_LABEL, "mb-1.5 text-[10px]")}>Before you read</div>
          <p className={cn(BODY_FONT, "m-0 text-[16.5px] leading-[1.65] text-[#2b2f29]")}>
            This is a preliminary report. I’m sharing it early to invite scientific scrutiny, not to announce a finished result. Below
            are the problems I already know about and am actively looking into. If you find others, I want to hear about them.
          </p>
        </div>

        <H2 id="summary">Summary</H2>
        <P>
          Language models sometimes say they can’t answer when the answer is right there in their context. In Qwen2.5-3B-Instruct,
          these false abstentions often come right after the model writes a note that names the correct answer. I asked a Claude Opus
          5.5 agent to propose weight edits that fix this, and evaluated them on held-out data under a protocol fixed in advance.
        </P>
        <P>
          A rank-1 edit to the last layer’s attention output met the repair criterion. On sealed held-out data it recovered 82% of
          false abstentions, while unsupported answers rose from 3.5% to 4.2% and 3% of correct answers broke. It beat three of five
          simpler fixes. It did not clearly beat a plain logit bias against “unknown”, and the agent’s explanations of why its edits
          work were not established.
        </P>

        <H2 id="known-problems">Known problems I’m looking into</H2>
        <ol className="my-6 space-y-7 p-0">
          {KNOWN_PROBLEMS.map((problem, i) => (
            <li key={problem.title} className="grid grid-cols-[28px_1fr] gap-x-3 md:grid-cols-[36px_1fr]">
              <span className="pt-[3px] font-[family-name:var(--font-geist-mono)] text-[12px] font-semibold text-[#15803d]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-[#1c1f1a] md:text-[18px]">
                  {problem.title}
                </div>
                <p className={cn(BODY_FONT, "mb-0 mt-2 text-[17px] leading-[1.65] text-[#2b2f29] md:text-[18px]")}>{problem.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <H2 id="feedback">Feedback</H2>
        <P>
          The point of putting this out now is to find what I’ve missed. <Strong>Critique of the design, the statistics and the
          conclusions is very welcome</Strong>, especially anything that would change a verdict. Write to me at{" "}
          <a href="mailto:qamilmirza@berkeley.edu" className={LINK_CLASS}>
            qamilmirza@berkeley.edu
          </a>
          .
        </P>

        <div className="mt-10">
          <ReportButton />
        </div>
      </article>
    </div>
  );
}
