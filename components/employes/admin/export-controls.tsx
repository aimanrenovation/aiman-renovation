"use client";

import { useState, useEffect } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

interface EmployeOption {
  id: string;
  firstname: string;
  lastname: string;
}

export function ExportControls() {
  const [debut, setDebut] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [fin, setFin] = useState(() => new Date().toISOString().slice(0, 10));
  const [employeId, setEmployeId] = useState("");
  const [employes, setEmployes] = useState<EmployeOption[]>([]);
  const [loadingHeures, setLoadingHeures] = useState(false);
  const [loadingPointages, setLoadingPointages] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    fetch("/api/employes/admin/employes")
      .then((r) => (r.ok ? r.json() : { employes: [] }))
      .then((data) => setEmployes(data.employes || data || []))
      .catch(() => {});
  }, []);

  async function downloadCsv(type: "heures" | "pointages") {
    const setter = type === "heures" ? setLoadingHeures : setLoadingPointages;
    setter(true);
    try {
      const params = new URLSearchParams({ debut, fin });
      if (employeId) params.set("employeId", employeId);
      const res = await fetch(`/api/employes/admin/export/${type}?${params}`);
      if (!res.ok) throw new Error("Erreur export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_${debut}_${fin}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors du telechargement");
    } finally {
      setter(false);
    }
  }

  async function generatePdf() {
    setLoadingPdf(true);
    try {
      const params = new URLSearchParams({ debut, fin });
      if (employeId) params.set("employeId", employeId);
      const res = await fetch(`/api/employes/admin/export/heures?${params}`);
      if (!res.ok) throw new Error("Erreur");
      const text = await res.text();

      // Parse CSV into data
      const lines = text.trim().split("\n");
      if (lines.length < 2) {
        alert("Aucune donnee pour cette periode");
        return;
      }
      const headers = lines[0].split(",");

      // Build a printable document using DOM manipulation
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Veuillez autoriser les popups pour generer le PDF");
        return;
      }

      const doc = printWindow.document;
      doc.title = `Recap mensuel - ${debut} a ${fin}`;

      // Add styles
      const style = doc.createElement("style");
      style.textContent = `
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #E50000; font-size: 18px; }
        h2 { font-size: 14px; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
        th { background: #f5f5f5; text-align: left; padding: 8px; border: 1px solid #ddd; }
        td { padding: 8px; border: 1px solid #ddd; }
        .footer { margin-top: 24px; font-size: 10px; color: #999; }
      `;
      doc.head.appendChild(style);

      // Title
      const h1 = doc.createElement("h1");
      h1.textContent = "Aiman Renovation";
      doc.body.appendChild(h1);

      const h2 = doc.createElement("h2");
      h2.textContent = `Recapitulatif heures - ${debut} au ${fin}`;
      doc.body.appendChild(h2);

      // Table
      const table = doc.createElement("table");
      const thead = doc.createElement("thead");
      const headerRow = doc.createElement("tr");
      for (const h of headers) {
        const th = doc.createElement("th");
        th.textContent = h;
        headerRow.appendChild(th);
      }
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = doc.createElement("tbody");
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(",");
        const tr = doc.createElement("tr");
        for (const c of cells) {
          const td = doc.createElement("td");
          td.textContent = c;
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      doc.body.appendChild(table);

      // Footer
      const footer = doc.createElement("div");
      footer.className = "footer";
      footer.textContent = `Genere le ${new Date().toLocaleDateString("fr-FR")} - Aiman Renovation`;
      doc.body.appendChild(footer);

      // Wait for content to render before printing
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch {
      alert("Erreur lors de la generation du PDF");
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Filtres
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Date debut</span>
            <input
              type="date"
              value={debut}
              onChange={(e) => setDebut(e.target.value)}
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Date fin</span>
            <input
              type="date"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Employe (optionnel)</span>
            <select
              value={employeId}
              onChange={(e) => setEmployeId(e.target.value)}
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
            >
              <option value="">Tous les employes</option>
              {employes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstname} {e.lastname}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Export buttons */}
      <div className="grid gap-4 sm:grid-cols-3">
        <button
          onClick={() => downloadCsv("heures")}
          disabled={loadingHeures}
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-700 bg-gray-800/50 p-5 text-left transition-colors hover:border-red-600/50 hover:bg-gray-800 disabled:opacity-50"
        >
          <FileSpreadsheet className="h-8 w-8 shrink-0 text-green-400" />
          <div>
            <div className="text-sm font-semibold text-white">Export heures CSV</div>
            <div className="mt-0.5 text-xs text-gray-500">
              Recapitulatif heures par employe
            </div>
          </div>
          <Download className="ml-auto h-4 w-4 text-gray-500" />
        </button>

        <button
          onClick={() => downloadCsv("pointages")}
          disabled={loadingPointages}
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-700 bg-gray-800/50 p-5 text-left transition-colors hover:border-red-600/50 hover:bg-gray-800 disabled:opacity-50"
        >
          <FileSpreadsheet className="h-8 w-8 shrink-0 text-blue-400" />
          <div>
            <div className="text-sm font-semibold text-white">Export pointages CSV</div>
            <div className="mt-0.5 text-xs text-gray-500">
              Detail de tous les pointages
            </div>
          </div>
          <Download className="ml-auto h-4 w-4 text-gray-500" />
        </button>

        <button
          onClick={generatePdf}
          disabled={loadingPdf}
          className="flex items-center justify-center gap-3 rounded-xl border border-gray-700 bg-gray-800/50 p-5 text-left transition-colors hover:border-red-600/50 hover:bg-gray-800 disabled:opacity-50"
        >
          <FileText className="h-8 w-8 shrink-0 text-red-400" />
          <div>
            <div className="text-sm font-semibold text-white">Recap mensuel PDF</div>
            <div className="mt-0.5 text-xs text-gray-500">
              Impression du recapitulatif
            </div>
          </div>
          <Download className="ml-auto h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
