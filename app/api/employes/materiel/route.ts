import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { dispatchJarvisEvent } from "@/lib/jarvis/webhook";

interface MaterielBody {
  chantier_id: string;
  date?: string;
  items: Array<{
    name: string;
    qty: number;
    unite?: string;
    urgence?: "normale" | "urgente";
    notes?: string;
  }>;
  notes?: string;
}

export const POST = requireAuth(async (request, _ctx, session) => {
  let body: MaterielBody;
  try {
    body = (await request.json()) as MaterielBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (!body.chantier_id || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const date = body.date ?? new Date().toISOString().slice(0, 10);

  const [row] = await db
    .insert(schema.demandesMateriel)
    .values({
      employeId: session.sub,
      chantierId: body.chantier_id,
      date,
      items: body.items,
      notes: body.notes ?? null,
    })
    .returning();

  const [chantier] = await db
    .select({ nom: schema.chantiers.nom })
    .from(schema.chantiers)
    .where(eq(schema.chantiers.id, body.chantier_id))
    .limit(1);

  dispatchJarvisEvent({
    type: "materiel.requested",
    employe_id: session.sub,
    chantier_id: body.chantier_id,
    chantier_nom: chantier?.nom,
    timestamp: row.createdAt.toISOString(),
    data: {
      demande_id: row.id,
      items: body.items,
      has_urgent: body.items.some((i) => i.urgence === "urgente"),
    },
  });

  return NextResponse.json({ ok: true, demande: row });
});
