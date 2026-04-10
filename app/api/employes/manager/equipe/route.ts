import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireManager, isErrorResponse } from "@/lib/employes/manager-guard";

/** GET /api/employes/manager/equipe — list employes managed by current user */
export async function GET() {
  const result = await requireManager();
  if (isErrorResponse(result)) return result;

  const { managedEmployeIds } = result;

  if (managedEmployeIds.length === 0) {
    return NextResponse.json({ employes: [] });
  }

  const managed = await db
    .select({
      id: schema.employes.id,
      firstname: schema.employes.firstname,
      lastname: schema.employes.lastname,
      role: schema.employes.role,
      hourlyRateCents: schema.employes.hourlyRateCents,
    })
    .from(schema.employes)
    .where(eq(schema.employes.managerId, result.session.sub));

  return NextResponse.json({ employes: managed });
}
