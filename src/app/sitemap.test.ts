import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes the research page", () => {
    expect(sitemap().map((e) => e.url)).toContain("https://qamil-mirza.com/research");
  });

  it("includes the memory write-up", () => {
    expect(sitemap().map((e) => e.url)).toContain("https://qamil-mirza.com/research/more-than-reasoning");
  });

  it("includes the brain surgery write-up", () => {
    expect(sitemap().map((e) => e.url)).toContain("https://qamil-mirza.com/research/ai-brain-surgery");
  });
});
