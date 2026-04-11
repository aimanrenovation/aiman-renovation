"use client";

import { useState, useEffect, useCallback } from "react";
import { Gift, Clock, CheckCircle, TrendingUp, Search, Plus, Copy, X, Trash2 } from "lucide-react";
import { showToast } from "@/lib/employes/use-toast";

// ---- Types ----

interface ParrainageItem {
  id: string;
  parrainNom: string;
  parrainPrenom: string;
  parrainEmail: string | null;
  parrainPhone: string | null;
  parrainChantierId: string | null;
  code: string;
  filleulNom: string | null;
  filleulPhone: string | null;
  filleulEmail: string | null;
  filleulChantierId: string | null;
  statut: string;
  recompense: string | null;
  recompenseRemise: boolean;
  messageEnvoyeAt: string | null;
  relanceEnvoyeeAt: string | null;
  convertAt: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  actifs: number;
  utilises: number;
  convertis: number;
  expires: number;
  tauxConversion: number;
  roiEstime: number;
}

type StatutFilter = "tous" | "actif" | "utilise" | "converti" | "expire";

// ---- Helpers ----

const STATUT_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  actif: { bg: "bg-amber-900/40", text: "text-amber-400", label: "Actif" },
  utilise: { bg: "bg-blue-900/40", text: "text-blue-400", label: "Utilisé" },
  converti: { bg: "bg-green-900/40", text: "text-green-400", label: "Converti" },
  expire: { bg: "bg-gray-700", text: "text-gray-400", label: "Expiré" },
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => showToast("Code copié !", "success"),
    () => showToast("Erreur copie", "error"),
  );
}

// ---- Main Component ----

