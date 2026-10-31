import { describe, it, expect } from "vitest";
import { isActive, isResearchPath, navItems } from "./nav-items";

describe("navItems", () => {
  it("includes Research between Projects and Sidequests", () => {
    expect(navItems.map((i) => i.label)).toEqual([
      "Home",
      "About",
      "Challenges",
      "Projects",
      "Research",
      "Sidequests",
      "Contact",
    ]);
    expect(navItems.find((i) => i.label === "Research")?.href).toBe("/research");
  });
});

describe("isActive", () => {
  it("matches a section and its sub-pages, but Home only on the home page", () => {
    expect(isActive("/research", "/research")).toBe(true);
    expect(isActive("/research", "/research/more-than-reasoning")).toBe(true);
    expect(isActive("/research", "/researcher")).toBe(false);
    expect(isActive("/", "/research")).toBe(false);
    expect(isActive("/", "/")).toBe(true);
  });
});

describe("isResearchPath", () => {
  it("covers the research page and its write-ups", () => {
    expect(isResearchPath("/research")).toBe(true);
    expect(isResearchPath("/research/more-than-reasoning")).toBe(true);
    expect(isResearchPath("/projects")).toBe(false);
    expect(isResearchPath(null)).toBe(false);
  });
});
