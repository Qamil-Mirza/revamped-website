# Caffeine Addiction (Drink-of-the-Day) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Caffeine Addiction" coverflow carousel of home-made drinks to `/sidequests`, backed by a single-user web upload flow secured with WebAuthn (Face ID) passkeys and Vercel Blob storage.

**Architecture:** Public read path — a client carousel fetches `GET /api/drinks`, which reads a JSON document from Vercel Blob. Owner write path — a `/sidequests/admin` page authenticates via WebAuthn passkey (issuing a signed httpOnly session cookie), then uploads images (re-encoded with sharp) and metadata through protected API routes. No database: drink metadata and registered credentials are JSON documents in Blob.

**Tech Stack:** Next.js 16 (App Router, Node runtime route handlers), React 19, TypeScript, Tailwind, framer-motion (existing), `@vercel/blob`, `jose`, `sharp`, `@simplewebauthn/server` + `@simplewebauthn/browser`, Vitest (new, tests only).

## Global Constraints

- Path alias: `@/*` → `./src/*` (tsconfig `paths`).
- Section heading text: **"Caffeine Addiction"**. Subhead: **"Small-batch experiments from my kitchen counter."**
- Owner timezone constant: `OWNER_TZ = "America/Los_Angeles"`.
- Production WebAuthn config: `RP_ID = qamil-mirza.com`, `RP_ORIGIN = https://qamil-mirza.com`. Dev defaults: `RP_ID = localhost`, `RP_ORIGIN = http://localhost:3000`.
- `name` ≤ 80 chars (required, trimmed). `note` ≤ 140 chars (required, trimmed, single sentence). `date` format `YYYY-MM-DD`.
- Image upload: MIME must start with `image/`, size ≤ 10 MB. Always re-encoded to WebP, longest edge ≤ 1600px, EXIF stripped.
- Session cookie name: `ca_session`. Challenge cookie name: `ca_challenge`. Cookies: `httpOnly`, `secure` (in production), `sameSite: "lax"`, `path: "/"`.
- Blob keys: drinks metadata `drinks/index.json`; credentials `auth/credentials.json`; images `drinks/images/<id>.webp`. All JSON/image blobs written with `access: "public"`, `allowOverwrite: true`, `addRandomSuffix: false`.
- Reads are public; **every** write/auth-issuing route enforces authorization server-side.
- Tests import `{ describe, it, expect, vi, beforeEach }` explicitly from `vitest` (no globals).
- `next/headers` `cookies()` is async in Next 16 — always `await cookies()`. Dynamic route `params` is a Promise — always `await params`.

---

### Task 1: Dependencies, test harness, and config

**Files:**
- Modify: `package.json` (deps + scripts)
- Create: `vitest.config.ts`
- Create: `src/lib/__smoke__.test.ts`
- Modify: `next.config.ts`
- Create: `.env.example`

**Interfaces:**
- Consumes: nothing.
- Produces: a working `npm test` command; `images.remotePatterns` allowing Blob image hosts; documented env vars.

- [ ] **Step 1: Install runtime + dev dependencies**

```bash
npm install @vercel/blob jose sharp @simplewebauthn/server@^13 @simplewebauthn/browser@^13
npm install -D vitest@^2
```

- [ ] **Step 2: Add test scripts to `package.json`**

In the `"scripts"` block add:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 4: Create a smoke test `src/lib/__smoke__.test.ts`**

```ts
import { describe, it, expect } from "vitest";

describe("test harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run the smoke test to verify the harness works**

Run: `npm test`
Expected: PASS — 1 test passed.

- [ ] **Step 6: Allow Blob image hosts in `next.config.ts`**

Replace the file contents with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 7: Create `.env.example`**

```bash
# Vercel Blob — auto-injected in Vercel once a Blob store is linked; set manually for local dev.
BLOB_READ_WRITE_TOKEN=

# Random 32+ byte secret used to sign the session and challenge JWTs.
# Generate with: openssl rand -base64 32
SESSION_SECRET=

# High-entropy token required to enroll a passkey (break-glass / device recovery key).
# Generate with: openssl rand -base64 32
ADMIN_REGISTRATION_TOKEN=

# WebAuthn relying-party config. Production values shown; dev falls back to localhost.
RP_ID=qamil-mirza.com
RP_ORIGIN=https://qamil-mirza.com
```

- [ ] **Step 8: Verify the app still builds/lints**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/__smoke__.test.ts next.config.ts .env.example
git commit -m "chore: add blob/jose/sharp/webauthn deps, vitest harness, env example"
```

---

### Task 2: Blob JSON + image store helper

**Files:**
- Create: `src/lib/blob-store.ts`
- Test: `src/lib/blob-store.test.ts`

**Interfaces:**
- Consumes: `@vercel/blob` (`list`, `put`, `del`).
- Produces:
  - `readJson<T>(pathname: string, fallback: T): Promise<T>`
  - `writeJson<T>(pathname: string, value: T): Promise<void>`
  - `putImage(pathname: string, data: Buffer, contentType: string): Promise<string>` (returns public URL)
  - `deleteByUrl(url: string): Promise<void>`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const list = vi.fn();
const put = vi.fn();
const del = vi.fn();
vi.mock("@vercel/blob", () => ({ list, put, del }));

import { readJson, writeJson, putImage, deleteByUrl } from "@/lib/blob-store";

beforeEach(() => {
  list.mockReset();
  put.mockReset();
  del.mockReset();
});

describe("readJson", () => {
  it("returns the fallback when no blob matches the pathname", async () => {
    list.mockResolvedValue({ blobs: [] });
    const result = await readJson("drinks/index.json", []);
    expect(result).toEqual([]);
  });

  it("fetches and parses the matching blob", async () => {
    list.mockResolvedValue({
      blobs: [{ pathname: "drinks/index.json", url: "https://x/drinks/index.json" }],
    });
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify([{ id: "a" }])));
    const result = await readJson<{ id: string }[]>("drinks/index.json", []);
    expect(result).toEqual([{ id: "a" }]);
    fetchMock.mockRestore();
  });
});

