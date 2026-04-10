import { and, eq, ne, gt, sql, count } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

export const GET = requireAuth(async (_request, _ctx, session) => {
  const employeId = session.sub;

  // Unread messages: messages NOT sent by current user, not yet read,
  // in chantiers where the employee has plannings
  const [msgRow] = await db
    .select({ n: count() })
    .from(schema.messagesChantier)
    .where(
      and(
        ne(schema.messagesChantier.employeId, employeId),
        eq(schema.messagesChantier.lu, false),
        sql`${schema.messagesChantier.chantierId} IN (
          SELECT DISTINCT ${schema.plannings.chantierId}
          FROM ${schema.plannings}
          WHERE ${schema.plannings.employeId} = ${employeId}
        )`
      )
    );

  // Open missions: missions urgentes with statut = 'ouverte'
  const [missionRow] = await db
    .select({ n: count() })
    .from(schema.missionsUrgentes)
    .where(
      and(
        eq(schema.missionsUrgentes.statut, "ouverte"),
        gt(schema.missionsUrgentes.dateLimite, sql`now()`)
      )
    );

  return NextResponse.json({
    unreadMessages: msgRow?.n ?? 0,
    openMissions: missionRow?.n ?? 0,
  });
});
