// Equations for the "More Than Reasoning" write-up, rendered with KaTeX on the
// server so the page ships plain HTML.
import katex from "katex";

export const EQUATIONS = {
  objective: String.raw`\max_{x,y}\left[\sum_q y_q-\epsilon\sum_{i,k}s_i x_{i,k}\right]`,
  noResurrection: String.raw`x_{i,k+1}\leq x_{i,k}`,
  coverage: String.raw`y_q\leq\sum_{i\in C(r)}x_{i,\operatorname{pos}(i,q)}`,
  budget: String.raw`\sum_{i\in\operatorname{present}(\tau)} s_i x_{i,\operatorname{pos}(i,\tau)}\leq B`,
  tieBreaker: String.raw`\epsilon=\frac{1}{10\sum_i s_i|\operatorname{needs}(i)|}`,
  costEvict: String.raw`c(i,\mathrm{EVICT})=c_{\mathrm{delete}}+\mathbf{1}[i\text{ is needed again}]`,
  costArchive: String.raw`c(i,\mathrm{ARCHIVE})=c_{\mathrm{archive}}+\rho\,\mathbf{1}[i\text{ is needed again}]`,
  costEvictFree: String.raw`c(i,\mathrm{EVICT})=\mathbf{1}[i\text{ is needed again}]`,
  costArchiveFree: String.raw`c(i,\mathrm{ARCHIVE})=0`,
  removeLoss: String.raw`\mathcal{L}_{\mathrm{remove}}(s)=-\log\left(\sum_{a\in A^*(s)}\pi_\theta(a\mid s)\right)`,
  reward: String.raw`R_t=r_t-0.1\,n_{\mathrm{forced\ evictions},t}-0.1\,n_{\mathrm{invalid\ actions},t}`,
  discountedReturn: String.raw`G_t=\sum_{k\geq t}\gamma^{k-t}R_k`,
  jLens: String.raw`\operatorname{JLens}_\ell(h)=\operatorname{unembed}(J_\ell h)`,
} as const;

export function renderTex(tex: string, display: boolean): string {
  return katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: "error", output: "html" });
}
