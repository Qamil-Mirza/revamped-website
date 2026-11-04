import { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/ui/nav-bar";
import { articleFontVariable, Figure, H2, P, Quote, Strong } from "@/components/article/prose";
import { ConditionalGateFigure } from "@/components/article/figures/ConditionalGate";
import { InterventionSitesFigure } from "@/components/article/figures/InterventionSites";
import { CausalChecksFigure } from "@/components/article/figures/CausalChecks";

const LINK_CLASS = "text-[#15803d] underline decoration-[#9fd9b0] underline-offset-2 hover:decoration-[#15803d]";

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
      {children}
    </a>
  );
}

export const metadata: Metadata = {
  title: "Weight-Space Programming for Mechanistic Interpretability | Qamil Mirza",
  description: "Can we ask an AI to perform brain surgery on another AI to understand its behavior?",
  alternates: {
    canonical: "https://qamil-mirza.com/research/ai-brain-surgery",
  },
};

export default function AiBrainSurgeryPage() {
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
        <h1 className="mb-4 mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] md:text-[46px]">
          Weight-Space Programming for Mechanistic Interpretability
        </h1>
        <p className="text-[18px] italic leading-relaxed text-[#6b7067] md:text-[19px]">
          Can we ask an AI to perform brain surgery on another AI to understand its behavior?
        </p>
        <div className="mt-6 border-b border-[#dcdbd2] pb-6 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.08em] text-[#6b7067]">
          Qamil Mirza · November 4, 2026
        </div>

        <P>
          Two days ago, my roommate brought to my attention this recent discovery by MIT CSAIL on{" "}
          <ExternalLink href="https://rikiyat.github.io/blog/weight-space-programming/">weight-space programming</ExternalLink>. In
          essence, it seemed to me like they’ve figured out that frontier models are pretty good at directly editing and interpreting
          the weights of smaller models. So, at least some of the time, we can have them perform a sort of “brain surgery” on these
          smaller models.
        </P>
        <P>I was blown away! I jumped out of my seat, read their report, and had Claude get to work on building this for my thesis.</P>
        <P>
          My sense is that if this is possible, then a more capable model could inspect a smaller one, figure out what might be going
          wrong (like our abstention case, wink wink), and edit the parts responsible. It might even explain why those parts of the
          model are causing a particular output. I think this is a potentially interesting tool for the field of mechanistic
          interpretability.
        </P>

        <H2 id="recap">A quick recap of where I got stuck</H2>
        <P>
          In{" "}
          <Link href="/research/more-than-reasoning" className={LINK_CLASS}>
            my previous article
          </Link>
          , I wrote about how a memory-management project became an investigation into models that fail despite having sufficient
          evidence.
        </P>
        <P>
          One behavior kept showing up: the model would write the supported answer into its own note, then finish with “unknown.” On
          one set of controlled tasks, this happened in 152 of 165 false abstentions.
        </P>
        <P>
          I started looking inside the model using vocabulary lenses, which turn internal activations into word scores, and
          activation patching, which lets us replace an internal state and observe what changes.
        </P>
        <P>
          These experiments taught me to be careful with both. A lens could miss information at a position where a patch still
          changed the answer. And transferring an entire activation didn’t tell me exactly which feature caused that change. This
          replicated a known measurement limitation. It wasn’t a newly discovered mechanism.
        </P>
        <P>
          Meanwhile, instructions and activation steering could recover correct answers. They could also make the model answer
          questions whose evidence was insufficient.
        </P>
        <P>
          That left me with a frustrating problem. I could sometimes make the model answer, but I couldn’t reliably control{" "}
          <em>when</em> it should.
        </P>

        <H2 id="conditional-steering">Making steering conditional</H2>
        <P>
          Before getting to weight edits, there’s another direction I want to explore: <Strong>conditional steering</Strong>.
        </P>
        <P>
          An activation is a collection of numbers the model computes while processing an input. Activation steering adds a chosen
          direction to those numbers, nudging the model’s behavior during a run. I’ll call that addition a “push.”
        </P>
        <P>Our earlier steering direction encouraged answering. Applying that push indiscriminately was where the trouble started.</P>
        <P>Imagine two memories:</P>
        <Quote>Maya lives in Leeds.</Quote>
        <Quote>Maya’s friend lives in Leeds.</Quote>
        <P>Now ask where Maya lives.</P>
        <P>
          The first memory supports an answer. The second doesn’t. Both contain the same city, so simply detecting “Leeds” somewhere
          inside the model wouldn’t tell us when answering is justified.
        </P>
        <P>
          What I’d like is a separate signal that determines whether to apply the push. It would need to distinguish those two cases
          using the relationship in the evidence.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 1.</Strong> What conditional steering should do. Both memories mention Leeds, so that signal can’t
              decide anything. The gate has to depend on the relationship. This is a sketch of the goal, not a result, and the bars
              are illustrative.
            </>
          }
        >
          <ConditionalGateFigure />
        </Figure>

        <P>
          The general idea already exists.{" "}
          <ExternalLink href="https://arxiv.org/abs/2409.05907">Lee and colleagues’ conditional activation steering method</ExternalLink>{" "}
          uses activation patterns to decide when to apply a steering intervention. Their demonstrations include selectively refusing
          particular categories of requests. Applying that approach to evidence sufficiency is a hypothesis I want to test.
        </P>
        <P>
          The hard part is learning a trustworthy condition. An earlier attempt to gate our intervention wasn’t selective enough. A new
          detector could also learn shortcuts, like associating a particular template with answerability.
        </P>
        <P>
          So I’d test it on matched examples where we change who a fact belongs to, swap the answer, or remove the relevant
          relationship. Names and sentence patterns would need to vary across both answerable and unanswerable cases.
        </P>
        <P>And I’d score the actual generated answers. A gate could recognize sufficient evidence correctly while the model still gives the wrong answer.</P>

        <H2 id="weight-space-programming">What weight-space programming adds</H2>
        <P>Conditional steering changes activations during a run. Weight-space programming lets an agent propose changes to the parameters that produce those activations.</P>

        <Figure
          caption={
            <>
              <Strong>Figure 2.</Strong> Where each intervention acts. Steering changes the numbers computed during one run, and the
              gate decides run by run. A weight edit changes the model itself. The network is schematic.
            </>
          }
        >
          <InterventionSitesFigure />
        </Figure>

        <P>
          The MIT CSAIL work gives a frontier model access to weights and tools for inspecting and editing them, without gradient-based
          training. In their Qwen experiment, the agent identified and edited a direction associated with repetitive reasoning loops.
          The authors reported improved task performance after the intervention. This is an early research report, with limits as well
          as successes. <ExternalLink href="https://rikiyat.github.io/blog/weight-space-programming/">Source</ExternalLink>
        </P>
        <P>The part that excited me was the possibility of turning an edit into a lead for investigation.</P>
        <P>Suppose Claude proposes changing a small part of Qwen and says:</P>
        <Quote>This component contributes to abstention under these conditions. Changing it should affect these examples, while leaving these others alone.</Quote>
        <P>That would give me something concrete to test: a component, a proposed function, and predictions.</P>
        <P>
          Of course, Claude could produce a very convincing explanation that happens to be wrong. We’d have another language model’s
          story about a language model. I’d want more than that before calling it an explanation.
        </P>

        <H2 id="defending-the-diagnosis">Making the “surgeon” defend its diagnosis</H2>
        <P>
          The infrastructure I built is for exploring edits while keeping an independent evaluation separate. The proposed experiment
          would give Claude practice examples, access to a restricted family of small edits, and a limited evaluation budget. Other
          examples would remain hidden from it.
        </P>
        <P>I want to evaluate two things separately.</P>
        <P>
          First, <Strong>does the edit help?</Strong> Does it recover correct answers, preserve appropriate abstention, and avoid
          damaging answers that were already correct? It should also be compared with simpler interventions, including directly
          discouraging “unknown.”
        </P>
        <P>
          Second, <Strong>does its explanation hold up?</Strong> If Claude identifies an activation through which the edit works, we
          can transfer that activation into the original model and see whether it reproduces the effect. We can also hold it at its
          original value in the edited model and check whether the effect disappears. Those comparisons need the same preceding tokens
          so we don’t accidentally change the question being tested.
        </P>

        <Figure
          caption={
            <>
              <Strong>Figure 3.</Strong> Two tests of a claim that an edit works through a named activation. Each one mixes the two
              models. These are planned tests, so no outcomes are shown.
            </>
          }
        >
          <CausalChecksFigure />
        </Figure>

        <P>Even then, we may only have explained how the edit works. It could have introduced a shortcut.</P>
        <P>
          To explain the original failure, the account also needs to predict something about the <em>unedited</em> model on examples
          the agent hasn’t seen. For instance, how should the named activity change when the relevant evidence becomes insufficient?
          What result would contradict the explanation?
        </P>
        <P>That’s the part I’m most interested in. A useful edit could help us find where to look. The follow-up experiments would determine what we actually learned.</P>
        <P>
          While I still don’t have a generalizable mechanism for why the model is able to write an answer and then say “unknown,” it
          seems like there are more things to try. And so long as there are avenues unexplored, you bet your ass I’m gonna keep banging
          my head against this wall.
        </P>
        <P className="italic">
          Have thoughts on the experiment, or an alternative explanation I should test? I’d love to hear them:{" "}
          <a href="mailto:qamilmirza@berkeley.edu" className={LINK_CLASS}>
            qamilmirza@berkeley.edu
          </a>
          .
        </P>
      </article>
    </div>
  );
}
