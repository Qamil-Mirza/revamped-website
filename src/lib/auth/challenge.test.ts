import { describe, it, expect, beforeEach } from "vitest";
import { signChallenge, verifyChallenge } from "@/lib/auth/challenge";

beforeEach(() => {
  process.env.SESSION_SECRET = "test-secret-test-secret-test-secret";
});

describe("challenge tokens", () => {
  it("round-trips the challenge value", async () => {
    const token = await signChallenge("abc123");
    expect(await verifyChallenge(token)).toBe("abc123");
  });

  it("returns null for a missing/invalid token", async () => {
    expect(await verifyChallenge(undefined)).toBeNull();
    expect(await verifyChallenge("garbage")).toBeNull();
  });
});
