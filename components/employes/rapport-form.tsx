"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PhotoUploader } from "./photo-uploader";
import { SignaturePad } from "./signature-pad";
import { showToast } from "@/lib/employes/use-toast";

interface ChantierOption {
  chantierId: string;
  chantierNom: string;
}

interface MaterielItem {
  name: string;
  qty: number;
  urgence: "normale" | "urgente";
}

interface DraftData {
  chantierId: string;
  description: string;
  travaux: string;
  blocages: string;
  savedAt: number;
}

function getDraftKey(): string {
  const date = new Date().toISOString().slice(0, 10);
  return `rapport-draft-${date}`;
}

function loadDraft(): DraftData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getDraftKey());
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

function saveDraft(data: Omit<DraftData, "savedAt">) {
  if (typeof window === "undefined") return;
  try {
    const payload: DraftData = { ...data, savedAt: Date.now() };
    localStorage.setItem(getDraftKey(), JSON.stringify(payload));
  } catch {
    // localStorage full or unavailable — ignore
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getDraftKey());
  } catch {
    // ignore
  }
}

function VoiceRecorder({
  onRecorded,
}: {
  onRecorded: (blob: Blob) => void;
}) {
  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        typeof navigator !== "undefined" &&
        typeof navigator.mediaDevices !== "undefined" &&
        typeof MediaRecorder !== "undefined"
    );
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Prefer webm/opus, fallback to whatever is available
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : undefined;
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        onRecorded(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      showToast("Micro non disponible", "error");
    }
  }, [onRecorded]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
  }, []);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={recording ? stopRecording : startRecording}
      className={`flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-colors ${
        recording
          ? "animate-pulse border-red-300 bg-red-50 text-red-700"
          : "border-neutral-300 bg-white text-neutral-600"
      }`}
    >
      {recording ? "⏹ Arrêter l'enregistrement" : "🎤 Note vocale"}
    </button>
  );
}

export function RapportForm({ chantiers }: { chantiers: ChantierOption[] }) {
  const router = useRouter();

  // Load draft on mount
  const draft = useRef(loadDraft());

  const [chantierId, setChantierId] = useState(
    draft.current?.chantierId || chantiers[0]?.chantierId || ""
  );
  const [description, setDescription] = useState(draft.current?.description || "");
  const [travaux, setTravaux] = useState(draft.current?.travaux || "");
  const [blocages, setBlocages] = useState(draft.current?.blocages || "");
  const [materiel, setMateriel] = useState<MaterielItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUrgent, setNewItemUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [draftSaved, setDraftSaved] = useState(!!draft.current);

  // Signature
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);

  // Voice notes
  const [voiceBlobs, setVoiceBlobs] = useState<Blob[]>([]);
  const [voiceUrls, setVoiceUrls] = useState<string[]>([]);
  const [uploadingVoice, setUploadingVoice] = useState(false);

  // Auto-save draft every 5 seconds (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (description || travaux || blocages) {
        saveDraft({ chantierId, description, travaux, blocages });
        setDraftSaved(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [chantierId, description, travaux, blocages]);

  const handleVoiceRecorded = useCallback((blob: Blob) => {
    setVoiceBlobs((prev) => [...prev, blob]);
    setVoiceUrls((prev) => [...prev, URL.createObjectURL(blob)]);
    showToast("Note vocale enregistrée", "success");
  }, []);

  const removeVoice = useCallback((idx: number) => {
    setVoiceUrls((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
    setVoiceBlobs((prev) => prev.filter((_, i) => i !== idx));
  }, []);

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
        .map((desc) => ({ type: "autre", severity: "normale", description: desc }));

      const rapportRes = await fetch("/api/employes/rapport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chantier_id: chantierId,
          description,
          travaux_realises: travauxList,
          blocages: blocagesList,
          ...(signatureBase64 ? { signature: signatureBase64 } : {}),
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

      // Upload voice notes via photos API
      if (voiceBlobs.length > 0) {
        setUploadingVoice(true);
        for (let i = 0; i < voiceBlobs.length; i++) {
          const blob = voiceBlobs[i];
          const ext = blob.type.includes("webm") ? "webm" : "ogg";
          const file = new File([blob], `note-vocale-${i + 1}.${ext}`, { type: blob.type });
          const form = new FormData();
          form.append("file", file);
          form.append("chantier_id", chantierId);
          form.append("caption", `Note vocale ${i + 1}`);
          await fetch("/api/employes/photos", { method: "POST", body: form });
        }
        setUploadingVoice(false);
      }

      // Clear draft after successful send
      clearDraft();
      setDraftSaved(false);

      setDone(true);
      showToast("Rapport envoyé avec succès", "success");
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
            setVoiceBlobs([]);
            setVoiceUrls([]);
            setSignatureBase64(null);
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
      {/* Draft indicator */}
      {draftSaved && (
        <div className="text-center text-xs text-neutral-400">
          Brouillon sauvegardé
        </div>
      )}

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

      {/* Voice recorder */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-700">Note vocale</span>
        <VoiceRecorder onRecorded={handleVoiceRecorded} />
        {voiceUrls.map((url, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2">
            <audio src={url} controls className="h-10 flex-1" />
            <button
              type="button"
              onClick={() => removeVoice(i)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs text-neutral-500"
              aria-label="Supprimer la note vocale"
            >
              ✕
            </button>
          </div>
        ))}
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
        disabled={loading || uploadingVoice}
        className="h-14 rounded-2xl bg-[#E50000] text-base font-semibold text-white disabled:opacity-50"
      >
        {loading
          ? uploadingVoice
            ? "Envoi notes vocales…"
            : "Envoi…"
          : "Envoyer mon rapport"}
      </button>

      {/* Signature de fin de journée */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <h3 className="mb-1 text-sm font-semibold text-neutral-700">
          Signature de fin de journée
        </h3>
        <p className="mb-3 text-xs text-neutral-500">
          Optionnel — signez avec votre doigt pour valider votre journée.
        </p>
        {signatureBase64 ? (
          <div className="flex flex-col items-center gap-3">
            <img
              src={signatureBase64}
              alt="Aperçu signature"
              className="w-full rounded-xl border border-neutral-200"
              style={{ height: "150px", objectFit: "contain" }}
            />
            <button
              type="button"
              onClick={() => setSignatureBase64(null)}
              className="text-xs font-medium text-neutral-500 underline"
            >
              Refaire la signature
            </button>
          </div>
        ) : (
          <SignaturePad onValidate={setSignatureBase64} />
        )}
      </div>
    </div>
  );
}
