"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CguAcceptForm() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/employes/cgu/accept", { method: "POST" });
      if (!res.ok) throw new Error("failed");
      router.push("/espace-employes/dashboard");
      router.refresh();
    } catch {
      setError("Impossible d'enregistrer votre acceptation. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 h-5 w-5 accent-[#E50000]"
        />
        <span className="text-sm text-neutral-700">
          J&apos;ai lu et j&apos;accepte les conditions d&apos;utilisation et le traitement de mes
          données personnelles, y compris ma géolocalisation au pointage.
        </span>
      </label>
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      <button
        type="button"
        onClick={handleAccept}
        disabled={!checked || loading}
        className="h-12 rounded-xl bg-[#E50000] font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Enregistrement…" : "J'accepte et je continue"}
      </button>
    </div>
  );
}
