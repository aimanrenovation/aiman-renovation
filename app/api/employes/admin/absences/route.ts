import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async (request) => {
  const url = new URL(request.url);
  const statutFilter = url.searchParams.get("statut");

  const demandes = await db
    .select({
      id: schema.demandesAbsence.id,
      employeId: schema.demandesAbsence.employeId,
      dateDebut: schema.demandesAbsence.dateDebut,
      dateFin: schema.demandesAbsence.dateFin,
      type: schema.demandesAbsence.type,
      raison: schema.demandesAbsence.raison,
      justificatifS3Key: schema.demandesAbsence.justificatifS3Key,
      statut: schema.demandesAbsence.statut,
      reponsePatron: schema.demandesAbsence.reponsePatron,
      reponduLe: schema.demandesAbsence.reponduLe,
      createdAt: schema.demandesAbsence.createdAt,
      employeFirstname: schema.employes.firstname,
      employeLastname: schema.employes.lastname,
    })
    .from(schema.demandesAbsence)
    .innerJoin(schema.employes, eq(schema.demandesAbsence.employeId, schema.employes.id))
    .where(statutFilter ? eq(schema.demandesAbsence.statut, statutFilter) : undefined)
    .orderBy(desc(schema.demandesAbsence.createdAt));

  return NextResponse.json({ demandes });
}, ["patron"]);
