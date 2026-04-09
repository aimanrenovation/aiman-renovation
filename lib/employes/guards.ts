import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { getEmployeSession } from "@/lib/auth/session";
import { CGU_CURRENT_VERSION } from "./cgu-version";

/**
 * Ensures the visitor has a valid session AND up-to-date CGU acceptance.
 * Redirects otherwise. Returns the employe row when OK.
 */
export async function requireActiveEmploye() {
  const session = await getEmployeSession();
  if (!session) redirect("/espace-employes/login");

  const [employe] = await db
    .select()
    .from(schema.employes)
    .where(eq(schema.employes.id, session.sub))
    .limit(1);

  if (!employe || !employe.actif) redirect("/espace-employes/login");

  if (!employe.cguAcceptedAt || employe.cguVersion !== CGU_CURRENT_VERSION) {
    redirect("/espace-employes/cgu");
  }

  return { session, employe };
}
