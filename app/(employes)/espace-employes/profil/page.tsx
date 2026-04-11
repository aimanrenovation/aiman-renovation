"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Camera,
  KeyRound,
  Loader2,
  Clock,
  CalendarDays,
  TrendingUp,
  HardHat,
  FileText,
  FileBadge,
  FileCheck,
  Briefcase,
  User,
  BadgeInfo,
} from "lucide-react";
import { EmployeAvatar } from "@/components/employes/avatar";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EmployeProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
  hourlyRateCents: number | null;
  createdAt: string | null;
}

interface Pointage {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string | null;
  pauseMinutes: number | null;
}

interface PlanningEntry {
  id: string;
  date: string;
  chantierId: string;
  chantierNom: string;
  chantierAdresse: string | null;
  chantierVille: string | null;
}

interface StatsData {
  totalHours: number;
  daysWorked: number;
  avgHoursPerDay: number;
}

interface ChantierSummary {
  chantierId: string;
  chantierNom: string;
  chantierVille: string | null;
  daysCount: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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
  employe: "Employe",
  chef_chantier: "Chef de chantier",
  patron: "Patron",
};

const ROLE_COLORS: Record<string, string> = {
  employe: "bg-blue-100 text-blue-700",
  chef_chantier: "bg-amber-100 text-amber-700",
  patron: "bg-red-100 text-red-700",
};

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function centsToEuros(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

function computeStats(pointages: Pointage[]): StatsData {
  let totalMinutes = 0;
  const daysSet = new Set<string>();

  for (const p of pointages) {
    if (!p.heureFin) continue;
    const start = new Date(p.heureDebut).getTime();
    const end = new Date(p.heureFin).getTime();
    const pause = p.pauseMinutes ?? 0;
    const worked = (end - start) / 60000 - pause;
    if (worked > 0) {
      totalMinutes += worked;
      daysSet.add(p.date);
    }
  }

  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const daysWorked = daysSet.size;
  const avgHoursPerDay = daysWorked > 0 ? Math.round((totalHours / daysWorked) * 10) / 10 : 0;

  return { totalHours, daysWorked, avgHoursPerDay };
}

function groupByChantier(plannings: PlanningEntry[]): ChantierSummary[] {
  const map = new Map<string, ChantierSummary>();
  for (const p of plannings) {
    const existing = map.get(p.chantierId);
    if (existing) {
      existing.daysCount += 1;
    } else {
      map.set(p.chantierId, {
        chantierId: p.chantierId,
        chantierNom: p.chantierNom,
        chantierVille: p.chantierVille,
        daysCount: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.daysCount - a.daysCount);
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function ProfilPage() {
  const [profile, setProfile] = useState<EmployeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Stats
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Chantiers
  const [chantiers, setChantiers] = useState<ChantierSummary[]>([]);
  const [chantiersLoading, setChantiersLoading] = useState(true);

  // Fetch profile
  useEffect(() => {
    fetch("/api/employes/me")
      .then((r) => r.json())
      .then((data) => setProfile(data.employe))
      .catch(() => setError("Impossible de charger le profil"))
      .finally(() => setLoading(false));
  }, []);

  // Fetch pointages for stats (last 30 days)
  useEffect(() => {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const fromStr = from.toISOString().slice(0, 10);

    fetch(`/api/employes/pointage?from=${fromStr}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.pointages) {
          setStats(computeStats(data.pointages));
        }
      })
      .catch(() => {
        /* silent */
      })
      .finally(() => setStatsLoading(false));
  }, []);

  // Fetch planning for chantiers
  useEffect(() => {
    fetch("/api/employes/planning")
      .then((r) => r.json())
      .then((data) => {
        if (data.plannings) {
          setChantiers(groupByChantier(data.plannings));
        }
      })
      .catch(() => {
        /* silent */
      })
      .finally(() => setChantiersLoading(false));
  }, []);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setError(null);
      setUploading(true);

      try {
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
        setProfile((prev) => (prev ? { ...prev, avatarUrl: data.avatarUrl } : prev));
        setPreview(null);
      } catch {
        setError("Erreur lors de l'upload");
        setPreview(null);
      } finally {
        setUploading(false);
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
  const roleBadge = ROLE_COLORS[profile.role] ?? "bg-neutral-100 text-neutral-700";

  return (
    <div className="space-y-5 pb-6">
      <h1 className="text-lg font-semibold">Mon profil</h1>

      {/* ── Avatar section ── */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={`${profile.firstname} ${profile.lastname}`}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <EmployeAvatar firstname={profile.firstname} lastname={profile.lastname} size={96} />
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

      {/* ── Section 1 : Informations personnelles ── */}
      <Section title="Informations personnelles" icon={<User className="h-4 w-4" />}>
        <InfoRow label="Nom complet" value={`${profile.firstname} ${profile.lastname}`} />
        <InfoRow label="Email" value={profile.email} />
        <InfoRow label="Telephone" value={profile.phone ?? "\u2014"} />
        <div className="flex justify-between text-sm">
          <span className="font-medium text-neutral-700">Role</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge}`}>
            {ROLE_LABELS[profile.role] ?? profile.role}
          </span>
        </div>
      </Section>

      {/* ── Section 2 : Informations contrat ── */}
      <Section title="Informations contrat" icon={<Briefcase className="h-4 w-4" />}>
        {profile.hourlyRateCents != null && (
          <InfoRow label="Taux horaire" value={`${centsToEuros(profile.hourlyRateCents)} \u20AC/h`} />
        )}
        {profile.createdAt && (
          <InfoRow label="Date d'embauche" value={formatDate(profile.createdAt)} />
        )}
        {profile.hourlyRateCents == null && !profile.createdAt && (
          <p className="text-xs text-neutral-400">Aucune information disponible</p>
        )}
      </Section>

      {/* ── Section 3 : Statistiques (Mon activite) ── */}
      <Section title="Mon activite" icon={<TrendingUp className="h-4 w-4" />}>
        {statsLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-neutral-300" />
          </div>
        ) : stats ? (
          <>
            <p className="mb-3 text-xs text-neutral-500">30 derniers jours</p>
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                icon={<Clock className="h-4 w-4 text-blue-600" />}
                value={`${stats.totalHours}h`}
                label="Heures"
                bg="bg-blue-50"
              />
              <StatCard
                icon={<CalendarDays className="h-4 w-4 text-emerald-600" />}
                value={String(stats.daysWorked)}
                label="Jours"
                bg="bg-emerald-50"
              />
              <StatCard
                icon={<TrendingUp className="h-4 w-4 text-amber-600" />}
                value={`${stats.avgHoursPerDay}h`}
                label="Moy/jour"
                bg="bg-amber-50"
              />
            </div>
          </>
        ) : (
          <p className="text-xs text-neutral-400">Aucune donnee disponible</p>
        )}
      </Section>

      {/* ── Section 4 : Mes chantiers ── */}
      <Section title="Mes chantiers" icon={<HardHat className="h-4 w-4" />}>
        {chantiersLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-neutral-300" />
          </div>
        ) : chantiers.length > 0 ? (
          <div className="space-y-2">
            {chantiers.map((c) => (
              <a
                key={c.chantierId}
                href={`/espace-employes/missions?chantier=${c.chantierId}`}
                className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 transition-colors hover:bg-neutral-100"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">{c.chantierNom}</p>
                  {c.chantierVille && (
                    <p className="text-xs text-neutral-500">{c.chantierVille}</p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-[#E50000]/10 px-2 py-0.5 text-xs font-medium text-[#E50000]">
                  {c.daysCount} jour{c.daysCount > 1 ? "s" : ""}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-400">Aucun chantier ce mois-ci</p>
        )}
      </Section>

      {/* ── Section 5 : Mes documents ── */}
      <Section title="Mes documents" icon={<FileText className="h-4 w-4" />}>
        <div className="space-y-3">
          <DocumentPlaceholder icon={<FileBadge className="h-5 w-5 text-blue-500" />} label="Fiche de paie" />
          <DocumentPlaceholder icon={<BadgeInfo className="h-5 w-5 text-emerald-500" />} label="Contrat" />
          <DocumentPlaceholder icon={<FileCheck className="h-5 w-5 text-amber-500" />} label="Attestation" />
        </div>
        <p className="mt-3 text-center text-xs text-neutral-400">Aucun document disponible</p>
      </Section>

      {/* ── Changer MDP ── */}
      <a
        href="/espace-employes/change-password"
        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium transition-colors hover:bg-neutral-50"
      >
        <KeyRound className="h-4 w-4 text-neutral-500" />
        Changer mon mot de passe
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
        {icon}
        {title}
      </div>
      {children}
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

function StatCard({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bg: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl ${bg} px-2 py-3`}>
      {icon}
      <span className="text-lg font-bold text-neutral-900">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </span>
    </div>
  );
}

function DocumentPlaceholder({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-neutral-200 px-3 py-2.5">
      {icon}
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  );
}
