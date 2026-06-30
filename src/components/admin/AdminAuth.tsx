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
