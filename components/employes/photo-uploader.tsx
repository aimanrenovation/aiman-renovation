"use client";
import { useRef, useState } from "react";

interface UploadedPhoto {
  id: string;
  previewUrl: string;
}

export function PhotoUploader({ chantierId }: { chantierId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("chantier_id", chantierId);
        const res = await fetch("/api/employes/photos", { method: "POST", body: form });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? "upload_failed");
        }
        const data = (await res.json()) as { photo: { id: string } };
        setPhotos((prev) => [
          ...prev,
          { id: data.photo.id, previewUrl: URL.createObjectURL(file) },
        ]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 bg-white text-sm font-medium text-neutral-600 disabled:opacity-50"
      >
        {uploading ? "Envoi en cours…" : "📷 Prendre / ajouter une photo"}
      </button>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.id}
              src={p.previewUrl}
              alt="Photo chantier"
              className="aspect-square w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