describe("writeJson", () => {
  it("writes a stable, public, overwritable JSON blob", async () => {
    put.mockResolvedValue({ url: "https://x/drinks/index.json" });
    await writeJson("drinks/index.json", [{ id: "a" }]);
    expect(put).toHaveBeenCalledWith(
      "drinks/index.json",
      JSON.stringify([{ id: "a" }]),
      expect.objectContaining({
        access: "public",
        contentType: "application/json",
        allowOverwrite: true,
        addRandomSuffix: false,
      }),
    );
  });
});

describe("putImage", () => {
  it("uploads bytes and returns the public url", async () => {
    put.mockResolvedValue({ url: "https://x/drinks/images/abc.webp" });
    const url = await putImage("drinks/images/abc.webp", Buffer.from("x"), "image/webp");
    expect(url).toBe("https://x/drinks/images/abc.webp");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/blob-store.test.ts`
Expected: FAIL — cannot find module `@/lib/blob-store`.

- [ ] **Step 3: Write the implementation**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/blob-store.test.ts`
Expected: PASS — all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/blob-store.ts src/lib/blob-store.test.ts
git commit -m "feat: add Vercel Blob JSON + image store helper"
```

---

### Task 3: Drinks pure logic (validation, today, sorting, featured selection)

**Files:**
- Create: `src/lib/drinks.ts` (pure functions + `Drink`/`DrinkInput` types only in this task)
- Test: `src/lib/drinks.logic.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Drink = { id: string; date: string; name: string; note: string; imageUrl: string; width: number; height: number; createdAt: string }`
  - `type DrinkInput = { date: string; name: string; note: string }`
  - `type ValidationResult = { ok: true; value: DrinkInput } | { ok: false; errors: string[] }`
  - `const OWNER_TZ = "America/Los_Angeles"`
  - `todayInOwnerTz(now?: Date): string` → `YYYY-MM-DD`
  - `validateDrinkInput(raw: { date?: string; name?: string; note?: string }): ValidationResult`
  - `sortDrinks(drinks: Drink[]): Drink[]` (newest first)
  - `selectFeatured(drinks: Drink[], today: string): { ordered: Drink[]; featuredIndex: number }`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import {
  todayInOwnerTz,
  validateDrinkInput,
  sortDrinks,
  selectFeatured,
  type Drink,
} from "@/lib/drinks";

function drink(partial: Partial<Drink>): Drink {
  return {
    id: "id",
    date: "2026-06-01",
    name: "Latte",
    note: "good",
    imageUrl: "https://x/a.webp",
    width: 100,
    height: 100,
    createdAt: "2026-06-01T00:00:00.000Z",
    ...partial,
  };
}

describe("todayInOwnerTz", () => {
  it("formats a date as YYYY-MM-DD in Pacific time", () => {
    // 2026-06-29T05:00:00Z is still 2026-06-28 in America/Los_Angeles (UTC-7)
    expect(todayInOwnerTz(new Date("2026-06-29T05:00:00Z"))).toBe("2026-06-28");
  });
});

describe("validateDrinkInput", () => {
  it("accepts and trims valid input", () => {
    const r = validateDrinkInput({ date: "2026-06-29", name: " Hojicha ", note: " earthy " });
    expect(r).toEqual({ ok: true, value: { date: "2026-06-29", name: "Hojicha", note: "earthy" } });
  });

  it("rejects a missing name", () => {
    const r = validateDrinkInput({ date: "2026-06-29", name: "  ", note: "x" });
    expect(r.ok).toBe(false);
  });

  it("rejects a note longer than 140 chars", () => {
    const r = validateDrinkInput({ date: "2026-06-29", name: "x", note: "a".repeat(141) });
    expect(r.ok).toBe(false);
  });

  it("rejects a malformed date", () => {
    const r = validateDrinkInput({ date: "06/29/2026", name: "x", note: "y" });
    expect(r.ok).toBe(false);
  });
});

describe("sortDrinks", () => {
  it("orders newest date first, breaking ties by createdAt", () => {
    const a = drink({ id: "a", date: "2026-06-01", createdAt: "2026-06-01T01:00:00Z" });
    const b = drink({ id: "b", date: "2026-06-03" });
    const c = drink({ id: "c", date: "2026-06-01", createdAt: "2026-06-01T02:00:00Z" });
    expect(sortDrinks([a, b, c]).map((d) => d.id)).toEqual(["b", "c", "a"]);
  });
});

describe("selectFeatured", () => {
  it("returns featuredIndex 0 (latest) when no drink is dated today", () => {
    const drinks = [drink({ id: "a", date: "2026-06-03" }), drink({ id: "b", date: "2026-06-01" })];
    const { ordered, featuredIndex } = selectFeatured(drinks, "2026-06-29");
    expect(ordered[0].id).toBe("a");
    expect(featuredIndex).toBe(0);
  });

  it("features the drink dated today", () => {
    const drinks = [drink({ id: "a", date: "2026-06-03" }), drink({ id: "today", date: "2026-06-29" })];
    const { ordered, featuredIndex } = selectFeatured(drinks, "2026-06-29");
    expect(ordered[featuredIndex].id).toBe("today");
  });

  it("returns featuredIndex -1 for an empty list", () => {
    expect(selectFeatured([], "2026-06-29")).toEqual({ ordered: [], featuredIndex: -1 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/drinks.logic.test.ts`
Expected: FAIL — cannot find module `@/lib/drinks`.

- [ ] **Step 3: Write the implementation**

```ts
export type Drink = {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  note: string;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: string; // ISO
};

export type DrinkInput = { date: string; name: string; note: string };

export type ValidationResult =
  | { ok: true; value: DrinkInput }
  | { ok: false; errors: string[] };

export const OWNER_TZ = "America/Los_Angeles";

export function todayInOwnerTz(now: Date = new Date()): string {
  // en-CA gives YYYY-MM-DD formatting.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: OWNER_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateDrinkInput(raw: {
  date?: string;
  name?: string;
  note?: string;
}): ValidationResult {
  const errors: string[] = [];
  const date = (raw.date ?? "").trim();
  const name = (raw.name ?? "").trim();
  const note = (raw.note ?? "").trim();

  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(date))) {
    errors.push("date must be a valid YYYY-MM-DD");
  }
  if (name.length < 1 || name.length > 80) {
    errors.push("name must be 1–80 characters");
  }
  if (note.length < 1 || note.length > 140) {
    errors.push("note must be 1–140 characters");
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: { date, name, note } };
}

export function sortDrinks(drinks: Drink[]): Drink[] {
  return [...drinks].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.createdAt < b.createdAt ? 1 : -1;
  });
}

export function selectFeatured(
  drinks: Drink[],
  today: string,
): { ordered: Drink[]; featuredIndex: number } {
  const ordered = sortDrinks(drinks);
  if (ordered.length === 0) return { ordered, featuredIndex: -1 };
  const todayIndex = ordered.findIndex((d) => d.date === today);
  return { ordered, featuredIndex: todayIndex >= 0 ? todayIndex : 0 };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/drinks.logic.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/drinks.ts src/lib/drinks.logic.test.ts
git commit -m "feat: add drinks validation/today/sort/featured pure logic"
```

---

### Task 4: Drinks data access (getDrinks / addDrink / deleteDrink)

**Files:**
- Modify: `src/lib/drinks.ts` (append I/O functions; keep pure functions from Task 3)
- Test: `src/lib/drinks.store.test.ts`

**Interfaces:**
- Consumes: `readJson`, `writeJson` from `@/lib/blob-store`; types from Task 3.
- Produces:
  - `DRINKS_KEY = "drinks/index.json"`
  - `getDrinks(): Promise<Drink[]>` (sorted newest first)
  - `addDrink(input: DrinkInput & { imageUrl: string; width: number; height: number }): Promise<Drink>`
  - `deleteDrink(id: string): Promise<Drink | null>` (returns the removed drink, or null if not found)

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const readJson = vi.fn();
const writeJson = vi.fn();
vi.mock("@/lib/blob-store", () => ({ readJson, writeJson }));

import { getDrinks, addDrink, deleteDrink } from "@/lib/drinks";

beforeEach(() => {
  readJson.mockReset();
  writeJson.mockReset();
});

describe("getDrinks", () => {
  it("returns drinks sorted newest first", async () => {
    readJson.mockResolvedValue([
      { id: "old", date: "2026-06-01", name: "a", note: "n", imageUrl: "u", width: 1, height: 1, createdAt: "2026-06-01T00:00:00Z" },
      { id: "new", date: "2026-06-05", name: "a", note: "n", imageUrl: "u", width: 1, height: 1, createdAt: "2026-06-05T00:00:00Z" },
    ]);
    const result = await getDrinks();
    expect(result.map((d) => d.id)).toEqual(["new", "old"]);
  });
});

describe("addDrink", () => {
  it("creates a record with an id + createdAt and persists it", async () => {
    readJson.mockResolvedValue([]);
    const created = await addDrink({
      date: "2026-06-29",
      name: "Hojicha",
      note: "earthy",
      imageUrl: "https://x/a.webp",
      width: 800,
      height: 600,
    });
    expect(created.id).toBeTruthy();
    expect(created.createdAt).toBeTruthy();
    expect(writeJson).toHaveBeenCalledWith("drinks/index.json", [created]);
  });
});

describe("deleteDrink", () => {
  it("removes the matching record and returns it", async () => {
    const existing = { id: "x", date: "2026-06-29", name: "a", note: "n", imageUrl: "u", width: 1, height: 1, createdAt: "2026-06-29T00:00:00Z" };
    readJson.mockResolvedValue([existing]);
    const removed = await deleteDrink("x");
    expect(removed).toEqual(existing);
    expect(writeJson).toHaveBeenCalledWith("drinks/index.json", []);
  });

  it("returns null when id is not found", async () => {
    readJson.mockResolvedValue([]);
    expect(await deleteDrink("nope")).toBeNull();
    expect(writeJson).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/drinks.store.test.ts`
Expected: FAIL — `getDrinks`/`addDrink`/`deleteDrink` not exported.

- [ ] **Step 3: Append the implementation to `src/lib/drinks.ts`**

Add these imports at the top of the file:

```ts
import { readJson, writeJson } from "@/lib/blob-store";
import { randomUUID } from "crypto";
```

Add at the bottom of the file:

```ts
export const DRINKS_KEY = "drinks/index.json";

export async function getDrinks(): Promise<Drink[]> {
  const drinks = await readJson<Drink[]>(DRINKS_KEY, []);
  return sortDrinks(drinks);
}

export async function addDrink(
  input: DrinkInput & { imageUrl: string; width: number; height: number },
): Promise<Drink> {
  const drinks = await readJson<Drink[]>(DRINKS_KEY, []);
  const drink: Drink = {
    id: randomUUID(),
    date: input.date,
    name: input.name,
    note: input.note,
    imageUrl: input.imageUrl,
    width: input.width,
    height: input.height,
    createdAt: new Date().toISOString(),
  };
  await writeJson(DRINKS_KEY, [...drinks, drink]);
  return drink;
}

export async function deleteDrink(id: string): Promise<Drink | null> {
  const drinks = await readJson<Drink[]>(DRINKS_KEY, []);
  const removed = drinks.find((d) => d.id === id) ?? null;
  if (!removed) return null;
  await writeJson(
    DRINKS_KEY,
    drinks.filter((d) => d.id !== id),
  );
  return removed;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/drinks.store.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/drinks.ts src/lib/drinks.store.test.ts
git commit -m "feat: add drinks Blob-backed data access"
```

---

### Task 5: Session tokens + auth guard

**Files:**
- Create: `src/lib/auth/jwt-secret.ts` (shared JWT signing key, used by session + challenge)
- Create: `src/lib/auth/session.ts`
- Test: `src/lib/auth/session.test.ts`

**Interfaces:**
- Consumes: `jose`, `next/headers` `cookies()`.
- Produces:
  - `jwtSecret(): Uint8Array` (in `jwt-secret.ts`; reads `SESSION_SECRET`, throws if unset)
  - `SESSION_COOKIE = "ca_session"`
  - `signSession(): Promise<string>`
  - `verifySession(token: string | undefined): Promise<boolean>`
  - `requireAuth(): Promise<boolean>` (reads the cookie, verifies)
  - `cookieOptions(): { httpOnly; secure; sameSite; path }` (shared cookie attributes)

- [ ] **Step 1: Write the failing test** (unit-tests the pure sign/verify path)

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { signSession, verifySession } from "@/lib/auth/session";

beforeEach(() => {
  process.env.SESSION_SECRET = "test-secret-test-secret-test-secret";
});

describe("session tokens", () => {
  it("verifies a token it signed", async () => {
    const token = await signSession();
    expect(await verifySession(token)).toBe(true);
  });

  it("rejects undefined", async () => {
    expect(await verifySession(undefined)).toBe(false);
  });

  it("rejects a tampered token", async () => {
    const token = await signSession();
    expect(await verifySession(token + "x")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/auth/session.test.ts`
Expected: FAIL — cannot find module `@/lib/auth/session`.

- [ ] **Step 3: Write the shared JWT secret helper `src/lib/auth/jwt-secret.ts`**

```ts
export function jwtSecret(): Uint8Array {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(value);
}
```

- [ ] **Step 4: Write the implementation `src/lib/auth/session.ts`**

```ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { jwtSecret } from "@/lib/auth/jwt-secret";

export const SESSION_COOKIE = "ca_session";

export async function signSession(): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("owner")
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(jwtSecret());
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, jwtSecret());
    return true;
  } catch {
    return false;
  }
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function requireAuth(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/auth/session.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth/jwt-secret.ts src/lib/auth/session.ts src/lib/auth/session.test.ts
git commit -m "feat: add signed session tokens + requireAuth guard"
```

---

### Task 6: Challenge tokens + registration-token check

**Files:**
- Create: `src/lib/auth/challenge.ts`
- Create: `src/lib/auth/registration-token.ts`
- Test: `src/lib/auth/challenge.test.ts`
- Test: `src/lib/auth/registration-token.test.ts`

**Interfaces:**
- Consumes: `jose`; `jwtSecret` from `@/lib/auth/jwt-secret` (Task 5); node `crypto.timingSafeEqual`.
- Produces:
  - `CHALLENGE_COOKIE = "ca_challenge"`
  - `signChallenge(challenge: string): Promise<string>` (5-minute expiry)
  - `verifyChallenge(token: string | undefined): Promise<string | null>` (returns the challenge string or null)
  - `checkRegistrationToken(provided: string | undefined): boolean`

- [ ] **Step 1: Write the failing tests**

`src/lib/auth/challenge.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { signChallenge, verifyChallenge } from "@/lib/auth/challenge";

beforeEach(() => {
  process.env.SESSION_SECRET = "test-secret-test-secret-test-secret";
});

describe("challenge tokens", () => {
  it("round-trips the challenge value", async () => {
    const token = await signChallenge("abc123");
    expect(await verifyChallenge(token)).toBe("abc123");
  });

  it("returns null for a missing/invalid token", async () => {
    expect(await verifyChallenge(undefined)).toBeNull();
    expect(await verifyChallenge("garbage")).toBeNull();
  });
});
```

`src/lib/auth/registration-token.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { checkRegistrationToken } from "@/lib/auth/registration-token";

beforeEach(() => {
  process.env.ADMIN_REGISTRATION_TOKEN = "correct-horse-battery-staple-xxxx";
});

describe("checkRegistrationToken", () => {
  it("accepts the correct token", () => {
    expect(checkRegistrationToken("correct-horse-battery-staple-xxxx")).toBe(true);
  });

  it("rejects an incorrect token", () => {
    expect(checkRegistrationToken("wrong")).toBe(false);
  });

  it("rejects undefined", () => {
    expect(checkRegistrationToken(undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/auth/challenge.test.ts src/lib/auth/registration-token.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/lib/auth/challenge.ts`**

```ts
import { SignJWT, jwtVerify } from "jose";
import { jwtSecret } from "@/lib/auth/jwt-secret";

export const CHALLENGE_COOKIE = "ca_challenge";

export async function signChallenge(challenge: string): Promise<string> {
  return new SignJWT({ challenge })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(jwtSecret());
}

export async function verifyChallenge(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    return typeof payload.challenge === "string" ? payload.challenge : null;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Write `src/lib/auth/registration-token.ts`**

```ts
import { timingSafeEqual } from "crypto";

export function checkRegistrationToken(provided: string | undefined): boolean {
  const expected = process.env.ADMIN_REGISTRATION_TOKEN;
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/auth/challenge.test.ts src/lib/auth/registration-token.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth/challenge.ts src/lib/auth/registration-token.ts src/lib/auth/challenge.test.ts src/lib/auth/registration-token.test.ts
git commit -m "feat: add WebAuthn challenge tokens + registration-token check"
```

---

### Task 7: Credentials store

**Files:**
- Create: `src/lib/auth/credentials.ts`
- Test: `src/lib/auth/credentials.test.ts`

**Interfaces:**
- Consumes: `readJson`, `writeJson` from `@/lib/blob-store`.
- Produces:
  - `CREDENTIALS_KEY = "auth/credentials.json"`
  - `type StoredCredential = { credentialID: string; publicKey: string; counter: number; transports?: string[]; createdAt: string }`
  - `getCredentials(): Promise<StoredCredential[]>`
  - `addCredential(c: StoredCredential): Promise<void>`
  - `updateCounter(credentialID: string, counter: number): Promise<void>`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const readJson = vi.fn();
const writeJson = vi.fn();
vi.mock("@/lib/blob-store", () => ({ readJson, writeJson }));

import { getCredentials, addCredential, updateCounter } from "@/lib/auth/credentials";

beforeEach(() => {
  readJson.mockReset();
  writeJson.mockReset();
});

describe("credentials store", () => {
  it("returns [] when none stored", async () => {
    readJson.mockResolvedValue([]);
    expect(await getCredentials()).toEqual([]);
  });

  it("appends a credential", async () => {
    readJson.mockResolvedValue([]);
    const cred = { credentialID: "id", publicKey: "pk", counter: 0, createdAt: "2026-06-29T00:00:00Z" };
    await addCredential(cred);
    expect(writeJson).toHaveBeenCalledWith("auth/credentials.json", [cred]);
  });

  it("updates the counter for a credential", async () => {
    readJson.mockResolvedValue([
      { credentialID: "id", publicKey: "pk", counter: 0, createdAt: "2026-06-29T00:00:00Z" },
    ]);
    await updateCounter("id", 5);
    expect(writeJson).toHaveBeenCalledWith("auth/credentials.json", [
      { credentialID: "id", publicKey: "pk", counter: 5, createdAt: "2026-06-29T00:00:00Z" },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/auth/credentials.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/auth/credentials.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth/credentials.ts src/lib/auth/credentials.test.ts
git commit -m "feat: add Blob-backed WebAuthn credentials store"
```

---

### Task 8: WebAuthn config + ceremony wrappers

**Files:**
- Create: `src/lib/auth/webauthn.ts`
- Test: `src/lib/auth/webauthn.test.ts`

**Interfaces:**
- Consumes: `@simplewebauthn/server`; `StoredCredential` from Task 7.
- Produces:
  - `rpConfig(): { rpID: string; rpName: string; origin: string }`
  - `buildRegistrationOptions(existing: StoredCredential[]): Promise<PublicKeyCredentialCreationOptionsJSON>`
  - `verifyRegistration(response, expectedChallenge: string): Promise<{ verified: boolean; credential?: StoredCredential }>`
  - `buildAuthenticationOptions(existing: StoredCredential[]): Promise<PublicKeyCredentialRequestOptionsJSON>`
  - `verifyAuthentication(response, expectedChallenge: string, credential: StoredCredential): Promise<{ verified: boolean; newCounter?: number }>`

> **Implementer note:** This wraps `@simplewebauthn/server` v13. If `npm install` resolved a different major, open `node_modules/@simplewebauthn/server` types and confirm: `verifyRegistrationResponse` returns `registrationInfo.credential.{id,publicKey,counter}`; `generateAuthenticationOptions`/`allowCredentials` take `id` as a base64url **string**; `verifyAuthenticationResponse` takes a `credential: { id, publicKey, counter, transports }` argument. Adjust field access to match the installed version, keeping this module's exported signatures unchanged.

- [ ] **Step 1: Write the failing test** (config + options-shape; verification ceremonies are validated manually on a device in Task 12)

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { rpConfig, buildRegistrationOptions, buildAuthenticationOptions } from "@/lib/auth/webauthn";

describe("rpConfig", () => {
  beforeEach(() => {
    delete process.env.RP_ID;
    delete process.env.RP_ORIGIN;
  });

  it("falls back to localhost in dev", () => {
    expect(rpConfig()).toEqual({
      rpID: "localhost",
      rpName: "Qamil Mirza",
      origin: "http://localhost:3000",
    });
  });

  it("uses env values when set", () => {
    process.env.RP_ID = "qamil-mirza.com";
    process.env.RP_ORIGIN = "https://qamil-mirza.com";
    expect(rpConfig().rpID).toBe("qamil-mirza.com");
    expect(rpConfig().origin).toBe("https://qamil-mirza.com");
  });
});

describe("option builders", () => {
  it("produces a registration challenge", async () => {
    const opts = await buildRegistrationOptions([]);
    expect(typeof opts.challenge).toBe("string");
    expect(opts.rp.id).toBe("localhost");
  });

  it("produces an authentication challenge", async () => {
    const opts = await buildAuthenticationOptions([]);
    expect(typeof opts.challenge).toBe("string");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/auth/webauthn.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

```ts
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/server";
import type { StoredCredential } from "@/lib/auth/credentials";

export function rpConfig() {
  return {
    rpID: process.env.RP_ID ?? "localhost",
    rpName: "Qamil Mirza",
    origin: process.env.RP_ORIGIN ?? "http://localhost:3000",
  };
}

export async function buildRegistrationOptions(
  existing: StoredCredential[],
): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const { rpID, rpName } = rpConfig();
  return generateRegistrationOptions({
    rpName,
    rpID,
    userName: "owner",
    attestationType: "none",
    excludeCredentials: existing.map((c) => ({
      id: c.credentialID,
      transports: c.transports as never,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required",
    },
  });
}

export async function verifyRegistration(
  response: RegistrationResponseJSON,
  expectedChallenge: string,
): Promise<{ verified: boolean; credential?: StoredCredential }> {
  const { rpID, origin } = rpConfig();
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });
  if (!verification.verified || !verification.registrationInfo) {
    return { verified: false };
  }
  const { credential } = verification.registrationInfo;
  return {
    verified: true,
    credential: {
      credentialID: credential.id,
      publicKey: Buffer.from(credential.publicKey).toString("base64url"),
      counter: credential.counter,
      transports: response.response.transports,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function buildAuthenticationOptions(
  existing: StoredCredential[],
): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const { rpID } = rpConfig();
  return generateAuthenticationOptions({
    rpID,
    userVerification: "required",
    allowCredentials: existing.map((c) => ({
      id: c.credentialID,
      transports: c.transports as never,
    })),
  });
}

export async function verifyAuthentication(
  response: AuthenticationResponseJSON,
  expectedChallenge: string,
  credential: StoredCredential,
): Promise<{ verified: boolean; newCounter?: number }> {
  const { rpID, origin } = rpConfig();
  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
    credential: {
      id: credential.credentialID,
      publicKey: Buffer.from(credential.publicKey, "base64url"),
      counter: credential.counter,
      transports: credential.transports as never,
    },
  });
  return {
    verified: verification.verified,
    newCounter: verification.authenticationInfo?.newCounter,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/auth/webauthn.test.ts`
Expected: PASS. (If type errors arise from a different installed version, apply the implementer note above.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth/webauthn.ts src/lib/auth/webauthn.test.ts
git commit -m "feat: add WebAuthn config + ceremony wrappers"
```

---

### Task 9: Drinks API routes (public GET, protected POST + DELETE)

**Files:**
- Create: `src/app/api/drinks/route.ts`
- Create: `src/app/api/drinks/[id]/route.ts`

**Interfaces:**
- Consumes: `getDrinks`, `addDrink`, `deleteDrink`, `validateDrinkInput` from `@/lib/drinks`; `putImage`, `deleteByUrl` from `@/lib/blob-store`; `requireAuth` from `@/lib/auth/session`; `sharp`.
- Produces: HTTP endpoints `GET/POST /api/drinks`, `DELETE /api/drinks/[id]`.

- [ ] **Step 1: Write `src/app/api/drinks/route.ts`**

```ts
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
```

> Note: `addDrink` generates its own id internally; the local `id` here is only used for the image pathname. That is intentional — the image filename does not need to equal the drink id, it only needs to be unique.

- [ ] **Step 2: Write `src/app/api/drinks/[id]/route.ts`**

```ts
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
```

- [ ] **Step 3: Verify the app compiles and the public GET responds**

Run: `npm run dev` in one terminal, then in another:
`curl -s http://localhost:3000/api/drinks`
Expected: `{"drinks":[]}` (empty until something is uploaded; requires `BLOB_READ_WRITE_TOKEN` + `SESSION_SECRET` in `.env.local`). If Blob env is not configured locally, expect a 500 — note it and continue; full verification happens in Task 12.

- [ ] **Step 4: Verify POST rejects unauthenticated requests**

Run: `curl -s -X POST http://localhost:3000/api/drinks -F name=x -F note=y -F date=2026-06-29`
Expected: `{"error":"unauthorized"}` with HTTP 401.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/drinks/route.ts "src/app/api/drinks/[id]/route.ts"
git commit -m "feat: add drinks API (public GET, auth-gated POST + DELETE)"
```

---

### Task 10: Admin auth API routes (register, authenticate, session)

**Files:**
- Create: `src/app/api/admin/register/options/route.ts`
- Create: `src/app/api/admin/register/verify/route.ts`
- Create: `src/app/api/admin/auth/options/route.ts`
- Create: `src/app/api/admin/auth/verify/route.ts`
- Create: `src/app/api/admin/session/route.ts`

**Interfaces:**
- Consumes: webauthn wrappers (Task 8), credentials store (Task 7), challenge tokens + registration-token check (Task 6), session helpers (Task 5).
- Produces: HTTP endpoints under `/api/admin/*`.

- [ ] **Step 1: Write `src/app/api/admin/register/options/route.ts`**

```ts
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
```

- [ ] **Step 2: Write `src/app/api/admin/register/verify/route.ts`**

```ts
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
```

- [ ] **Step 3: Write `src/app/api/admin/auth/options/route.ts`**

```ts
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
```

- [ ] **Step 4: Write `src/app/api/admin/auth/verify/route.ts`**

```ts
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
    return NextResponse.json({ error: "unknown credential" }, { status: 401 });
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
```

- [ ] **Step 5: Write `src/app/api/admin/session/route.ts`**

```ts
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
```

- [ ] **Step 6: Verify endpoints compile and respond**

Run: `npm run dev`, then:
`curl -s http://localhost:3000/api/admin/session`
Expected: JSON like `{"authenticated":false,"hasCredential":false}` (requires Blob + SESSION_SECRET env; otherwise a 500 — note and defer full check to Task 12).
`curl -s -X POST http://localhost:3000/api/admin/register/options -H 'content-type: application/json' -d '{"token":"wrong"}'`
Expected: HTTP 401 `{"error":"invalid registration token"}`.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/admin
git commit -m "feat: add WebAuthn register/authenticate/session API routes"
```

---

### Task 11: Public coverflow carousel UI

**Files:**
- Create: `src/components/ui/DrinkCard.tsx`
- Create: `src/components/ui/DrinksCarousel.tsx`

**Interfaces:**
- Consumes: `GET /api/drinks`; `Drink` type, `selectFeatured`, `todayInOwnerTz` from `@/lib/drinks-logic` (client-safe pure module — NOT `@/lib/drinks`, which pulls in server-only `@vercel/blob` + node `crypto`); framer-motion; next/image.
- Produces: `<DrinksCarousel />` (default export) for the sidequests page; `<DrinkCard drink position />`.

- [ ] **Step 1: Write `src/components/ui/DrinkCard.tsx`**

```tsx
"use client";

import Image from "next/image";
import type { Drink } from "@/lib/drinks-logic";

function formatDate(date: string): string {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DrinkCard({
  drink,
  featured,
}: {
  drink: Drink;
  featured: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl bg-black/30 backdrop-blur-sm ring-1 ring-white/10 transition-all ${
        featured ? "shadow-2xl" : ""
      }`}
    >
      <div className="relative aspect-square w-full">
        <Image
          src={drink.imageUrl}
          alt={drink.name}
          fill
          sizes="(max-width: 768px) 70vw, 360px"
          className="object-cover"
        />
      </div>
      <div className="p-4 text-left">
        <p className="text-xs uppercase tracking-wider text-primaryText/60">
          {formatDate(drink.date)}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-primaryText">{drink.name}</h3>
        {featured && (
          <p className="mt-1 text-sm text-primaryText/80">{drink.note}</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/ui/DrinksCarousel.tsx`**

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DrinkCard from "@/components/ui/DrinkCard";
import { selectFeatured, todayInOwnerTz, type Drink } from "@/lib/drinks-logic";

export default function DrinksCarousel() {
  const [drinks, setDrinks] = useState<Drink[] | null>(null);
  const [center, setCenter] = useState(0);

  useEffect(() => {
    let active = true;
    fetch("/api/drinks")
      .then((r) => r.json())
      .then((data: { drinks: Drink[] }) => {
        if (!active) return;
        const { ordered, featuredIndex } = selectFeatured(data.drinks, todayInOwnerTz());
        setDrinks(ordered);
        setCenter(featuredIndex < 0 ? 0 : featuredIndex);
      })
      .catch(() => active && setDrinks([]));
    return () => {
      active = false;
    };
  }, []);

  const move = useCallback(
    (dir: -1 | 1) => {
      setDrinks((d) => {
        if (!d || d.length === 0) return d;
        setCenter((c) => Math.min(Math.max(c + dir, 0), d.length - 1));
        return d;
      });
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  if (drinks === null) {
    return (
      <div className="mx-auto h-72 w-full max-w-md animate-pulse rounded-2xl bg-white/5" />
    );
  }

  if (drinks.length === 0) {
    return (
      <p className="text-center text-primaryText/60">No drinks brewed yet — check back soon.</p>
    );
  }

  const visible = [center - 1, center, center + 1].filter(
    (i) => i >= 0 && i < drinks.length,
  );

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="flex items-center justify-center gap-4 py-6"
        role="group"
        aria-label="Drink carousel"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((i) => {
            const isCenter = i === center;
            return (
              <motion.div
                key={drinks[i].id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isCenter ? 1 : 0.45,
                  scale: isCenter ? 1 : 0.8,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className={isCenter ? "w-64 sm:w-72 z-10" : "hidden w-48 sm:block"}
                onClick={() => !isCenter && setCenter(i)}
                style={{ cursor: isCenter ? "default" : "pointer" }}
              >
                <DrinkCard drink={drinks[i]} featured={isCenter} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={center === 0}
          aria-label="Previous drink"
          className="rounded-full border border-white/20 px-4 py-2 text-primaryText disabled:opacity-30"
        >
          ←
        </button>
        <span className="text-sm text-primaryText/60">
          {center + 1} / {drinks.length}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={center === drinks.length - 1}
          aria-label="Next drink"
          className="rounded-full border border-white/20 px-4 py-2 text-primaryText disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify it renders the empty state**

Temporarily render the carousel by completing Task 13 first is NOT required; instead verify compilation:
Run: `npm run lint`
Expected: no errors in the two new files. Full visual verification happens in Task 13/12.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/DrinkCard.tsx src/components/ui/DrinksCarousel.tsx
git commit -m "feat: add public coverflow drinks carousel"
```

---

### Task 12: Admin UI (Face ID auth + upload form)

**Files:**
- Create: `src/components/admin/AdminAuth.tsx`
- Create: `src/components/admin/DrinkUploadForm.tsx`
- Create: `src/app/sidequests/admin/page.tsx`

**Interfaces:**
- Consumes: `@simplewebauthn/browser` (`startRegistration`, `startAuthentication`); the `/api/admin/*` and `/api/drinks` endpoints; `Drink` type; `todayInOwnerTz`.
- Produces: the `/sidequests/admin` page (not linked from nav).

- [ ] **Step 1: Write `src/components/admin/AdminAuth.tsx`**

```tsx
"use client";

import { useState } from "react";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

export default function AdminAuth({
  hasCredential,
  onAuthenticated,
}: {
  hasCredential: boolean;
  onAuthenticated: () => void;
}) {
  const [token, setToken] = useState("");
  const [showEnroll, setShowEnroll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setError(null);
    setBusy(true);
    try {
      const optionsJSON = await (await fetch("/api/admin/auth/options", { method: "POST" })).json();
      const response = await startAuthentication({ optionsJSON });
      const res = await fetch("/api/admin/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ response }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "sign-in failed");
      onAuthenticated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function enroll() {
    setError(null);
    setBusy(true);
    try {
      const optRes = await fetch("/api/admin/register/options", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!optRes.ok) throw new Error((await optRes.json()).error ?? "enrollment failed");
      const optionsJSON = await optRes.json();
      const response = await startRegistration({ optionsJSON });
      const verifyRes = await fetch("/api/admin/register/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, response }),
      });
      if (!verifyRes.ok) throw new Error((await verifyRes.json()).error ?? "enrollment failed");
      await signIn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "enrollment failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto mt-24 max-w-sm space-y-6 text-center">
      <h1 className="text-2xl font-bold text-primaryText">Caffeine Addiction — Admin</h1>

      {hasCredential && (
        <button
          type="button"
          onClick={signIn}
          disabled={busy}
          className="w-full rounded-lg bg-green-500/20 px-4 py-3 font-medium text-green-200 ring-1 ring-green-400 disabled:opacity-50"
        >
          Sign in with Face ID
        </button>
      )}

      <button
        type="button"
        onClick={() => setShowEnroll((v) => !v)}
        className="text-sm text-primaryText/60 underline"
      >
        {showEnroll ? "Hide" : "Enroll this device"}
      </button>

      {showEnroll && (
        <div className="space-y-3">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Registration token"
            className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-primaryText"
          />
          <button
            type="button"
            onClick={enroll}
            disabled={busy || token.length === 0}
            className="w-full rounded-lg border border-white/20 px-4 py-3 text-primaryText disabled:opacity-50"
          >
            Enroll with Face ID
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/admin/DrinkUploadForm.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { todayInOwnerTz, type Drink } from "@/lib/drinks-logic";

export default function DrinkUploadForm({ onLogout }: { onLogout: () => void }) {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [date, setDate] = useState(todayInOwnerTz());
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const data = await (await fetch("/api/drinks")).json();
    setDrinks(data.drinks);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Choose an image");
      return;
    }
    setBusy(true);
    try {
      const body = new FormData();
      body.set("image", file);
      body.set("date", date);
      body.set("name", name);
      body.set("note", note);
      const res = await fetch("/api/drinks", { method: "POST", body });
      if (!res.ok) throw new Error((await res.json()).error ?? "upload failed");
      setName("");
      setNote("");
      setFile(null);
      (e.target as HTMLFormElement).reset();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this drink?")) return;
    await fetch(`/api/drinks/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    onLogout();
  }

  return (
    <div className="mx-auto mt-16 max-w-md space-y-8 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primaryText">Add a drink</h1>
        <button type="button" onClick={logout} className="text-sm text-primaryText/60 underline">
          Log out
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-primaryText"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-primaryText"
        />
        <input
          type="text"
          value={name}
          maxLength={80}
          placeholder="Drink name"
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-primaryText"
        />
        <div>
          <textarea
            value={note}
            maxLength={140}
            placeholder="One-sentence note"
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-primaryText"
          />
          <p className="text-right text-xs text-primaryText/50">{note.length}/140</p>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-green-500/20 px-4 py-3 font-medium text-green-200 ring-1 ring-green-400 disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Post drink"}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>

      <div className="space-y-2">
        <h2 className="text-sm uppercase tracking-wider text-primaryText/60">Recent</h2>
        {drinks.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
            <span className="text-sm text-primaryText">
              {d.date} — {d.name}
            </span>
            <button type="button" onClick={() => remove(d.id)} className="text-xs text-red-400">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write `src/app/sidequests/admin/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { NavBar } from "@/components/ui/nav-bar";
import AdminAuth from "@/components/admin/AdminAuth";
import DrinkUploadForm from "@/components/admin/DrinkUploadForm";

export default function AdminPage() {
  const [state, setState] = useState<{ authenticated: boolean; hasCredential: boolean } | null>(
    null,
  );

  async function loadSession() {
    const data = await (await fetch("/api/admin/session")).json();
    setState(data);
  }

  useEffect(() => {
    loadSession();
  }, []);

  return (
    <div className="min-h-screen bg-backgroundColor">
      <NavBar />
      {state === null ? (
        <div className="mx-auto mt-24 h-40 w-full max-w-sm animate-pulse rounded-2xl bg-white/5" />
      ) : state.authenticated ? (
        <DrinkUploadForm onLogout={loadSession} />
      ) : (
        <AdminAuth hasCredential={state.hasCredential} onAuthenticated={loadSession} />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Manual end-to-end verification**

Prerequisites: a `.env.local` with `BLOB_READ_WRITE_TOKEN` (from a linked Vercel Blob store), `SESSION_SECRET`, `ADMIN_REGISTRATION_TOKEN`. `RP_ID`/`RP_ORIGIN` may be left unset (defaults to localhost).

Run: `npm run dev`, open `http://localhost:3000/sidequests/admin` in a browser with a platform authenticator (Mac Touch ID / Chrome virtual authenticator):
1. Click "Enroll this device", paste the `ADMIN_REGISTRATION_TOKEN`, complete the biometric prompt. Expect to land on the upload form.
2. Upload an image with a name + note. Expect it to appear under "Recent".
3. Visit `http://localhost:3000/api/drinks` — expect the new drink in the JSON.
4. Click "Log out", reload — expect the Face ID sign-in screen. Sign in — expect the form again.
5. Delete the test drink.

Expected: all steps succeed. If `startAuthentication`/`startRegistration` signatures differ from `{ optionsJSON }`, confirm against the installed `@simplewebauthn/browser` version and adjust.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin src/app/sidequests/admin/page.tsx
git commit -m "feat: add admin page with Face ID auth + drink upload form"
```

---

### Task 13: Wire the section into the sidequests page + docs

**Files:**
- Modify: `src/app/sidequests/page.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: `<DrinksCarousel />`.
- Produces: the "Caffeine Addiction" section visible before the map; documented setup/enrollment.

- [ ] **Step 1: Add the section to `src/app/sidequests/page.tsx`**

Add the import near the other imports:

```tsx
import DrinksCarousel from "@/components/ui/DrinksCarousel";
```

Insert this section between the closing `</section>` of the Hero and the opening of the "Exploring The World" `<section>`:

```tsx
      {/* Caffeine Addiction Section */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-5xl md:text-7xl text-primaryText font-bold text-center mb-3">
          Caffeine Addiction
        </h2>
        <p className="text-center text-lg text-primaryText mb-6">
          Small-batch experiments from my kitchen counter.
        </p>
        <DrinksCarousel />
      </section>
```

- [ ] **Step 2: Visually verify the page**

Run: `npm run dev`, open `http://localhost:3000/sidequests`.
Expected: the "Caffeine Addiction" heading + carousel appear above "Exploring The World". With no drinks, the empty-state message shows. After uploading via the admin page, the carousel shows cards with the newest centered (or today's drink featured).

- [ ] **Step 3: Document setup in `README.md`**

Append this section to `README.md`:

````markdown
## Caffeine Addiction (drink-of-the-day) admin

The `/sidequests` page has a "Caffeine Addiction" carousel backed by Vercel Blob and secured with a WebAuthn passkey (Face ID / Touch ID).

### Environment variables

See `.env.example`. Required in Vercel (and `.env.local` for dev):

- `BLOB_READ_WRITE_TOKEN` — auto-injected once a Blob store is linked to the project.
- `SESSION_SECRET` — `openssl rand -base64 32`.
- `ADMIN_REGISTRATION_TOKEN` — `openssl rand -base64 32`. Keep it in a password manager; it's the break-glass key for enrolling devices.
- `RP_ID=qamil-mirza.com`, `RP_ORIGIN=https://qamil-mirza.com` (production).

### One-time passkey enrollment (after deploy)

1. Set the env vars in Vercel and redeploy.
2. On your iPhone, open Safari to `https://qamil-mirza.com/sidequests/admin` (must be the real domain — passkeys bind to it; a `*.vercel.app` preview passkey won't work on the live site).
3. Tap "Enroll this device", paste `ADMIN_REGISTRATION_TOKEN`, complete Face ID.
4. Thereafter: open `/sidequests/admin` → "Sign in with Face ID" → upload a drink.

Passkeys sync across your Apple devices via iCloud Keychain. To enroll a new/non-synced device, use the token again.
````

- [ ] **Step 4: Run the full test suite + lint**

Run: `npm test && npm run lint`
Expected: all tests pass; no lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/sidequests/page.tsx README.md
git commit -m "feat: show Caffeine Addiction carousel on sidequests + document admin setup"
```

---

## Self-Review

**Spec coverage:**
- §3 placement + copy → Task 13.
- §4 data model → Tasks 3–4 (`Drink` type, fields, `OWNER_TZ`, today logic).
- §6.1 blob-store → Task 2. §6.2 drinks logic + I/O → Tasks 3–4. §6.3 session → Task 5. §6.4 challenge → Task 6. §6.5 credentials → Task 7. §6.6 webauthn → Task 8.
- §6.7 API routes → Tasks 9 (drinks) + 10 (admin). §6.8 components → Tasks 11–12. §6.9 pages → Tasks 12–13.
- §7 deps/env/next.config → Task 1. §8 security model → enforced across Tasks 5, 6, 9, 10 (auth gates, token gate, image re-encode, cookie attrs). §9 error handling → Tasks 9–12 (status codes, empty/loading states). §10 testing → Tasks 2–8 unit tests + Task 12 manual e2e. §11 file list → matches tasks. §12 defaults → Global Constraints.

**Placeholder scan:** No TBD/TODO; every code step contains complete code; the two "implementer notes" (Task 8, Task 12) are version-confirmation instructions with concrete fallbacks, not placeholders.

**Type consistency:** `Drink`, `DrinkInput`, `ValidationResult`, `StoredCredential` defined once and reused. `selectFeatured` returns `{ ordered, featuredIndex }` — consumed exactly so in Task 11. Cookie names (`ca_session`, `ca_challenge`), Blob keys (`drinks/index.json`, `auth/credentials.json`, `drinks/images/<id>.webp`), and function signatures match across producing/consuming tasks.
