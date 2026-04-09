"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function IconMail() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-neutral-500">
      <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
      <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-neutral-500">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
  );
}

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
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      {/* Email */}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <IconMail />
        </span>
        <input
          type="email"
          autoComplete="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-900/80 pl-12 pr-4 text-base text-white placeholder:text-neutral-500 focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/30"
        />
      </div>

      {/* Mot de passe */}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <IconLock />
        </span>
        <input
          type="password"
          autoComplete="current-password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-900/80 pl-12 pr-4 text-base text-white placeholder:text-neutral-500 focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/30"
        />
      </div>

      {/* Mot de passe oublié */}
      <a
        href="/espace-employes/reset-password"
        className="self-end text-xs text-neutral-400 underline-offset-2 hover:text-white hover:underline"
      >
        Mot de passe oublié ?
      </a>

      {/* Erreur */}
      {error && (
        <div className="rounded-lg bg-red-900/40 px-3 py-2 text-sm text-red-300" role="alert">
          {error}
        </div>
      )}

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-12 rounded-xl bg-[#E50000] text-base font-semibold text-white shadow-lg shadow-red-900/30 transition-all hover:bg-[#cc0000] active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
