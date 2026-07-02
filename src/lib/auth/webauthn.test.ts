import { describe, it, expect, beforeEach } from "vitest";
import { rpConfig, buildRegistrationOptions, buildAuthenticationOptions } from "@/lib/auth/webauthn";

describe("rpConfig", () => {
  beforeEach(() => {
    delete process.env.RP_ID;
    delete process.env.RP_ORIGIN;
  });

  it("falls back to localhost in dev", () => {
    expect(rpConfig()).toEqual({
      rpID: "localhost",
      rpName: "Qamil Mirza",
      origin: "http://localhost:3000",
    });
  });

  it("uses env values when set", () => {
    process.env.RP_ID = "qamil-mirza.com";
    process.env.RP_ORIGIN = "https://qamil-mirza.com";
    expect(rpConfig().rpID).toBe("qamil-mirza.com");
    expect(rpConfig().origin).toBe("https://qamil-mirza.com");
  });
});

describe("option builders", () => {
  beforeEach(() => {
    delete process.env.RP_ID;
    delete process.env.RP_ORIGIN;
  });

  it("produces a registration challenge", async () => {
    const opts = await buildRegistrationOptions([]);
    expect(typeof opts.challenge).toBe("string");
    expect(opts.rp.id).toBe("localhost");
  });

  it("produces an authentication challenge", async () => {
    const opts = await buildAuthenticationOptions([]);
    expect(typeof opts.challenge).toBe("string");
  });
});
