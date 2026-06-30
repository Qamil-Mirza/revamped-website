import { list, put, del } from "@vercel/blob";

export async function readJson<T>(pathname: string, fallback: T): Promise<T> {
  const { blobs } = await list({ prefix: pathname });
  const match = blobs.find((b) => b.pathname === pathname);
  if (!match) return fallback;
  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return fallback;
  return (await res.json()) as T;
}

export async function writeJson<T>(pathname: string, value: T): Promise<void> {
  await put(pathname, JSON.stringify(value), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

export async function putImage(
  pathname: string,
  data: Buffer,
  contentType: string,
): Promise<string> {
  const { url } = await put(pathname, data, {
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
