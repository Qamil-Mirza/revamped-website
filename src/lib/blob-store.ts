import { list, put, del } from "@vercel/blob";

export async function readJson<T>(pathname: string, fallback: T): Promise<T> {
  const { blobs } = await list({ prefix: pathname });
  const match = blobs.find((b) => b.pathname === pathname);
  if (!match) return fallback;
  const bust = match.url.includes("?") ? "&" : "?";
  const res = await fetch(`${match.url}${bust}_=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to read blob ${pathname}: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function writeJson<T>(pathname: string, value: T): Promise<void> {
  await put(pathname, JSON.stringify(value), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
  });
}

export async function putImage(
  pathname: string,
  data: Buffer,
  contentType: string,
): Promise<string> {
  // Defensive copy into regular (non-shared) memory before uploading: sharp's
  // output Buffer can be backed by a SharedArrayBuffer in Vercel's serverless
  // runtime, and the fetch used by put() rejects it ("SharedArrayBuffer is not
  // allowed"). This doesn't surface under `next dev`, only in production.
  const { url } = await put(pathname, Buffer.from(data), {
    access: "public",
    contentType,
    allowOverwrite: true,
    addRandomSuffix: false,
  });
  return url;
}

export async function deleteByUrl(url: string): Promise<void> {
  await del(url);
}
