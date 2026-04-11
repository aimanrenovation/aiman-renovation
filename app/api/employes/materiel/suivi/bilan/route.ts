import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async (request, _ctx, _session) => {
  const url = new URL(request.url);
  const chantierId = url.searchParams.get("chantier_id");

  if (!chantierId) {
    return NextResponse.json({ error: "missing_chantier_id" }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(schema.suiviMateriel)
    .where(eq(schema.suiviMateriel.chantierId, chantierId))
    .orderBy(schema.suiviMateriel.createdAt);

  let totalGaspillage = 0;
  let totalEconomie = 0;

  const items = rows.map((r) => {
    const ecart = r.quantiteUtilisee - r.quantitePrevue;
    const gaspillage = ecart > 0;
    if (gaspillage) totalGaspillage++;
    if (ecart < 0) totalEconomie++;

    return {
      id: r.id,
      materiau: r.materiau,
      prevu: r.quantitePrevue,
      utilise: r.quantiteUtilisee,
      unite: r.unite,
      ecart,
      gaspillage,
    };
  });

  return NextResponse.json({ items, totalGaspillage, totalEconomie });
});
