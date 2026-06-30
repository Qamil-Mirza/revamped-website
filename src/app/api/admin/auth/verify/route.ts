import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCredentials, updateCounter } from "@/lib/auth/credentials";
import { verifyAuthentication } from "@/lib/auth/webauthn";
import { verifyChallenge, CHALLENGE_COOKIE } from "@/lib/auth/challenge";
import { signSession, SESSION_COOKIE, cookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.response?.id) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const store = await cookies();
  const expectedChallenge = await verifyChallenge(store.get(CHALLENGE_COOKIE)?.value);
  store.delete(CHALLENGE_COOKIE);
  if (!expectedChallenge) {
    return NextResponse.json({ error: "challenge expired" }, { status: 400 });
  }
  const credential = (await getCredentials()).find((c) => c.credentialID === body.response.id);
  if (!credential) {
    return NextResponse.json({ error: "authentication failed" }, { status: 401 });
  }
  const { verified, newCounter } = await verifyAuthentication(body.response, expectedChallenge, credential);
  if (!verified) {
    return NextResponse.json({ error: "authentication failed" }, { status: 401 });
  }
  if (typeof newCounter === "number") {
    await updateCounter(credential.credentialID, newCounter);
  }
  store.set(SESSION_COOKIE, await signSession(), { ...cookieOptions(), maxAge: 14 * 24 * 60 * 60 });
  return NextResponse.json({ verified: true });
}
