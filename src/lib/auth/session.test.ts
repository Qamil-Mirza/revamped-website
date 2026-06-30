import { describe, it, expect, beforeEach } from "vitest";
import { signSession, verifySession } from "@/lib/auth/session";

beforeEach(() => {
  process.env.SESSION_SECRET = "test-secret-test-secret-test-secret";
});

describe("session tokens", () => {
  it("verifies a token it signed", async () => {
    const token = await signSession();
    expect(await verifySession(token)).toBe(true);
  });

  it("rejects undefined", async () => {
    expect(await verifySession(undefined)).toBe(false);
  });

  it("rejects a tampered token", async () => {
    const token = await signSession();
    expect(await verifySession(token + "x")).toBe(false);
  });
});
