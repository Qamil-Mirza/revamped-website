import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/blob-store", () => ({
  readJson: vi.fn(),
  writeJson: vi.fn(),
}));

import { getCredentials, addCredential, updateCounter } from "@/lib/auth/credentials";
import * as blobStore from "@/lib/blob-store";

const readJson = vi.mocked(blobStore.readJson);
const writeJson = vi.mocked(blobStore.writeJson);

beforeEach(() => {
  readJson.mockReset();
  writeJson.mockReset();
});

describe("credentials store", () => {
  it("returns [] when none stored", async () => {
    readJson.mockResolvedValue([]);
    expect(await getCredentials()).toEqual([]);
  });

  it("appends a credential", async () => {
    readJson.mockResolvedValue([]);
    const cred = { credentialID: "id", publicKey: "pk", counter: 0, createdAt: "2026-06-29T00:00:00Z" };
    await addCredential(cred);
    expect(writeJson).toHaveBeenCalledWith("auth/credentials.json", [cred]);
  });

  it("updates the counter for a credential", async () => {
    readJson.mockResolvedValue([
      { credentialID: "id", publicKey: "pk", counter: 0, createdAt: "2026-06-29T00:00:00Z" },
      { credentialID: "other", publicKey: "pk2", counter: 3, createdAt: "2026-06-29T00:00:00Z" },
    ]);
    await updateCounter("id", 5);
    expect(writeJson).toHaveBeenCalledWith("auth/credentials.json", [
      { credentialID: "id", publicKey: "pk", counter: 5, createdAt: "2026-06-29T00:00:00Z" },
      { credentialID: "other", publicKey: "pk2", counter: 3, createdAt: "2026-06-29T00:00:00Z" },
    ]);
  });
});
