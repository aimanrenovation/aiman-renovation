import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { getEmployeSession } from "@/lib/auth/session";
import type { AccessClaims } from "@/lib/auth/jwt";

/**
 * Ensures the caller has a valid session with role "chef_chantier" or "patron",
 * and returns the list of employe IDs they manage.
 */
export async function requireManager(): Promise<{
  session: AccessClaims;
  employe: typeof schema.employes.$inferSelect;
  managedEmployeIds: string[];
} | NextResponse> {
  const session = await getEmployeSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  if (session.role !== "chef_chantier" && session.role !== "patron") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const [employe] = await db
    .select()
    .from(schema.employes)
    .where(eq(schema.employes.id, session.sub))
    .limit(1);

  if (!employe || !employe.actif) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const managed = await db
    .select({ id: schema.employes.id })
    .from(schema.employes)
    .where(eq(schema.employes.managerId, session.sub));

  const managedEmployeIds = managed.map((e) => e.id);

  return { session, employe, managedEmployeIds };
}

/**
 * Type guard: check if requireManager() returned an error response.
 */
export function isErrorResponse(
  result: Awaited<ReturnType<typeof requireManager>>
): result is NextResponse {
  return result instanceof NextResponse;
}