export function ParrainageDashboard() {
  const [parrainages, setParrainages] = useState<ParrainageItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statutFilter, setStatutFilter] = useState<StatutFilter>("tous");
  const [search, setSearch] = useState("");

  const [showNewModal, setShowNewModal] = useState(false);
  const [convertTarget, setConvertTarget] = useState<ParrainageItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/employes/admin/parrainages");
      if (!res.ok) throw new Error("Erreur chargement");
      const json = await res.json();
      setParrainages(json.parrainages ?? []);
      setStats(json.stats ?? null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = parrainages.filter((p) => {
    if (statutFilter !== "tous" && p.statut !== statutFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const haystack =
        `${p.parrainNom} ${p.parrainPrenom} ${p.code} ${p.filleulNom ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  async function toggleRecompense(p: ParrainageItem) {
    try {
      const res = await fetch(`/api/employes/admin/parrainages/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recompenseRemise: !p.recompenseRemise }),
      });
      if (!res.ok) throw new Error("Erreur");
      showToast(
        p.recompenseRemise ? "Récompense non remise" : "Récompense marquée remise",
        "success",
      );
      fetchData();
    } catch {
      showToast("Erreur mise à jour", "error");
    }
  }

  async function handleDelete(p: ParrainageItem) {
    if (!confirm(`Supprimer le parrainage de ${p.parrainPrenom} ${p.parrainNom} ?`)) return;
    try {
      const res = await fetch(`/api/employes/admin/parrainages/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur");
      showToast("Parrainage supprimé", "success");
      fetchData();
    } catch {
      showToast("Erreur suppression", "error");
    }
  }

  // ---- Loading / Error states ----
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Parrainages</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-gray-700 bg-gray-800/50"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-gray-700 bg-gray-800/50" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Parrainages</h1>
        <div className="rounded-xl border border-red-800 bg-red-900/20 p-6 text-center text-sm text-red-400">
          {error || "Impossible de charger les données"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parrainages</h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 rounded-lg bg-[#E50000] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Nouveau
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardColored
          icon={<Gift className="h-5 w-5" />}
          label="Total parrainages"
          value={stats.total}
          color="blue"
        />
        <StatCardColored
          icon={<Clock className="h-5 w-5" />}
          label="Actifs / en attente"
          value={stats.actifs}
          color="amber"
        />
        <StatCardColored
          icon={<CheckCircle className="h-5 w-5" />}
          label="Convertis"
          value={stats.convertis}
          color="green"
        />
        <StatCardColored
          icon={<TrendingUp className="h-5 w-5" />}
          label="ROI estimé"
          value={`${stats.roiEstime.toLocaleString("fr-FR")} \u20AC`}
          color="brand"
          sub={`Taux conversion : ${stats.tauxConversion}%`}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(["tous", "actif", "converti", "utilise", "expire"] as StatutFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatutFilter(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                statutFilter === s
                  ? "bg-white text-gray-900"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {s === "tous" ? "Tous" : (STATUT_BADGE[s]?.label ?? s)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-8 text-center text-sm text-gray-500">
          Aucun parrainage trouvé
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => {
            const badge = STATUT_BADGE[p.statut] ?? STATUT_BADGE.actif;
            return (
              <div key={p.id} className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {p.parrainPrenom} {p.parrainNom}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(p.code)}
                      className="mt-1 flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                      {p.code}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.statut === "actif" && (
                      <button
                        onClick={() => setConvertTarget(p)}
                        className="rounded-lg bg-green-900/40 px-3 py-1.5 text-xs font-medium text-green-400 transition-colors hover:bg-green-900/60"
                      >
                        Convertir
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(p)}
                      className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-900/30 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-xs text-gray-400 sm:grid-cols-2 lg:grid-cols-3">
                  <div>Créé le {formatDate(p.createdAt)}</div>
                  {p.filleulNom && (
                    <div>
                      Filleul : <span className="text-white">{p.filleulNom}</span>
                    </div>
                  )}
                  {p.recompense && (
                    <div className="flex items-center gap-2">
                      Récompense : {p.recompense}
                      <label className="flex cursor-pointer items-center gap-1">
                        <input
                          type="checkbox"
                          checked={p.recompenseRemise}
                          onChange={() => toggleRecompense(p)}
                          className="h-3.5 w-3.5 rounded border-gray-600 bg-gray-700 text-[#E50000] focus:ring-0"
                        />
                        <span className="text-[10px]">Remise</span>
                      </label>
                    </div>
                  )}
                  {p.messageEnvoyeAt && <div>Msg envoyé : {formatDate(p.messageEnvoyeAt)}</div>}
                  {p.relanceEnvoyeeAt && <div>Relance : {formatDate(p.relanceEnvoyeeAt)}</div>}
                  {p.convertAt && <div>Converti le : {formatDate(p.convertAt)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showNewModal && (
        <NewParrainageModal
          onClose={() => setShowNewModal(false)}
          onCreated={() => {
            setShowNewModal(false);
            fetchData();
          }}
        />
      )}

      {convertTarget && (
        <ConvertModal
          parrainage={convertTarget}
          onClose={() => setConvertTarget(null)}
          onConverted={() => {
            setConvertTarget(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// ---- Stat card colored ----

function StatCardColored({
  icon,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "blue" | "amber" | "green" | "brand";
  sub?: string;
}) {
  const colors = {
    blue: "bg-blue-600/20 text-blue-400",
    amber: "bg-amber-600/20 text-amber-400",
    green: "bg-green-600/20 text-green-400",
    brand: "bg-[#E50000]/20 text-[#E50000]",
  };

  return (
    <div className="flex items-start gap-4 rounded-xl border border-gray-700 bg-gray-800/50 p-5">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors[color]}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

// ---- Modal: Nouveau parrainage ----

function NewParrainageModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    parrainNom: "",
    parrainPrenom: "",
    parrainEmail: "",
    parrainPhone: "",
    recompense: "100\u20AC de remise",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.parrainNom || !form.parrainPrenom) {
      showToast("Nom et prénom requis", "error");
      return;
    }

    setSubmitting(true);
    try {
      const code = `PARRAIN-${form.parrainNom.toUpperCase().replace(/\s+/g, "").slice(0, 10)}-${new Date().getFullYear()}`;

      const res = await fetch("/api/employes/admin/parrainages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parrainNom: form.parrainNom,
          parrainPrenom: form.parrainPrenom,
          parrainEmail: form.parrainEmail || null,
          parrainPhone: form.parrainPhone || null,
          recompense: form.recompense || null,
          code,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error || "Erreur création");
      }

      showToast("Parrainage créé !", "success");
      onCreated();
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalOverlay onClose={onClose} title="Nouveau parrainage">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Prénom *"
            value={form.parrainPrenom}
            onChange={(v) => update("parrainPrenom", v)}
          />
          <InputField
            label="Nom *"
            value={form.parrainNom}
            onChange={(v) => update("parrainNom", v)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Email"
            type="email"
            value={form.parrainEmail}
            onChange={(v) => update("parrainEmail", v)}
          />
          <InputField
            label="Téléphone"
            type="tel"
            value={form.parrainPhone}
            onChange={(v) => update("parrainPhone", v)}
          />
        </div>
        <InputField
          label="Récompense"
          value={form.recompense}
          onChange={(v) => update("recompense", v)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-[#E50000] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {submitting ? "Création..." : "Créer le parrainage"}
        </button>
      </form>
    </ModalOverlay>
  );
}

// ---- Modal: Convertir ----

function ConvertModal({
  parrainage,
  onClose,
  onConverted,
}: {
  parrainage: ParrainageItem;
  onClose: () => void;
  onConverted: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    filleulNom: "",
    filleulPhone: "",
    filleulEmail: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.filleulNom) {
      showToast("Nom du filleul requis", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/employes/admin/parrainages/${parrainage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statut: "converti",
          filleulNom: form.filleulNom,
          filleulPhone: form.filleulPhone || null,
          filleulEmail: form.filleulEmail || null,
        }),
      });

      if (!res.ok) throw new Error("Erreur conversion");

      showToast("Parrainage converti !", "success");
      onConverted();
    } catch {
      showToast("Erreur conversion", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalOverlay
      onClose={onClose}
      title={`Convertir \u2014 ${parrainage.parrainPrenom} ${parrainage.parrainNom}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Nom du filleul *"
          value={form.filleulNom}
          onChange={(v) => update("filleulNom", v)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Téléphone"
            type="tel"
            value={form.filleulPhone}
            onChange={(v) => update("filleulPhone", v)}
          />
          <InputField
            label="Email"
            type="email"
            value={form.filleulEmail}
            onChange={(v) => update("filleulEmail", v)}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-50"
        >
          {submitting ? "Conversion..." : "Confirmer la conversion"}
        </button>
      </form>
    </ModalOverlay>
  );
}

// ---- Shared UI primitives ----

function ModalOverlay({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl border border-gray-700 bg-gray-900 p-6 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
      />
    </label>
  );
}
