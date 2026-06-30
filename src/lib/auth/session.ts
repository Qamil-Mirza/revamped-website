import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { jwtSecret } from "@/lib/auth/jwt-secret";

export const SESSION_COOKIE = "ca_session";

export async function signSession(): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("owner")
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(jwtSecret());
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, jwtSecret(), { subject: "owner" });
    return true;
  } catch {
    return false;
  }
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function requireAuth(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}
