import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { geocodeChantier } from "@/lib/geo/geocoding";

export const GET = requireAuth(async () => {
  // Fetch chantiers
  const chantierRows = await db
    .select()
    .from(schema.chantiers)
    .orderBy(desc(schema.chantiers.createdAt));

  // Fetch hours + costs aggregated per chantier
  const statsRows = await db
    .select({
      chantierId: schema.pointages.chantierId,
      totalMinutes: sql<number>`
        COALESCE(SUM(
          EXTRACT(EPOCH FROM (${schema.pointages.heureFin} - ${schema.pointages.heureDebut})) / 60
          - ${schema.pointages.pauseMinutes}
        ), 0)::int
      `,
      coutMoCents: sql<number>`
        COALESCE(SUM(
          (EXTRACT(EPOCH FROM (${schema.pointages.heureFin} - ${schema.pointages.heureDebut})) / 3600
           - ${schema.pointages.pauseMinutes} / 60.0)
          * COALESCE(${schema.employes.hourlyRateCents}, 0)
        ), 0)::int
      `,
    })
    .from(schema.pointages)
    .innerJoin(schema.employes, eq(schema.pointages.employeId, schema.employes.id))
    .groupBy(schema.pointages.chantierId);

  const statsMap = new Map(statsRows.map((s) => [s.chantierId, s]));

  return NextResponse.json({
    chantiers: chantierRows.map((c) => {
      const stats = statsMap.get(c.id);
      const totalMinutes = stats?.totalMinutes ?? 0;
      return {
        id: c.id,
        nom: c.nom,
        clientNom: c.clientNom,
        ville: c.ville,
        statut: c.statut,
        dateDebut: c.dateDebut,
        dateFinPrevue: c.dateFinPrevue,
        budgetPrevuCents: c.budgetPrevuCents,
        createdAt: c.createdAt,
        totalMinutes,
        totalHours: Math.round((totalMinutes / 60) * 100) / 100,
        coutMoCents: stats?.coutMoCents ?? 0,
      };
    }),
  });
}, ["patron"]);

export const POST = requireAuth(async (request) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { nom, clientNom, clientEmail, clientPhone, adresse, ville, codePostal, dateDebut, dateFinPrevue, budgetPrevuCents, statut } = body as {
    nom?: string; clientNom?: string; clientEmail?: string; clientPhone?: string;
    adresse?: string; ville?: string; codePostal?: string;
    dateDebut?: string; dateFinPrevue?: string; budgetPrevuCents?: number; statut?: string;
  };

  if (!nom || !clientNom || !adresse) {
    return NextResponse.json({ error: "missing_fields", required: ["nom", "clientNom", "adresse"] }, { status: 400 });
  }

  // Geocode address
  let lat: string | null = null;
  let lng: string | null = null;
  let geocodingSource: string | null = null;
  try {
    const fullAddress = [adresse, ville, codePostal].filter(Boolean).join(", ");
    const geo = await geocodeChantier(fullAddress);
    if (geo) {
      lat = String(geo.lat);
      lng = String(geo.lng);
      geocodingSource = "mapbox";
    }
  } catch { /* geocoding is best-effort */ }

  const [created] = await db
    .insert(schema.chantiers)
    .values({
      nom: nom.trim(),
      clientNom: clientNom.trim(),
      clientEmail: clientEmail?.trim() || null,
      clientPhone: clientPhone?.trim() || null,
      adresse: adresse.trim(),
      ville: ville?.trim() || null,
      codePostal: codePostal?.trim() || null,
      latChantier: lat,
      lngChantier: lng,
      geocodedAt: lat ? new Date() : null,
      geocodingSource,
      dateDebut: dateDebut || null,
      dateFinPrevue: dateFinPrevue || null,
      budgetPrevuCents: budgetPrevuCents ?? null,
      statut: statut || "en_cours",
    })
    .returning();

  return NextResponse.json({ chantier: created }, { status: 201 });
}, ["patron"]);
