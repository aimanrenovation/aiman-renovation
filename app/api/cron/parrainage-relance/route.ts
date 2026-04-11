import { NextResponse } from "next/server";
import { and, between, isNull, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { sendParrainageMessage } from "@/lib/employes/whatsapp";

/**
 * GET /api/cron/parrainage-relance
 *
 * Vercel Cron — runs daily.
 * Sends a single follow-up message ~90 days after the initial WhatsApp.
 * After this follow-up there are no further reminders.
 */
export async function GET(request: Request) {
  // ── Auth ──────────────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 1. Find parrainages eligible for the one-time follow-up
  const eligible = await db
    .select({
      parrainageId: schema.parrainages.id,
      parrainPrenom: schema.parrainages.parrainPrenom,
      parrainPhone: schema.parrainages.parrainPhone,
      code: schema.parrainages.code,
    })
    .from(schema.parrainages)
    .where(
      and(
        eq(schema.parrainages.statut, "actif"),
        between(
          schema.parrainages.messageEnvoyeAt,
          sql`NOW() - INTERVAL '91 days'`,
          sql`NOW() - INTERVAL '89 days'`,
        ),
        isNull(schema.parrainages.relanceEnvoyeeAt),
        isNull(schema.parrainages.filleulNom),
      ),
    );

  let relanced = 0;

  // ── 2. Send follow-up + mark as done
  for (const row of eligible) {
    const message = [
      `Bonjour ${row.parrainPrenom}, c'est Aiman Rénovation.`,
      `Votre code parrainage ${row.code} est toujours valide !`,
      `100€ offerts si un proche fait appel à nous et mentionne votre nom.`,
      `Bonne journée !`,
    ].join("\n");

    await sendParrainageMessage({
      phone: row.parrainPhone!,
      message,
      parrainageId: row.parrainageId,
    });

    await db
      .update(schema.parrainages)
      .set({ relanceEnvoyeeAt: new Date() })
      .where(eq(schema.parrainages.id, row.parrainageId));

    relanced++;
  }

  console.log(
    `[cron/parrainage-relance] processed=${eligible.length} relanced=${relanced}`,
  );

  return NextResponse.json({ processed: eligible.length, relanced });
}
