"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/employes/use-toast";
import { ChecklistQualite } from "@/components/employes/checklist-qualite";
import { PhotosFinJournee } from "./photos-fin-journee";

type StopStep = "idle" | "photos" | "checklist" | "stopping";

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
  chantierId: string;
  chantierNom: string;
  onSiteDebut: boolean | null;
  noGeoDebut: boolean;
  distanceDebutM: number | null;
}

interface Props {
  openPointage: OpenPointage | null;
  missions: Mission[];
}

function vibrate(pattern: number | number[]) {
  try { navigator?.vibrate?.(pattern); } catch { /* unsupported */ }
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 880;
    o.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.15);
  } catch { /* unsupported */ }
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

function formatElapsed(fromIso: string, pausedMs: number, isPaused: boolean, pausedAt: number | null): string {
  const now = isPaused && pausedAt ? pausedAt : Date.now();
  const diff = now - new Date(fromIso).getTime() - pausedMs;
  const absDiff = Math.max(0, diff);
  const h = Math.floor(absDiff / 3_600_000);
  const m = Math.floor((absDiff % 3_600_000) / 60_000);
  const s = Math.floor((absDiff % 60_000) / 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function rawElapsedMs(fromIso: string): number {
  return Date.now() - new Date(fromIso).getTime();
}

const TWELVE_HOURS_MS = 12 * 3_600_000;

export function PointageClient({ openPointage, missions }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(missions[0]?.chantierId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pause state
  const [paused, setPaused] = useState(false);
  const [totalPausedMs, setTotalPausedMs] = useState(0);
  const [pausedAt, setPausedAt] = useState<number | null>(null);

  // Stop flow: photos → checklist → stopping
  const [stopStep, setStopStep] = useState<StopStep>("idle");

  // Multi-chantier
  const [showChantierSwitch, setShowChantierSwitch] = useState(false);
  const [switchTarget, setSwitchTarget] = useState<string>("");

  // Battery warning
  const [lowBattery, setLowBattery] = useState(false);

  // Timer
  const [elapsed, setElapsed] = useState<string>(
    openPointage ? formatElapsed(openPointage.heureDebutIso, 0, false, null) : "00:00:00"
  );

  // 12h warning
  const [over12h, setOver12h] = useState(false);

  // Track pause accumulation with a ref so the interval can read latest values
  const pauseRef = useRef({ paused, totalPausedMs, pausedAt });
  pauseRef.current = { paused, totalPausedMs, pausedAt };

  useEffect(() => {
    if (!openPointage) return;
    const t = setInterval(() => {
      const { paused: p, totalPausedMs: tp, pausedAt: pa } = pauseRef.current;
      setElapsed(formatElapsed(openPointage.heureDebutIso, tp, p, pa));
      setOver12h(rawElapsedMs(openPointage.heureDebutIso) >= TWELVE_HOURS_MS);
    }, 1000);
    return () => clearInterval(t);
  }, [openPointage]);

  // Battery API check
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    if (typeof nav.getBattery !== "function") return;
    let cancelled = false;
    nav.getBattery().then((battery: { level: number; addEventListener: (e: string, cb: () => void) => void; removeEventListener: (e: string, cb: () => void) => void }) => {
      if (cancelled) return;
      const check = () => setLowBattery(battery.level < 0.2);
      check();
      battery.addEventListener("levelchange", check);
      return () => battery.removeEventListener("levelchange", check);
    }).catch(() => { /* API not available */ });
    return () => { cancelled = true; };
  }, []);

  async function handleStart() {
    if (!selected) {
      setError("Sélectionnez un chantier.");
      return;
    }

    // Feature 1: Confirmation dialog
    const chantierNom = missions.find((m) => m.chantierId === selected)?.chantierNom ?? selected;
    const confirmed = window.confirm(`Démarrer le pointage sur ${chantierNom} ?`);
    if (!confirmed) return;

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
      vibrate(200);
      playBeep();
      showToast("Pointage démarré", "success");
      // Reset pause state for new pointage
      setPaused(false);
      setTotalPausedMs(0);
      setPausedAt(null);
      setShowChantierSwitch(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function handleStop(pauseMinutes?: number) {
    setError(null);
    setLoading(true);
    try {
      const pos = await getPosition();
      const finalPauseMin = pauseMinutes ?? Math.round(totalPausedMs / 60_000);
      const res = await fetch("/api/employes/pointage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "stop",
          lat: pos?.lat ?? null,
          lng: pos?.lng ?? null,
          pause_minutes: finalPauseMin > 0 ? finalPauseMin : undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "stop_failed");
      vibrate([100, 50, 100]);
      playBeep();
      showToast("Pointage terminé", "success");
      setPaused(false);
      setTotalPausedMs(0);
      setPausedAt(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  function handlePauseToggle() {
    if (paused) {
      // Resume: add paused duration
      const pauseDuration = pausedAt ? Date.now() - pausedAt : 0;
      setTotalPausedMs((prev) => prev + pauseDuration);
      setPaused(false);
      setPausedAt(null);
      vibrate(100);
      showToast("Reprise du pointage", "info");
    } else {
      // Pause
      setPaused(true);
      setPausedAt(Date.now());
      vibrate(100);
      showToast("Pointage en pause", "info");
    }
  }

  async function handleChantierSwitch(newChantierId: string) {
    if (!newChantierId || newChantierId === openPointage?.id) return;
    setError(null);
    setLoading(true);
    try {
      // Stop current pointage
      const pos = await getPosition();
      const finalPauseMin = Math.round(totalPausedMs / 60_000);
      const stopRes = await fetch("/api/employes/pointage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "stop",
          lat: pos?.lat ?? null,
          lng: pos?.lng ?? null,
          pause_minutes: finalPauseMin > 0 ? finalPauseMin : undefined,
        }),
      });
      if (!stopRes.ok) throw new Error((await stopRes.json()).error ?? "stop_failed");

      // Start on new chantier
      const startPos = await getPosition();
      const startRes = await fetch("/api/employes/pointage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          chantier_id: newChantierId,
          lat: startPos?.lat ?? null,
          lng: startPos?.lng ?? null,
        }),
      });
      if (!startRes.ok) throw new Error((await startRes.json()).error ?? "start_failed");

      const chantierNom = missions.find((m) => m.chantierId === newChantierId)?.chantierNom ?? "";
      showToast(`Changement vers ${chantierNom}`, "success");
      setPaused(false);
      setTotalPausedMs(0);
      setPausedAt(null);
      setShowChantierSwitch(false);
      setSwitchTarget("");
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

    const otherMissions = missions.filter(
      (m) => m.chantierNom !== openPointage.chantierNom
    );

    return (
      <div className="flex flex-col gap-5">
        {/* 12h warning */}
        {over12h && (
          <div className="rounded-2xl border border-amber-400 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            ⚠️ Pointage ouvert depuis plus de 12h — avez-vous oublié de pointer ?
          </div>
        )}

        {/* Battery warning */}
        {lowBattery && (
          <div className="rounded-2xl border border-amber-400 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            🔋 Batterie faible (&lt;20%) — pensez à brancher votre téléphone.
          </div>
        )}

        {/* Main timer card */}
        <div className={`rounded-2xl p-6 text-white shadow-sm ${paused ? "bg-amber-500" : "bg-[#E50000]"}`}>
          <div className="text-xs font-medium uppercase tracking-wide opacity-80">Chantier</div>
          <div className="text-lg font-semibold">{openPointage.chantierNom}</div>
          <div className="mt-4 font-mono text-5xl font-bold tabular-nums">{elapsed}</div>
          {paused && (
            <div className="mt-2 animate-pulse text-sm font-bold uppercase tracking-widest">EN PAUSE</div>
          )}
          <div className="mt-2 text-xs opacity-80">{statusLabel}</div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        {/* Stop flow: photos → checklist → stopping */}
        {stopStep === "photos" && (
          <div className="flex flex-col gap-3">
            <PhotosFinJournee
              chantierId={openPointage.chantierId}
              onComplete={() => setStopStep("checklist")}
            />
            <button
              type="button"
              onClick={() => setStopStep("idle")}
              className="h-10 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-600"
            >
              Annuler
            </button>
          </div>
        )}

        {stopStep === "checklist" && (
          <div className="flex flex-col gap-3">
            <ChecklistQualite
              pointageId={openPointage.id}
              chantierId={openPointage.chantierId}
              chantierNom={openPointage.chantierNom}
              onComplete={() => {
                setStopStep("stopping");
                handleStop();
              }}
            />
            <button
              type="button"
              onClick={() => setStopStep("idle")}
              className="h-10 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-600"
            >
              Annuler
            </button>
          </div>
        )}

        {stopStep === "stopping" && (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-[#E50000]" />
            <span className="text-sm text-neutral-500">Fin du pointage en cours...</span>
          </div>
        )}

        {/* Pause / Resume + Stop buttons (hidden during stop flow) */}
        {stopStep === "idle" && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePauseToggle}
              disabled={loading}
              className={`h-14 flex-1 rounded-2xl text-base font-semibold disabled:opacity-50 ${
                paused
                  ? "bg-green-600 text-white"
                  : "bg-amber-500 text-white"
              }`}
            >
              {paused ? "Reprendre" : "Pause"}
            </button>
            <button
              type="button"
              onClick={() => setStopStep("photos")}
              disabled={loading}
              className="h-14 flex-1 rounded-2xl border-2 border-[#E50000] bg-white text-base font-semibold text-[#E50000] disabled:opacity-50"
            >
              {loading ? "Arret..." : "Terminer"}
            </button>
          </div>
        )}

        {/* Multi-chantier switch */}
        {otherMissions.length > 0 && (
          <div>
            {!showChantierSwitch ? (
              <button
                type="button"
                onClick={() => setShowChantierSwitch(true)}
                className="text-sm font-medium text-neutral-500 underline underline-offset-2"
              >
                Changer de chantier
              </button>
            ) : (
              <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="text-sm font-medium text-neutral-700">Changer de chantier</div>
                <div className="flex flex-col gap-2">
                  {otherMissions.map((m) => (
                    <label
                      key={m.chantierId}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                        switchTarget === m.chantierId
                          ? "border-[#E50000] bg-red-50"
                          : "border-neutral-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="switch-chantier"
                        checked={switchTarget === m.chantierId}
                        onChange={() => setSwitchTarget(m.chantierId)}
                        className="mt-1 h-4 w-4 accent-[#E50000]"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{m.chantierNom}</div>
                        <div className="text-xs text-neutral-500">{m.chantierAdresse}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChantierSwitch(false);
                      setSwitchTarget("");
                    }}
                    className="h-10 flex-1 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-600"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChantierSwitch(switchTarget)}
                    disabled={loading || !switchTarget}
                    className="h-10 flex-1 rounded-xl bg-[#E50000] text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {loading ? "En cours…" : "Confirmer"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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
