# "Caffeine Addiction" — Drink-of-the-Day Section — Design

Date: 2026-06-29
Status: Approved design (pending final spec review)
Branch context: builds on `feature/space-cockpit-about`

## 1. Summary

Add a **"Caffeine Addiction"** section to the `/sidequests` ("Adventures Off the Clock") page.
It showcases home-made matcha/coffee drinks in a distinctive **coverflow carousel** and is backed by a
**secure, single-user web upload flow** so the owner can post a "drink of the day" from their phone — protected
by **Face ID / passkey (WebAuthn)**.

The current site is fully static (travel photos baked into a JSON manifest at build time, no backend). This feature
introduces the project's first runtime backend: API routes, cloud storage (Vercel Blob), and authentication. All of
it is locked to a single user; public visitors get read-only access.

## 2. Goals & non-goals

**Goals**
- A coverflow carousel on `/sidequests`, placed **before** the map/gallery section.
- Each drink shows: image, name, a one-sentence note, and a date.
- Featured logic: if a drink is dated today, it is the centered/featured card; otherwise the most recent drink is
  centered and the 3 newest are shown. Paging walks back through history newest → oldest.
- A web upload flow (works well from a phone) to add a drink (image + date + name + note).
- Authentication via **WebAuthn passkey (Face ID / Touch ID)** only. Least privilege: only the owner can write.
- $0 running cost at expected volume (a few entries/week, one user).

**Non-goals (YAGNI)**
- No drink "type"/category field (matcha vs coffee) — entries are freeform.
- No database — metadata lives in a single JSON file in Blob.
- No multi-user accounts, roles, or public comments.
- No password auth (passkey only). No server-side analytics.

## 3. Placement & copy

On `src/app/sidequests/page.tsx`, insert a new `<section>` **between the hero section and the "Exploring The World"
map section**.

- Heading: **"Caffeine Addiction"**
- Subhead (placeholder, easily changed): *"Small-batch experiments from my kitchen counter."*

## 4. Data model

One record per drink. All records live in a single JSON array in Vercel Blob at `drinks/index.json`.

```ts
type Drink = {
  id: string;        // url-safe unique id (crypto.randomUUID)
  date: string;      // "YYYY-MM-DD" — the drink's date (owner-set, defaults to today)
  name: string;      // e.g. "Hojicha Latte" (required, trimmed, <= 80 chars)
  note: string;      // one sentence, hard-capped at 140 chars
  imageUrl: string;  // Vercel Blob public URL
  width: number;     // intrinsic dimensions, for next/image
  height: number;
  createdAt: string; // ISO timestamp (server-set)
};
```

Images stored separately in Blob at `drinks/images/<id>.webp`.

"Today" is computed in a fixed timezone constant `OWNER_TZ` (default `America/Los_Angeles`) so the featured-drink
logic is stable regardless of server/visitor locale. Date comparison is on the `YYYY-MM-DD` string.

## 5. Architecture overview

```
Browser (public)                 Next.js (Vercel)                     Vercel Blob
─────────────────                ────────────────                     ───────────
DrinksCarousel  ──GET /api/drinks──▶ getDrinks() ──────────────────▶ drinks/index.json
 (client fetch)  ◀── JSON list ─────

Browser (owner, /sidequests/admin)
─────────────────
AdminAuth (Face ID)
  register: POST /api/admin/register/options  ─▶ (token-gated) generateRegistrationOptions
            startRegistration() [Face ID]
            POST /api/admin/register/verify    ─▶ verify + store credential ─▶ drinks/credentials.json
  sign in:  POST /api/admin/auth/options       ─▶ generateAuthenticationOptions
            startAuthentication() [Face ID]
            POST /api/admin/auth/verify         ─▶ verify ─▶ set session cookie (JWT)

DrinkUploadForm
  POST /api/drinks (multipart)  ─▶ requireAuth ─▶ sharp re-encode ─▶ Blob put image
                                                  ─▶ append to drinks/index.json
  DELETE /api/drinks/[id]       ─▶ requireAuth ─▶ Blob delete image + remove record
```

