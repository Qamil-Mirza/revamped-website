import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SignJWT } from "jose";
import { signSession, verifySession } from "@/lib/auth/session";

beforeEach(() => {
  process.env.SESSION_SECRET = "test-secret-test-secret-test-secret";
});

afterEach(() => {
  delete process.env.SESSION_SECRET;
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

  it("rejects a same-secret token that lacks the owner subject (e.g. a challenge token)", async () => {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const foreign = await new SignJWT({ challenge: "abc" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(secret);
    expect(await verifySession(foreign)).toBe(false);
  });
});
