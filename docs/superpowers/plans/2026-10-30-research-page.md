# Research Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a light-themed `/research` page with the question → evidence → layers → refusal animation, make Research a permanent nav link, and replace the home page's Medium card with a light "window" card that links to it.

**Architecture:** Content and the animation's sequencing logic live in a pure, unit-tested module (`src/lib/research.ts`). Thin client components render it: `LabAnimation` (desktop horizontal river, mobile vertical river), `PreviousResearch`, and `ResearchCardBackground` (CSS-only loop for the home card). Shared keyframes and masks live in one CSS module. `NavBar` and `Footer` gain a light appearance on `/research`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind, CSS modules, Web Animations API, Vitest (node environment, no DOM).

**Spec:** `docs/superpowers/specs/2026-10-30-research-page-design.md`

## Global Constraints

- Colors: bg `#f5f4ee`, ink `#1c1f1a`, muted `#6b7067`, hairline `#dcdbd2`, green `#22c55e`, dark green `#15803d`. No orange or clay anywhere.
- Fonts: Geist Sans (`var(--font-geist-sans)`) and Geist Mono (`var(--font-geist-mono)`), already loaded in `src/app/layout.tsx`.
- No label above the headline. No badges on research rows.
- The question text never contains the answer.
- Question, evidence and reply boxes have fixed heights. Desktop: about 72 / 96 / 64px. Mobile: 72 / 96 / 60px.
- River edges use a mask gradient (transparent → opaque at 16% → opaque at 84% → transparent). There are no hard token cut-offs.
- The `md` breakpoint (768px) switches between desktop and mobile layouts.
- The dark nav and footer on every other page look unchanged, apart from the new Research link.
- Respect `prefers-reduced-motion`.
- Commit messages use the repo's style: `[improvement]: …` / `[fix]: …`.
- Work on branch `improvement/research-page`, not `main`.

## Review Focus

1. **Layout shift during the animation:** content below the lab must not move during a full cycle, on desktop or mobile. Covered by Task 4, Step 6 (browser measurement).
2. **Leaving the page mid-loop:** the sequence must stop on unmount or abort, with no callbacks afterwards. Covered by Task 1's `runSequence` abort test.
3. **Resizing across 768px mid-animation:** the orientation switches and no stray tokens remain from the old orientation. Covered by Task 4, Step 6.
4. **Reduced motion:** the page shows a complete static frame (question, evidence and reply filled in) with no loop running. Covered by Task 1's `staticFrame` test and Task 4, Step 6.
5. **Narrow desktop (768–1024px):** the longest evidence passage fits its fixed box without clipping, and the river is at least about 320px wide. Covered by Task 4, Step 6.

---

### Task 1: Research content and sequence logic

**Files:**
- Create: `src/lib/research.ts`
- Test: `src/lib/research.test.ts`

**Interfaces:**
- Produces:
  - `type LabExample = { question: string; source: string; evidence: [before: string, answer: string, after: string]; questionTokens: string[]; evidenceTokens: string[]; reply: string }`
  - `const LAB_EXAMPLES: LabExample[]`: the spec's four examples, in order (Canberra, 1911, Jane Austen, Thursday).
  - `type FlowToken = { text: string; kind: "question" | "evidence"; isAnswer: boolean; lane: number; delayMs: number }`
  - `function tokensFor(example: LabExample): FlowToken[]`. Question tokens use lanes 0–1 and evidence tokens lanes 2–3. Delays are staggered by about 320ms, and evidence starts about 160ms after the question. `isAnswer` is true when the evidence token's text equals `evidence[1]`.
  - `type LabFrame = { question: string; evidenceVisible: boolean; evidenceLoading: boolean; reply: string }`
  - `function staticFrame(example: LabExample): LabFrame` returns everything filled in, with `evidenceLoading: false`.
  - `type SequenceHooks = { onFrame(f: LabFrame): void; onFlow(tokens: FlowToken[]): void }`
  - `async function runSequence(examples: LabExample[], hooks: SequenceHooks, signal: AbortSignal, timing?: Partial<Timing>): Promise<void>`. It loops forever until aborted, then resolves without calling a hook again.
    - Steps: type the question (about 30ms per character), pause 250ms, show evidence loading for 900ms, show the evidence and pause 500ms, call `onFlow`, wait 4900ms, type the reply (35ms per character), hold 2400ms, then clear.
    - `Timing` holds these numbers so tests can shrink them.
  - `type ResearchItem = { when: string; title: string; summary: string; href: string }`
  - `const PREVIOUS_RESEARCH: ResearchItem[]`: the three rows from the spec's table, verbatim. The Gilead `href` is `/documents/Gilead_Analyst_Sentiment_Poster_SP26.pdf`.
  - `const HERO = { headline: string; lede: string; meta: string; repoLabel: string; repoHref: string }`, with the spec's exact copy. `meta` is `"Honors thesis · Fall 2026"`, `repoLabel` is `"llm-memctl on GitHub ↗"`, and `repoHref` is `"https://github.com/Qamil-Mirza/llm-memctl"`.

