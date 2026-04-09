"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/employes/admin/data-table";
import { ChantierForm } from "@/components/employes/admin/chantier-form";

interface Chantier {
  id: string;
  nom: string;
  clientNom: string;
  ville: string | null;
  dateDebut: string | null;
  dateFinPrevue: string | null;
  statut: string | null;
  budgetPrevuCents: number | null;
  budgetReelCents: number | null;
  [key: string]: unknown;
}

const STATUT_STYLES: Record<string, string> = {
  prospect: "bg-blue-900/40 text-blue-400",
  en_cours: "bg-green-900/40 text-green-400",
  termine: "bg-gray-700 text-gray-400",
  annule: "bg-red-900/40 text-red-400",
};

function formatCents(cents: number | null): string {
  if (cents == null) return "-";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function rentabilite(budget: number | null, reel: number | null): { pct: string; color: string } | null {
  if (budget == null || !budget || reel == null) return null;
  const pct = ((budget - reel) / budget) * 100;
  const color = pct >= 0 ? "text-green-400" : "text-red-400";
  return { pct: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`, color };
}

export default function ChantiersPage() {
  const router = useRouter();
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchChantiers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employes/admin/chantiers");
      if (res.ok) {
        const data = await res.json();
        setChantiers(data.chantiers || data || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChantiers();
  }, [fetchChantiers]);

  const columns: Column<Chantier>[] = [
    {
      key: "nom",
      label: "Nom",
      sortable: true,
      render: (row) => <span className="font-medium text-white">{row.nom}</span>,
    },
    {
      key: "clientNom",
      label: "Client",
      sortable: true,
    },
    {
      key: "ville",
      label: "Ville",
      sortable: true,
      render: (row) => <span>{row.ville || "-"}</span>,
    },
    {
      key: "dateDebut",
      label: "Dates",
      render: (row) => (
        <span className="text-xs">
          {row.dateDebut || "?"} → {row.dateFinPrevue || "?"}
        </span>
      ),
    },
    {
      key: "statut",
      label: "Statut",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            STATUT_STYLES[row.statut || ""] || "bg-gray-700 text-gray-400"
          }`}
        >
          {row.statut || "N/A"}
        </span>
      ),
    },
    {
      key: "budget",
      label: "Budget",
      render: (row) => <span className="text-xs">{formatCents(row.budgetPrevuCents)}</span>,
    },
    {
      key: "cout",
      label: "Cout MO",
      render: (row) => <span className="text-xs">{formatCents(row.budgetReelCents)}</span>,
    },
    {
      key: "rentabilite",
      label: "Rentabilite",
      render: (row) => {
        const r = rentabilite(row.budgetPrevuCents, row.budgetReelCents);
        if (!r) return <span className="text-gray-600">-</span>;
        return <span className={`text-xs font-semibold ${r.color}`}>{r.pct}</span>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chantiers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Creer un chantier
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={chantiers}
          keyField="id"
          emptyMessage="Aucun chantier trouve"
          onRowClick={(row) => router.push(`/espace-employes/admin/chantiers/${row.id}`)}
        />
      )}

      {showForm && (
        <ChantierForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchChantiers();
          }}
        />
      )}
    </div>
  );
}
