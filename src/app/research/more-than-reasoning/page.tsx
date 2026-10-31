import { Metadata } from "next";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { NavBar } from "@/components/ui/nav-bar";
import { Cite, Figure, H2, H3, List, P, Quote, Strong, Table, Tex } from "@/components/article/prose";
import { EQUATIONS } from "@/lib/article-math";
import { REFERENCES } from "@/lib/article-refs";
import { SnaggletoothFigure } from "@/components/article/figures/Snaggletooth";
import { MemoryTiersFigure } from "@/components/article/figures/MemoryTiers";
import { OracleFigure } from "@/components/article/figures/Oracle";
import { ControllerReaderFigure } from "@/components/article/figures/ControllerReader";
import { TeacherResultFigure } from "@/components/article/figures/TeacherResult";
import { QuerySelectionFigure } from "@/components/article/figures/QuerySelection";
import { InterventionsFigure } from "@/components/article/figures/Interventions";
import { LogitLensFigure } from "@/components/article/figures/LogitLens";
import { LensFigure } from "@/components/article/figures/Lens";
import { SpiderAntFigure } from "@/components/article/figures/SpiderAnt";
import { RelationalChainFigure } from "@/components/article/figures/RelationalChain";
import { EvidenceControlFigure } from "@/components/article/figures/EvidenceControl";
import { LensGatesFigure } from "@/components/article/figures/LensGates";
import { InterventionTradeoffFigure } from "@/components/article/figures/InterventionTradeoff";
import { ThreeQuestionsFigure } from "@/components/article/figures/ThreeQuestions";

export const metadata: Metadata = {
  title: "More Than Reasoning | Qamil Mirza",
  description:
    "How a project about managing an AI agent's memory turned into an investigation of what language models actually do with the information we give them.",
  alternates: {
    canonical: "https://qamil-mirza.com/research/more-than-reasoning",
  },
};

