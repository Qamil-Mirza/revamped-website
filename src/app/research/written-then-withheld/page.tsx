import { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/ui/nav-bar";
import { articleFontVariable, Figure, H2, H3, List, P, Quote, Strong, Table } from "@/components/article/prose";
import { RabbitHoleFigure } from "@/components/article/figures/RabbitHole";
import { QuestionHeading, SixQuestionsFigure } from "@/components/article/figures/SixQuestions";
import { TaskSetupFigure } from "@/components/article/figures/TaskSetup";
import { LateAnswerFigure } from "@/components/article/figures/LateAnswer";
import { ProbeFigure } from "@/components/article/figures/Probe";
import { EditLoopFigure } from "@/components/article/figures/EditLoop";
import { TwoHeadsFigure } from "@/components/article/figures/TwoHeads";
import { HBars } from "@/components/article/figures/HBars";

const LINK_CLASS = "text-[#15803d] underline decoration-[#9fd9b0] underline-offset-2 hover:decoration-[#15803d]";
const TITLE = "A Mechanistic Investigation Of False Abstention In Qwen-2.5-3B Instruct";
const SUMMARY =
  "Qwen 2.5 3B writes the right answer in its own note, then replies “unknown.” I traced why, down to two attention heads, and checked whether other models do it too.";

export const metadata: Metadata = {
  title: "A Mechanistic Investigation Of False Abstention In Qwen-2.5-3B Instruct | Qamil Mirza",
  description: SUMMARY,
  alternates: {
    canonical: "https://qamil-mirza.com/research/written-then-withheld",
  },
};

const PAPERS = [
  {
    authors: "Ling et al.",
    title: "LLM Abstention Can Be a Prompt Artifact, in Addition to Genuine Uncertainty",
    result:
      "Offering an “unknown” option makes models abstain on questions they could answer. Our results support this too: take the option away and Qwen’s false abstention disappears.",
    id: "arXiv:2507.16199",
    href: "https://arxiv.org/abs/2507.16199",
  },
  {
    authors: "Du & Hu",
    title: "Recognition-Refusal Misalignment in LLMs",
    result: "Eleven models recognise an unanswerable question in their middle layers but still choose to answer it.",
    id: "EMNLP 2026",
    href: "https://aclanthology.org/2026.emnlp-main.1078/",
  },
  {
    authors: "Nguyen, Xu et al.",
    title: "The Commit-Abstain Circuit",
    result: "Traced the answer-or-abstain decision to a circuit in ten models.",
    id: "arXiv:2609.32964",
    href: "https://arxiv.org/abs/2609.32964",
  },
  {
    authors: "Liu et al.",
    title: "Broken Symmetry in LLM Refusal",
    result: "Showed that by performing activation patching in Qwen 2.5 7B, you can release an answer the model was holding back.",
    id: "arXiv:2608.15772",
    href: "https://arxiv.org/abs/2608.15772",
  },
];

const PROMPT = `Below is your memory of a long conversation, followed by a question about it. Answer with a short phrase that states the fact asked for. If the memory does not state the answer, reply: unknown
Each memory line shows who said it and when. First write a brief note of at most 80 words: name the facts that bear on the question in a few words each (do not copy whole lines), then do any counting, adding or date arithmetic. [...] Reply unknown only if the memory does not state the answer. End with one line of the form 'Answer: <short phrase>'.

## Memory
user, 2023/03/01 (Wed) 10:00: Paul lives in Liverpool.
user, 2023/03/02 (Thu) 10:00: Paul works as a manager.

## Current input
Question: (asked on 2023/03/03 (Fri) 12:00) Where does Paul live?

Note:`;

function PaperCards() {
  return (
    <div className="my-8 grid gap-3 md:grid-cols-2">
      {PAPERS.map((p) => (
        <a
          key={p.id}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-xl border border-[#dcdbd2] bg-white p-4 transition-colors hover:border-[#9fd9b0]"
        >
          <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#6b7067]">{p.authors}</span>
          <span className="mt-1.5 text-[15px] font-semibold leading-snug text-[#1c1f1a] group-hover:text-[#15803d]">{p.title}</span>
          <span className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[#2b2f29]">{p.result}</span>
          <span className="mt-3 font-[family-name:var(--font-geist-mono)] text-[11px] text-[#15803d]">{p.id} ↗</span>
        </a>
      ))}
    </div>
  );
}

export default function WrittenThenWithheldPage() {
  return (
    <div className={`${articleFontVariable} min-h-screen bg-[#f5f4ee] font-[family-name:var(--font-geist-sans)] text-[#1c1f1a]`}>
      <NavBar variant="light" />

      <article className="mx-auto max-w-[680px] px-[18px] pb-24 pt-10 md:px-0 md:pt-16">
        <Link
          href="/research"
          className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.12em] text-[#6b7067] hover:text-[#15803d]"
        >
          ← Research
        </Link>
        <h1 className="mb-4 mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] md:text-[46px]">{TITLE}</h1>
        <p className="text-[18px] italic leading-relaxed text-[#6b7067] md:text-[19px]">{SUMMARY}</p>
        <div className="mt-6 border-b border-[#dcdbd2] pb-6 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.08em] text-[#6b7067]">
          Qamil Mirza · November 21, 2026
        </div>

        <P>
          It’s been a while since my last research entry. This project started as a way to figure out whether we can design better
          memory systems for LLMs in long-horizon tasks. And man oh man, I did not think we’d go down another rabbit hole. When I
          started this as my thesis work, I remember thinking to myself: no way I’m gonna pivot. Boy, was that unrealistic and naive of
          me.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 1.</Strong> How a memory project became a question about two attention heads.
            </>
          }
        >
          <RabbitHoleFigure />
        </Figure>

        <P>
          In my last entry, I talked about the new and exciting paradigm of{" "}
          <Link href="/research/ai-brain-surgery" className={LINK_CLASS}>
            weight space programming
          </Link>
          . I was really excited about it for a number of reasons, but mainly because it made me think: if LLMs are able to do “brain
          surgery” on other models, then, as the report suggested, we can use them to find where in a model’s hidden activations things
          go wrong, and edit them accordingly. But what’s more interesting to me is this: if frontier models can do that, can they also
          tell me <em>why</em> certain neurons or attention heads behave the way they do?
        </P>
        <P>
          Now, I’ve been working on figuring out why small language models falsely abstain. That is: they have the answer to the
          question in their context window, they write down a note about the relevant fact (I ask them to), the answer is in that note,
          and they still answer “unknown”.
        </P>

        <Quote label="Memory">[2023/03/01] Henry lives in York.</Quote>
        <Quote label="Question">Where does Henry live?</Quote>
        <Quote label="Qwen 2.5 3B · a real reply from a held-out set" tone="model">
          Henry lives in York, as stated on 2023/03/01 (Wed) 10:00. Answer: unknown
        </Quote>

        <P>
          At first I didn’t think much of it. I thought, ok, it’s a small model, it has poor reasoning capabilities, and it just
          hallucinates. But the more I worked on it, the more that question stuck with me. It feels like a cop-out to just blame
          reasoning capabilities when there could be more at play. So I said: let me take a stab at mapping out what really goes on.
        </P>

        <H2 id="the-final-work">The final work</H2>
        <P>
          Ok, so{" "}
          <Link href="/research/more-than-reasoning" className={LINK_CLASS}>
            our earlier results
          </Link>{" "}
          showed that Qwen 2.5 3B falsely abstains quite a bit. First, let’s see whether other people have run into this. I had Claude
          run a deep literature scan, and from it I picked the 20 most relevant papers to read. A few stood out:
        </P>

        <PaperCards />

        <P>
          Ok, so this is a pretty dense field. But one thing still stood out. In their work, the answer stays hidden inside the model:
          it never shows up in the output, and they read the decision from the model’s internals (in the commit-abstain paper, at the
          last token of the question, before the model writes anything). In my case, the model writes the right answer, then says
          “unknown”. You can watch it change its mind, line by line.
        </P>
        <P>
          The other thing I wondered about was whether models from different families have different levels of caution, and whether my
          analysis needed to take that innate “caution level” into account. A more cautious model will say “unknown” more often for
          that reason alone, so the fair comparison is between models that are equally careful.
        </P>
        <P>
          The main question I set out to answer: <Strong>why does this false abstention happen?</Strong> In particular, I wanted to
          know:
        </P>
        <List ordered>
          <li>
            <Strong>Does the answer get lost?</Strong> If I use some sort of layer lens, can I see the right answer token disappear as
            we get closer to the output layer?
          </li>
          <li>
            <Strong>What inside Qwen causes the refusal?</Strong> A set of neurons? A set of attention heads? One particular head?
          </li>
          <li>
            <Strong>Under what scenarios does Qwen choose to abstain?</Strong>
          </li>
        </List>
        <P>In the more general case, I also wanted to see whether the results in Qwen hold in other model families:</P>
        <List ordered>
          <li value={4}>
            <Strong>Do other models falsely abstain too?</Strong> If yes, why? If not, what makes Qwen different?
          </li>
          <li value={5}>
            <Strong>Is there a trade-off with answering the unanswerable?</Strong>
          </li>
          <li value={6}>
            <Strong>Can we fix it?</Strong> (Maybe with weight space programming?)
          </li>
        </List>

        <Figure
          caption={
            <>
              <Strong>Figure 2.</Strong> The six questions. Each section below is marked with where it sits in this grid.
            </>
          }
        >
          <SixQuestionsFigure />
        </Figure>

        <H3>The setup</H3>
        <P>
          To test the models, I generated a synthetic dataset of made-up people, the cities they live and work in, their jobs, and who
          supervises whom. For instance, the memory can hold facts like:
        </P>
        <List>
          <li>Alice lives in Leeds.</li>
          <li>Alice works as a chef.</li>
          <li>Alice’s supervisor is Bob.</li>
          <li>Bob works in Brighton.</li>
        </List>
        <P>This gives me a straightforward way to test false abstention in a few ways:</P>
        <List>
          <li>
            <Strong>Direct lookup:</Strong> the fact is in the memory. The model just needs to retrieve it. “Where does Alice live?”
          </li>
          <li>
            <Strong>Two-step:</Strong> the model has to chain two facts. “In which city does Alice’s supervisor work?” It needs to
            chain “Alice’s supervisor is Bob” and “Bob works in Brighton”, and answer Brighton.
          </li>
          <li>
            <Strong>Update:</Strong> I tell the model someone moved cities, and ask where they live now.
          </li>
        </List>
        <P>
          Each question also has an <Strong>unanswerable</Strong> twin, where the needed fact is missing or belongs to someone else.
          That is how I measure caution: how often a model answers a question it can’t actually answer.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 3.</Strong> The task. One memory, three kinds of question, and an unanswerable twin for each.
            </>
          }
        >
          <TaskSetupFigure />
        </Figure>

        <P>The prompt I used looks like this (one direct lookup):</P>
        <pre className="my-6 whitespace-pre-wrap break-words rounded-xl border border-[#dcdbd2] bg-white px-4 py-3 font-[family-name:var(--font-geist-mono)] text-[12.5px] leading-relaxed text-[#2b2f29]">
          {PROMPT}
        </pre>

        <QuestionHeading n={1}>Does the answer get lost?</QuestionHeading>
        <P>
          First, some ground truth on this made-up city data. I ran Qwen 2.5 3B on it and found that in <Strong>91%</Strong> of its
          false abstentions, the right answer is already in the little note I told it to write.
        </P>
        <P>
          So I applied the logit lens, which reads off what the model would predict at each layer. I initially also fit a Jacobian
          lens, a fancier version, but on Qwen the two told the same story (they agreed on 99.8% of calls), and the logit lens works on
          every model family without fitting anything, so it became the main read-out. Interestingly, what I saw was the opposite of my
          hypothesis. I thought the answer token would disappear somewhere. But no: on <Strong>64%</Strong> of Qwen’s failures the
          right answer is still among the final layer’s <Strong>top-10</Strong> predicted tokens. It only becomes readable late, in
          the last few layers (layers 30–33 of 36). Something pushes the model toward abstaining right at the end...
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 4.</Strong> The answer doesn’t vanish. It only becomes readable to the lens in layers 30–33, and on most
              failures it is still near the top at the last layer, where “unknown” wins anyway.
            </>
          }
        >
          <LateAnswerFigure />
        </Figure>

        <P>
          I also trained a logistic regression classifier on each model’s hidden activations at a middle layer, to see whether those
          activations could tell an answerable question from an unanswerable one. It reached an{" "}
          <Strong>AUROC of 0.994–0.999 across 5 model families</Strong>. So the information about whether a question can be answered
          is linearly readable in every model. This probe shows that the information is there but makes no statement about whether the
          model actually uses that information.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 5.</Strong> A linear probe reads answerability almost perfectly in every family. Every family knows, and
              only one refuses.
            </>
          }
        >
          <ProbeFigure />
        </Figure>

        <P>So the answer doesn’t just magically disappear. Something else must be pushing the model away from giving it...</P>

        <QuestionHeading n={2}>What causes the refusal?</QuestionHeading>
        <P>To figure this out, I tried a lot of approaches, and most of them taught me what the mechanism <em>isn’t</em>:</P>
        <List>
          <li>
            <Strong>Pushing the hidden state toward “answer”</Strong> at one layer released most false “unknown”s, but so did a push
            that carried no information about the answer at all. Any nudge works, which means the push isn’t telling us where the
            decision lives.
          </li>
          <li>
            <Strong>Activation patching, layer by layer</Strong> showed the answer is causally usable from about three-quarters of the
            way through the model, earlier than the lenses can read it.
          </li>
          <li>
            <Strong>Looking for a small set of neurons:</Strong> the push toward “unknown” is spread thin. Half of it needs about
            15,000 of the model’s 396,288 MLP neurons, across layers 6–35. No small neuron circuit to point at.
          </li>
        </List>
        <P>
          Then one day I was told about weight space programming, and I decided to try it for mech interp. I gave Opus 5.5 a sandbox
          and a set of tools. It could run numpy code, ask a metered service to run Qwen on development questions and return its
          outputs and hidden activations, and save weight edits for us to test. It could change only a few kinds of weights (attention
          outputs, MLP down-projections, layer norms), with hard limits on the size of each edit, and it had three submissions. I asked
          it to find a fix for false abstention and not stop there: it also had to give me a plausible explanation of why the component
          it changed matters.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 6.</Strong> The weight-space-editing loop. The agent only ever saw development questions. The final test
              ran on questions sealed away from it.
            </>
          }
        >
          <EditLoopFigure />
        </Figure>

        <P>
          The agent came back with two edits. One was a rank-1 change to the last layer’s attention output. On sealed held-out
          questions it released <Strong>82%</Strong> of false “unknown”s to the right answer, while barely increasing wrong answers to
          unanswerable questions (3.5% → 4.2%). The other zeroed the outputs of two attention heads, layer 32 head 2 and layer 33 head
          10. On a new split it released <Strong>75%</Strong> of false abstentions, against at most 46% for 20 random pairs of heads
          from the same layers. The humbling part, though, is that neither edit was able to beat the simplest fix, a flat bias
          subtracted from the “unknown” token’s score. So while the agent found out this really cool insight, it turns out a simple fix
          works too.
        </P>
        <P>
          To test the agent’s theory further, I ran my own head search: I switched off each of Qwen’s 576 attention heads, one at a
          time, at the answer position, on development questions. The top two were <Strong>layer 28 head 2</Strong> and{" "}
          <Strong>layer 33 head 10</Strong>, which shares a head with the agent’s pair.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 7.</Strong> All 576 of Qwen 2.5 3B’s attention heads. My search and the agent landed on pairs that share
              layer 33 head 10. Zeroing my pair released 96.7% of written-then-withheld abstentions on held-out questions.
            </>
          }
        >
          <TwoHeadsFigure />
        </Figure>

        <P>
          Then I tested those two heads on a held-out set of questions I hadn’t touched. Zeroing them released <Strong>96.7%</Strong>{" "}
          of the false abstentions where the answer was written, against at most <Strong>11.2%</Strong> for the best of 20 random
          pairs. This wasn’t exactly a free edit. Zeroing out these heads also made the model answer 6.4% of the questions it had
          correctly called “unknown” because they were genuinely unanswerable.
        </P>
        <P>
          What are they doing? Layer 33 head 10 spends 61% of its attention on the “unknown” option text in the prompt. Blocking just
          the two heads’ view of those option words released 77% of false abstentions, while blocking random words of the same count
          released nothing. But the push isn’t special to false abstentions: zeroing the heads also lowers the “unknown” score on
          questions the model already answered correctly. So these two heads aren’t a dedicated “false abstention circuit”, and I
          didn’t find one elsewhere. What I can say though is that these heads seem to carry a general push towards the “unknown”,
          read off the option text, and false abstentions are the close calls it tips over.
        </P>

        <QuestionHeading n={3}>When does Qwen abstain?</QuestionHeading>
        <P>
          Weirdly, it’s worst where the answer is easiest to find. On development questions, Qwen falsely abstains on 69% of direct
          lookups, 33% of two-step questions and 12% of updates, and more often when there are more distractor facts (25% → 39% →
          50%). Take the “unknown” option out of the prompt and false abstention drops to under 1%.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 8.</Strong> Qwen 2.5 3B’s false abstention rate on development questions. With no “unknown” option in
              the prompt, it is under 1% everywhere.
            </>
          }
        >
          <div className="p-4 md:p-6">
            <HBars
              groups={[
                {
                  title: "By question type",
                  bars: [
                    { label: "Direct lookup", value: 69 },
                    { label: "Two-step", value: 33 },
                    { label: "Update", value: 12 },
                  ],
                },
                {
                  title: "By number of distractor facts",
                  bars: [
                    { label: "Fewest", value: 25, tone: "light" },
                    { label: "More", value: 39, tone: "light" },
                    { label: "Most", value: 50 },
                  ],
                },
                {
                  title: "Without the “unknown” option",
                  bars: [{ label: "All questions", value: 1, display: "< 1%", tone: "muted" }],
                },
              ]}
              axisLabel="false abstention, % of answerable questions"
            />
          </div>
        </Figure>

        <QuestionHeading n={4}>Do other models do it? Why only Qwen?</QuestionHeading>
        <P>
          This is where my “small models just do this” assumption fell apart. I graded free-form answers from ten models with a Claude
          judge that I’d checked against my own hand labels. Among every model I could score, only Qwen 2.5 3B falsely abstains (42%).
          Llama 3.2 3B, Gemma 3 4B, Phi-4-mini and Granite 3.3 2B all stay at or below 3.6%. Even Qwen’s own siblings don’t do it: Qwen
          2.5 7B is at 1.3%, Qwen 3 1.7B at 1.0%, Qwen 3 8B at 0%.
        </P>
        <P>
          And the other models fail in the <em>other</em> direction: when they’re wrong, they give a real city from the memory, but it’s
          the wrong person’s city.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 9.</Strong> False abstention across models, graded by a Claude judge checked against hand labels. The second row covers Llama 3.2 3B, Gemma 3 4B, Phi-4-mini and Granite 3.3 2B. Qwen
              2.5 3B is the only one that does it.
            </>
          }
        >
          <div className="p-4 md:p-6">
            <HBars
              groups={[
                {
                  bars: [
                    { label: "Qwen 2.5 3B", value: 42 },
                    { label: "Llama, Gemma, Phi, Granite", value: 3.6, display: "≤ 3.6%", tone: "muted" },
                    { label: "Qwen 2.5 7B", value: 1.3, tone: "muted" },
                    { label: "Qwen 3 1.7B", value: 1.0, display: "1.0%", tone: "muted" },
                    { label: "Qwen 3 8B", value: 0, tone: "muted" },
                  ],
                },
              ]}
              axisLabel="false abstention, % of answerable questions"
            />
          </div>
        </Figure>

        <P>
          So why only Qwen? I compared Qwen 2.5 3B with its base model (before instruction tuning) on the same questions. The base
          model already falsely abstains (22%, against 44% for the instruct model), but differently: it mostly misses the fact. The
          answer is in its note in only 21% of its false abstentions, against 96% for the instruct model. On direct lookups it refuses
          13 of 120, while the instruct model refuses 100 of 120. So the habit starts in the base model, and “written, then withheld”
          mostly arrives with instruction tuning.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 10.</Strong> Qwen 2.5 3B before (base) and after (instruct) instruction tuning, on the same questions.
            </>
          }
        >
          <div className="p-4 md:p-6">
            <HBars
              groups={[
                {
                  title: "False abstention",
                  bars: [
                    { label: "Base", value: 22, tone: "muted" },
                    { label: "Instruct", value: 44 },
                  ],
                },
                {
                  title: "Of those, answer already in the note",
                  bars: [
                    { label: "Base", value: 21, tone: "muted" },
                    { label: "Instruct", value: 96 },
                  ],
                },
                {
                  title: "Direct lookups refused",
                  bars: [
                    { label: "Base", value: (13 / 120) * 100, display: "13 / 120", tone: "muted" },
                    { label: "Instruct", value: (100 / 120) * 100, display: "100 / 120" },
                  ],
                },
              ]}
            />
          </div>
        </Figure>

        <QuestionHeading n={5}>Is it a trade-off with answering the unanswerable?</QuestionHeading>
        <P>
          Qwen is also the most cautious model of the five: it answers only 2.3% of unanswerable questions, while the others answer
          6.7–27.7%. So maybe it’s just caution? I tested that by making the others more careful. With a stricter instruction (“reply
          unknown unless the memory states the answer exactly”), Llama and Phi became as cautious as Qwen (answering 1% of
          unanswerable questions), and their false abstention stayed at 3% and 0%. On the same questions, Qwen’s was 58%.
        </P>
        <P>
          Honest caveat: forcing the issue with a logit push toward “unknown” <em>can</em> bring Llama and Gemma close to (or past)
          Qwen’s level, so the pre-registered caution test failed, and I can’t rule caution out completely.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 11.</Strong> False abstention under the stricter instruction. Llama and Phi become as cautious as Qwen
              (answering 1% of unanswerable questions) and still don’t falsely abstain.
            </>
          }
        >
          <div className="p-4 md:p-6">
            <HBars
              groups={[
                {
                  bars: [
                    { label: "Qwen 2.5 3B", value: 58 },
                    { label: "Llama 3.2 3B", value: 3, tone: "muted" },
                    { label: "Phi-4-mini", value: 0, tone: "muted" },
                  ],
                },
              ]}
              axisLabel="false abstention, % of answerable questions"
            />
          </div>
        </Figure>

        <QuestionHeading n={6}>Can we fix it?</QuestionHeading>
        <P>Yes, several ways, and every fix has a price:</P>
        <Table
          head={["Fix", "Cost", "False “unknown”"]}
          rows={[
            ["Switch off the two heads", "6% of correct refusals become answers", "97% released"],
            ["Flat bias against “unknown”", "6% of correct refusals become answers", "87% released"],
            ["A few worked examples in the prompt", "Answers 18% of unanswerable questions (was 2%)", "42% → 2%"],
            ["Remove the “unknown” option", "Answers 66% of unanswerable questions", "40% → 0%"],
          ]}
        />
        <P>
          The head switch-off and the plain bias cost about the same, which tells you something: the heads explain the behaviour, but
          as a fix they’re no better than the blunt tool.
        </P>

        <H2 id="learnings">Learnings</H2>
        <P>
          I think this was such an interesting project for my thesis, though I feel like I’m in a weird space. The thesis is supposed
          to be finished next semester, and I don’t think there’s much more to pursue here. Maybe I’m wrong? I don’t know. Some
          questions I genuinely still have: why couldn’t we find a general mechanism across models? And does zeroing these heads affect
          anything else in the model’s usual work? I only measured it on this task.
        </P>
        <P>
          Part of me thinks I wouldn’t have dug this deep had I tried to establish a baseline across model families first. Instead, I
          went deeper and deeper into Qwen, and only after talking to grad students from other universities did I seriously ask
          whether the behaviour generalised to other models. That’s tunnel vision and the oil drilling paradox for ya HAHA.
        </P>
        <P>If I had to sum up my learnings:</P>
        <List ordered>
          <li>
            <Strong>Don’t jump the gun into experiments.</Strong> Figure out the landscape first: what have people tried, and what
            haven’t they? Science is a collective endeavour, and there’s too little time in one’s life to make the same mistakes other
            people already have.
          </li>
          <li>
            <Strong>Talk to people about your ideas more.</Strong> Have them break your theories and challenge your beliefs. It helps
            avoid tunnel vision. The flip side: don’t let criticism get you down too much. Receiving feedback is a balancing act.
          </li>
        </List>

        <H2 id="whats-next">What’s next</H2>
        <P>
          The result is a case study of one model rather than a law about all small models, so I’ll try to publish it at a workshop.
          I’d never done that independently before, and I’m prepared for the wave of reviewer feedback. Next, I’m moving to a new
          research project: extending the work in “Are Large Reasoning Models Interruptible?” on their self-doubt behaviour.
        </P>
        <P className="italic">
          Have questions? Concerns? Feedback? Criticism? Send them my way at{" "}
          <a href="mailto:qamilmirza@berkeley.edu" className={LINK_CLASS}>
            qamilmirza@berkeley.edu
          </a>
          , and I’ll gladly have a look. Thanks for your time :)
        </P>
      </article>
    </div>
  );
}
