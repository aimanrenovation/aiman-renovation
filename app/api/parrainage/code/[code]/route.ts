import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";

type RouteCtx = { params: Promise<{ code: string }> };

/**
 * GET /api/parrainage/code/[code]
 * Chercher un parrainage par code (quand un prospect mentionne un code).
 * Route publique — pas de requireAuth.
 */
export async function GET(_request: Request, ctx: RouteCtx) {
  const { code } = await ctx.params;

  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  const [row] = await db
    .select({
      id: schema.parrainages.id,
      parrainNom: schema.parrainages.parrainNom,
      parrainPrenom: schema.parrainages.parrainPrenom,
      code: schema.parrainages.code,
      statut: schema.parrainages.statut,
      recompense: schema.parrainages.recompense,
      createdAt: schema.parrainages.createdAt,
    })
    .from(schema.parrainages)
    .where(eq(schema.parrainages.code, code));

  if (!row) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ parrainage: row });
}
