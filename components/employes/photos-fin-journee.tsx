"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { showToast } from "@/lib/employes/use-toast";

interface PhotoCheck {
  avant: number;
  apres: number;
  canStop: boolean;
}

interface PhotoMeta {
  id: string;
  s3Key: string;
  caption: string | null;
  tags: string[];
}

interface Props {
  chantierId: string;
  onComplete: () => void;
}

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 1920;
      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas_not_supported")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("compression_failed")); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.8,
      );
    };
    img.onerror = () => reject(new Error("image_load_failed"));
    img.src = URL.createObjectURL(file);
  });
}

export function PhotosFinJournee({ chantierId, onComplete }: Props) {
  const [check, setCheck] = useState<PhotoCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().slice(0, 10);

  const fetchCheck = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/employes/photos/check?chantier_id=${encodeURIComponent(chantierId)}&date=${today}`,
      );
      if (!res.ok) throw new Error("check_failed");
      const data: PhotoCheck = await res.json();
      setCheck(data);
    } catch {
      showToast("Erreur lors de la vérification des photos", "error");
    } finally {
      setLoading(false);
    }
  }, [chantierId, today]);

  useEffect(() => {
    fetchCheck();
  }, [fetchCheck]);

  async function handleUploadApres(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const rawFile of Array.from(files)) {
        let file: File;
        try {
          file = await compressImage(rawFile);
        } catch {
          file = rawFile;
        }
        const form = new FormData();
        form.append("file", file);
        form.append("chantier_id", chantierId);
        form.append("tags", JSON.stringify(["apres"]));

        const res = await fetch("/api/employes/photos", { method: "POST", body: form });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error ?? "upload_failed");
        }
      }
      showToast("Photo(s) APRES envoyee(s)", "success");
      await fetchCheck();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Erreur upload", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-[#E50000]" />
        <span className="text-sm text-neutral-500">Verification des photos...</span>
      </div>
    );
  }

  const avant = check?.avant ?? 0;
  const apres = check?.apres ?? 0;
  const canContinue = apres > 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
      <h3 className="text-base font-semibold text-neutral-800">
        Photos de chantier
      </h3>

      {/* Section AVANT */}
      <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
            avant > 0 ? "bg-green-500" : "bg-neutral-300"
          }`}
        >
          {avant}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-neutral-700">Photos AVANT</div>
          <div className="text-xs text-neutral-500">
            {avant > 0
              ? `${avant} photo${avant > 1 ? "s" : ""} prise${avant > 1 ? "s" : ""} aujourd'hui`
              : "Aucune photo avant aujourd'hui"}
          </div>
        </div>
        {avant > 0 && <span className="text-green-600 text-lg">&#10003;</span>}
      </div>

      {/* Section APRES */}
      <div
        className={`flex flex-col gap-3 rounded-xl border px-4 py-3 ${
          apres > 0
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
              apres > 0 ? "bg-green-500" : "bg-[#E50000]"
            }`}
          >
            {apres}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-neutral-700">
              Photos APRES <span className="text-[#E50000]">*</span>
            </div>
            {apres === 0 ? (
              <div className="text-xs font-medium text-[#E50000]">
                Prenez au moins 1 photo APRES les travaux
              </div>
            ) : (
              <div className="text-xs text-green-700">
                {apres} photo{apres > 1 ? "s" : ""} prise{apres > 1 ? "s" : ""} aujourd&apos;hui
              </div>
            )}
          </div>
          {apres > 0 && <span className="text-green-600 text-lg">&#10003;</span>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={(e) => handleUploadApres(e.target.files)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-white text-sm font-medium text-neutral-700 disabled:opacity-50"
        >
          {uploading ? "Envoi en cours..." : "Prendre une photo APRES"}
        </button>
      </div>

      {/* Comparaison avant/apres textuelle */}
      {avant > 0 && apres > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
            Comparaison
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-neutral-200 bg-white p-3 text-center">
              <div className="text-2xl font-bold text-neutral-700">{avant}</div>
              <div className="text-xs text-neutral-500">AVANT</div>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
              <div className="text-2xl font-bold text-green-700">{apres}</div>
              <div className="text-xs text-green-600">APRES</div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton Continuer */}
      <button
        type="button"
        onClick={onComplete}
        disabled={!canContinue}
        className={`h-14 rounded-2xl text-base font-semibold text-white ${
          canContinue
            ? "bg-[#E50000]"
            : "cursor-not-allowed bg-neutral-300"
        }`}
      >
        Continuer
      </button>

      {!canContinue && (
        <p className="text-center text-xs text-neutral-400">
          Vous devez prendre au moins 1 photo APRES pour terminer votre pointage.
        </p>
      )}
    </div>
  );
}
