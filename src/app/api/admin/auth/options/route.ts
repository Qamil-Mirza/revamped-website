import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCredentials } from "@/lib/auth/credentials";
import { buildAuthenticationOptions } from "@/lib/auth/webauthn";
import { signChallenge, CHALLENGE_COOKIE } from "@/lib/auth/challenge";
import { cookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  const options = await buildAuthenticationOptions(await getCredentials());
  const store = await cookies();
  store.set(CHALLENGE_COOKIE, await signChallenge(options.challenge), {
    ...cookieOptions(),
    maxAge: 300,
  });
  return NextResponse.json(options);
}
