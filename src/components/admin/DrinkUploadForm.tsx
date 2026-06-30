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
    try {
      const res = await fetch("/api/drinks");
      if (!res.ok) return;
      const data = await res.json();
      setDrinks(Array.isArray(data.drinks) ? data.drinks : []);
    } catch {
      // network blip — keep the current list
    }
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
    const res = await fetch(`/api/drinks/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete drink");
      return;
    }
    await refresh();
  }

  async function logout() {
    const res = await fetch("/api/admin/session", { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to log out");
      return;
    }
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
