import { NextResponse } from "next/server";
import { and, eq, gte, lt } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async (request, _ctx, session) => {
  const { searchParams } = new URL(request.url);
  const chantierId = searchParams.get("chantier_id");
  const dateStr = searchParams.get("date");

  if (!chantierId || !dateStr) {
    return NextResponse.json(
      { error: "missing_chantier_id_or_date" },
      { status: 400 },
    );
  }

  // Validate date format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  }

  const dayStart = new Date(`${dateStr}T00:00:00Z`);
  const dayEnd = new Date(`${dateStr}T23:59:59.999Z`);

  const rows = await db
    .select({ tags: schema.photosChantier.tags })
    .from(schema.photosChantier)
    .where(
      and(
        eq(schema.photosChantier.employeId, session.sub),
        eq(schema.photosChantier.chantierId, chantierId),
        gte(schema.photosChantier.priseLe, dayStart),
        lt(schema.photosChantier.priseLe, dayEnd),
      ),
    );

  let avant = 0;
  let apres = 0;

  for (const row of rows) {
    const tags = row.tags;
    if (Array.isArray(tags)) {
      if (tags.includes("avant")) avant++;
      if (tags.includes("apres")) apres++;
    }
  }

  return NextResponse.json({ avant, apres, canStop: apres > 0 });
});
