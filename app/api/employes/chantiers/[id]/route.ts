import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = requireAuth<RouteContext>(async (_request, ctx) => {
  const { id } = await ctx.params;
  const [chantier] = await db
    .select({
      id: schema.chantiers.id,
      nom: schema.chantiers.nom,
      adresse: schema.chantiers.adresse,
      ville: schema.chantiers.ville,
      codePostal: schema.chantiers.codePostal,
      latChantier: schema.chantiers.latChantier,
      lngChantier: schema.chantiers.lngChantier,
      radiusM: schema.chantiers.radiusM,
      statut: schema.chantiers.statut,
    })
    .from(schema.chantiers)
    .where(eq(schema.chantiers.id, id))
    .limit(1);

  if (!chantier) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ chantier });
});