- [ ] **Step 1: Write the failing tests** in `src/lib/research.test.ts`:
  - `it("never puts the answer in the question")`: for every example, `question.toLowerCase()` does not include `evidence[1].toLowerCase()`.
  - `it("has exactly one answer token, and it comes from the evidence")`: `tokensFor(ex).filter(t => t.isAnswer)` has length 1, with `kind === "evidence"` and `lane >= 2`.
  - `it("keeps question tokens in the upper lanes")`: every question token has `lane <= 1`.
  - `it("lists previous research exactly as specified")`: `PREVIOUS_RESEARCH.map(r => r.href)` equals `["https://neurips.cc/virtual/2025/loc/san-diego/130758", "/documents/Gilead_Analyst_Sentiment_Poster_SP26.pdf", "https://github.com/Qamil-Mirza/badss-2025-options-alpha-strategy"]`, and `PREVIOUS_RESEARCH[0].when === "NeurIPS 2025 · AI4Science"`.
  - `it("static frame is fully filled in")`: `staticFrame(LAB_EXAMPLES[0])` equals `{ question: "What is the capital of Australia?", evidenceVisible: true, evidenceLoading: false, reply: "I don't know." }`.
  - `it("stops calling hooks once aborted")`:
    - Use `vi.useFakeTimers()` and start `runSequence` with all timing values set to 1.
    - Advance timers until `onFlow` has been called once.
    - Abort, record the call counts, advance 10,000ms, and assert the counts are unchanged and the promise resolved.
  - `it("cycles through examples in order")`: with tiny timings, `onFlow` is called with tokens from `LAB_EXAMPLES[0]`, then `[1]`, then `[0]` again after `[3]`.

