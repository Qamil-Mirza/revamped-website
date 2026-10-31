import { describe, it, expect } from "vitest";
import { REFERENCES, referenceNumber } from "./article-refs";

describe("article references", () => {
  it("numbers references in list order", () => {
    expect(referenceNumber("gurnee2026")).toBe(1);
    expect(referenceNumber(REFERENCES[REFERENCES.length - 1].id)).toBe(REFERENCES.length);
  });

  it("fails loudly on a citation that isn't in the list", () => {
    expect(() => referenceNumber("nope")).toThrow("Unknown reference: nope");
  });

  it("has unique ids and https links", () => {
    expect(new Set(REFERENCES.map((r) => r.id)).size).toBe(REFERENCES.length);
    for (const r of REFERENCES) expect(r.url.startsWith("https://")).toBe(true);
  });
});
