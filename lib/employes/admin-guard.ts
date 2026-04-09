import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { getEmployeSession } from "@/lib/auth/session";

/**
 * Ensures the visitor has a valid session, is an active employe,
 * and has the "patron" role. Redirects to dashboard otherwise.
 */
export async function requirePatron() {
  const session = await getEmployeSession();
  if (!session) redirect("/espace-employes/login");

  const [employe] = await db
    .select()
    .from(schema.employes)
    .where(eq(schema.employes.id, session.sub))
    .limit(1);

  if (!employe || !employe.actif) redirect("/espace-employes/login");
  if (employe.role !== "patron") redirect("/espace-employes/dashboard");

  return { session, employe };
}
