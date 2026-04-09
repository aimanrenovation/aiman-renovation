import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const chantierId = searchParams.get("chantier_id");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));

  if (!chantierId) {
    return NextResponse.json({ error: "missing_chantier_id" }, { status: 400 });
  }

  const offset = (page - 1) * limit;

  const [countRow] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(schema.photosChantier)
    .where(eq(schema.photosChantier.chantierId, chantierId));

  const photos = await db
    .select({
      id: schema.photosChantier.id,
      s3Key: schema.photosChantier.s3Key,
      caption: schema.photosChantier.caption,
      tags: schema.photosChantier.tags,
      priseLe: schema.photosChantier.priseLe,
      width: schema.photosChantier.width,
      height: schema.photosChantier.height,
      createdAt: schema.photosChantier.createdAt,
      employeFirstname: schema.employes.firstname,
      employeLastname: schema.employes.lastname,
    })
    .from(schema.photosChantier)
    .innerJoin(schema.employes, eq(schema.photosChantier.employeId, schema.employes.id))
    .where(eq(schema.photosChantier.chantierId, chantierId))
    .orderBy(desc(schema.photosChantier.priseLe), desc(schema.photosChantier.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({
    photos: photos.map((p) => ({
      id: p.id,
      s3Key: p.s3Key,
      url: `/api/employes/galerie/photo?key=${encodeURIComponent(p.s3Key)}`,
      caption: p.caption,
      tags: p.tags,
      priseLe: p.priseLe?.toISOString() ?? p.createdAt.toISOString(),
      width: p.width,
      height: p.height,
      employe: `${p.employeFirstname} ${p.employeLastname}`,
    })),
    total: countRow?.total ?? 0,
    page,
    limit,
  });
});
