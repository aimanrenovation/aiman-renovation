"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Camera, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { EmployeAvatar } from "@/components/employes/avatar";

interface EmployeProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
}

function compressImage(file: File, maxPx: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

const ROLE_LABELS: Record<string, string> = {
  employe: "Employé",
  chef_chantier: "Chef de chantier",
  patron: "Patron",
};

export default function ProfilPage() {
  const [profile, setProfile] = useState<EmployeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/employes/me")
      .then((r) => r.json())
      .then((data) => setProfile(data.employe))
      .catch(() => setError("Impossible de charger le profil"))
      .finally(() => setLoading(false));
  }, []);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setError(null);
      setUploading(true);

      try {
        // Compress client-side
        const compressed = await compressImage(file, 400, 0.85);
        const fd = new FormData();
        fd.append("file", compressed, "avatar.jpg");

        const res = await fetch("/api/employes/me/avatar", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error === "file_too_large" ? "Image trop lourde (max 2 Mo)" : "Erreur upload");
          setPreview(null);
          return;
        }
        // Update profile with new avatar
        setProfile((prev) => (prev ? { ...prev, avatarUrl: data.avatarUrl } : prev));
        setPreview(null);
      } catch {
        setError("Erreur lors de l'upload");
        setPreview(null);
      } finally {
        setUploading(false);
        // Reset input so same file can be re-selected
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!profile) {
    return <p className="py-10 text-center text-sm text-neutral-500">Profil introuvable.</p>;
  }

  const displayUrl = preview ?? profile.avatarUrl;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Mon profil</h1>

      {/* Avatar section */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={`${profile.firstname} ${profile.lastname}`}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <EmployeAvatar
              firstname={profile.firstname}
              lastname={profile.lastname}
              size={96}
            />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-full bg-[#E50000] px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Camera className="h-3.5 w-3.5" />
          Changer la photo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      {/* Info section */}
      <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
        <InfoRow label="Nom" value={`${profile.firstname} ${profile.lastname}`} />
        <InfoRow label="Email" value={profile.email} />
        <InfoRow label="Téléphone" value={profile.phone ?? "—"} />
        <InfoRow label="Rôle" value={ROLE_LABELS[profile.role] ?? profile.role} />
      </div>

      {/* Actions */}
      <Link
        href="/espace-employes/change-password"
        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium transition-colors hover:bg-neutral-50"
      >
        <KeyRound className="h-4 w-4 text-neutral-500" />
        Changer mon mot de passe
      </Link>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      <span className="text-neutral-900">{value}</span>
    </div>
  );
}
