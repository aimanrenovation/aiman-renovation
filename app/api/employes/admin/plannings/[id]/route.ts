import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { dispatchJarvisEvent } from "@/lib/jarvis/webhook";

export const PATCH = requireAuth(async (request, ctx) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const allowed = ["employeId", "chantierId", "date", "heureDebut", "heureFin", "mission", "statut"] as const;
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no_updates" }, { status: 400 });
  }

  const [updated] = await db
    .update(schema.plannings)
    .set(updates)
    .where(eq(schema.plannings.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  dispatchJarvisEvent({
    type: "planning_modifie",
    employe_id: updated.employeId,
    chantier_id: updated.chantierId,
    timestamp: new Date().toISOString(),
    data: {
      planningId: updated.id,
      date: updated.date,
      action: "updated",
    },
  });

  return NextResponse.json({ planning: updated });
}, ["patron"]);

export const DELETE = requireAuth(async (_request, ctx) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  // Fetch before delete to get employe/chantier IDs for webhook
  const [existing] = await db
    .select({ employeId: schema.plannings.employeId, chantierId: schema.plannings.chantierId, date: schema.plannings.date })
    .from(schema.plannings)
    .where(eq(schema.plannings.id, id))
    .limit(1);

  const [deleted] = await db
    .delete(schema.plannings)
    .where(eq(schema.plannings.id, id))
    .returning({ id: schema.plannings.id });

  if (!deleted) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (existing) {
    dispatchJarvisEvent({
      type: "planning_modifie",
      employe_id: existing.employeId,
      chantier_id: existing.chantierId,
      timestamp: new Date().toISOString(),
      data: { planningId: id, date: existing.date, action: "deleted" },
    });
  }

  return NextResponse.json({ deleted: true });
}, ["patron"]);
