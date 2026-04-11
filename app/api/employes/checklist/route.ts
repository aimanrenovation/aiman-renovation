import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import {
  CHECKLIST_TEMPLATES,
  detectChecklistType,
} from "@/lib/employes/checklists-templates";

// ---------- GET ----------
export const GET = requireAuth(async (request, _ctx, session) => {
  const { searchParams } = new URL(request.url);
  const pointageId = searchParams.get("pointage_id");

  if (!pointageId) {
    return NextResponse.json({ error: "pointage_id_required" }, { status: 400 });
  }

  // Check if a checklist already exists for this pointage
  const [existing] = await db
    .select()
    .from(schema.checklistsQualite)
    .where(eq(schema.checklistsQualite.pointageId, pointageId))
    .limit(1);

  if (existing) {
    return NextResponse.json({ checklist: existing });
  }

  // No existing checklist — build template items from the chantier name
  const [pointage] = await db
    .select({
      chantierId: schema.pointages.chantierId,
    })
    .from(schema.pointages)
    .where(eq(schema.pointages.id, pointageId))
    .limit(1);

  if (!pointage) {
    return NextResponse.json({ error: "pointage_not_found" }, { status: 404 });
  }

  const [chantier] = await db
    .select({ nom: schema.chantiers.nom })
    .from(schema.chantiers)
    .where(eq(schema.chantiers.id, pointage.chantierId))
    .limit(1);

  const chantierNom = chantier?.nom ?? "";
  const type = detectChecklistType(chantierNom);
  const template = CHECKLIST_TEMPLATES[type] ?? CHECKLIST_TEMPLATES.general;

  const items = template.items.map((label) => ({ label, checked: false }));

  return NextResponse.json({
    checklist: null,
    template: { type, label: template.label, items },
  });
});

// ---------- POST ----------
export const POST = requireAuth(async (request, _ctx, session) => {
  let body: { pointage_id: string; items: Array<{ label: string; checked: boolean }> };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!body.pointage_id || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // Fetch the pointage to get chantierId
  const [pointage] = await db
    .select({ chantierId: schema.pointages.chantierId })
    .from(schema.pointages)
    .where(eq(schema.pointages.id, body.pointage_id))
    .limit(1);

  if (!pointage) {
    return NextResponse.json({ error: "pointage_not_found" }, { status: 404 });
  }

  const allChecked = body.items.every((i) => i.checked);

  // Upsert: delete existing then insert
  await db
    .delete(schema.checklistsQualite)
    .where(eq(schema.checklistsQualite.pointageId, body.pointage_id));

  const [row] = await db
    .insert(schema.checklistsQualite)
    .values({
      pointageId: body.pointage_id,
      employeId: session.sub,
      chantierId: pointage.chantierId,
      items: body.items,
      completedAt: allChecked ? new Date() : null,
    })
    .returning();

  return NextResponse.json({ checklist: row });
});
