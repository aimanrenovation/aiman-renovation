import { eq, sql, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { getEmployeSession } from "@/lib/auth/session";

/**
 * GET /api/employes/missions/classement
 * Returns top 5 employees by number of accepted missions.
 */
export async function GET() {
  const session = await getEmployeSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const rows = await db
    .select({
      employeId: schema.missionsUrgentes.acceptePar,
      nom: sql<string>`concat(${schema.employes.firstname}, ' ', ${schema.employes.lastname})`,
      count: sql<number>`count(*)::int`,
    })
    .from(schema.missionsUrgentes)
    .innerJoin(
      schema.employes,
      eq(schema.missionsUrgentes.acceptePar, schema.employes.id),
    )
    .where(eq(schema.missionsUrgentes.statut, "prise"))
    .groupBy(schema.missionsUrgentes.acceptePar, schema.employes.firstname, schema.employes.lastname)
    .orderBy(desc(sql`count(*)`))
    .limit(5);

  return NextResponse.json({ classement: rows });
}
