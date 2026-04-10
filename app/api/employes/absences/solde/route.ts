import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { getEmployeSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getEmployeSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let [solde] = await db
    .select()
    .from(schema.soldeConges)
    .where(eq(schema.soldeConges.employeId, session.sub))
    .limit(1);

  // Auto-create with defaults if no record exists
  if (!solde) {
    [solde] = await db
      .insert(schema.soldeConges)
      .values({ employeId: session.sub })
      .returning();
  }

  const joursAcquis = parseFloat(solde.joursAcquis);
  const joursPris = parseFloat(solde.joursPris);

  return NextResponse.json({
    solde: {
      ...solde,
      joursRestants: joursAcquis - joursPris,
    },
  });
}
