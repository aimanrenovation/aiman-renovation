"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { showToast } from "@/lib/employes/use-toast";

export interface MissionCardProps {
  mission: {
    id: string;
    titre: string;
    description: string;
    chantierNom?: string;
    chantierVille?: string;
    bonusDescription?: string;
    bonusMontantCents?: number;
    dateLimite: string;
    statut: string;
    acceptePar?: string;
    accepteParNom?: string;
    creePar: string;
    creeParNom: string;
  };
  currentEmployeId: string;
}

function formatDateLimite(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBonus(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/* ---- Countdown sub-component ---- */

function CountdownDisplay({ dateLimite }: { dateLimite: string }) {
  const [remaining, setRemaining] = useState<number>(
    () => new Date(dateLimite).getTime() - Date.now(),
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining(new Date(dateLimite).getTime() - Date.now());
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dateLimite]);

  if (remaining <= 0) {
    return (
      <span className="mt-1 inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
        Expire
      </span>
    );
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isUrgent = remaining < 3600000; // < 1h

  const pad = (n: number) => String(n).padStart(2, "0");

  let display: string;
  if (days > 0) {
    display = `${days}j ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  } else {
    display = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return (
    <span
      className={`mt-1 inline-block rounded px-2 py-0.5 font-mono text-xs font-bold ${
        isUrgent
          ? "animate-pulse bg-red-100 text-red-600"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {display}
    </span>
  );
}

/* ---- Main MissionCard ---- */

export function MissionCard({ mission, currentEmployeId }: MissionCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMine =
    mission.statut === "prise" && mission.acceptePar === currentEmployeId;
  const isTakenByOther =
    mission.statut === "prise" && mission.acceptePar !== currentEmployeId;
  const isExpiredOrCancelled =
    mission.statut === "expiree" || mission.statut === "annulee";
  const isOpen = mission.statut === "ouverte";

  async function handleAccept() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/employes/missions/${mission.id}/accepter`, {
        method: "POST",
      });

      if (res.ok) {
        setAccepted(true);
        setShowConfetti(true);
        showToast("Mission acceptee !", "success");
        setTimeout(() => {
          setShowConfetti(false);
          router.refresh();
        }, 2500);
      } else if (res.status === 409) {
        setError("Mission deja prise !");
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Erreur inattendue");
      }
    } catch {
      setError("Erreur reseau, reessaie.");
    } finally {
      setLoading(false);
    }
  }

  const cardOpacity =
    isTakenByOther || isExpiredOrCancelled ? "opacity-60" : "";

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-opacity ${cardOpacity}`}
    >
      {/* Confetti animation */}
      {showConfetti && (
        <>
          <div className="pointer-events-none absolute inset-0 z-20">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="confetti-particle absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: [
                    "#E50000",
                    "#22c55e",
                    "#f59e0b",
                    "#3b82f6",
                    "#a855f7",
                    "#ec4899",
                  ][i % 6],
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes confettiFall {
              0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(300px) rotate(720deg);
                opacity: 0;
              }
            }
            .confetti-particle {
              width: 8px;
              height: 8px;
              border-radius: 2px;
              animation: confettiFall 2s ease-out forwards;
            }
          `}</style>
        </>
      )}

      {/* Accepted animation overlay */}
      {accepted && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/90">
          <span
            className="text-6xl text-green-500 transition-transform duration-[600ms]"
            style={{
              animation: "scaleIn 600ms ease-out forwards",
            }}
          >
            &#x2705;
          </span>
          <style>{`
            @keyframes scaleIn {
              0% { transform: scale(0); opacity: 0; }
              60% { transform: scale(1.2); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* Titre */}
      <h3 className="text-lg font-bold text-neutral-900">{mission.titre}</h3>

      {/* Description */}
      <p className="mt-1 text-sm text-neutral-600">{mission.description}</p>

      {/* Chantier badge */}
      {mission.chantierNom && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
          <MapPin className="h-3.5 w-3.5" />
          {mission.chantierNom}
          {mission.chantierVille && (
            <span className="text-neutral-400">- {mission.chantierVille}</span>
          )}
        </div>
      )}

      {/* Bonus */}
      {mission.bonusDescription && (
        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
          <p className="text-sm text-green-800">
            <span className="mr-1">&#127873;</span>
            Bonus : {mission.bonusDescription}
            {mission.bonusMontantCents != null && (
              <span className="ml-1 font-bold text-green-700">
                {formatBonus(mission.bonusMontantCents)}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Date limite with countdown */}
      <div className="mt-3">
        <p className="text-xs text-neutral-500">
          Limite : {formatDateLimite(mission.dateLimite)}
        </p>
        {isOpen && <CountdownDisplay dateLimite={mission.dateLimite} />}
      </div>

      {/* Createur */}
      <p className="mt-1 text-xs text-neutral-400">
        Par {mission.creeParNom}
      </p>

      {/* Error toast */}
      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Action area */}
      <div className="mt-4">
        {isOpen && !accepted && (
          <button
            type="button"
            onClick={handleAccept}
            disabled={loading}
            className="w-full rounded-lg bg-[#E50000] py-3 text-center text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Chargement...
              </span>
            ) : (
              <>&#128640; J&apos;ACCEPTE CETTE MISSION</>
            )}
          </button>
        )}

        {(isMine || accepted) && !loading && (
          <div className="rounded-lg bg-green-50 py-3 text-center text-sm font-semibold text-green-700">
            &#x2705; Tu as accepte cette mission
          </div>
        )}

        {isTakenByOther && (
          <div className="rounded-lg bg-neutral-100 py-3 text-center text-sm text-neutral-500">
            Mission prise par {mission.accepteParNom ?? "un collegue"} &#x2705;
          </div>
        )}

        {isExpiredOrCancelled && (
          <div className="rounded-lg bg-neutral-100 py-3 text-center text-sm text-neutral-400 line-through">
            {mission.statut === "expiree" ? "Mission expiree" : "Mission annulee"}
          </div>
        )}
      </div>
    </div>
  );
}
