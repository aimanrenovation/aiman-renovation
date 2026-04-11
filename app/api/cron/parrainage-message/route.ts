import { NextResponse } from "next/server";
import { and, between, isNull, isNotNull, sql, eq, notExists } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { generateParrainageCode } from "@/lib/employes/parrainage-code";
import { sendParrainageMessage } from "@/lib/employes/whatsapp";

/**
 * GET /api/cron/parrainage-message
 *
 * Vercel Cron — runs daily.
 * For every chantier finished ~30 days ago whose client has a phone number
 * and no parrainage yet, creates a parrainage row and sends the initial
 * WhatsApp message (via webhook for now).
 */
export async function GET(request: Request) {
  // ── Auth ──────────────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 1. Find eligible chantiers (finished ~30 days ago, no parrainage yet)
  const eligible = await db
    .select({
      chantierId: schema.chantiers.id,
      clientNom: schema.chantiers.clientNom,
      clientPhone: schema.chantiers.clientPhone,
      adresse: schema.chantiers.adresse,
    })
    .from(schema.chantiers)
    .where(
      and(
        isNotNull(schema.chantiers.dateFinReelle),
        isNotNull(schema.chantiers.clientPhone),
        between(
          schema.chantiers.dateFinReelle,
          sql`(CURRENT_DATE - INTERVAL '31 days')::date`,
          sql`(CURRENT_DATE - INTERVAL '29 days')::date`,
        ),
        notExists(
          db
            .select({ one: sql`1` })
            .from(schema.parrainages)
            .where(eq(schema.parrainages.parrainChantierId, schema.chantiers.id)),
        ),
      ),
    );

  let created = 0;

  // ── 2. For each eligible chantier, create parrainage + send message
  for (const row of eligible) {
    const parts = row.clientNom.split(" ");
    const prenom = parts[0];
    const nom = parts.slice(1).join(" ") || parts[0];
    const code = generateParrainageCode(row.clientNom);

    const [parrainage] = await db
      .insert(schema.parrainages)
      .values({
        parrainChantierId: row.chantierId,
        parrainNom: nom,
        parrainPrenom: prenom,
        parrainPhone: row.clientPhone,
        code,
        statut: "actif",
        recompense: "100€ de remise sur le prochain projet",
        messageEnvoyeAt: new Date(),
      })
      .returning({ id: schema.parrainages.id });

    const message = [
      `Bonjour ${prenom}, merci pour votre confiance sur le chantier de ${row.adresse} !`,
      `Si un de vos proches a un projet de rénovation, partagez-lui notre contact.`,
      `Si le chantier se fait, on vous offre une remise de 100€ sur votre prochain projet.`,
      `Il suffit qu'il mentionne votre code : ${code}`,
      `Aiman Rénovation — 06 33 49 69 25`,
    ].join("\n");

    await sendParrainageMessage({
      phone: row.clientPhone!,
      message,
      parrainageId: parrainage.id,
    });

    created++;
  }

  console.log(
    `[cron/parrainage-message] processed=${eligible.length} created=${created}`,
  );

  return NextResponse.json({ processed: eligible.length, created });
}
