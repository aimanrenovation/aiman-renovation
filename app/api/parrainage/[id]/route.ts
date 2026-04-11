import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

type RouteCtx = { params: Promise<{ id: string }> };

/**
 * GET /api/parrainage/[id]
 * Détails d'un parrainage.
 */
export const GET = requireAuth(async (_request, ctx: RouteCtx) => {
  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const [row] = await db
    .select()
    .from(schema.parrainages)
    .where(eq(schema.parrainages.id, id));

  if (!row) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ parrainage: row });
});

/**
 * PATCH /api/parrainage/[id]
 * Mettre à jour un parrainage (ajouter filleul, changer statut, etc.).
 */
export const PATCH = requireAuth(async (request, ctx: RouteCtx) => {
  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Only allow specific fields to be updated
  const allowedFields = new Set([
    "filleulNom",
    "filleulPhone",
    "filleulEmail",
    "filleulChantierId",
    "statut",
    "recompense",
    "recompenseRemise",
    "messageEnvoyeAt",
    "relanceEnvoyeeAt",
  ]);

  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (allowedFields.has(key)) {
      updates[key] = value;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no_valid_fields" }, { status: 400 });
  }

  const [updated] = await db
    .update(schema.parrainages)
    .set(updates)
    .where(eq(schema.parrainages.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, parrainage: updated });
});
