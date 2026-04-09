import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async (_request, ctx) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  const [chantier] = await db
    .select()
    .from(schema.chantiers)
    .where(eq(schema.chantiers.id, id))
    .limit(1);

  if (!chantier) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const [pointages, rapports, photos] = await Promise.all([
    db
      .select({
        id: schema.pointages.id,
        employeFirstname: schema.employes.firstname,
        employeLastname: schema.employes.lastname,
        date: schema.pointages.date,
        heureDebut: schema.pointages.heureDebut,
        heureFin: schema.pointages.heureFin,
        pauseMinutes: schema.pointages.pauseMinutes,
        onSiteDebut: schema.pointages.onSiteDebut,
        notes: schema.pointages.notes,
      })
      .from(schema.pointages)
      .innerJoin(schema.employes, eq(schema.pointages.employeId, schema.employes.id))
      .where(eq(schema.pointages.chantierId, id))
      .orderBy(desc(schema.pointages.heureDebut)),

    db
      .select({
        id: schema.rapportsJournaliers.id,
        employeFirstname: schema.employes.firstname,
        employeLastname: schema.employes.lastname,
        date: schema.rapportsJournaliers.date,
        description: schema.rapportsJournaliers.description,
        travauxRealises: schema.rapportsJournaliers.travauxRealises,
        blocages: schema.rapportsJournaliers.blocages,
        meteo: schema.rapportsJournaliers.meteo,
      })
      .from(schema.rapportsJournaliers)
      .innerJoin(schema.employes, eq(schema.rapportsJournaliers.employeId, schema.employes.id))
      .where(eq(schema.rapportsJournaliers.chantierId, id))
      .orderBy(desc(schema.rapportsJournaliers.date)),

    db
      .select({
        id: schema.photosChantier.id,
        s3Key: schema.photosChantier.s3Key,
        caption: schema.photosChantier.caption,
        priseLe: schema.photosChantier.priseLe,
        employeFirstname: schema.employes.firstname,
        employeLastname: schema.employes.lastname,
      })
      .from(schema.photosChantier)
      .innerJoin(schema.employes, eq(schema.photosChantier.employeId, schema.employes.id))
      .where(eq(schema.photosChantier.chantierId, id))
      .orderBy(desc(schema.photosChantier.createdAt)),
  ]);

  return NextResponse.json({ chantier, pointages, rapports, photos });
}, ["patron"]);
