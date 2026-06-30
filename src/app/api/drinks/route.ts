import { NextResponse } from "next/server";
import sharp from "sharp";
import { getDrinks, addDrink, validateDrinkInput } from "@/lib/drinks";
import { putImage } from "@/lib/blob-store";
import { requireAuth } from "@/lib/auth/session";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024;

export async function GET() {
  const drinks = await getDrinks();
  return NextResponse.json({ drinks });
}

export async function POST(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("image");
  const validation = validateDrinkInput({
    date: form.get("date")?.toString(),
    name: form.get("name")?.toString(),
    note: form.get("note")?.toString(),
  });

  if (!validation.ok) {
    return NextResponse.json({ error: validation.errors.join("; ") }, { status: 400 });
  }
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "an image file is required" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "image must be ≤ 10 MB" }, { status: 413 });
  }

  const input = validation.value;
  const id = randomUUID();
  const inputBuffer = Buffer.from(await file.arrayBuffer());

  const { data, info } = await sharp(inputBuffer)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  const imageUrl = await putImage(`drinks/images/${id}.webp`, data, "image/webp");

  const drink = await addDrink({
    ...input,
    imageUrl,
    width: info.width,
    height: info.height,
  });

  return NextResponse.json({ drink }, { status: 201 });
}
