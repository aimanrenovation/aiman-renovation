import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";
import { GalerieChantierClient } from "./galerie-chantier-client";

export const dynamic = "force-dynamic";

export default async function GalerieChantierPage(
  props: { params: Promise<{ chantierId: string }> }
) {
  await requireActiveEmploye();
  const { chantierId } = await props.params;

  const [chantier] = await db
    .select({ id: schema.chantiers.id, nom: schema.chantiers.nom })
    .from(schema.chantiers)
    .where(eq(schema.chantiers.id, chantierId))
    .limit(1);

  if (!chantier) notFound();

  const photos = await db
    .select({
      id: schema.photosChantier.id,
      s3Key: schema.photosChantier.s3Key,
      caption: schema.photosChantier.caption,
      priseLe: schema.photosChantier.priseLe,
      createdAt: schema.photosChantier.createdAt,
      employeFirstname: schema.employes.firstname,
      employeLastname: schema.employes.lastname,
    })
    .from(schema.photosChantier)
    .innerJoin(schema.employes, eq(schema.photosChantier.employeId, schema.employes.id))
    .where(eq(schema.photosChantier.chantierId, chantierId))
    .orderBy(desc(schema.photosChantier.priseLe), desc(schema.photosChantier.createdAt));

  // Group by date
  const groupMap = new Map<string, {
    date: string;
    label: string;
    photos: { id: string; url: string; caption: string | null; employe: string; priseLe: string }[];
  }>();

  for (const p of photos) {
    const dt = p.priseLe ?? p.createdAt;
    const dateKey = dt.toISOString().slice(0, 10);
    const label = dt.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    if (!groupMap.has(dateKey)) {
      groupMap.set(dateKey, { date: dateKey, label, photos: [] });
    }

    groupMap.get(dateKey)!.photos.push({
      id: p.id,
      url: `/api/employes/galerie/photo?key=${encodeURIComponent(p.s3Key)}`,
      caption: p.caption,
      employe: `${p.employeFirstname} ${p.employeLastname}`,
      priseLe: dt.toISOString(),
    });
  }

  const groups = Array.from(groupMap.values());

  return (
    <GalerieChantierClient chantierNom={chantier.nom} groups={groups} />
  );
}
