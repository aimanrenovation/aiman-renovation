"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, RotateCcw, UserCheck, UserX } from "lucide-react";
import { DataTable, type Column } from "@/components/employes/admin/data-table";
import { EmployeForm } from "@/components/employes/admin/employe-form";

interface Employe {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  role: string;
  hourlyRateCents: number | null;
  actif: boolean;
  [key: string]: unknown;
}

const ROLE_LABELS: Record<string, string> = {
  employe: "Employe",
  chef_chantier: "Chef de chantier",
  patron: "Patron",
};

export default function EmployesPage() {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [resetResult, setResetResult] = useState<{ id: string; password: string } | null>(null);

  const fetchEmployes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employes/admin/employes");
      if (res.ok) {
        const data = await res.json();
        setEmployes(data.employes || data || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployes();
  }, [fetchEmployes]);

  async function toggleActif(emp: Employe) {
    setActionLoading(emp.id);
    try {
      await fetch(`/api/employes/admin/employes/${emp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actif: !emp.actif }),
      });
      fetchEmployes();
    } catch {
      alert("Erreur");
    } finally {
      setActionLoading(null);
    }
  }

  async function resetPassword(emp: Employe) {
    if (!confirm(`Reinitialiser le mot de passe de ${emp.firstname} ${emp.lastname} ?`)) return;
    setActionLoading(emp.id);
    try {
      const res = await fetch(`/api/employes/admin/employes/${emp.id}/reset-password`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setResetResult({ id: emp.id, password: data.password || data.tempPassword || "---" });
      } else {
        alert("Erreur lors du reset");
      }
    } catch {
      alert("Erreur");
    } finally {
      setActionLoading(null);
    }
  }

  const columns: Column<Employe>[] = [
    {
      key: "nom",
      label: "Nom",
      sortable: true,
      accessor: (row) => `${row.lastname} ${row.firstname}`,
      render: (row) => (
        <span className="font-medium text-white">
          {row.firstname} {row.lastname}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (row) => <span className="text-gray-400">{row.email}</span>,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (row) => (
        <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300">
          {ROLE_LABELS[row.role] || row.role}
        </span>
      ),
    },
    {
      key: "hourlyRateCents",
      label: "Taux/h",
      sortable: true,
      render: (row) =>
        row.hourlyRateCents != null ? (
          <span>{(row.hourlyRateCents / 100).toFixed(2)} EUR</span>
        ) : (
          <span className="text-gray-600">-</span>
        ),
    },
    {
      key: "actif",
      label: "Statut",
      render: (row) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            row.actif
              ? "bg-green-900/40 text-green-400"
              : "bg-red-900/40 text-red-400"
          }`}
        >
          {row.actif ? "Actif" : "Inactif"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleActif(row);
            }}
            disabled={actionLoading === row.id}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
              row.actif
                ? "text-red-400 hover:bg-red-900/20"
                : "text-green-400 hover:bg-green-900/20"
            }`}
            title={row.actif ? "Desactiver" : "Activer"}
          >
            {row.actif ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
            {row.actif ? "Desactiver" : "Activer"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetPassword(row);
            }}
            disabled={actionLoading === row.id}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-yellow-400 transition-colors hover:bg-yellow-900/20 disabled:opacity-50"
            title="Reset MDP"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset MDP
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Creer un employe
        </button>
      </div>

      {/* Reset password result alert */}
      {resetResult && (
        <div className="flex items-center justify-between rounded-xl border border-yellow-800 bg-yellow-900/20 p-4">
          <div>
            <div className="text-sm font-medium text-yellow-400">
              Mot de passe reinitialise
            </div>
            <div className="mt-1 font-mono text-lg text-white">{resetResult.password}</div>
            <div className="mt-1 text-xs text-yellow-600">
              Communiquez ce mot de passe a l&apos;employe. Il ne sera plus affiche.
            </div>
          </div>
          <button
            onClick={() => setResetResult(null)}
            className="text-xs text-yellow-500 hover:text-yellow-300"
          >
            Fermer
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={employes}
          keyField="id"
          emptyMessage="Aucun employe trouve"
        />
      )}

      {showForm && (
        <EmployeForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchEmployes();
          }}
        />
      )}
    </div>
  );
}
