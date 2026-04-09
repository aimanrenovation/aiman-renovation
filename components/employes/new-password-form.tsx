"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Minimum 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/employes/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        if (data.error === "invalid_token") setError("Lien expiré ou invalide. Redemandez un lien.");
        else setError("Erreur. Réessayez.");
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="w-full rounded-2xl bg-green-900/30 p-6 text-center">
        <div className="text-2xl">✓</div>
        <p className="mt-2 text-sm font-medium text-green-300">
          Mot de passe modifié ! Vous pouvez vous connecter.
        </p>
        <button
          type="button"
          onClick={() => router.push("/espace-employes/login")}
          className="mt-4 h-10 rounded-xl bg-[#E50000] px-6 text-sm font-semibold text-white"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <input
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-900/80 px-4 text-base text-white placeholder:text-neutral-500 focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/30"
      />
      <input
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-900/80 px-4 text-base text-white placeholder:text-neutral-500 focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/30"
      />
      <p className="text-xs text-neutral-500">Minimum 8 caractères</p>

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
        {loading ? "Modification…" : "Changer mon mot de passe"}
      </button>
    </form>
  );
}
