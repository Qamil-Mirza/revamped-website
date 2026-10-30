import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes the research page", () => {
    expect(sitemap().map((e) => e.url)).toContain("https://qamil-mirza.com/research");
  });
});
