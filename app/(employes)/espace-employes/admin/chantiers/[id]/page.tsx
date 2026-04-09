"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Wallet, Clock, Camera, FileText } from "lucide-react";
import { StatCard } from "@/components/employes/admin/stat-card";

interface ChantierDetail {
  chantier: {
    id: string;
    nom: string;
    clientNom: string;
    adresse: string;
    ville: string | null;
    codePostal: string | null;
    dateDebut: string | null;
    dateFinPrevue: string | null;
    dateFinReelle: string | null;
    statut: string | null;
    budgetPrevuCents: number | null;
  };
  stats: {
    totalHeures: number;
    coutMOCents: number;
    budgetPrevuCents: number | null;
    deltaCents: number | null;
  };
  pointages: {
    id: string;
    employeNom: string;
    date: string;
    heureDebut: string;
    heureFin: string | null;
    dureeMinutes: number;
  }[];
  rapports: {
    id: string;
    employeNom: string;
    date: string;
    description: string | null;
  }[];
  photos: {
    id: string;
    s3Key: string;
    caption: string | null;
    createdAt: string;
  }[];
}

type Tab = "pointages" | "rapports" | "photos";

function formatCents(cents: number | null): string {
  if (cents == null) return "-";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default function ChantierDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<ChantierDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pointages");

  useEffect(() => {
    fetch(`/api/employes/admin/chantiers/${id}/detail`)
      .then((r) => {
        if (!r.ok) throw new Error("Erreur chargement");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-800" />
        <div className="h-32 animate-pulse rounded-xl border border-gray-700 bg-gray-800/50" />
        <div className="h-64 animate-pulse rounded-xl border border-gray-700 bg-gray-800/50" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/espace-employes/admin/chantiers" className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <div className="rounded-xl border border-red-800 bg-red-900/20 p-6 text-center text-sm text-red-400">
          {error || "Chantier introuvable"}
        </div>
      </div>
    );
  }

  const { chantier, stats, pointages, rapports, photos } = data;
  const delta = stats.deltaCents;
  const deltaPositive = delta != null && delta >= 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Back + title */}
      <div>
        <Link href="/espace-employes/admin/chantiers" className="mb-2 flex items-center gap-1 text-sm text-gray-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Retour aux chantiers
        </Link>
        <h1 className="text-2xl font-bold">{chantier.nom}</h1>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            <div>
              <div className="text-sm text-white">{chantier.adresse}</div>
              <div className="text-xs text-gray-500">
                {[chantier.ville, chantier.codePostal].filter(Boolean).join(" ")}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            <div>
              <div className="text-sm text-white">
                {chantier.dateDebut || "?"} → {chantier.dateFinPrevue || "?"}
              </div>
              {chantier.dateFinReelle && (
                <div className="text-xs text-gray-500">
                  Termine le {chantier.dateFinReelle}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            <div>
              <div className="text-sm text-white">Client: {chantier.clientNom}</div>
              <div className="text-xs text-gray-500">
                Budget: {formatCents(chantier.budgetPrevuCents)}
              </div>
            </div>
          </div>
          <div>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                chantier.statut === "en_cours"
                  ? "bg-green-900/40 text-green-400"
                  : chantier.statut === "termine"
                    ? "bg-gray-700 text-gray-400"
                    : "bg-blue-900/40 text-blue-400"
              }`}
            >
              {chantier.statut || "prospect"}
            </span>
          </div>
        </div>
      </div>

      {/* Rentabilite cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Heures totales"
          value={`${stats.totalHeures}h`}
        />
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label="Cout main d'oeuvre"
          value={formatCents(stats.coutMOCents)}
        />
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label="Budget prevu"
          value={formatCents(stats.budgetPrevuCents)}
        />
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label="Delta"
          value={delta != null ? formatCents(delta) : "-"}
          sub={delta != null ? (deltaPositive ? "Rentable" : "Depassement") : undefined}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800">
        {(["pointages", "rapports", "photos"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t
                ? "border-b-2 border-red-500 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t === "pointages" && `Pointages (${pointages.length})`}
            {t === "rapports" && `Rapports (${rapports.length})`}
            {t === "photos" && `Photos (${photos.length})`}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "pointages" && (
        pointages.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-8 text-center text-sm text-gray-500">
            Aucun pointage pour ce chantier
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-800/50">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Employe</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Debut</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Fin</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Duree</th>
                </tr>
              </thead>
              <tbody>
                {pointages.map((p) => (
                  <tr key={p.id} className="border-b border-gray-700/50 text-gray-300 last:border-0">
                    <td className="px-4 py-3 font-medium text-white">{p.employeNom}</td>
                    <td className="px-4 py-3">{p.date}</td>
                    <td className="px-4 py-3">
                      {p.heureDebut ? new Date(p.heureDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {p.heureFin ? new Date(p.heureFin).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "En cours"}
                    </td>
                    <td className="px-4 py-3">
                      {p.dureeMinutes ? `${Math.floor(p.dureeMinutes / 60)}h${String(p.dureeMinutes % 60).padStart(2, "0")}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === "rapports" && (
        rapports.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-8 text-center text-sm text-gray-500">
            <FileText className="mx-auto mb-2 h-8 w-8 text-gray-600" />
            Aucun rapport pour ce chantier
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {rapports.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{r.employeNom}</div>
                    <div className="text-xs text-gray-500">{r.date}</div>
                  </div>
                </div>
                {r.description && (
                  <p className="mt-2 text-sm text-gray-400">{r.description}</p>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {tab === "photos" && (
        photos.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-8 text-center text-sm text-gray-500">
            <Camera className="mx-auto mb-2 h-8 w-8 text-gray-600" />
            Aucune photo pour ce chantier
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-gray-700 bg-gray-800"
              >
                <img
                  src={`/api/employes/photos/${photo.id}/thumb`}
                  alt={photo.caption || "Photo chantier"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="text-[10px] text-white line-clamp-2">{photo.caption}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
