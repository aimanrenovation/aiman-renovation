"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/employes/use-toast";

export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit faire au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (currentPassword === newPassword) {
      setError("Le nouveau mot de passe doit être différent de l'ancien.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/employes/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        if (data.error === "wrong_password") setError("Mot de passe actuel incorrect.");
        else if (data.error === "same_password") setError("Le nouveau mot de passe doit être différent.");
        else setError("Erreur. Réessayez.");
        return;
      }
      showToast("Mot de passe modifié !", "success");
      router.push("/espace-employes/dashboard");
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
        <span className="text-sm font-medium text-neutral-700">Mot de passe provisoire</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="h-12 rounded-xl border border-neutral-300 px-4 text-base focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/20"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Nouveau mot de passe</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="h-12 rounded-xl border border-neutral-300 px-4 text-base focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/20"
        />
        <span className="text-xs text-neutral-500">Minimum 8 caractères</span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Confirmer le nouveau mot de passe</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {loading ? "Modification…" : "Changer mon mot de passe"}
      </button>
    </form>
  );
}
