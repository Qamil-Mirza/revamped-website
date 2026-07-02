import { NextResponse } from "next/server";
import { deleteDrink } from "@/lib/drinks";
import { deleteByUrl } from "@/lib/blob-store";
import { requireAuth } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const removed = await deleteDrink(id);
  if (!removed) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  try {
    await deleteByUrl(removed.imageUrl);
  } catch {
    // Image already gone or unreachable — the record is removed, which is what matters.
  }
  return NextResponse.json({ ok: true });
}