export default function MoreThanReasoningPage() {
  return (
    <div className="min-h-screen bg-[#f5f4ee] font-[family-name:var(--font-geist-sans)] text-[#1c1f1a]">
      <NavBar variant="light" />

      <article className="mx-auto max-w-[680px] px-[18px] pb-24 pt-10 md:px-0 md:pt-16">
        <Link
          href="/research"
          className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.12em] text-[#6b7067] hover:text-[#15803d]"
        >
          ← Research
        </Link>
        <h1 className="mb-4 mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] md:text-[46px]">
          More Than Reasoning: What Memory Experiments Taught Me About Language Models
        </h1>
        <p className="text-[18px] italic leading-relaxed text-[#6b7067] md:text-[19px]">
          How a project about managing an AI agent’s memory turned into an investigation of what language models actually do
          with the information we give them.
        </p>
        <div className="mt-6 border-b border-[#dcdbd2] pb-6 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.08em] text-[#6b7067]">
          Qamil Mirza · October 30, 2026
        </div>

        <aside className="mt-8 rounded-2xl border border-[#9fd9b0] bg-[#f3fbf5] px-5 py-4">
          <div className="mb-1.5 font-[family-name:var(--font-geist-mono)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#15803d]">
            TL;DR
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-[16px] leading-[1.6] text-[#2b2f29] marker:text-[#15803d]">
            <li>
              I set out to make AI agents better at managing their memory. Picking the right evidence once the question is known
              helped: roughly ten points more accurate with about a third of the tokens.
            </li>
            <li>But a small model wrote the right answer into its own note and then said “unknown.”</li>
            <li>Having the right information isn’t the same as using it.</li>
            <li>
              My honors thesis now uses interpretability tools like the logit lens and the J-lens to look at what happens between
              reading the evidence and producing an answer, while being careful about what those tools can and can’t prove.
            </li>
          </ul>
        </aside>

        <P>Why do agents suck sometimes?</P>
        <P>That was pretty much the question I started with.</P>
        <P>
          We have AI agents that can browse the internet, read documents, search through conversation histories, and even store
          information for later. Yet somehow, they still manage to fail at questions that seem ridiculously straightforward.
        </P>
        <P>Naturally, I wanted to understand why.</P>
        <P>
          One of the first things I became interested in was <Strong>memory</Strong>. More specifically, how an agent decides
          what information to remember, what to forget, and what to retrieve when it needs to answer a question.
        </P>
        <P>I figured that if we could give an agent the right information at the right time, we could make it perform better.</P>
        <P>Sounds reasonable, right?</P>
        <P>Well, somewhere along the way, I ran into this rather interesting example.</P>

        <Figure
          caption={
            <>
              <Strong>Figure 1.</Strong> The memory contains the answer, and the model even copies it into its own note. Then it
              answers “unknown.” Qwen2.5-3B-Instruct<Cite id="qwen2024" />, given eight selected memory entries from a
              LongMemEval-S conversation<Cite id="wu2024" />.
            </>
          }
        >
          <SnaggletoothFigure />
        </Figure>

        <P>WHAT!?</P>
        <P>
          The answer was literally sitting right there! Heck, the model had even written it down in its own note before
          deciding that it didn’t know the answer.
        </P>
        <P>
          For some context, this was Qwen2.5-3B-Instruct<Cite id="qwen2024" />, a relatively small language model with around
          three billion parameters. It was given eight selected memory entries from a conversation in the LongMemEval-S
          benchmark<Cite id="wu2024" />.
        </P>
        <P>
          We had instructed it to write a brief note before answering, and to respond with “unknown” if the memory didn’t
          contain enough information.
        </P>
        <P>
          But here’s the interesting part: <Strong>the memory did contain the answer, and the model had reproduced it.</Strong>
        </P>
        <P>
          Now, before we get too excited, this doesn’t necessarily mean the model understood everything and simply decided not
          to answer. There are several possible explanations for what happened.
        </P>
        <P>
          What it does tell us, however, is that retrieving the correct information doesn’t guarantee that a model will
          actually use it to produce the correct answer.
        </P>
        <P>That observation would eventually change the direction of my research.</P>
        <P>But to understand how I got here, we have to go back to where this project started.</P>

        <H2 id="optimization">1. Can we treat memory as an optimization problem?</H2>
        <P>One of the classes I took at UC Berkeley was CS170, Efficient Algorithms and Intractable Problems.</P>
        <P>
          A big part of the class involves taking seemingly complicated problems, figuring out their mathematical structure, and
          designing algorithms to solve them efficiently.
        </P>
        <P>So naturally, I wondered whether we could do something similar with memory management.</P>
        <P>Imagine you’re having a conversation with an AI assistant over several months.</P>
        <P>
          You tell it about your classes, your favorite coffee, the restaurants you’ve visited, the projects you’re working on,
          and a whole bunch of other things.
        </P>
        <P>Some of that information might become useful later. A lot of it probably won’t.</P>
        <P>
          The problem is that language models have a limited amount of context they can process at once. We can’t necessarily
          keep feeding the entire conversation history back into the model every time we ask it a question.
        </P>
        <P>We have to be selective.</P>
        <P>In my initial framework, I divided memory into three categories:</P>
        <List ordered>
          <li>
            <Strong>Active memory:</Strong> Information currently visible to the language model.
          </li>
          <li>
            <Strong>Archived memory:</Strong> Information stored somewhere else that the agent could retrieve later.
          </li>
          <li>
            <Strong>Deleted memory:</Strong> Information that’s permanently gone.
          </li>
        </List>

        <Figure
          caption={
            <>
              <Strong>Figure 2.</Strong> The three tiers. Each time a new memory arrives, the active tier is over budget, so
              something has to be archived or deleted to make room.
            </>
          }
        >
          <MemoryTiersFigure />
        </Figure>

        <P>
          The goal was straightforward: preserve the information most likely to help answer future questions without exceeding
          our memory budget.
        </P>
        <P>Of course, there’s a catch.</P>
        <P>
          <Strong>How do we know which information will be useful in the future?</Strong>
        </P>
        <P>We don’t.</P>
        <P>But what if, just for an experiment, we pretended that we did?</P>

        <H3>Building an oracle that knows the future</H3>
        <P>This is where my amazingly intelligent friend Claude and I started working on a hindsight optimizer.</P>
        <P>
          An <em>oracle</em> is essentially a system with privileged information. In our case, it knew exactly which pieces of
          memory would be required to answer future questions.
        </P>
        <P>Think of it like studying for an exam, except someone has already handed you the questions.</P>
        <P>You’d know precisely which topics to focus on and which ones you could safely ignore.</P>

        <Figure
          caption={
            <>
              <Strong>Figure 3.</Strong> The oracle’s view. Future questions reach back to the memories they will need; everything
              else is safe to delete. A real agent never gets to see the right-hand side.
            </>
          }
        >
          <OracleFigure />
        </Figure>

        <P>For our restricted keep-or-delete problem, we implemented an exact optimizer with the following objective:</P>
        <Tex display>{EQUATIONS.objective}</Tex>
        <P>Okay, that’s a mouthful. Let’s unpack it.</P>
        <P>
          Here, <Tex>{"y_q"}</Tex> indicates whether we preserved all the evidence needed to answer question <Tex>{"q"}</Tex>.
          Meanwhile, <Tex>{"x_{i,k}"}</Tex> tells us whether memory item <Tex>{"i"}</Tex> is still active at its{" "}
          <Tex>{"k"}</Tex>-th required use, and <Tex>{"s_i"}</Tex> is the number of tokens that item occupies.
        </P>
        <P>
          The first term rewards us for preserving enough information to answer future questions. The second term gives us a
          small incentive to use less memory.
        </P>
        <P>We also introduced constraints to make sure our optimizer behaved realistically.</P>
        <P>For instance:</P>
        <Tex display>{EQUATIONS.noResurrection}</Tex>
        <P>This says that once we’ve deleted something, we can’t magically bring it back.</P>
        <P>Another constraint ensured that every piece of evidence required by a question was covered by at least one retained memory item:</P>
        <Tex display>{EQUATIONS.coverage}</Tex>
        <P>
          This applies to each evidence requirement <Tex>{"r"}</Tex> of question <Tex>{"q"}</Tex>, where <Tex>{"C(r)"}</Tex>{" "}
          represents the memory items containing that evidence.
        </P>
        <P>Finally, we enforced our active-memory budget:</P>
        <Tex display>{EQUATIONS.budget}</Tex>
        <P>
          Here, <Tex>{"B"}</Tex> is the maximum number of tokens we’re allowed to keep active, and <Tex>{"\\tau"}</Tex>{" "}
          represents a relevant point in time.
        </P>
        <P>We chose a sufficiently small tie-breaker,</P>
        <Tex display>{EQUATIONS.tieBreaker}</Tex>
        <P>for nonempty instances, so maximizing evidence coverage remained our primary objective.</P>
        <P>
          <Strong>Mathematical lingo aside, here’s all we’re really doing:</Strong>
        </P>
        <P>
          We’re trying to preserve enough information to answer as many future questions as possible while staying within a
          limited memory budget.
        </P>
        <P>
          The optimizer provides a reference point for how well a practical memory controller could theoretically perform under
          these assumptions.
        </P>
        <P>But there’s something important I haven’t mentioned yet.</P>
        <P>
          <Strong>We assumed that whenever the model had all the required evidence, it would answer correctly.</Strong>
        </P>
        <P>At the time, that seemed like a reasonable way to isolate the memory-management problem.</P>
        <P>As you can probably guess from the Snaggletooth example, that assumption would eventually come back to haunt me.</P>

        <H3>Separating memory failures from reasoning failures</H3>
        <P>Before going further, let me explain how I tested these memory controllers.</P>
        <P>Imagine the following conversation:</P>
        <Quote>
          The car wash cost $15.
          <br />
          The parking ticket cost $50.
        </Quote>
        <P>A few days later, you ask:</P>
        <Quote label="Question">How much did I spend on the car wash and parking ticket?</Quote>
        <P>Obviously, the answer is $65.</P>
        <P>But there are actually two separate things our agent needs to do.</P>
        <P>First, it needs to remember that the car wash cost $15 and the parking ticket cost $50.</P>
        <P>Second, it needs to combine those two facts and calculate the answer.</P>
        <P>
          The first is the <Strong>controller’s responsibility</Strong>. The second is the <Strong>reader’s responsibility</Strong>.
        </P>
        <P>Now imagine the model answered $55 instead.</P>
        <P>
          Was that because the controller forgot one of the numbers? Or because the language model made a mistake while adding
          them?
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 4.</Strong> Same question, three outcomes. A wrong answer can come from the controller dropping
              evidence or from the reader misusing evidence it was given, and the two need to be scored separately.
            </>
          }
        >
          <ControllerReaderFigure />
        </Figure>

        <P>If we want to evaluate memory management, we shouldn’t confuse those two failures.</P>
        <P>
          So, for the early synthetic experiments, I used a <em>scripted reader</em>.
        </P>
        <P>
          Instead of asking a real language model to solve the question, this program simply checked whether all the required
          information was available.
        </P>
        <P>If it was, we counted the question as successfully answered.</P>
        <P>This let us study memory allocation without worrying about the language model making mistakes.</P>
        <P>And with that, we had a fairly clean experimental setup for testing different memory controllers.</P>

        <H2 id="regret">2. Teaching a memory controller what to regret</H2>
        <P>Now, our hindsight optimizer had a pretty unfair advantage.</P>
        <P>It knew the future.</P>
        <P>
          A real agent obviously doesn’t have that luxury. It has to make decisions about what to remember without knowing what
          someone might ask tomorrow.
        </P>
        <P>So the next question was whether we could train a controller to make those decisions intelligently.</P>
        <P>
          One approach I explored involved <Strong>learning from hindsight regret</Strong>.
        </P>
        <P>The intuition is simple.</P>
        <P>Imagine you deleted a message today, only to realize next week that you desperately needed it.</P>
        <P>You’d probably regret deleting it.</P>
        <P>But if that message never became useful again, deleting it wouldn’t have mattered.</P>
        <P>We tried to formalize that idea by assigning costs to memory-management actions:</P>
        <Tex display>{EQUATIONS.costEvict}</Tex>
        <Tex display>{EQUATIONS.costArchive}</Tex>
        <P>Don’t worry too much about the notation.</P>
        <P>The indicator function is simply one if the memory item will be needed again, and zero otherwise.</P>
        <P>
          The parameter <Tex>{"\\rho"}</Tex> represents the risk of failing to retrieve an archived item.
        </P>
        <P>For the initial experiment, we assumed archiving was free and retrieval was perfect. That gave us:</P>
        <Tex display>{EQUATIONS.costEvictFree}</Tex>
        <Tex display>{EQUATIONS.costArchiveFree}</Tex>
        <P>Essentially, deleting something important is bad. Archiving it is safe.</P>
        <P>But what about something that will never be useful again?</P>
        <P>Well, both actions are equally acceptable!</P>
        <P>And believe it or not, that tiny distinction turned out to matter quite a bit.</P>

        <H3>A small change that made a big difference</H3>
        <P>Our earlier hindsight teacher preferred deleting information that would never be needed again.</P>
        <P>That makes perfect sense if you know the future.</P>
        <P>Unfortunately, the learner didn’t know the future.</P>
        <P>It had to guess which pieces of information would become useful, and it couldn’t always make that distinction correctly.</P>
        <P>
          So while it was trying to imitate the teacher, it could learn to delete information without actually learning when
          deletion was safe.
        </P>
        <P>Not exactly what we wanted.</P>
        <P>We changed the teacher to accept multiple equally good actions rather than forcing it to prefer one.</P>
        <P>Our imitation-learning loss became:</P>
        <Tex display>{EQUATIONS.removeLoss}</Tex>
        <P>
          Here, <Tex>{"A^*(s)"}</Tex> represents the set of actions the teacher considers acceptable in state <Tex>{"s"}</Tex>,
          while <Tex>{"\\pi_\\theta(a\\mid s)"}</Tex> is the learner’s probability of choosing action <Tex>{"a"}</Tex>.
        </P>
        <P>
          Instead of insisting that the controller copy one particular action, we rewarded it for assigning probability to any
          acceptable action. We accumulated this loss across removal decisions and also trained retrieval predictions.
        </P>
        <P>And the result?</P>
        <P>
          At a 2% active-memory budget, average success on our synthetic recall task increased from <Strong>0.335 to 0.851</Strong>
          , across three training seeds.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 5.</Strong> Average success on the synthetic recall task at a 2% active-memory budget, mean of three
              training seeds. Synthetic setting: free archive, perfect retrieval, scripted reader.
            </>
          }
        >
          <TeacherResultFigure />
        </Figure>

        <P>That’s a pretty substantial improvement from changing how we defined the teacher’s preferences!</P>
        <P>But I want to emphasize something.</P>
        <P>
          These were synthetic experiments with a free archive, perfect retrieval, and a scripted reader. The result showed
          that the revised teacher worked better under those particular conditions.
        </P>
        <P>
          It did <Strong>not</Strong> mean we’d suddenly solved memory management for real language-model agents.
        </P>
        <P>In fact, once I started testing with actual language models, things became a lot more complicated.</P>

        <H2 id="rl">3. What happens when we introduce reinforcement learning?</H2>
        <P>Naturally, I also wanted to see whether reinforcement learning could improve the controller.</P>
        <P>The idea was to reward the controller for completing tasks successfully while penalizing undesirable behavior.</P>
        <P>In the early experiments, we used:</P>
        <Tex display>{EQUATIONS.reward}</Tex>
        <P>
          The controller received a task reward, but lost points whenever it took invalid actions or forced the system to evict
          information to stay within its memory budget.
        </P>
        <P>We then optimized the discounted return:</P>
        <Tex display>{EQUATIONS.discountedReturn}</Tex>
        <P>In simpler terms, we wanted the controller to make decisions that would lead to better outcomes over time.</P>
        <P>
          These rewards applied to the early controller experiments; later experiments involving evidence selection and memory
          writing used different objectives.
        </P>
        <P>So, did reinforcement learning beat imitation learning?</P>
        <P>Well... no.</P>
        <P>At least not in the settings we tested.</P>
        <P>Across those experiments, reinforcement learning didn’t outperform imitation.</P>
        <P>
          That was disappointing, but it was also useful information. It suggested that simply introducing a more sophisticated
          training algorithm wasn’t necessarily going to solve the problem.
        </P>

        <H3>Moving from synthetic tasks to real conversations</H3>
        <P>Up until this point, we’d largely been testing memory management in a controlled environment.</P>
        <P>But real conversations are messy.</P>
        <P>
          People refer to things indirectly, mention important facts across different messages, change their minds, and ask
          questions that require combining several pieces of information.
        </P>
        <P>
          So I moved toward benchmarks such as LongMemEval<Cite id="wu2024" />, where the model has to answer questions using
          information from longer conversation histories.
        </P>
        <P>And instead of using a scripted reader, we now had an actual language model generating answers.</P>
        <P>This was important because it brought us closer to how real AI agents operate.</P>
        <P>
          One of the clearest positive results came from <Strong>query-aware memory selection</Strong>.
        </P>
        <P>Instead of deciding what to keep without knowing the question, we selected relevant evidence once the question was available.</P>
        <P>
          In the LongMemEval configurations we tested, this improved answer accuracy by roughly ten percentage points compared
          with a recency-based baseline, while using about one-third as many prompt tokens.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 6.</Strong> Schematic of the two prompts. Blocks stand for chunks of prompt, and green ones hold
              evidence the question needs. The measured results are the ones shown below the bars: about a third of the tokens
              and roughly ten points more accuracy.
            </>
          }
        >
          <QuerySelectionFigure />
        </Figure>

        <P>That’s pretty exciting!</P>
        <P>
          It suggested that intelligently selecting the information supplied to a model could improve performance while reducing
          context usage.
        </P>
        <P>However, there’s another result worth mentioning.</P>
        <P>Our neural selector didn’t demonstrate an advantage over logistic regression when both used the same features.</P>
        <P>Yes, logistic regression. The same relatively simple model you probably encountered in an introductory machine-learning class.</P>
        <P>I found that rather amusing.</P>
        <P>We could build a complicated neural controller, but a much simpler model could perform comparably on the tested selection task.</P>
        <P>
          So the evidence supported the value of selecting relevant information. It didn’t provide particularly strong evidence
          that our more elaborate controller architecture was responsible for the improvement.
        </P>
        <P>But something else was becoming apparent.</P>
        <P>Even when we supplied the model with the correct information, it didn’t always answer correctly.</P>
        <P>
          <Strong>The memory controller could do its job, and the language model could still fail.</Strong>
        </P>
        <P>And that brought me back to the strange example I showed you at the beginning.</P>

        <H2 id="unknown">4. The model had the answer. So why did it say unknown?</H2>
        <P>Remember our little Snaggletooth example?</P>
        <P>Let’s look at it again.</P>
        <Quote label="Question">What type of action figure did I buy from a thrift store?</Quote>
        <Quote label="Memory">…just got a rare blue Snaggletooth action figure from a thrift store a few weeks ago.</Quote>
        <Quote label="Model output" tone="model">
          user mentioned buying a rare blue Snaggletooth action figure from a thrift store a few weeks ago.
          <br />
          <br />
          Answer: unknown
        </Quote>
        <P>This example fascinated me because the model wasn’t merely overlooking a relevant memory entry.</P>
        <P>It had actually reproduced the information we needed in its own note!</P>
        <P>So I tried a small experiment.</P>
        <P>What if we preserved the model’s note exactly as it was, but changed the instruction for its final answer?</P>
        <P>We added:</P>
        <Quote label="New final instruction">Based on the note above, give the answer as a short phrase. Do not reply unknown.</Quote>
        <P>And suddenly, the model responded:</P>
        <Quote label="Model output" tone="model">Snaggletooth action figure</Quote>
        <P>There it is!</P>
        <P>The model could produce the correct answer when we changed the instruction.</P>
        <P>Now, it’s tempting to conclude that the model knew the answer all along and simply refused to say it.</P>
        <P>But I’d be careful with that interpretation.</P>
        <P>
          What we’ve actually shown is that the model’s response was sensitive to its instructions. We haven’t established
          exactly what happened internally.
        </P>
        <P>
          Perhaps the model had enough information but was overly inclined to abstain. Perhaps the prompt influenced how it
          evaluated the evidence.
        </P>
        <P>We’d need more experiments to distinguish those possibilities.</P>
        <P>And this becomes even more interesting when we look at another example.</P>

        <H3>What about questions that require combining information?</H3>
        <P>This time, the question was:</P>
        <Quote label="Question">How much did I spend on car wash and parking ticket?</Quote>
        <P>The model received two relevant memories:</P>
        <Quote label="Memory">
          Car wash: $15
          <br />
          Parking ticket: $50
        </Quote>
        <P>Obviously, we’re expecting $65.</P>
        <P>But here’s what the model produced:</P>
        <Quote label="Model output" tone="model">
          user mentioned spending $15 on a car wash on February 3rd and $50 on a parking ticket on January 5th.
          <br />
          <br />
          Answer: unknown
        </Quote>
        <P>Again!?</P>
        <P>This time, though, there’s an important difference.</P>
        <P>In the Snaggletooth example, the answer was already explicitly present in the model’s note.</P>
        <P>Here, the note contains the two numbers, but the model still needs to perform an addition.</P>
        <P>We then tried:</P>
        <Table
          head={["Condition", "What we changed", "Result"]}
          rows={[
            [
              "Keep the existing note and continue",
              "Preserved the note containing $15 and $50, then added: “Based on the note above, give the answer as a short phrase. Do not reply unknown.”",
              "$65",
            ],
            [
              "Generate a fresh response",
              "Changed the original instructions to require a best guess instead of allowing “unknown,” then generated the note and answer again from the same evidence.",
              "$55",
            ],
          ]}
        />
        <P>
          The second condition did not preserve the successful extraction of $15 and $50 in the original note. It let the model
          produce a new response from the beginning.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 7.</Strong> How each prompt was changed. Keeping the model’s own note and adding one final instruction
              recovered both answers. Rewriting the instructions and generating from scratch threw that note away, and the new
              response got the sum wrong.
            </>
          }
        >
          <InterventionsFigure />
        </Figure>

        <P>The important takeaway here is that different interventions led to different outcomes.</P>
        <P>Simply telling the model not to answer “unknown” wasn’t a reliable way of recovering correct answers.</P>
        <P>And we shouldn’t treat these two examples as evidence of exactly the same underlying problem.</P>
        <P>In the first example, the model needed to extract information that was already explicitly written in its note.</P>
        <P>In the second, it needed to combine information and perform a calculation.</P>
        <P>Those are different computational requirements.</P>
        <P>
          The examples also came from one model and prompt family, so they don’t tell us how frequently either failure occurs
          across language models.
        </P>
        <P>But they raised a question I found much more interesting than the one I’d originally started with:</P>
        <P>
          <Strong>If the information is available, what actually happens between reading that information and producing an answer?</Strong>
        </P>
        <P>And more importantly, can we observe that process?</P>

        <H2 id="inside">5. Looking inside a language model</H2>
        <P>This is where my project started drifting toward mechanistic interpretability.</P>
        <P>Up until now, we’d mostly been evaluating models by looking at their inputs and outputs.</P>
        <P>We supplied some information, asked a question, and checked whether the answer was correct.</P>
        <P>But a language model is doing a whole bunch of computation between those two points.</P>
        <P>The question is whether we can inspect that computation and learn something useful about how the model arrives at its answer.</P>
        <P>
          One technique I started exploring was called the <Strong>logit lens</Strong>
          <Cite id="nostalgebraist2020" />.
        </P>

        <H3>The logit lens: Peeking inside the network</H3>
        <P>A transformer processes information through multiple layers.</P>
        <P>
          At each layer, the model maintains internal representations of the tokens it’s processing. These representations
          evolve as the information moves through the network.
        </P>
        <P>Normally, we only decode the final representation into a prediction over the model’s vocabulary.</P>
        <P>But what if we took the representations from an earlier layer and tried decoding those instead?</P>
        <P>That’s essentially the intuition behind the logit lens.</P>
        <P>It lets us inspect intermediate activations by mapping them into the model’s output vocabulary.</P>
        <P>
          For example, instead of only seeing the final answer, we might observe which words are associated with the model’s
          representations at different points in the network.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 8.</Strong> The logit lens, drawn schematically. Tap the activation at any layer and decode it with
              the final layer’s unembedding. Read-outs from early layers tend to be diffuse; later ones concentrate on the token
              the model goes on to predict. The bar heights are illustrative, not measured.
            </>
          }
        >
          <LogitLensFigure />
        </Figure>

        <P>Pretty cool, right?</P>
        <P>Well, there is a problem.</P>
        <P>
          Representations can change across layers, and directly decoding an intermediate activation assumes that its coordinates
          are already compatible with the final output space.
        </P>
        <P>That isn’t necessarily true.</P>
        <P>
          Which brings us to another technique: the <Strong>Jacobian lens</Strong>.
        </P>

        <H3>The Jacobian lens: A different way of reading intermediate representations</H3>
        <P>The Jacobian lens, or J-lens, tries to account for how representations change as they propagate through the model.</P>
        <P>
          Rather than directly decoding an intermediate activation, it applies a layer-specific transformation before mapping that
          activation into vocabulary scores.
        </P>
        <P>Schematically, we can write:</P>
        <Tex display>{EQUATIONS.jLens}</Tex>
        <P>
          Here, <Tex>{"h"}</Tex> is an intermediate activation, and <Tex>{"J_\\ell"}</Tex> is an averaged Jacobian that maps the
          effect of that activation toward the final-layer representation.
        </P>
        <P>The full readout also involves the model’s normal output processing, including normalization.</P>

        <Figure
          caption={
            <>
              <Strong>Figure 9.</Strong> Schematic of the two read-outs. At layer ℓ, the logit lens decodes the activation
              directly; the J-lens first maps it toward the final layer with an averaged Jacobian. Normalization is omitted.
            </>
          }
        >
          <LensFigure />
        </Figure>

        <P>
          The basic idea is that we can get a more meaningful view of what concepts an intermediate representation might make the
          model verbalize.
        </P>
        <P>
          Now, the reason I became interested in this technique was a paper by Gurnee and colleagues (2026), titled{" "}
          <a href={REFERENCES[0].url} target="_blank" rel="noopener noreferrer" className="text-[#15803d] underline decoration-[#9fd9b0] underline-offset-2 hover:decoration-[#15803d]">
            Verbalizable Representations Form a Global Workspace in Language Models
          </a>
          <Cite id="gurnee2026" />.
        </P>
        <P>
          Big shoutout to my friend Aadil Jamari, who first told me about the J-lens and the J-space in passing over dinner.
        </P>
        <P>They demonstrated something fascinating.</P>
        <P>Consider this question:</P>
        <Quote label="Prompt">The number of legs on the animal that spins webs is...</Quote>
        <P>To answer correctly, the model needs to identify the animal as a spider before determining that it has eight legs.</P>
        <P>
          But the word <em>spider</em> isn’t explicitly mentioned in the prompt.
        </P>
        <P>
          Using the Jacobian lens, the researchers observed representations associated with <em>spider</em> appearing in
          intermediate layers.
        </P>
        <P>That alone is interesting, but it doesn’t necessarily prove the model was using that representation to produce its answer.</P>
        <P>So they went a step further.</P>
        <P>
          They intervened on the model’s internal representation, swapping the relevant lens coordinates for <em>spider</em>{" "}
          with those for <em>ant</em>.
        </P>
        <P>And the model’s answer changed from eight to six.</P>

        <Figure
          caption={
            <>
              <Strong>Figure 10.</Strong> The intervention from Gurnee et al.<Cite id="gurnee2026" />, drawn schematically. Swapping
              the <em>spider</em> coordinates for <em>ant</em> changes the answer from eight legs to six.
            </>
          }
        >
          <SpiderAntFigure />
        </Figure>

        <P>WOW.</P>
        <P>The intervention provides evidence that the intermediate representation played a causal role in the model’s computation.</P>
        <P>
          Rather than merely observing a token that happened to appear in an intermediate readout, the researchers changed that
          representation and observed a corresponding change in the output.
        </P>
        <P>That distinction is incredibly important.</P>
        <P>And naturally, it made me wonder whether we could use similar techniques to investigate our memory failures.</P>

        <H2 id="wrong">6. Can we actually see where the model goes wrong?</H2>
        <P>My initial hope was that we could trace how evidence turns into an answer.</P>
        <P>Imagine giving the model a memory that contains a particular fact.</P>
        <P>As that information passes through the network, perhaps we could observe the relevant concepts appearing in intermediate representations.</P>
        <P>Then, by comparing successful and unsuccessful answers, we might identify where the computation differed.</P>
        <P>At least, that was the idea.</P>
        <P>And some of our early observations seemed promising.</P>
        <P>We occasionally found answer-related tokens appearing in lens readouts even when the model ultimately produced an incorrect answer.</P>
        <P>At first glance, you might think that’s evidence that the model had internally recovered the answer but failed to express it.</P>
        <P>However, there’s a problem with that interpretation.</P>

        <H3>Just because a token appears doesn’t mean the model derived it</H3>
        <P>We ran a control experiment where we removed the supporting evidence.</P>
        <P>And interestingly, a substantial amount of that apparent answer presence survived.</P>
        <P>
          In other words, some of the words we thought might indicate successful reasoning were still appearing even when the
          model no longer had the necessary information.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 11.</Strong> The control, drawn schematically. With the supporting evidence removed, much of the apparent answer presence in the lens read-out survives. Which layers light up here is illustrative.
            </>
          }
        >
          <EvidenceControlFigure />
        </Figure>
        <P>That’s a pretty important warning sign.</P>
        <P>
          A model might associate certain concepts with a question because they’re statistically plausible, not because it
          successfully derived them from the evidence.
        </P>
        <P>
          For example, if I ask you what animal spins webs, the word <em>spider</em> is an obvious association.
        </P>
        <P>
          But if a particular answer token appears in an activation readout, that doesn’t automatically tell us how the model
          arrived there or whether it used the evidence we provided.
        </P>
        <P>
          <Strong>Recovering a word from an internal representation is not the same as proving that the model computed the answer.</Strong>
        </P>
        <P>And that made our interpretability experiments a little more complicated than I’d hoped.</P>

        <H3>What did the smaller models show?</H3>
        <P>We also evaluated the lens methods on smaller language models.</P>
        <P>The results were mixed.</P>
        <P>
          For Qwen 3B, the Jacobian lens passed our answer-rank improvement test but failed an aggregate intermediate-recovery
          comparison.
        </P>
        <P>Other small models passed their respective evaluation gates.</P>

        <Figure
          caption={
            <>
              <Strong>Figure 12.</Strong> How the lens methods fared on the smaller models. For Qwen 3B, the Jacobian lens passed the answer-rank test but failed the aggregate intermediate-recovery comparison.
            </>
          }
        >
          <LensGatesFigure />
        </Figure>
        <P>
          So while some readouts were useful, we couldn’t simply conclude that smaller models were incapable of representing
          abstract intermediate concepts.
        </P>
        <P>We also experimented with changing instructions and steering model activations.</P>
        <P>Some interventions recovered correct answers, which was encouraging.</P>
        <P>Unfortunately, they also introduced new errors.</P>

        <Figure
          caption={
            <>
              <Strong>Figure 13.</Strong> Interventions cut both ways: some recovered correct answers, others broke answers that were already right. Schematic, not to scale.
            </>
          }
        >
          <InterventionTradeoffFigure />
        </Figure>
        <P>
          We went on to explore activation patching<Cite id="meng2022" /> and evidence substitution, trying to determine whether
          particular representations had evidence-specific causal effects on the final answer.
        </P>
        <P>
          But the experiments had limitations that prevented us from cleanly distinguishing all the failure mechanisms we were
          considering.
        </P>
        <P>Admittedly, this was frustrating.</P>
        <P>You’d hope that looking inside the model would give you a straightforward explanation of what went wrong.</P>
        <P>Instead, we found that the measurements themselves required careful interpretation.</P>
        <P>And I think that’s one of the most valuable things I’ve learned from this project so far.</P>
        <P>There are three very different questions we need to distinguish:</P>
        <List ordered>
          <li>
            <Strong>Did the model answer correctly?</Strong> This measures its observable performance.
          </li>
          <li>
            <Strong>Can we recover an expected intermediate concept?</Strong> This tells us what a particular interpretability
            method can reveal.
          </li>
          <li>
            <Strong>Does changing that representation alter the answer in the predicted way?</Strong> This gives us evidence about
            its causal role in the computation.
          </li>
        </List>

        <Figure
          caption={
            <>
              <Strong>Figure 14.</Strong> Three different questions, and the inference that doesn’t follow from each.
            </>
          }
        >
          <ThreeQuestionsFigure />
        </Figure>
        <P>These might sound similar, but they’re not interchangeable.</P>
        <P>A model can answer correctly without exposing an expected intermediate through our lens.</P>
        <P>A lens can expose an answer-related token without showing that the model derived it from the evidence.</P>
        <P>And an intervention can change the output without necessarily proving our entire explanation of the original failure.</P>
        <P>So we have to be careful about what each experiment actually tells us.</P>

        <H2 id="next">7. Where do we go from here?</H2>
        <P>When I first started this project, I was trying to answer a relatively practical question:</P>
        <P>
          <Strong>How can we manage an AI agent’s limited memory more effectively?</Strong>
        </P>
        <P>
          That led me to optimization, hindsight oracles, imitation learning, reinforcement learning, and eventually real
          conversation benchmarks.
        </P>
        <P>And we did find something useful.</P>
        <P>Selecting relevant evidence can improve answer accuracy while reducing the number of tokens supplied to the model.</P>
        <P>But in the process, we also discovered that memory selection was only part of the problem.</P>
        <P>Even when the evidence was available, the language model could still fail to answer correctly.</P>
        <P>That observation led me toward a different research question:</P>
        <Quote>
          Can we identify the intermediate computation that connects available evidence to an answer, and understand how that
          computation differs when the model fails?
        </Quote>
        <P>This is the direction I’m now exploring for my undergraduate honors thesis.</P>

        <H3>Starting with simpler, controlled questions</H3>
        <P>One of the challenges with real conversation benchmarks is that they’re messy.</P>
        <P>
          Questions vary in difficulty, evidence can be scattered across multiple entries, and there are often several different
          reasons a model might fail.
        </P>
        <P>If our goal is to understand the computation itself, it might help to start with a more controlled setting.</P>
        <P>For example, imagine we give the model:</P>
        <Quote>
          Maya’s supervisor is Alex.
          <br />
          Alex works in Leeds.
        </Quote>
        <P>And then ask:</P>
        <Quote label="Question">Where does Maya’s supervisor work?</Quote>
        <P>To answer this, the model needs to connect Maya to Alex, then Alex to Leeds.</P>
        <P>The answer is Leeds.</P>
        <P>Now imagine we systematically change the names, locations, relationships, or the question itself.</P>
        <P>We could study whether the model’s internal representations change in ways consistent with those modifications.</P>

        <Figure
          caption={
            <>
              <Strong>Figure 15.</Strong> A two-hop question. The model has to go from Maya to Alex, then from Alex to a city.
              Changing one fact (Leeds → Bristol) should change the intermediate result and the answer with it.
            </>
          }
        >
          <RelationalChainFigure />
        </Figure>

        <P>For example, if we replace Leeds with Bristol, does the representation associated with the intermediate result change accordingly?</P>
        <P>And if it does, can we intervene on that representation and predictably change the model’s answer?</P>
        <P>That’s the kind of experiment I’m interested in.</P>
        <P>More specifically, I want to study three kinds of tasks.</P>
        <P>
          <Strong>Direct extraction:</Strong> The answer is explicitly present in the evidence. For instance, identifying the
          Snaggletooth action figure.
        </P>
        <P>
          <Strong>Relational composition:</Strong> The model has to connect multiple facts, like determining where Maya’s
          supervisor works.
        </P>
        <P>
          <Strong>Temporal updating:</Strong> The model needs to determine which information remains valid after something
          changes. For example, someone moves from Leeds to Bristol, and the model needs to use the updated location.
        </P>
        <P>By constructing matched successful and unsuccessful examples, we can start investigating where these computations differ.</P>
        <P>
          We can inspect activations across layers and token positions, identify candidate intermediate representations, and then
          test whether intervening on them changes the final answer in predictable ways.
        </P>
        <P>Of course, there’s no guarantee that the relevant computation will be easily readable through a lens.</P>
        <P>And even if we find a promising representation, we’ll still have to establish whether it actually plays a causal role.</P>
        <P>But that’s precisely what makes this direction interesting.</P>
        <P>
          Instead of assuming that every incorrect answer is a failure to retrieve the right information, we can start
          investigating whether the model failed to derive the answer, represent something correctly, or use a relevant
          computation when generating its response.
        </P>

        <H2 id="bigger-picture">8. The bigger picture</H2>
        <P>Looking back, I find it rather amusing how much this project has changed.</P>
        <P>I started with an optimization problem inspired by an algorithms class.</P>
        <P>
          The original goal was to decide which memories to keep, archive, or delete so that an agent could answer as many future
          questions as possible.
        </P>
        <P>
          We built a hindsight optimizer, trained controllers, experimented with reinforcement learning, and compared different
          selection methods.
        </P>
        <P>But underneath all of those experiments was one assumption:</P>
        <P>
          <Strong>If the model has the information it needs, it should be able to answer the question.</Strong>
        </P>
        <P>
          And then a three-billion-parameter language model looked at a note containing a Snaggletooth action figure and told me
          the answer was unknown.
        </P>
        <P>That was the moment the original assumption became something worth investigating.</P>
        <P>I don’t think the experiments we’ve conducted so far give us a complete explanation of why this happens.</P>
        <P>
          The interpretability results are mixed, some interventions help while others introduce errors, and the selected examples
          don’t establish a general mechanism.
        </P>
        <P>But they do give us a much clearer idea of what to investigate next.</P>
        <P>
          Perhaps improving AI agents isn’t just about building better memory systems, adding more context, or developing more
          sophisticated controllers.
        </P>
        <P>Perhaps we also need to understand what happens after the model receives the information it needs.</P>
        <P>
          After all, <Strong>having access to the right information and successfully using that information are two different things.</Strong>
        </P>
        <P>And understanding the gap between the two is what I hope to investigate next.</P>

        <aside className="mt-12 rounded-2xl border border-dashed border-[#9fd9b0] bg-white px-5 py-4 text-[16px] leading-[1.65] text-[#2b2f29]">
          <span className="font-semibold text-[#15803d]">P.S.</span> Psst… have thoughts? Think I’m being dumb, or have
          feedback? Hit me up at{" "}
          <a href="mailto:qamilmirza@berkeley.edu" className="font-medium text-[#15803d] underline decoration-[#9fd9b0] underline-offset-2 hover:decoration-[#15803d]">
            qamilmirza@berkeley.edu
          </a>
          ! Feedback is a gift :)
        </aside>

        <section className="mt-16 border-t border-[#dcdbd2] pt-8">
          <h2 className="mb-4 font-[family-name:var(--font-geist-mono)] text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6b7067]">
            References
          </h2>
          <ol className="space-y-3 text-[14px] leading-relaxed text-[#2b2f29]">
            {REFERENCES.map((r, i) => (
              <li key={r.id} id={`ref-${i + 1}`} className="flex scroll-mt-24 gap-3">
                <span className="font-[family-name:var(--font-geist-mono)] text-[12px] text-[#15803d]">[{i + 1}]</span>
                <span>
                  {r.text}{" "}
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="break-all text-[#15803d] hover:underline">
                    {r.url.replace(/^https:\/\//, "")}
                  </a>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </article>
    </div>
  );
}
