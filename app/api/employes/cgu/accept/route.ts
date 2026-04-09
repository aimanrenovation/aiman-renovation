import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { CGU_CURRENT_VERSION } from "@/lib/employes/cgu-version";

export const POST = requireAuth(async (_request, _ctx, session) => {
  await db
    .update(schema.employes)
    .set({
      cguAcceptedAt: new Date(),
      cguVersion: CGU_CURRENT_VERSION,
      updatedAt: new Date(),
    })
    .where(eq(schema.employes.id, session.sub));

  return NextResponse.json({ ok: true, version: CGU_CURRENT_VERSION });
});
