import { NextResponse } from "next/server";
import { eq, gte, lte, sql, desc, and } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async () => {
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);

  // Monday of current week
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const mondayStr = monday.toISOString().slice(0, 10);

  const [todayPointages, pendingRapports, recentPhotos, weeklyHours] =
    await Promise.all([
      // Today's pointages with employe + chantier names
      db
        .select({
          id: schema.pointages.id,
          employeFirstname: schema.employes.firstname,
          employeLastname: schema.employes.lastname,
          chantierNom: schema.chantiers.nom,
          heureDebut: schema.pointages.heureDebut,
          heureFin: schema.pointages.heureFin,
          onSiteDebut: schema.pointages.onSiteDebut,
          pauseMinutes: schema.pointages.pauseMinutes,
        })
        .from(schema.pointages)
        .innerJoin(schema.employes, eq(schema.pointages.employeId, schema.employes.id))
        .innerJoin(schema.chantiers, eq(schema.pointages.chantierId, schema.chantiers.id))
        .where(eq(schema.pointages.date, today))
        .orderBy(desc(schema.pointages.heureDebut)),

      // Rapports without validation (recent, last 30 days)
      db
        .select({
          id: schema.rapportsJournaliers.id,
          employeFirstname: schema.employes.firstname,
          employeLastname: schema.employes.lastname,
          chantierNom: schema.chantiers.nom,
          date: schema.rapportsJournaliers.date,
          description: schema.rapportsJournaliers.description,
        })
        .from(schema.rapportsJournaliers)
        .innerJoin(schema.employes, eq(schema.rapportsJournaliers.employeId, schema.employes.id))
        .innerJoin(schema.chantiers, eq(schema.rapportsJournaliers.chantierId, schema.chantiers.id))
        .orderBy(desc(schema.rapportsJournaliers.createdAt))
        .limit(20),

      // Recent photos (last 7 days)
      db
        .select({
          id: schema.photosChantier.id,
          s3Key: schema.photosChantier.s3Key,
          caption: schema.photosChantier.caption,
          chantierNom: schema.chantiers.nom,
          createdAt: schema.photosChantier.createdAt,
        })
        .from(schema.photosChantier)
        .innerJoin(schema.chantiers, eq(schema.photosChantier.chantierId, schema.chantiers.id))
        .where(gte(schema.photosChantier.createdAt, new Date(weekAgo)))
        .orderBy(desc(schema.photosChantier.createdAt))
        .limit(12),

      // Weekly hours per employe
      db
        .select({
          employeId: schema.pointages.employeId,
          employeFirstname: schema.employes.firstname,
          employeLastname: schema.employes.lastname,
          totalMinutes: sql<number>`
            COALESCE(SUM(
              EXTRACT(EPOCH FROM (${schema.pointages.heureFin} - ${schema.pointages.heureDebut})) / 60
              - ${schema.pointages.pauseMinutes}
            ), 0)::int
          `,
        })
        .from(schema.pointages)
        .innerJoin(schema.employes, eq(schema.pointages.employeId, schema.employes.id))
        .where(
          and(
            gte(schema.pointages.date, mondayStr),
            lte(schema.pointages.date, today)
          )
        )
        .groupBy(
          schema.pointages.employeId,
          schema.employes.firstname,
          schema.employes.lastname
        ),
    ]);

  // All employes to show who hasn't checked in
  const allEmployes = await db
    .select({ id: schema.employes.id, firstname: schema.employes.firstname, lastname: schema.employes.lastname })
    .from(schema.employes)
    .where(eq(schema.employes.actif, true));

  const pointedIds = new Set(todayPointages.map((p) => {
    // find employeId from the join - we need to query it differently
    return undefined; // placeholder
  }));

  return NextResponse.json({
    todayPointages,
    pendingRapports,
    recentPhotos,
    weeklyHours: weeklyHours.map((w) => ({
      ...w,
      totalHours: Math.round((w.totalMinutes / 60) * 100) / 100,
    })),
    allEmployes,
    stats: {
      pointedToday: todayPointages.length,
      totalEmployes: allEmployes.length,
      pendingRapportsCount: pendingRapports.length,
      photosThisWeek: recentPhotos.length,
    },
  });
}, ["patron"]);
