import { SignJWT, jwtVerify } from "jose";
import { jwtSecret } from "@/lib/auth/jwt-secret";

export const CHALLENGE_COOKIE = "ca_challenge";

export async function signChallenge(challenge: string): Promise<string> {
  return new SignJWT({ challenge })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(jwtSecret());
}

export async function verifyChallenge(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    return typeof payload.challenge === "string" ? payload.challenge : null;
  } catch {
    return null;
  }
}
