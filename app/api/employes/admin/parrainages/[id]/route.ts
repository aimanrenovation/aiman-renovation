import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

/** PATCH /api/employes/admin/parrainages/[id] — modifier un parrainage */
export const PATCH = requireAuth(async (request, ctx) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const allowedFields = [
    "statut",
    "filleulNom",
    "filleulPhone",
    "filleulEmail",
    "filleulChantierId",
    "recompenseRemise",
    "recompense",
  ] as const;

  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  // Validate statut if provided
  if (updates.statut) {
    const validStatuts = ["actif", "utilise", "converti", "expire"];
    if (!validStatuts.includes(updates.statut as string)) {
      return NextResponse.json({ error: "invalid_statut" }, { status: 400 });
    }
    // Auto-set convertAt when status becomes converti
    if (updates.statut === "converti") {
      updates.convertAt = new Date();
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no_fields_to_update" }, { status: 400 });
  }

  const [updated] = await db
    .update(schema.parrainages)
    .set(updates)
    .where(eq(schema.parrainages.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "parrainage_not_found" }, { status: 404 });
  }

  return NextResponse.json({ parrainage: updated });
}, ["patron"]);

/** DELETE /api/employes/admin/parrainages/[id] — supprimer un parrainage */
export const DELETE = requireAuth(async (_request, ctx) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  const [deleted] = await db
    .delete(schema.parrainages)
    .where(eq(schema.parrainages.id, id))
    .returning({ id: schema.parrainages.id });

  if (!deleted) {
    return NextResponse.json({ error: "parrainage_not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}, ["patron"]);
