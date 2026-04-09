import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

/** PATCH /api/employes/admin/employes/[id] — update employe fields */
export const PATCH = requireAuth(async (request, ctx) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Only allow updating specific fields
  const allowedFields = ["actif", "role", "hourlyRateCents", "phone", "firstname", "lastname"] as const;
  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no_fields_to_update" }, { status: 400 });
  }

  // Validate role if provided
  if (updates.role) {
    const validRoles = ["employe", "chef_chantier", "patron"];
    if (!validRoles.includes(updates.role as string)) {
      return NextResponse.json({ error: "invalid_role" }, { status: 400 });
    }
  }

  updates.updatedAt = new Date();

  const [updated] = await db
    .update(schema.employes)
    .set(updates)
    .where(eq(schema.employes.id, id))
    .returning({
      id: schema.employes.id,
      firstname: schema.employes.firstname,
      lastname: schema.employes.lastname,
      email: schema.employes.email,
      phone: schema.employes.phone,
      role: schema.employes.role,
      hourlyRateCents: schema.employes.hourlyRateCents,
      actif: schema.employes.actif,
      updatedAt: schema.employes.updatedAt,
    });

  if (!updated) {
    return NextResponse.json({ error: "employe_not_found" }, { status: 404 });
  }

  return NextResponse.json({ employe: updated });
}, ["patron"]);