## 6. Modules / units (each independently understandable & testable)

### 6.1 `src/lib/blob-store.ts` — generic Blob JSON helper
- `readJson<T>(key, fallback): Promise<T>` — fetch a JSON blob, return `fallback` if missing.
- `writeJson(key, value): Promise<void>` — `put` with `access: "public"`, `allowOverwrite: true`, `contentType: application/json`.
- Depends on: `@vercel/blob`. Pure I/O wrapper; everything else is built on it.

### 6.2 `src/lib/drinks.ts` — drinks domain logic
- `Drink` type (above).
- `getDrinks(): Promise<Drink[]>` — read `drinks/index.json`, sorted newest first by `date` then `createdAt`.
- `addDrink(input): Promise<Drink>` — append a record (id/createdAt server-set), write back.
- `deleteDrink(id): Promise<void>` — remove record (caller also deletes the image blob).
- `selectFeatured(drinks, today): { featuredIndex, ordered }` — **pure function**: ordered newest-first; if a drink's
  `date === today` it is `featuredIndex`, else index 0 (most recent). No I/O — directly unit-tested.
- `validateDrinkInput(fields)` — **pure**: trims, enforces name (1–80), note (1–140), date format. Returns errors or clean values.

### 6.3 `src/lib/auth/session.ts` — session tokens
- `createSession(): Promise<string>` — signed JWT (via `jose`, HS256, `SESSION_SECRET`), ~14-day expiry, subject `"owner"`.
- `verifySession(token): Promise<boolean>` — verify signature + expiry.
- `setSessionCookie(res)/clearSessionCookie(res)` — httpOnly, Secure, SameSite=Lax, Path=/.
- `requireAuth(req): Promise<boolean>` — read cookie, verify. The **real security boundary** for all writes.

### 6.4 `src/lib/auth/challenge.ts` — single-use WebAuthn challenge
- WebAuthn challenges must be stored between the "options" and "verify" requests. With no DB, the challenge is held in a
  short-lived (5 min) signed cookie (jose JWT, `CHALLENGE_SECRET` or reuse `SESSION_SECRET`).
- `setChallengeCookie(value)`, `readChallengeCookie()`, `clearChallengeCookie()`. Single-use: cleared on verify.

### 6.5 `src/lib/auth/credentials.ts` — registered passkeys
- Stored in Blob `drinks/credentials.json` as an array of
  `{ credentialID, publicKey, counter, transports, createdAt }` (base64url-encoded binary).
- `getCredentials()`, `addCredential(cred)`, `updateCounter(credentialID, counter)`.
- Supports multiple devices (each enrolled with the token), which also serves as the recovery path.

### 6.6 `src/lib/auth/webauthn.ts` — WebAuthn config + wrappers
- Reads `RP_ID` and `RP_ORIGIN` env (defaults: `localhost` / `http://localhost:3000` in dev).
- Thin wrappers over `@simplewebauthn/server`: `buildRegistrationOptions`, `verifyRegistration`,
  `buildAuthenticationOptions`, `verifyAuthentication`.

### 6.7 API route handlers (`src/app/api/...`)
- `drinks/route.ts`
  - `GET` — **public**. Returns `getDrinks()`. `dynamic = "force-dynamic"` (always fresh, no redeploy needed).
  - `POST` — **protected** (`requireAuth`). Parses multipart (image + date + name + note); `validateDrinkInput`;
    validates image MIME (`image/*`) and size (≤ 10 MB); **sharp** re-encodes (auto-rotate, downscale longest edge to
    1600px, convert to WebP, strip EXIF/GPS); `put` to Blob; `addDrink`. Returns the created `Drink`.
- `drinks/[id]/route.ts`
  - `DELETE` — **protected**. `deleteDrink(id)` + delete the image blob.
