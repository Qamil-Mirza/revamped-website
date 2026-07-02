import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/blob-store", () => ({
  readJson: vi.fn(),
  writeJson: vi.fn(),
}));

import { getDrinks, addDrink, deleteDrink } from "@/lib/drinks";
import * as blobStore from "@/lib/blob-store";

const readJson = vi.mocked(blobStore.readJson);
const writeJson = vi.mocked(blobStore.writeJson);

beforeEach(() => {
  readJson.mockReset();
  writeJson.mockReset();
});

describe("getDrinks", () => {
  it("returns drinks sorted newest first", async () => {
    readJson.mockResolvedValue([
      { id: "old", date: "2026-06-01", name: "a", note: "n", imageUrl: "u", width: 1, height: 1, createdAt: "2026-06-01T00:00:00Z" },
      { id: "new", date: "2026-06-05", name: "a", note: "n", imageUrl: "u", width: 1, height: 1, createdAt: "2026-06-05T00:00:00Z" },
    ]);
    const result = await getDrinks();
    expect(result.map((d) => d.id)).toEqual(["new", "old"]);
  });
});

describe("addDrink", () => {
  it("creates a record with an id + createdAt and persists it", async () => {
    readJson.mockResolvedValue([]);
    const created = await addDrink({
      date: "2026-06-29",
      name: "Hojicha",
      note: "earthy",
      imageUrl: "https://x/a.webp",
      width: 800,
      height: 600,
    });
    expect(created.id).toBeTruthy();
    expect(created.createdAt).toBeTruthy();
    expect(writeJson).toHaveBeenCalledWith("drinks/index.json", [created]);
  });
});

describe("deleteDrink", () => {
  it("removes the matching record and returns it", async () => {
    const existing = { id: "x", date: "2026-06-29", name: "a", note: "n", imageUrl: "u", width: 1, height: 1, createdAt: "2026-06-29T00:00:00Z" };
    readJson.mockResolvedValue([existing]);
    const removed = await deleteDrink("x");
    expect(removed).toEqual(existing);
    expect(writeJson).toHaveBeenCalledWith("drinks/index.json", []);
  });

  it("returns null when id is not found", async () => {
    readJson.mockResolvedValue([]);
    expect(await deleteDrink("nope")).toBeNull();
    expect(writeJson).not.toHaveBeenCalled();
  });
});
