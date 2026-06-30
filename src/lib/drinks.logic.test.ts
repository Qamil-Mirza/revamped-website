import { describe, it, expect } from "vitest";
import {
  todayInOwnerTz,
  validateDrinkInput,
  sortDrinks,
  selectFeatured,
  type Drink,
} from "@/lib/drinks";

function drink(partial: Partial<Drink>): Drink {
  return {
    id: "id",
    date: "2026-06-01",
    name: "Latte",
    note: "good",
    imageUrl: "https://x/a.webp",
    width: 100,
    height: 100,
    createdAt: "2026-06-01T00:00:00.000Z",
    ...partial,
  };
}

describe("todayInOwnerTz", () => {
  it("formats a date as YYYY-MM-DD in Pacific time", () => {
    // 2026-06-29T05:00:00Z is still 2026-06-28 in America/Los_Angeles (UTC-7)
    expect(todayInOwnerTz(new Date("2026-06-29T05:00:00Z"))).toBe("2026-06-28");
  });
});

describe("validateDrinkInput", () => {
  it("accepts and trims valid input", () => {
    const r = validateDrinkInput({ date: "2026-06-29", name: " Hojicha ", note: " earthy " });
    expect(r).toEqual({ ok: true, value: { date: "2026-06-29", name: "Hojicha", note: "earthy" } });
  });

  it("rejects a missing name", () => {
    const r = validateDrinkInput({ date: "2026-06-29", name: "  ", note: "x" });
    expect(r.ok).toBe(false);
  });

  it("rejects a note longer than 140 chars", () => {
    const r = validateDrinkInput({ date: "2026-06-29", name: "x", note: "a".repeat(141) });
    expect(r.ok).toBe(false);
  });

  it("rejects a malformed date", () => {
    const r = validateDrinkInput({ date: "06/29/2026", name: "x", note: "y" });
    expect(r.ok).toBe(false);
  });

  it("accepts a name of exactly 80 chars", () => {
    expect(validateDrinkInput({ date: "2026-06-29", name: "a".repeat(80), note: "x" }).ok).toBe(true);
  });
  it("rejects a name of 81 chars", () => {
    expect(validateDrinkInput({ date: "2026-06-29", name: "a".repeat(81), note: "x" }).ok).toBe(false);
  });
  it("accepts a note of exactly 140 chars", () => {
    expect(validateDrinkInput({ date: "2026-06-29", name: "x", note: "a".repeat(140) }).ok).toBe(true);
  });

  it("rejects entirely empty input (all fields undefined)", () => {
    expect(validateDrinkInput({}).ok).toBe(false);
  });
});

describe("sortDrinks", () => {
  it("orders newest date first, breaking ties by createdAt", () => {
    const a = drink({ id: "a", date: "2026-06-01", createdAt: "2026-06-01T01:00:00Z" });
    const b = drink({ id: "b", date: "2026-06-03" });
    const c = drink({ id: "c", date: "2026-06-01", createdAt: "2026-06-01T02:00:00Z" });
    expect(sortDrinks([a, b, c]).map((d) => d.id)).toEqual(["b", "c", "a"]);
  });
});

describe("selectFeatured", () => {
  it("returns featuredIndex 0 (latest) when no drink is dated today", () => {
    const drinks = [drink({ id: "a", date: "2026-06-03" }), drink({ id: "b", date: "2026-06-01" })];
    const { ordered, featuredIndex } = selectFeatured(drinks, "2026-06-29");
    expect(ordered[0].id).toBe("a");
    expect(featuredIndex).toBe(0);
  });

  it("features the drink dated today", () => {
    const drinks = [drink({ id: "a", date: "2026-06-03" }), drink({ id: "today", date: "2026-06-29" })];
    const { ordered, featuredIndex } = selectFeatured(drinks, "2026-06-29");
    expect(ordered[featuredIndex].id).toBe("today");
  });

  it("returns featuredIndex -1 for an empty list", () => {
    expect(selectFeatured([], "2026-06-29")).toEqual({ ordered: [], featuredIndex: -1 });
  });
});
