import { eq, gte, lte, and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async () => {
  const today = new Date();
  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  const startStr = today.toISOString().slice(0, 10);
  const endStr = threeMonthsLater.toISOString().slice(0, 10);

  // Fetch accepted and pending absences overlapping the next 3 months
  const rows = await db
    .select({
      id: schema.demandesAbsence.id,
      employeId: schema.demandesAbsence.employeId,
      dateDebut: schema.demandesAbsence.dateDebut,
      dateFin: schema.demandesAbsence.dateFin,
      type: schema.demandesAbsence.type,
      statut: schema.demandesAbsence.statut,
      employeFirstname: schema.employes.firstname,
      employeLastname: schema.employes.lastname,
    })
    .from(schema.demandesAbsence)
    .innerJoin(schema.employes, eq(schema.demandesAbsence.employeId, schema.employes.id))
    .where(
      and(
        inArray(schema.demandesAbsence.statut, ["accepte", "en_attente"]),
        lte(schema.demandesAbsence.dateDebut, endStr),
        gte(schema.demandesAbsence.dateFin, startStr)
      )
    );

  // Group by employe
  const employeMap = new Map<string, {
    id: string;
    nom: string;
    absences: { dateDebut: string; dateFin: string; type: string; statut: string }[];
  }>();

  for (const row of rows) {
    let entry = employeMap.get(row.employeId);
    if (!entry) {
      entry = {
        id: row.employeId,
        nom: `${row.employeFirstname} ${row.employeLastname}`,
        absences: [],
      };
      employeMap.set(row.employeId, entry);
    }
    entry.absences.push({
      dateDebut: row.dateDebut,
      dateFin: row.dateFin,
      type: row.type,
      statut: row.statut,
    });
  }

  return NextResponse.json({ employes: Array.from(employeMap.values()) });
}, ["patron"]);
