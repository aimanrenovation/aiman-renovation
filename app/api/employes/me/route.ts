import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async (_request, _ctx, session) => {
  const [employe] = await db
    .select({
      id: schema.employes.id,
      firstname: schema.employes.firstname,
      lastname: schema.employes.lastname,
      email: schema.employes.email,
      phone: schema.employes.phone,
      role: schema.employes.role,
      actif: schema.employes.actif,
      cguAcceptedAt: schema.employes.cguAcceptedAt,
      cguVersion: schema.employes.cguVersion,
      avatarUrl: schema.employes.avatarUrl,
    })
    .from(schema.employes)
    .where(eq(schema.employes.id, session.sub))
    .limit(1);

  if (!employe) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ employe });
});
