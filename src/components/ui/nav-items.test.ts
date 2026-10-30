import { describe, it, expect } from "vitest";
import { navItems } from "./nav-items";

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
