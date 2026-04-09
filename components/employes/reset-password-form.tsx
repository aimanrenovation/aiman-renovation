"use client";
import { useState } from "react";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/employes/auth/reset-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setSent(true);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full rounded-2xl bg-green-900/30 p-6 text-center">
        <div className="text-2xl">✓</div>
        <p className="mt-2 text-sm font-medium text-green-300">
          Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <input
        type="email"
        autoComplete="email"
        required
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-900/80 px-4 text-base text-white placeholder:text-neutral-500 focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/30"
      />

      {error && (
        <div className="rounded-lg bg-red-900/40 px-3 py-2 text-sm text-red-300" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-xl bg-[#E50000] text-base font-semibold text-white shadow-lg shadow-red-900/30 transition-all hover:bg-[#cc0000] active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Envoi…" : "Envoyer le lien"}
      </button>
    </form>
  );
}
