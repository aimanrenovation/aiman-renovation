"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoUploader } from "./photo-uploader";

interface ChantierOption {
  chantierId: string;
  chantierNom: string;
}

interface MaterielItem {
  name: string;
  qty: number;
  urgence: "normale" | "urgente";
}

export function RapportForm({ chantiers }: { chantiers: ChantierOption[] }) {
  const router = useRouter();
  const [chantierId, setChantierId] = useState(chantiers[0]?.chantierId ?? "");
  const [description, setDescription] = useState("");
  const [travaux, setTravaux] = useState<string>("");
  const [blocages, setBlocages] = useState("");
  const [materiel, setMateriel] = useState<MaterielItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUrgent, setNewItemUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function addItem() {
    if (!newItemName.trim()) return;
    setMateriel((prev) => [
      ...prev,
      {
        name: newItemName.trim(),
        qty: newItemQty,
        urgence: newItemUrgent ? "urgente" : "normale",
      },
    ]);
    setNewItemName("");
    setNewItemQty(1);
    setNewItemUrgent(false);
  }

  function removeItem(idx: number) {
    setMateriel((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit() {
    if (!chantierId) {
      setError("Sélectionnez un chantier.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const travauxList = travaux
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((label) => ({ label }));

      const blocagesList = blocages
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((description) => ({ type: "autre", severity: "normale", description }));

      const rapportRes = await fetch("/api/employes/rapport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chantier_id: chantierId,
          description,
          travaux_realises: travauxList,
          blocages: blocagesList,
        }),
      });
      if (!rapportRes.ok) throw new Error("rapport_failed");

      if (materiel.length > 0) {
        const matRes = await fetch("/api/employes/materiel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chantier_id: chantierId, items: materiel }),
        });
        if (!matRes.ok) throw new Error("materiel_failed");
      }

      setDone(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-green-50 p-6 text-center">
        <div className="text-3xl">✓</div>
        <div className="mt-2 text-base font-semibold text-green-900">
          Rapport envoyé
        </div>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setDescription("");
            setTravaux("");
            setBlocages("");
            setMateriel([]);
          }}
          className="mt-4 text-sm font-medium text-green-700 underline"
        >
          Nouveau rapport
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {chantiers.length > 1 && (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-700">Chantier</span>
          <select
            value={chantierId}
            onChange={(e) => setChantierId(e.target.value)}
            className="h-12 rounded-xl border border-neutral-300 bg-white px-3 text-base"
          >
            {chantiers.map((c) => (
              <option key={c.chantierId} value={c.chantierId}>
                {c.chantierNom}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Description de la journée</span>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ce qui a été fait aujourd'hui…"
          className="rounded-xl border border-neutral-300 p-3 text-base focus:border-[#E50000] focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">
          Travaux réalisés (1 par ligne)
        </span>
        <textarea
          rows={3}
          value={travaux}
          onChange={(e) => setTravaux(e.target.value)}
          placeholder="Pose carrelage cuisine&#10;Jointage douche"
          className="rounded-xl border border-neutral-300 p-3 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Blocages / problèmes</span>
        <textarea
          rows={2}
          value={blocages}
          onChange={(e) => setBlocages(e.target.value)}
          placeholder="Manque de matériel, retard livraison…"
          className="rounded-xl border border-neutral-300 p-3 text-sm"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-700">Photos du chantier</span>
        {chantierId && <PhotoUploader chantierId={chantierId} />}
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-4">
        <span className="text-sm font-medium text-neutral-700">Matériel à commander</span>
        {materiel.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm">
            {materiel.map((it, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                <span>
                  {it.qty}× {it.name}
                  {it.urgence === "urgente" && (
                    <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                      URGENT
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-xs text-neutral-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Ex : sacs ciment"
            className="h-10 flex-1 rounded-lg border border-neutral-300 px-3 text-sm"
          />
          <input
            type="number"
            min={1}
            value={newItemQty}
            onChange={(e) => setNewItemQty(Number.parseInt(e.target.value, 10) || 1)}
            className="h-10 w-16 rounded-lg border border-neutral-300 px-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-neutral-600">
          <input
            type="checkbox"
            checked={newItemUrgent}
            onChange={(e) => setNewItemUrgent(e.target.checked)}
            className="h-4 w-4 accent-[#E50000]"
          />
          Urgent
        </label>
        <button
          type="button"
          onClick={addItem}
          className="h-10 rounded-lg border border-neutral-300 text-sm font-medium"
        >
          Ajouter
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="h-14 rounded-2xl bg-[#E50000] text-base font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Envoi…" : "Envoyer mon rapport"}
      </button>
    </div>
  );
}
