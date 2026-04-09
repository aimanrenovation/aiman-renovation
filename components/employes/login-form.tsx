"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/employes/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        employe?: { cguAccepted?: boolean };
      };
      if (!res.ok || !data.ok) {
        if (data.error === "rate_limited") setError("Trop de tentatives. Réessayez dans 15 min.");
        else setError("Email ou mot de passe incorrect.");
        return;
      }
      router.push(data.employe?.cguAccepted ? "/espace-employes/dashboard" : "/espace-employes/cgu");
      router.refresh();
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-xl border border-neutral-300 px-4 text-base focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/20"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Mot de passe</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-xl border border-neutral-300 px-4 text-base focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/20"
        />
      </label>
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-12 rounded-xl bg-[#E50000] text-base font-semibold text-white shadow-sm transition-opacity disabled:opacity-60"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
