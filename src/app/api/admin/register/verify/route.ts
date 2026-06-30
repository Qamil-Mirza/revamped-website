import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRegistrationToken } from "@/lib/auth/registration-token";
import { verifyRegistration } from "@/lib/auth/webauthn";
import { addCredential } from "@/lib/auth/credentials";
import { verifyChallenge, CHALLENGE_COOKIE } from "@/lib/auth/challenge";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !checkRegistrationToken(body.token)) {
    return NextResponse.json({ error: "invalid registration token" }, { status: 401 });
  }
  const store = await cookies();
  const expectedChallenge = await verifyChallenge(store.get(CHALLENGE_COOKIE)?.value);
  store.delete(CHALLENGE_COOKIE);
  if (!expectedChallenge) {
    return NextResponse.json({ error: "challenge expired" }, { status: 400 });
  }
  const { verified, credential } = await verifyRegistration(body.response, expectedChallenge);
  if (!verified || !credential) {
    return NextResponse.json({ error: "registration failed" }, { status: 400 });
  }
  await addCredential(credential);
  return NextResponse.json({ verified: true });
}
