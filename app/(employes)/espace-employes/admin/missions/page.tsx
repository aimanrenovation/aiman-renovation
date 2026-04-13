"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  Plus,
  Trophy,
  Clock,
  CheckCircle,
  X,
} from "lucide-react";
import { StatCard } from "@/components/employes/admin/stat-card";

// ---- Types ----

interface Mission {
  id: string;
  titre: string;
  description: string;
  chantierId: string | null;
  chantierNom: string | null;
  chantierVille: string | null;
  bonusDescription: string | null;
  bonusMontantCents: number | null;
  dateLimite: string;
  statut: string;
  acceptePar: string | null;
  accepteParNom: string | null;
  accepteLe: string | null;
  creePar: string;
  createurPrenom: string;
  createurNom: string;
  createdAt: string;
}

interface ClassementEntry {
  employeId: string;
  nom: string;
  count: number;
}

interface ChantierOption {
  id: string;
  nom: string;
}

const STATUT_CFG: Record<string, { bg: string; text: string; label: string }> = {
  ouverte: { bg: "bg-blue-900/40", text: "text-blue-400", label: "Ouverte" },
  prise: { bg: "bg-green-900/40", text: "text-green-400", label: "Prise" },
  annulee: { bg: "bg-gray-700", text: "text-gray-400", label: "Annulee" },
  expiree: { bg: "bg-red-900/40", text: "text-red-400", label: "Expiree" },
};

function formatDateTime(d: string): string {
  return new Date(d).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---- Component ----

export default function AdminMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [classement, setClassement] = useState<ClassementEntry[]>([]);
  const [chantiers, setChantiers] = useState<ChantierOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const [missRes, classRes, chRes] = await Promise.all([
        fetch("/api/employes/admin/missions"),
        fetch("/api/employes/missions/classement"),
        fetch("/api/employes/admin/chantiers"),
      ]);
      if (missRes.ok) {
        const data = await missRes.json();
        setMissions(data.missions ?? []);
      }
      if (classRes.ok) {
        const data = await classRes.json();
        setClassement(data.classement ?? []);
      }
      if (chRes.ok) {
        const data = await chRes.json();
        setChantiers(data.chantiers || data || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const ouvertes = missions.filter((m) => m.statut === "ouverte").length;
  const prises = missions.filter((m) => m.statut === "prise").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Missions urgentes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouvelle mission
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Zap className="h-5 w-5" />} label="Ouvertes" value={ouvertes} />
        <StatCard icon={<CheckCircle className="h-5 w-5" />} label="Prises" value={prises} />
        <StatCard icon={<Trophy className="h-5 w-5" />} label="Total missions" value={missions.length} />
      </div>

      {/* Classement top accepteurs */}
      {classement.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Top accepteurs
          </h2>
          <div className="flex flex-wrap gap-3">
            {classement.map((c, i) => (
              <div
                key={c.employeId}
                className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2"
              >
                <span className={`text-lg font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : "text-amber-700"}`}>
                  #{i + 1}
                </span>
                <span className="text-sm font-medium text-white">{c.nom}</span>
                <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-xs font-bold text-red-400">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Missions list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-gray-700 bg-gray-800/50" />
          ))}
        </div>
      ) : missions.length === 0 ? (
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-8 text-center text-sm text-gray-500">
          <Zap className="mx-auto mb-2 h-8 w-8 text-gray-600" />
          Aucune mission urgente
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map((m) => {
            const cfg = STATUT_CFG[m.statut] ?? STATUT_CFG.ouverte;
            const isExpired = new Date(m.dateLimite) < new Date() && m.statut === "ouverte";

            return (
              <div
                key={m.id}
                className={`rounded-xl border bg-gray-800/50 p-4 ${
                  isExpired ? "border-red-800 opacity-60" : "border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 shrink-0 text-amber-400" />
                      <span className="text-sm font-semibold text-white">{m.titre}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${cfg.bg} ${cfg.text}`}>
                        {isExpired ? "Expiree" : cfg.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400 line-clamp-2">{m.description}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                      {m.chantierNom && (
                        <span>Chantier : {m.chantierNom}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Limite : {formatDateTime(m.dateLimite)}
                      </span>
                      {m.bonusMontantCents && (
                        <span className="font-semibold text-green-400">
                          Bonus : {(m.bonusMontantCents / 100).toFixed(0)}EUR
                        </span>
                      )}
                      {m.bonusDescription && !m.bonusMontantCents && (
                        <span className="font-medium text-green-400">
                          Bonus : {m.bonusDescription}
                        </span>
                      )}
                    </div>

                    {m.statut === "prise" && m.accepteParNom && (
                      <div className="mt-2 rounded-lg bg-green-900/20 px-3 py-1.5 text-xs text-green-400">
                        Prise par <span className="font-semibold">{m.accepteParNom}</span>
                        {m.accepteLe && ` le ${formatDateTime(m.accepteLe)}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create mission modal */}
      {showForm && (
        <CreateMissionForm
          chantiers={chantiers}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// ---- Create mission form ----

function CreateMissionForm({
  chantiers,
  onClose,
  onSuccess,
}: {
  chantiers: ChantierOption[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      titre: fd.get("titre") as string,
      description: fd.get("description") as string,
      chantier_id: (fd.get("chantierId") as string) || undefined,
      bonus_description: (fd.get("bonusDescription") as string) || undefined,
      bonus_montant_cents: fd.get("bonusMontant")
        ? Math.round(Number(fd.get("bonusMontant")) * 100)
        : undefined,
      date_limite: fd.get("dateLimite") as string,
    };

    try {
      const res = await fetch("/api/employes/admin/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur");
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  // Default date_limite = tomorrow at 18:00
  const defaultLimite = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Nouvelle mission urgente</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Titre</span>
            <input
              name="titre"
              required
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
              placeholder="Ex: Urgence fuite toiture"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Description</span>
            <textarea
              name="description"
              required
              rows={3}
              className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="Decrivez la mission..."
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Chantier (optionnel)</span>
            <select
              name="chantierId"
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
            >
              <option value="">Aucun chantier</option>
              {chantiers.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Date limite</span>
            <input
              name="dateLimite"
              type="datetime-local"
              required
              defaultValue={defaultLimite}
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Bonus (EUR)</span>
              <input
                name="bonusMontant"
                type="number"
                step="0.01"
                min="0"
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
                placeholder="50"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">ou description bonus</span>
              <input
                name="bonusDescription"
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
                placeholder="Pizza pour l'equipe"
              />
            </label>
          </div>

          {error && (
            <div className="rounded-lg bg-red-900/30 px-3 py-2 text-sm text-red-400">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Creer la mission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
