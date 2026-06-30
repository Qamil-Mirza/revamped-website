import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@vercel/blob", () => ({
  list: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}));

import { readJson, writeJson, putImage, deleteByUrl } from "@/lib/blob-store";
import * as blob from "@vercel/blob";

const list = vi.mocked(blob.list);
const put = vi.mocked(blob.put);
const del = vi.mocked(blob.del);

beforeEach(() => {
  list.mockReset();
  put.mockReset();
  del.mockReset();
});

describe("readJson", () => {
  it("returns the fallback when no blob matches the pathname", async () => {
    list.mockResolvedValue({ blobs: [] });
    const result = await readJson("drinks/index.json", []);
    expect(result).toEqual([]);
  });

  it("fetches and parses the matching blob", async () => {
    list.mockResolvedValue({
      blobs: [{ pathname: "drinks/index.json", url: "https://x/drinks/index.json" }],
    });
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify([{ id: "a" }])));
    const result = await readJson<{ id: string }[]>("drinks/index.json", []);
    expect(result).toEqual([{ id: "a" }]);
    fetchMock.mockRestore();
  });
});

describe("writeJson", () => {
  it("writes a stable, public, overwritable JSON blob", async () => {
    put.mockResolvedValue({ url: "https://x/drinks/index.json" });
    await writeJson("drinks/index.json", [{ id: "a" }]);
    expect(put).toHaveBeenCalledWith(
      "drinks/index.json",
      JSON.stringify([{ id: "a" }]),
      expect.objectContaining({
        access: "public",
        contentType: "application/json",
        allowOverwrite: true,
        addRandomSuffix: false,
      }),
    );
  });
});

describe("putImage", () => {
  it("uploads bytes and returns the public url", async () => {
    put.mockResolvedValue({ url: "https://x/drinks/images/abc.webp" });
    const url = await putImage("drinks/images/abc.webp", Buffer.from("x"), "image/webp");
    expect(url).toBe("https://x/drinks/images/abc.webp");
    expect(put).toHaveBeenCalledWith(
      "drinks/images/abc.webp",
      Buffer.from("x"),
      expect.objectContaining({
        access: "public",
        contentType: "image/webp",
        allowOverwrite: true,
        addRandomSuffix: false,
      }),
    );
  });
});

describe("deleteByUrl", () => {
  it("deletes a blob by its url", async () => {
    del.mockResolvedValue();
    await deleteByUrl("https://x/y");
    expect(del).toHaveBeenCalledWith("https://x/y");
  });
});
