import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async (request, _ctx, session) => {
  const url = new URL(request.url);
  const chantierId = url.searchParams.get("chantier_id");

  if (!chantierId) {
    return NextResponse.json({ error: "missing_chantier_id" }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(schema.suiviMateriel)
    .where(eq(schema.suiviMateriel.chantierId, chantierId))
    .orderBy(schema.suiviMateriel.createdAt);

  return NextResponse.json({ items: rows });
});

interface SuiviBody {
  chantier_id: string;
  materiau: string;
  quantite_prevue: number;
  quantite_utilisee: number;
  unite?: string;
  notes?: string;
  id?: string; // if provided, update existing row
}

export const POST = requireAuth(async (request, _ctx, session) => {
  let body: SuiviBody;
  try {
    body = (await request.json()) as SuiviBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!body.chantier_id || !body.materiau?.trim()) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const quantitePrevue = Math.max(0, Math.round(body.quantite_prevue ?? 0));
  const quantiteUtilisee = Math.max(0, Math.round(body.quantite_utilisee ?? 0));
  const unite = body.unite?.trim() || "unité";

  // Update existing row
  if (body.id) {
    const [updated] = await db
      .update(schema.suiviMateriel)
      .set({
        materiau: body.materiau.trim(),
        quantitePrevue,
        quantiteUtilisee,
        unite,
        notes: body.notes?.trim() || null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.suiviMateriel.id, body.id),
          eq(schema.suiviMateriel.chantierId, body.chantier_id),
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: updated });
  }

  // Insert new row
  const [row] = await db
    .insert(schema.suiviMateriel)
    .values({
      chantierId: body.chantier_id,
      employeId: session.sub,
      materiau: body.materiau.trim(),
      quantitePrevue,
      quantiteUtilisee,
      unite,
      notes: body.notes?.trim() || null,
    })
    .returning();

  return NextResponse.json({ ok: true, item: row });
});
