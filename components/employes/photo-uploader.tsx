"use client";
import { useRef, useState, useCallback } from "react";

interface PendingPhoto {
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
}

interface UploadedPhoto {
  id: string;
  previewUrl: string;
}

interface UploadProgress {
  current: number;
  total: number;
  percent: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

async function compressImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
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
      if (!ctx) {
        reject(new Error("canvas_not_supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("compression_failed"));
            return;
          }
          resolve({ blob, width, height });
        },
        "image/jpeg",
        0.8
      );
    };
    img.onerror = () => reject(new Error("image_load_failed"));
    img.src = URL.createObjectURL(file);
  });
}

function uploadWithProgress(
  url: string,
  formData: FormData,
  onProgress: (percent: number) => void
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      const headers = new Headers();
      xhr
        .getAllResponseHeaders()
        .trim()
        .split("\r\n")
        .forEach((line) => {
          const idx = line.indexOf(": ");
          if (idx > 0) headers.set(line.slice(0, idx), line.slice(idx + 2));
        });
      resolve(
        new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers,
        })
      );
    };
    xhr.onerror = () => reject(new Error("network_error"));
    xhr.send(formData);
  });
}

export function PhotoUploader({ chantierId }: { chantierId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const [uploaded, setUploaded] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const removePending = useCallback((idx: number) => {
    setPending((prev) => {
      const removed = prev[idx];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const removeUploaded = useCallback((idx: number) => {
    setUploaded((prev) => {
      const removed = prev[idx];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const newPending: PendingPhoto[] = [];
    for (const file of Array.from(files)) {
      try {
        const { blob } = await compressImage(file);
        const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
          type: "image/jpeg",
        });
        newPending.push({
          file: compressedFile,
          previewUrl: URL.createObjectURL(blob),
          originalSize: file.size,
          compressedSize: blob.size,
        });
      } catch {
        // If compression fails, use original file
        newPending.push({
          file,
          previewUrl: URL.createObjectURL(file),
          originalSize: file.size,
          compressedSize: file.size,
        });
      }
    }
    setPending((prev) => [...prev, ...newPending]);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUpload() {
    if (pending.length === 0) return;
    setError(null);
    setUploading(true);
    const total = pending.length;
    let current = 0;

    try {
      for (const item of pending) {
        current++;
        setProgress({ current, total, percent: 0 });

        const form = new FormData();
        form.append("file", item.file);
        form.append("chantier_id", chantierId);

        const res = await uploadWithProgress(
          "/api/employes/photos",
          form,
          (percent) => setProgress({ current, total, percent })
        );

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? "upload_failed");
        }
        const data = (await res.json()) as { photo: { id: string } };
        setUploaded((prev) => [...prev, { id: data.photo.id, previewUrl: item.previewUrl }]);
      }
      setPending([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur upload");
    } finally {
      setUploading(false);
      setProgress(null);
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

      {/* Pending photos (before upload) */}
      {pending.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            {pending.map((p, i) => (
              <div key={i} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.previewUrl}
                  alt="Preview"
                  className="aspect-square w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePending(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
                {p.originalSize !== p.compressedSize && (
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                    {formatBytes(p.originalSize)} → {formatBytes(p.compressedSize)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Upload button + progress */}
          {uploading && progress ? (
            <div className="flex flex-col gap-1">
              <div className="text-xs text-neutral-500 text-center">
                {progress.current}/{progress.total} photo{progress.total > 1 ? "s" : ""} envoyée{progress.total > 1 ? "s" : ""}
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-[#E50000] transition-all duration-200"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="h-10 rounded-xl bg-[#E50000] text-sm font-medium text-white disabled:opacity-50"
            >
              Envoyer {pending.length} photo{pending.length > 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}

      {/* Already uploaded photos */}
      {uploaded.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-neutral-400">Photos envoyées</span>
          <div className="grid grid-cols-3 gap-2">
            {uploaded.map((p, i) => (
              <div key={p.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.previewUrl}
                  alt="Photo chantier"
                  className="aspect-square w-full rounded-lg object-cover opacity-80"
                />
                <button
                  type="button"
                  onClick={() => removeUploaded(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
                <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                  ✓
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
