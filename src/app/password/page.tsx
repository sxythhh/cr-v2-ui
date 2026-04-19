"use client";

import { useState } from "react";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[320px] flex-col gap-4 px-4"
      >
        <h1 className="text-center text-lg font-semibold text-white">
          Enter password
        </h1>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoFocus
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
        />

        {error && (
          <p className="text-center text-xs text-red-400">Wrong password</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {loading ? "..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
