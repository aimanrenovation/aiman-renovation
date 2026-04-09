import { and, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { dispatchJarvisEvent } from "@/lib/jarvis/webhook";

interface RapportBody {
  chantier_id: string;
  date?: string;
  description?: string;
  travaux_realises?: Array<{ label: string; duration_minutes?: number }>;
  blocages?: Array<{ type: string; severity: string; description: string }>;
  meteo?: string;
}

export const POST = requireAuth(async (request, _ctx, session) => {
  let body: RapportBody;
  try {
    body = (await request.json()) as RapportBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (!body.chantier_id) {
    return NextResponse.json({ error: "missing_chantier_id" }, { status: 400 });
  }

  const date = body.date ?? new Date().toISOString().slice(0, 10);

  const [row] = await db
    .insert(schema.rapportsJournaliers)
    .values({
      employeId: session.sub,
      chantierId: body.chantier_id,
      date,
      description: body.description ?? null,
      travauxRealises: body.travaux_realises ?? null,
      blocages: body.blocages ?? null,
      meteo: body.meteo ?? null,
    })
    .returning();

  const [chantier] = await db
    .select({ nom: schema.chantiers.nom })
    .from(schema.chantiers)
    .where(eq(schema.chantiers.id, body.chantier_id))
    .limit(1);

  dispatchJarvisEvent({
    type: "rapport.created",
    employe_id: session.sub,
    chantier_id: body.chantier_id,
    chantier_nom: chantier?.nom,
    timestamp: row.createdAt.toISOString(),
    data: {
      rapport_id: row.id,
      date,
      description: body.description,
      travaux_count: body.travaux_realises?.length ?? 0,
      blocages_count: body.blocages?.length ?? 0,
    },
  });

  return NextResponse.json({ ok: true, rapport: row });
});

export const GET = requireAuth(async (request, _ctx, session) => {
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const conditions = [eq(schema.rapportsJournaliers.employeId, session.sub)];
  if (from) conditions.push(gte(schema.rapportsJournaliers.date, from));
  if (to) conditions.push(lte(schema.rapportsJournaliers.date, to));

  const rows = await db
    .select()
    .from(schema.rapportsJournaliers)
    .where(and(...conditions))
    .orderBy(schema.rapportsJournaliers.date);
  return NextResponse.json({ rapports: rows });
});
