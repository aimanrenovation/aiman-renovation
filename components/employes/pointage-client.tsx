"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Mission {
  chantierId: string;
  chantierNom: string;
  chantierAdresse: string;
  radiusM: number;
  mission: string | null;
}

interface OpenPointage {
  id: string;
  heureDebutIso: string;
  chantierNom: string;
  onSiteDebut: boolean | null;
  noGeoDebut: boolean;
  distanceDebutM: number | null;
}

interface Props {
  openPointage: OpenPointage | null;
  missions: Mission[];
}

async function getPosition(): Promise<{ lat: number; lng: number } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
    );
  });
}

function formatElapsed(fromIso: string): string {
  const diff = Date.now() - new Date(fromIso).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function PointageClient({ openPointage, missions }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(missions[0]?.chantierId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<string>(
    openPointage ? formatElapsed(openPointage.heureDebutIso) : "00:00:00"
  );

  useEffect(() => {
    if (!openPointage) return;
    const t = setInterval(() => setElapsed(formatElapsed(openPointage.heureDebutIso)), 1000);
    return () => clearInterval(t);
  }, [openPointage]);

  async function handleStart() {
    if (!selected) {
      setError("Sélectionnez un chantier.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const pos = await getPosition();
      if (!pos) {
        const ok = window.confirm(
          "Géolocalisation indisponible ou refusée. Pointer sans géoloc ? Votre responsable sera notifié."
        );
        if (!ok) {
          setLoading(false);
          return;
        }
      }
      const res = await fetch("/api/employes/pointage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          chantier_id: selected,
          lat: pos?.lat ?? null,
          lng: pos?.lng ?? null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "start_failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function handleStop() {
    setError(null);
    setLoading(true);
    try {
      const pos = await getPosition();
      const res = await fetch("/api/employes/pointage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "stop",
          lat: pos?.lat ?? null,
          lng: pos?.lng ?? null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "stop_failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  if (openPointage) {
    const statusLabel = openPointage.noGeoDebut
      ? "⚠️ Sans géolocalisation"
      : openPointage.onSiteDebut
        ? `✓ Sur site${openPointage.distanceDebutM != null ? ` (${openPointage.distanceDebutM} m)` : ""}`
        : `⚠️ Hors zone${openPointage.distanceDebutM != null ? ` (${openPointage.distanceDebutM} m)` : ""}`;
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl bg-[#E50000] p-6 text-white shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide opacity-80">Chantier</div>
          <div className="text-lg font-semibold">{openPointage.chantierNom}</div>
          <div className="mt-4 font-mono text-5xl font-bold tabular-nums">{elapsed}</div>
          <div className="mt-2 text-xs opacity-80">{statusLabel}</div>
        </div>
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        <button
          type="button"
          onClick={handleStop}
          disabled={loading}
          className="h-14 rounded-2xl border-2 border-[#E50000] bg-white text-base font-semibold text-[#E50000] disabled:opacity-50"
        >
          {loading ? "Arrêt…" : "Terminer ma journée"}
        </button>
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
        Aucune mission planifiée pour aujourd&apos;hui. Contactez votre responsable.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-700">Chantier</span>
        <div className="flex flex-col gap-2">
          {missions.map((m) => (
            <label
              key={m.chantierId}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                selected === m.chantierId
                  ? "border-[#E50000] bg-red-50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <input
                type="radio"
                name="chantier"
                checked={selected === m.chantierId}
                onChange={() => setSelected(m.chantierId)}
                className="mt-1 h-4 w-4 accent-[#E50000]"
              />
              <div className="flex-1">
                <div className="font-medium">{m.chantierNom}</div>
                <div className="text-xs text-neutral-500">{m.chantierAdresse}</div>
                {m.mission && <div className="mt-1 text-xs text-neutral-600">{m.mission}</div>}
              </div>
            </label>
          ))}
        </div>
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      <button
        type="button"
        onClick={handleStart}
        disabled={loading || !selected}
        className="h-14 rounded-2xl bg-[#E50000] text-base font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Démarrage…" : "Démarrer ma journée"}
      </button>
      <p className="text-xs text-neutral-500">
        Votre position GPS sera enregistrée au démarrage du pointage pour vérifier votre présence
        sur le chantier.
      </p>
    </div>
  );
}
