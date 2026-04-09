import { NextResponse } from "next/server";
import { and, eq, gte, lte, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async (request) => {
  const url = new URL(request.url);
  const employeId = url.searchParams.get("employeId");
  const chantierId = url.searchParams.get("chantierId");
  const debut = url.searchParams.get("debut");
  const fin = url.searchParams.get("fin");

  const conditions = [];
  if (employeId) conditions.push(eq(schema.plannings.employeId, employeId));
  if (chantierId) conditions.push(eq(schema.plannings.chantierId, chantierId));
  if (debut) conditions.push(gte(schema.plannings.date, debut));
  if (fin) conditions.push(lte(schema.plannings.date, fin));

  const rows = await db
    .select({
      id: schema.plannings.id,
      employeId: schema.plannings.employeId,
      employeFirstname: schema.employes.firstname,
      employeLastname: schema.employes.lastname,
      chantierId: schema.plannings.chantierId,
      chantierNom: schema.chantiers.nom,
      date: schema.plannings.date,
      heureDebut: schema.plannings.heureDebut,
      heureFin: schema.plannings.heureFin,
      mission: schema.plannings.mission,
      statut: schema.plannings.statut,
    })
    .from(schema.plannings)
    .innerJoin(schema.employes, eq(schema.plannings.employeId, schema.employes.id))
    .innerJoin(schema.chantiers, eq(schema.plannings.chantierId, schema.chantiers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(schema.plannings.date));

  return NextResponse.json({ plannings: rows });
}, ["patron"]);

export const POST = requireAuth(async (request) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { employeId, chantierId, date, heureDebut, heureFin, mission } = body as {
    employeId?: string; chantierId?: string; date?: string;
    heureDebut?: string; heureFin?: string; mission?: string;
  };

  if (!employeId || !chantierId || !date) {
    return NextResponse.json({ error: "missing_fields", required: ["employeId", "chantierId", "date"] }, { status: 400 });
  }

  const [created] = await db
    .insert(schema.plannings)
    .values({
      employeId,
      chantierId,
      date,
      heureDebut: heureDebut || null,
      heureFin: heureFin || null,
      mission: mission?.trim() || null,
    })
    .returning();

  return NextResponse.json({ planning: created }, { status: 201 });
}, ["patron"]);
