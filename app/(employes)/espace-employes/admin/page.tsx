"use client";

import { useState, useEffect } from "react";
import { Users, Clock, FileText, Camera } from "lucide-react";
import { StatCard } from "@/components/employes/admin/stat-card";

interface DashboardData {
  pointesAujourdhui: number;
  rapportsEnAttente: number;
  heuresSemaine: number;
  pointages: {
    id: string;
    employeNom: string;
    chantierNom: string;
    heureDebut: string;
    heureFin: string | null;
    onSiteDebut: boolean | null;
  }[];
  rapports: {
    id: string;
    employeNom: string;
    chantierNom: string;
    date: string;
    description: string | null;
  }[];
  photos: {
    id: string;
    s3Key: string;
    caption: string | null;
    chantierNom: string;
    createdAt: string;
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/employes/admin/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("Erreur chargement");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-gray-700 bg-gray-800/50" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-gray-700 bg-gray-800/50" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="rounded-xl border border-red-800 bg-red-900/20 p-6 text-center text-sm text-red-400">
          {error || "Impossible de charger les donnees"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Pointes aujourd'hui"
          value={data.pointesAujourdhui}
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Rapports en attente"
          value={data.rapportsEnAttente}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Heures cette semaine"
          value={`${data.heuresSemaine}h`}
        />
      </div>

      {/* Today's pointages */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Pointages du jour
        </h2>
        {data.pointages.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 text-center text-sm text-gray-500">
            Aucun pointage aujourd&apos;hui
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-800/50">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Employe
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Chantier
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Debut
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Fin
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.pointages.map((p) => (
                  <tr key={p.id} className="border-b border-gray-700/50 text-gray-300 last:border-0">
                    <td className="px-4 py-3 font-medium text-white">{p.employeNom}</td>
                    <td className="px-4 py-3">{p.chantierNom}</td>
                    <td className="px-4 py-3">
                      {p.heureDebut ? new Date(p.heureDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {p.heureFin ? new Date(p.heureFin).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "En cours"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.onSiteDebut
                            ? "bg-green-900/40 text-green-400"
                            : p.onSiteDebut === false
                              ? "bg-red-900/40 text-red-400"
                              : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {p.onSiteDebut ? "Sur site" : p.onSiteDebut === false ? "Hors site" : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent rapports */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Rapports recents
        </h2>
        {data.rapports.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 text-center text-sm text-gray-500">
            Aucun rapport en attente
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {data.rapports.map((r) => (
              <div
                key={r.id}
                className="flex items-start justify-between rounded-xl border border-gray-700 bg-gray-800/50 p-4"
              >
                <div>
                  <div className="text-sm font-medium text-white">{r.employeNom}</div>
                  <div className="mt-0.5 text-xs text-gray-400">
                    {r.chantierNom} - {r.date}
                  </div>
                  {r.description && (
                    <div className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {r.description}
                    </div>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-yellow-900/40 px-2 py-0.5 text-xs font-medium text-yellow-400">
                  En attente
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent photos */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Photos recentes
        </h2>
        {data.photos.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 text-center text-sm text-gray-500">
            <Camera className="mx-auto mb-2 h-8 w-8 text-gray-600" />
            Aucune photo recente
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {data.photos.map((photo) => (
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
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="text-[10px] font-medium text-white">{photo.chantierNom}</div>
                  {photo.caption && (
                    <div className="text-[10px] text-gray-300 line-clamp-1">{photo.caption}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
