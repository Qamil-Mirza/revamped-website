import { describe, it, expect, beforeEach } from "vitest";
import { checkRegistrationToken } from "@/lib/auth/registration-token";

beforeEach(() => {
  process.env.ADMIN_REGISTRATION_TOKEN = "correct-horse-battery-staple-xxxx";
});

describe("checkRegistrationToken", () => {
  it("accepts the correct token", () => {
    expect(checkRegistrationToken("correct-horse-battery-staple-xxxx")).toBe(true);
  });

  it("rejects an incorrect token", () => {
    expect(checkRegistrationToken("wrong")).toBe(false);
  });

  it("rejects undefined", () => {
    expect(checkRegistrationToken(undefined)).toBe(false);
  });
});
