import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { dispatchJarvisEvent } from "@/lib/jarvis/webhook";

/**
 * POST /api/employes/missions/[id]/accepter
 * Premier arrivé, premier servi. Race condition gérée via WHERE statut='ouverte'.
 */
export const POST = requireAuth(
  async (_request, ctx: { params: Promise<{ id: string }> }, session) => {
    const { id: missionId } = await ctx.params;

    if (!missionId) {
      return NextResponse.json({ error: "missing_id" }, { status: 400 });
    }

    const [updated] = await db
      .update(schema.missionsUrgentes)
      .set({
        statut: "prise",
        acceptePar: session.sub,
        accepteLe: sql`now()`,
      })
      .where(
        and(
          eq(schema.missionsUrgentes.id, missionId),
          eq(schema.missionsUrgentes.statut, "ouverte"),
        ),
      )
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "mission_deja_prise_ou_expiree" },
        { status: 409 },
      );
    }

    dispatchJarvisEvent({
      type: "mission_urgente_acceptee" as never,
      employe_id: session.sub,
      chantier_id: updated.chantierId ?? "",
      timestamp: new Date().toISOString(),
      data: {
        missionId: updated.id,
        titre: updated.titre,
      },
    });

    return NextResponse.json({ ok: true, mission: updated });
  },
);
