import { describe, it, expect } from "vitest";
import { EQUATIONS, renderTex } from "./article-math";

describe("article math", () => {
  it("renders every equation in the article without errors", () => {
    for (const [name, tex] of Object.entries(EQUATIONS)) {
      expect(() => renderTex(tex, true), name).not.toThrow();
    }
  });

  it("renders display math as a block and inline math inline", () => {
    expect(renderTex("x_{i,k}", true)).toContain("katex-display");
    expect(renderTex("x_{i,k}", false)).not.toContain("katex-display");
  });
});
