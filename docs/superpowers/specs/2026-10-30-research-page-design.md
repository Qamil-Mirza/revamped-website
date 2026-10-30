# Research page design

Date: 2026-10-30
Status: approved in brainstorming. The mockups referenced below are in `.superpowers/brainstorm/83817-1793398640/content/` (`page-v5.html` for the desktop page, `bento-card-v3.html` for the home card and the mobile page).

## Intent

The home page's top-right bento card currently links out to Medium ("Sharing Knowledge, Fueling Growth"). Qamil wants that card to open a new **research page** instead: a place that first shows what he's thinking about right now, then highlights his earlier research.

The page should feel like stepping into a different world from the dark home page. It's off-white and calm, with the site's green as its accent and motion graphics that act out the research question. It's inspired by the clean feel of Anthropic's research pages but must **not** look like Anthropic's branding.

## Goals

- A new route, `/research`, with a light off-white theme and green accents.
- A hero headline about the current research, followed by an animation that acts it out.
- A list of previous research below the hero, each row linking out.
- The home-page Medium card becomes a light "window" card that links to `/research`.
- **Research** becomes a permanent nav link on every page.
- Works well on mobile, with a layout made for it (not just squashed).

## Non-goals

- No individual detail pages per research item; rows link out.
- No CMS or data fetching; content is hardcoded in the page like the rest of the site.
- Medium isn't removed from the site; it stays in the social icons and on the projects page.
- The projects page isn't changed, even though some research also appears there.

## Anti-goals (would be a failure even if it works)

- Looking like Anthropic: no clay or orange accent, no Anthropic-style serif headlines, no copying their layout wholesale.
- Badges or chips on the research rows (Qamil removed them explicitly).
- A label above the headline ("Currently researching" and "What's top of mind" were both tried and removed).
- Layout that jumps while the animation plays, especially on mobile. Every animated box has a fixed size.
- Tokens popping in or out at a hard edge. They must fade in and out smoothly.
- The logo shown with a circular background on the light theme.

## Look

Decided by Qamil (from the mockups):

- **Colors:** background off-white `#f5f4ee`, text near-black `#1c1f1a`, muted text `#6b7067`, hairlines `#dcdbd2`. Green accent `#22c55e`, with a darker green `#15803d` for green text on the light background.
- **Feel:** clean sans-serif headings, small monospace uppercase labels, generous whitespace, thin hairline dividers.

My calls:

- **Type:** the repo already loads Geist Sans and Geist Mono in the root layout, so use those (sans for headings and body, mono for labels and tokens).

## Nav

Decided by Qamil:

- Same structure as the home-page nav (`src/components/ui/nav-bar.tsx`): logo plus "Qamil Mirza" on the left, links on the right, a hamburger menu on mobile.
- On the research page it uses the light colors.
- The logo is **just the camel shape** in near-black on transparent, with no circle. It was made from `src/public/logo.png` by turning luminance into alpha, filling with `#1c1f1a` and cropping to the shape. The mockup asset is `.superpowers/brainstorm/83817-1793398640/content/camel.png`; add it to the repo, e.g. `src/public/logo-camel-dark.png`.
- Add **Research** (`/research`) to `navItems`, so it appears on every page. On `/research` the active link is green with a green underline.

My calls:

- Placement: Research goes between Projects and Sidequests.
- How the nav becomes light-themed (a `variant` prop, or a separate light nav) is up to the builder. The dark nav on other pages must look unchanged apart from the new link.

## Research page layout (desktop)

From top to bottom:

1. Nav (light).
2. **Hero text.**
   - Headline: "Why do small models refuse answers they've already been given?"
   - Lede: "I'm tracing how small language models work their way to an answer, and why they still abstain when retrieval has put the answer right in front of them. This grew out of my earlier work on memory and retrieval in LLMs."
   - No label above the headline.
