import { readJson, writeJson } from "@/lib/blob-store";

export const CREDENTIALS_KEY = "auth/credentials.json";

export type StoredCredential = {
  credentialID: string; // base64url
  publicKey: string; // base64url
  counter: number;
  transports?: string[];
  createdAt: string;
};

export async function getCredentials(): Promise<StoredCredential[]> {
  return readJson<StoredCredential[]>(CREDENTIALS_KEY, []);
}

export async function addCredential(c: StoredCredential): Promise<void> {
  const all = await getCredentials();
  await writeJson(CREDENTIALS_KEY, [...all, c]);
}

export async function updateCounter(credentialID: string, counter: number): Promise<void> {
  const all = await getCredentials();
  await writeJson(
    CREDENTIALS_KEY,
    all.map((c) => (c.credentialID === credentialID ? { ...c, counter } : c)),
  );
}