- `admin/register/options/route.ts` — `POST`. **Token-gated** (`ADMIN_REGISTRATION_TOKEN`, constant-time compare,
  small delay on mismatch). Returns registration options; sets challenge cookie.
- `admin/register/verify/route.ts` — `POST`. **Token-gated**. `verifyRegistration` against challenge cookie; on success
  `addCredential`. (Does not issue a session — owner then signs in.)
- `admin/auth/options/route.ts` — `POST`. Returns authentication options (`allowCredentials` from stored creds); sets challenge cookie.
- `admin/auth/verify/route.ts` — `POST`. `verifyAuthentication`; on success `updateCounter` + set session cookie.
- `admin/session/route.ts` — `GET` returns `{ authenticated: boolean }`; `DELETE` clears the session cookie (logout).

All write/auth route handlers set `runtime = "nodejs"` (sharp + node crypto need the Node runtime, not Edge).

### 6.8 UI components
- `src/components/ui/DrinksCarousel.tsx` — **public, client**. Fetches `GET /api/drinks` on mount (skeleton while
  loading; tasteful empty state "No drinks brewed yet"). Coverflow: 3 cards visible — center enlarged + in focus
  (image, name, note, formatted date), flanking cards scaled down + dimmed. Left/right arrows, swipe (mobile),
  keyboard arrows (a11y). Uses framer-motion (existing dep). Featured card chosen via `selectFeatured`.
- `src/components/ui/DrinkCard.tsx` — presentational card (image + name + note + date), variants for featured vs side.
- `src/components/admin/AdminAuth.tsx` — **client**. "Sign in with Face ID" (passkey auth) and a collapsible
  "Enroll this device" form (token + register). Uses `@simplewebauthn/browser`.
- `src/components/admin/DrinkUploadForm.tsx` — **client**. Image picker (`accept="image/*"`, `capture` hint for mobile
  camera), date (defaults to today in `OWNER_TZ`), name, note with live char counter (≤140). Lists recent drinks with
  delete buttons. Logout button. Posts to `/api/drinks`.

### 6.9 Pages
- `src/app/sidequests/admin/page.tsx` — **client**. On load calls `GET /api/admin/session`; renders `AdminAuth` if not
  authenticated, else `DrinkUploadForm`. Not linked from the public nav.
- `src/app/sidequests/page.tsx` — **modified**: insert the "Caffeine Addiction" `<section>` with `<DrinksCarousel />`
  before the "Exploring The World" section. (Page stays a client component; carousel self-fetches.)

## 7. Config & dependencies

**New dependencies**
- `@vercel/blob` — image + JSON storage.
- `jose` — sign/verify session & challenge JWTs (Node + Edge safe).
- `sharp` — image re-encode/resize/strip-EXIF (supported on Vercel).
- `@simplewebauthn/server`, `@simplewebauthn/browser` — WebAuthn.
- Dev: `vitest` (+ `@vitejs/plugin-react` if needed) — unit tests.

**Environment variables** (documented in README; `.env.local` for dev, Vercel project settings for prod)
- `BLOB_READ_WRITE_TOKEN` — auto-injected on Vercel; set manually for local dev.
- `SESSION_SECRET` — random 32+ bytes; signs session (and challenge) JWTs.
- `ADMIN_REGISTRATION_TOKEN` — high-entropy (32+ bytes); required for every passkey enrollment. Break-glass / recovery key.
- `RP_ID` — relying-party id: **`qamil-mirza.com`** (prod, confirmed via sitemap/robots/layout metadata). Defaults to `localhost` in dev.
- `RP_ORIGIN` — **`https://qamil-mirza.com`** (prod). Defaults to `http://localhost:3000` in dev.

**`next.config.ts`** — add `images.remotePatterns` for `**.public.blob.vercel-storage.com` so next/image can
optimize Blob-hosted images.

## 8. Security model (least privilege)