- [ ] **Step 2: Run** `npx vitest run src/lib/research.test.ts`. Expected: FAIL (the module doesn't exist).

- [ ] **Step 3: Implement `src/lib/research.ts`** with the interfaces above. Use an abortable `sleep(ms, signal)` that rejects on abort. `runSequence` catches the abort and returns. Typing calls `onFrame` with a growing prefix.

- [ ] **Step 4: Run** `npx vitest run src/lib/research.test.ts`. Expected: PASS.

- [ ] **Step 5: Commit** with the message `[improvement]: research page content and animation sequence`.

### Task 2: Research nav link and light nav

**Files:**
- Create: `src/components/ui/nav-items.ts`
- Create: `src/public/logo-camel-dark.png` (copy of `.superpowers/brainstorm/83817-1793398640/content/camel.png`)
- Modify: `src/components/ui/nav-bar.tsx`
- Test: `src/components/ui/nav-items.test.ts`

**Interfaces:**
- Produces:
  - `export const navItems: { label: string; href: string }[]` in `nav-items.ts`.
  - `NavBar({ variant?: "dark" | "light" })`. The default is `"dark"`.

- [ ] **Step 1: Write the failing test.** `navItems.map(i => i.label)` equals `["Home", "About", "Challenges", "Projects", "Research", "Sidequests", "Contact"]`, and the Research item's `href` is `"/research"`.
- [ ] **Step 2: Run** `npx vitest run src/components/ui/nav-items.test.ts`. Expected: FAIL.
- [ ] **Step 3: Create `nav-items.ts`** and import it in `nav-bar.tsx` (remove the inline array).
- [ ] **Step 4: Add the `variant` prop.** In light mode:
  - Container bg `#f5f4ee` with a bottom hairline `#dcdbd2`.
  - Name and icons in `#1c1f1a`.
  - Links at `rgba(28,31,26,.7)`, turning `#1c1f1a` on hover.
  - The active link (via `usePathname()`) is `#15803d` with a 2px `#22c55e` underline.
  - The logo is `logo-camel-dark.png` at 28px tall, auto width, with no `rounded-full`.
  - The mobile menu panel uses the light bg.

  Dark mode output stays byte-for-byte the same as today apart from the new link.
- [ ] **Step 5: Run** `npx vitest run` and `npx tsc --noEmit -p .`. Expected: both PASS.
- [ ] **Step 6: Commit** with the message `[improvement]: add Research nav link and light nav variant`.

### Task 3: Sitemap, footer and housekeeping

**Files:**
- Modify: `src/app/sitemap.ts`, `src/components/ui/footer.tsx`, `.gitignore`
- Test: `src/app/sitemap.test.ts`

- [ ] **Step 1: Write the failing test.** `sitemap().map(e => e.url)` contains `"https://qamil-mirza.com/research"`.
- [ ] **Step 2: Run** `npx vitest run src/app/sitemap.test.ts`. Expected: FAIL.
- [ ] **Step 3: Add `"/research"`** to `paths`, after `"/projects"`.
- [ ] **Step 4: Run** the same test. Expected: PASS.
- [ ] **Step 5: Make the footer light on `/research`.** Make `Footer` a client component (`"use client"`). When `usePathname() === "/research"`, use bg `#f5f4ee`, border `#dcdbd2` and text `#6b7067`. Otherwise keep the current classes unchanged.
- [ ] **Step 6: Add `.superpowers/`** to `.gitignore`.
- [ ] **Step 7: Run** `npx vitest run` and `npx tsc --noEmit -p .`. Expected: PASS.
- [ ] **Step 8: Commit** with the message `[improvement]: research sitemap entry and light footer`.

### Task 4: Lab animation component

**Files:**
- Create: `src/components/research/LabAnimation.tsx` (client)
- Create: `src/components/research/research.module.css`

**Interfaces:**
- Consumes: `LAB_EXAMPLES`, `tokensFor`, `runSequence`, `staticFrame`, `LabFrame`, `FlowToken` from `@/lib/research`.
- Produces: `export function LabAnimation(): JSX.Element`.
- `research.module.css` exports the classes `riverX` (horizontal mask), `riverY` (vertical mask), `token`, `tokenEvidence`, `caret`, `shimmer`, and the keyframes `flowX`, `flowY`, `answerGlow`. Task 6 reuses `flowX`, `answerGlow` and `riverX`.

- [ ] **Step 1: Desktop layout (≥768px).**
  - A band about 320px tall between hairlines, with grid columns `290px 1fr 210px`.
  - Between 768 and 1024px, use `220px 1fr 170px`.
  - Inputs:
    - A white Question box, 72px tall, with the label "QUESTION".
    - An evidence box, 96px tall, with a dashed `#9fd9b0` border, bg `#f3fbf5`, the label "RETRIEVED EVIDENCE" and a right-aligned source label.
  - Reply: a `#1c1f1a` bubble, 64px tall, with the label "MODEL".
  - River: layer lines at 20/35/50/65/80%, labelled "layer 1" (20%), "layer 12" (50%) and "layer 24" (80%).
- [ ] **Step 2: Mobile layout (<768px).**
  - One column: question (72px), evidence (96px), river (230px tall, `riverY` mask), reply (60px).
  - Layer lines are horizontal at the same percentages.
  - Question tokens sit at left offsets around 2–16%, evidence tokens at around 56–62%.
  - Decide the orientation with a `matchMedia("(min-width: 768px)")` hook, and clear the token layer when it changes.
- [ ] **Step 3: Wire up the sequence.**
  - On mount, create an `AbortController` and call `runSequence(LAB_EXAMPLES, { onFrame: setFrame, onFlow: spawnTokens }, signal)`. Abort on unmount.
  - Abort when `document.hidden`, and restart on `visibilitychange` back to visible.
  - `spawnTokens` appends token elements to a ref'd layer and animates them with `element.animate()`:
    - Horizontal: `translateX(-140px → width+20px)` over 4400ms, linear.
    - Vertical: `translateY(-30px → height+10px)` over 4200ms.
    - The answer token also gets the glow keyframes: offsets 0 → .3 → .55 → .8 → 1. That's evidence style, then green `#22c55e` / white with glow `0 0 18px rgba(34,197,94,.55)`, held, then washed out `#ecebe4` / `#c4c3bb`.
    - Remove each token on `finish`.
- [ ] **Step 4: Reduced motion.** If `matchMedia("(prefers-reduced-motion: reduce)").matches`, render `staticFrame(LAB_EXAMPLES[0])` with no tokens and don't start `runSequence`.
- [ ] **Step 5: Mount it temporarily** on a scratch route to verify. Task 5 mounts it properly.
- [ ] **Step 6: Browser verification (Review Focus 1, 3, 4 and 5).** Run `npm run dev`, then:
  - At 1280px and 390px, record `getBoundingClientRect().top` of the element after the band every 200ms for 12s. It must stay constant.
  - Resize from 1280 to 600px mid-flow. There should be no horizontal tokens left over and the vertical river should start.
  - Emulate `prefers-reduced-motion: reduce`. The static frame should show, with no tokens.
  - At 800px, the Jane Austen and Thursday evidence passages should fit their 96px box without clipping.
- [ ] **Step 7: Run** `npx tsc --noEmit -p .`. Expected: PASS. Then commit with the message `[improvement]: research lab animation`.

### Task 5: Research page

**Files:**
- Create: `src/app/research/page.tsx` (server component with metadata)
- Create: `src/components/research/PreviousResearch.tsx`
- Create: `public/documents/Gilead_Analyst_Sentiment_Poster_SP26.pdf` (copy of `~/Downloads/GILD_SP26 (1).pdf`)

**Interfaces:**
- Consumes: `HERO`, `PREVIOUS_RESEARCH` from `@/lib/research`; `LabAnimation`; `NavBar variant="light"`.

- [ ] **Step 1: Page shell.**
  - Metadata: `title: "Research | Qamil Mirza"`, with `alternates.canonical: "https://qamil-mirza.com/research"`.
  - The wrapper paints `#f5f4ee` over the full viewport height with ink text and the Geist sans font.
  - Content sits in a container of about 1200px max, with 36px side padding on desktop and 18px on mobile.
- [ ] **Step 2: Hero.**
  - `HERO.headline`: 44px, semibold, `-0.02em` tracking (28px on mobile).
  - `HERO.lede`: 16px muted (14px on mobile), max width about 600px.
  - Then `<LabAnimation />`.
  - Then the meta row: `HERO.meta` in muted mono, plus `HERO.repoLabel` in dark green, linking to `repoHref` in a new tab.
- [ ] **Step 3: `PreviousResearch`.**
  - A mono uppercase "Previous research" heading.
  - Each row is an `<a>` with `target="_blank" rel="noopener noreferrer"`.
  - Desktop grid: `150px 1fr auto`.
  - On hover the row gets `padding-left: 10px`, and the title and arrow turn `#15803d`.
  - Mobile: the `when` line spans the full width above the title, with the arrow at the right.
  - No badges.
- [ ] **Step 4: Copy the Gilead PDF** to `public/documents/Gilead_Analyst_Sentiment_Poster_SP26.pdf`. Confirm `curl -sI localhost:3000/documents/Gilead_Analyst_Sentiment_Poster_SP26.pdf` returns 200.
- [ ] **Step 5: Remove the scratch route** from Task 4.
- [ ] **Step 6: Verify in the browser** at 1280px and 390px.
  - The light nav shows the camel and a green active Research link, and the light footer shows.
  - The page has no label above the headline.
  - All three rows open the right URLs.
  - Run `npx tsc --noEmit -p .` and `npm run build`. Expected: PASS.
- [ ] **Step 7: Commit** with the message `[improvement]: add research page`.

### Task 6: Home-page research card

**Files:**
- Create: `src/components/research/ResearchCardBackground.tsx`
- Modify: `src/components/ui/bento-grid.tsx`, `src/app/page.tsx:71-86`

**Interfaces:**
- Consumes: `research.module.css` classes `riverX`, `token`, `tokenEvidence`, and the keyframes `flowX`, `answerGlow`.
- Produces: `BentoCard` gains an optional `label?: string`, rendered above the name in mono, uppercase, 10px, `0.14em` tracking, using `labelColor`. It also gains `labelColor?: string` and `ctaColor?: string` (the CTA's text color, falling back to `primaryTextColor`), and `description` becomes optional (omitted when empty).

- [ ] **Step 1: `ResearchCardBackground`.**
  - A full-card `#f5f4ee` background.
  - In the upper area (top 34px, height 150px, `riverX` mask): three layer lines at 25/50/75%.
  - Tokens use CSS-only infinite `flowX` animations of about 6s with negative delays: "What is", "the capital?", "Canberra" (evidence, plus `answerGlow`) and "since 1913" (evidence).
  - Under reduced motion, tokens rest in place.
- [ ] **Step 2: Extend `BentoCard`** with `label`, `labelColor`, `ctaColor` and an optional `description`. Existing cards should render identically.
- [ ] **Step 3: Replace the "Sharing Knowledge, Fueling Growth" feature** in `src/app/page.tsx`:
  - `name: "Why do small models refuse answers they've already been given?"`, `label: "Research"`, `labelColor: "text-[#15803d]"`, `ctaColor: "text-[#15803d]"`.
  - `href: "/research"`, `cta: "Research"`.
  - `primaryTextColor: "text-[#1c1f1a]"`.
  - `background: <ResearchCardBackground />`.
  - Keep the same `className` grid position.
  - Remove the now-unused `DotPattern` and `cn` imports if nothing else uses them.
- [ ] **Step 4: Verify in the browser** at 1280px and 390px.
  - The card is light among the dark tiles, the tokens flow and fade at the edges, and "Canberra" glows then fades.
  - On hover the text lifts and a green "Research →" appears. Clicking opens `/research`.
  - The other four cards are unchanged.
  - Run `npx tsc --noEmit -p .`, `npx vitest run` and `npm run build`. Expected: PASS.
- [ ] **Step 5: Commit** with the message `[improvement]: research card on home page`.
