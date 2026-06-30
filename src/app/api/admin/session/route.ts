import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAuth, SESSION_COOKIE } from "@/lib/auth/session";
import { getCredentials } from "@/lib/auth/credentials";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await requireAuth();
  const hasCredential = (await getCredentials()).length > 0;
  return NextResponse.json({ authenticated, hasCredential });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