- **Reads are public** (it's a public portfolio); **all writes require a valid session** (`requireAuth`).
- **Authentication = WebAuthn passkey only.** Phishing-resistant, biometric-gated; the server stores only public keys.
- **Registration is always token-gated.** Enrolling a passkey requires `ADMIN_REGISTRATION_TOKEN` (constant-time
  compare, small failure delay, high-entropy value). Only the owner has it; it also serves as the device-recovery path.
- **Session cookie:** signed JWT, `httpOnly`, `Secure`, `SameSite=Lax`, expiring (~14 days).
- **Challenges:** single-use, 5-minute, bound to a signed cookie; cleared on verify.
- **Upload hardening:** MIME + size validation; sharp re-encode strips EXIF/GPS metadata; note/name length caps.
- **Known limitation:** no shared datastore for server-side rate limiting (Blob only). Mitigated because (a) passkey
  auth is not brute-forceable like a password, and (b) the only secret-comparison endpoint (registration token) uses a
  constant-time compare + delay and a high-entropy token. Documented, accepted for single-user scope.

## 9. Error handling

- API routes return JSON `{ error }` with appropriate status (400 validation, 401 unauthenticated, 413 too large,
  500 unexpected). Never leak whether a credential/token exists beyond what WebAuthn requires.
- `DrinksCarousel`: loading skeleton; on fetch failure show a quiet inline message (don't break the page); empty state
  when zero drinks.
- Upload form: inline field errors, disabled submit while uploading, success/failure toast (react-toastify is a dep).
- Blob read of a missing `index.json`/`credentials.json` returns `[]` (first-run safe).

## 10. Testing strategy

No test framework exists today; add **Vitest**. Unit-test the pure + security-critical logic:
- `selectFeatured` — today-vs-latest selection across edge cases (no drinks, today present/absent, ties).
- `validateDrinkInput` — name/note length, date format, trimming.
- drinks index `add`/`delete` over a mocked `blob-store` interface.
- `session` — sign/verify roundtrip; reject tampered and expired tokens; `requireAuth` returns false without a valid cookie.
- `challenge` — sign/verify roundtrip; reject expired.
- Registration-token compare — constant-time path accepts correct, rejects incorrect.

WebAuthn end-to-end (real attestation/assertion) is verified **manually** in `npm run dev` on a real device
(`@simplewebauthn/*` carry their own crypto tests). Upload happy-path verified manually against Blob in dev.

## 11. Files touched

**New**
- `src/lib/blob-store.ts`
- `src/lib/drinks.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/challenge.ts`
- `src/lib/auth/credentials.ts`
- `src/lib/auth/webauthn.ts`
- `src/app/api/drinks/route.ts`
- `src/app/api/drinks/[id]/route.ts`
- `src/app/api/admin/register/options/route.ts`
- `src/app/api/admin/register/verify/route.ts`
- `src/app/api/admin/auth/options/route.ts`
- `src/app/api/admin/auth/verify/route.ts`
- `src/app/api/admin/session/route.ts`
- `src/components/ui/DrinksCarousel.tsx`
- `src/components/ui/DrinkCard.tsx`
- `src/components/admin/AdminAuth.tsx`
- `src/components/admin/DrinkUploadForm.tsx`
- `src/app/sidequests/admin/page.tsx`
- Vitest test files alongside the modules above.

**Modified**
- `src/app/sidequests/page.tsx` — add the "Caffeine Addiction" section.
- `next.config.ts` — Blob image remote pattern.
- `package.json` — new deps + `test` script.
- `README.md` — document env vars + one-time passkey enrollment steps.

## 12. Open items / defaults (flag during review if wrong)
- Admin route path: `/sidequests/admin`.
- `OWNER_TZ` default: `America/Los_Angeles`.
- Subhead copy is a placeholder.
- `RP_ID`/`RP_ORIGIN` production values are `qamil-mirza.com` / `https://qamil-mirza.com` (confirmed from sitemap/robots/layout). Passkeys enrolled on Vercel preview URLs (`*.vercel.app`) will not work on the custom domain — enroll on the real domain.
