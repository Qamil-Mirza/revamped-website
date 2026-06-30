import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRegistrationToken } from "@/lib/auth/registration-token";
import { getCredentials } from "@/lib/auth/credentials";
import { buildRegistrationOptions } from "@/lib/auth/webauthn";
import { signChallenge, CHALLENGE_COOKIE } from "@/lib/auth/challenge";
import { cookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { token } = await request.json().catch(() => ({ token: undefined }));
  if (!checkRegistrationToken(token)) {
    await new Promise((r) => setTimeout(r, 500)); // small delay on mismatch
    return NextResponse.json({ error: "invalid registration token" }, { status: 401 });
  }
  const options = await buildRegistrationOptions(await getCredentials());
  const store = await cookies();
  store.set(CHALLENGE_COOKIE, await signChallenge(options.challenge), {
    ...cookieOptions(),
    maxAge: 300,
  });
  return NextResponse.json(options);
}
