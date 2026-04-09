import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { hashPassword } from "@/lib/auth/password";

/** POST /api/employes/admin/employes/[id]/reset-password — generate new password */
export const POST = requireAuth(async (_request, ctx) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  const [employe] = await db
    .select({ id: schema.employes.id, firstname: schema.employes.firstname, lastname: schema.employes.lastname })
    .from(schema.employes)
    .where(eq(schema.employes.id, id))
    .limit(1);

  if (!employe) {
    return NextResponse.json({ error: "employe_not_found" }, { status: 404 });
  }

  const plainPassword = randomBytes(8).toString("base64url");
  const passwordHash = await hashPassword(plainPassword);

  await db
    .update(schema.employes)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(schema.employes.id, id));

  return NextResponse.json({
    ok: true,
    employeId: employe.id,
    employeNom: `${employe.firstname} ${employe.lastname}`,
    newPassword: plainPassword,
  });
}, ["patron"]);