3. **The lab animation**, a full-width band between two hairlines. It's described below.
4. **A meta row** under the band: "Honors thesis · Fall 2026" and a link "llm-memctl on GitHub ↗" to https://github.com/Qamil-Mirza/llm-memctl.
5. **"Previous research"**, a small mono uppercase heading, then rows. Each row is a 3-column grid: when/venue (mono, uppercase), then title plus a one-line summary, then a ↗ arrow. Hovering nudges the row right and turns the title and arrow green. The whole row is a link that opens in a new tab.

| When / venue | Title | Summary | Link |
|---|---|---|---|
| NeurIPS 2025 · AI4Science | A Multi-Modal Deep Learning Model for Drug Potency Prediction | Protein–ligand interaction fingerprints from docking and co-folding, fed into directed message-passing networks. | https://neurips.cc/virtual/2025/loc/san-diego/130758 |
| Spring 2026 · Gilead | Can Analysts Predict Markets? | LLM sentiment from sell-side research reports, tested against walk-forward forecasts of Gilead's stock price. | Poster PDF, added to the site at `public/documents/` (source: `~/Downloads/GILD_SP26 (1).pdf`) |
| 2025 · Wells Fargo | Optimizing Equity Derivative Hedging Strategies | A mixed-integer program that keeps a $10M exposure floor at minimum option premium. | https://github.com/Qamil-Mirza/badss-2025-options-alpha-strategy |

The memory and retrieval work isn't its own row; it's mentioned in the lede.

## The lab animation

This is the centerpiece. It acts out the research question: a question comes in, retrieval supplies evidence containing the answer, the answer is visibly present inside the model, and the model still refuses.

**Desktop layout:** a three-column band about 320px tall. The columns are inputs (about 290px), the layer river (fills the rest) and the reply (about 210px).

- **Inputs column**, stacked:
  - A white **Question** box. The question types itself out character by character with a green caret. It contains only the question, never the answer. Qamil flagged that stating the answer inside the question reads as weird.
  - A **Retrieved evidence** box: dashed green border, faint green fill, the label "Retrieved evidence" and a source label such as "encyclopedia" or "inbox · Sam". After the question finishes, it fades in, shows a shimmer skeleton for about 0.9s, then shows a short passage with the answer word highlighted in green.
- **River:**
  - Thin vertical lines stand for layers, labelled "layer 1", "layer 12" and "layer 24".
  - Words travel left to right as pill-shaped tokens.
    - Question tokens are plain gray pills in the upper lanes.
    - Evidence tokens have a dashed green outline and ride the lower lanes.
  - The **answer token** (from the evidence) turns solid green with a soft glow through the middle layers (roughly 30–55% of its trip), then fades to a washed-out gray before it reaches the end.
  - **Soft edges:** the river uses a horizontal mask gradient (transparent → opaque at about 16% → opaque at about 84% → transparent). Tokens fade in from the inputs and out into the reply with no visible box edge. Keep the layer lines inside the opaque region (about 20–80%) so they aren't faded.
- **Reply column:** a dark (`#1c1f1a`) **Model** bubble. After the tokens pass, it types a refusal.

**Sequence per example, then loop:** type the question → show the evidence (shimmer, then text) → tokens flow for about 4.5s → type the reply → hold about 2.4s → clear everything and start the next example.

**Examples:** these are illustrative, not real experiment outputs; that's acceptable.

| Question | Source | Evidence (answer in **bold**) | Reply |
|---|---|---|---|
| What is the capital of Australia? | encyclopedia | **Canberra** has been Australia's capital since 1913. | I don't know. |
| When did Marie Curie win the Chemistry Nobel? | nobelprize.org | Curie received the Nobel Prize in Chemistry in **1911**. | I'm not sure about that. |
| Who wrote Pride and Prejudice? | library catalog | **Jane Austen** published Pride and Prejudice in 1813. | I can't answer that. |
| What day is the team meeting? | inbox · Sam | Heads up, the team meeting has moved to **Thursday**. | I don't have that information. |

