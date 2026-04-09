import { and, asc, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

function monthRange(month: string): { from: string; to: string } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) return null;
  const year = Number.parseInt(match[1], 10);
  const m = Number.parseInt(match[2], 10);
  if (m < 1 || m > 12) return null;
  const from = `${match[1]}-${match[2]}-01`;
  const lastDay = new Date(Date.UTC(year, m, 0)).getUTCDate();
  const to = `${match[1]}-${match[2]}-${String(lastDay).padStart(2, "0")}`;
  return { from, to };
}

export const GET = requireAuth(async (request, _ctx, session) => {
  const url = new URL(request.url);
  const monthParam = url.searchParams.get("month");
  const month = monthParam ?? new Date().toISOString().slice(0, 7);
  const range = monthRange(month);
  if (!range) return NextResponse.json({ error: "invalid_month" }, { status: 400 });

  const rows = await db
    .select({
      id: schema.plannings.id,
      date: schema.plannings.date,
      heureDebut: schema.plannings.heureDebut,
      heureFin: schema.plannings.heureFin,
      mission: schema.plannings.mission,
      statut: schema.plannings.statut,
      chantierId: schema.plannings.chantierId,
      chantierNom: schema.chantiers.nom,
      chantierAdresse: schema.chantiers.adresse,
      chantierVille: schema.chantiers.ville,
    })
    .from(schema.plannings)
    .innerJoin(schema.chantiers, eq(schema.plannings.chantierId, schema.chantiers.id))
    .where(
      and(
        eq(schema.plannings.employeId, session.sub),
        gte(schema.plannings.date, range.from),
        lte(schema.plannings.date, range.to)
      )
    )
    .orderBy(asc(schema.plannings.date));

  return NextResponse.json({ month, plannings: rows });
});
