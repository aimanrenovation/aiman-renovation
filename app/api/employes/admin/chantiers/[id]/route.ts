import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const PATCH = requireAuth(async (request, ctx) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const allowed = ["nom", "clientNom", "clientEmail", "clientPhone", "adresse", "ville", "codePostal", "dateDebut", "dateFinPrevue", "dateFinReelle", "statut", "budgetPrevuCents", "budgetReelCents"] as const;
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no_updates" }, { status: 400 });
  }

  const [updated] = await db
    .update(schema.chantiers)
    .set(updates)
    .where(eq(schema.chantiers.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ chantier: updated });
}, ["patron"]);
