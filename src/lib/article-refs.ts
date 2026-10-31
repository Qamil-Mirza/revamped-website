// Works cited in "More Than Reasoning".
export type Reference = { id: string; text: string; url: string };

export const REFERENCES: Reference[] = [
  {
    id: "gurnee2026",
    text: "Gurnee, W., et al. (2026). Verbalizable Representations Form a Global Workspace in Language Models. Transformer Circuits Thread.",
    url: "https://transformer-circuits.pub/2026/workspace/index.html",
  },
  {
    id: "wu2024",
    text: "Wu, D., Wang, H., Yu, W., Zhang, Y., Chang, K.-W., & Yu, D. (2024). LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory. arXiv:2410.10813.",
    url: "https://arxiv.org/abs/2410.10813",
  },
  {
    id: "qwen2024",
    text: "Qwen Team (2024). Qwen2.5 Technical Report. arXiv:2412.15115.",
    url: "https://arxiv.org/abs/2412.15115",
  },
  {
    id: "nostalgebraist2020",
    text: "nostalgebraist (2020). interpreting GPT: the logit lens. LessWrong.",
    url: "https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens",
  },
  {
    id: "meng2022",
    text: "Meng, K., Bau, D., Andonian, A., & Belinkov, Y. (2022). Locating and Editing Factual Associations in GPT. arXiv:2202.05262.",
    url: "https://arxiv.org/abs/2202.05262",
  },
];

export function referenceNumber(id: string): number {
  const n = REFERENCES.findIndex((r) => r.id === id);
  if (n === -1) throw new Error(`Unknown reference: ${id}`);
  return n + 1;
}