**Fixed sizes (required):** the question, evidence and reply boxes have fixed heights, sized for the longest example, on desktop and mobile. Typing, the shimmer and appearing text must never move anything else on the page.

## Mobile layout

Decided by Qamil (he said the mobile view "looks great"):

- One column: hero text, the question box, the evidence box, the river, the reply bubble, the meta row, previous research.
- **The river turns vertical.** Layers become horizontal hairlines, and tokens fall from top to bottom. Question tokens are in the left lanes and evidence tokens in the right. The mask gradient runs top to bottom, and the river is about 230px tall.
- **Fixed box heights:** question about 72px, evidence about 96px, reply about 60px. This is Qamil's explicit requirement, so nothing shifts while the animation plays.
- Research rows stack: the when/venue line on top, then title and summary with the arrow at the right.
- The nav collapses into the existing hamburger menu, in light colors.

My calls:

- The desktop/mobile switch happens at the site's existing `md` breakpoint (768px).

## Home-page card (option A, "Window")

This replaces the "Sharing Knowledge, Fueling Growth" feature in `src/app/page.tsx`, keeping the same grid position.

- **Card:** off-white `#f5f4ee` background. It's the one light tile among the dark cards, a window into the research page.
- **Background:** a small, simplified version of the river animation in the upper part of the card.
  - Three layer lines, with a few question tokens and evidence tokens drifting left to right.
  - The evidence token "Canberra" glows green mid-way, then fades.
  - Soft mask edges.
  - CSS-only looping is fine; there's no typing and no boxes.
- **Text, bottom-left:**
  - A small green mono "RESEARCH" label.
  - The title "Why do small models refuse answers they've already been given?" in near-black.
- **Hover:** the text lifts and a green "Research →" CTA appears, matching the other bento cards' behavior.
- **Link:** `/research`.

My calls:

- The existing `BentoCard` hardcodes dark-ish styles (`dark:bg-black`, `dark:text-neutral-300` on the title, a white inset shadow). The builder should make sure the light card's colors actually apply. This may need a small `BentoCard` extension, like `cardClassName` or a light variant, rather than fighting `dark:` classes.

## Motion and accessibility

My calls:

- Respect `prefers-reduced-motion`.
  - On the research page, show one example statically: question, evidence and reply all filled in, with the answer token resting at its faded end state.
  - On the home card, show tokens at rest.
- Pause the research animation loop when the tab is hidden, so timers don't pile up.
- Use the Web Animations API (as in the mockup) or `framer-motion`, which the repo already uses. Either is fine.

## Other details

My calls:

- **Footer:** the site footer is global and dark. On `/research`, the builder should check it doesn't look broken against the light page. Restyling it light on this page is preferred if that's simple.
- **Metadata:** add a page title ("Research | Qamil Mirza") and add `/research` to `src/app/sitemap.ts`.
- **Gitignore:** add `.superpowers/` to `.gitignore`.

## Settled after review

My calls:

- **Page background:** the root `body` is dark (`#121212`), so `/research` must paint its own off-white background over the full viewport.
- **Page width:** content, including the lab band, sits in a centered container of about 1200px max. The band's hairlines can still run full width.
- **Narrow desktop widths:** between `md` and roughly 1024px, shrink the inputs and reply columns so the river keeps at least about 320px.
- **Home card wiring:** `BentoCard`'s `description` becomes optional. The "RESEARCH" label is rendered above the title.
- **Gilead poster:** use `~/Downloads/GILD_SP26 (1).pdf`, the newer of the two files there.
- **Spec vs. mockups:** where the mockups and this document differ (e.g. the NeurIPS year, the mobile copy), this document wins.

## Left to the builder

- Component structure and file layout.
- The animation implementation, within the timing and visual rules above.
- Exact lane positions, token chunking and easing.
- How the light nav variant is implemented.
