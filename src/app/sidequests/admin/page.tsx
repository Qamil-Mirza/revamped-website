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
    try {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setState(data);
    } catch {
      setState({ authenticated: false, hasCredential: false });
    }
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
