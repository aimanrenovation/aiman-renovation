import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { geocodeChantier } from "@/lib/geo/geocoding";

export const GET = requireAuth(async () => {
  const rows = await db
    .select({
      id: schema.chantiers.id,
      nom: schema.chantiers.nom,
      clientNom: schema.chantiers.clientNom,
      ville: schema.chantiers.ville,
      statut: schema.chantiers.statut,
      dateDebut: schema.chantiers.dateDebut,
      dateFinPrevue: schema.chantiers.dateFinPrevue,
      budgetPrevuCents: schema.chantiers.budgetPrevuCents,
      createdAt: schema.chantiers.createdAt,
      totalMinutes: sql<number>`
        COALESCE((
          SELECT SUM(
            EXTRACT(EPOCH FROM (p.heure_fin - p.heure_debut)) / 60 - p.pause_minutes
          )::int
          FROM pointages p WHERE p.chantier_id = ${schema.chantiers.id}
          AND p.heure_fin IS NOT NULL
        ), 0)
      `,
      coutMoCents: sql<number>`
        COALESCE((
          SELECT SUM(
            (EXTRACT(EPOCH FROM (p.heure_fin - p.heure_debut)) / 3600 - p.pause_minutes / 60.0)
            * COALESCE(e.hourly_rate_cents, 0)
          )::int
          FROM pointages p
          JOIN employes e ON e.id = p.employe_id
          WHERE p.chantier_id = ${schema.chantiers.id}
          AND p.heure_fin IS NOT NULL
        ), 0)
      `,
    })
    .from(schema.chantiers)
    .orderBy(desc(schema.chantiers.createdAt));

  return NextResponse.json({
    chantiers: rows.map((r) => ({
      ...r,
      totalHours: Math.round((r.totalMinutes / 60) * 100) / 100,
    })),
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
