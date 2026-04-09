import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { getEmployeSession } from "@/lib/auth/session";
import { setChallenge } from "@/lib/auth/webauthn-challenges";
import { rpName, rpID } from "@/lib/auth/webauthn-config";

export async function GET() {
  const session = await getEmployeSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const [employe] = await db
    .select({ id: schema.employes.id, firstname: schema.employes.firstname, lastname: schema.employes.lastname, email: schema.employes.email })
    .from(schema.employes)
    .where(eq(schema.employes.id, session.sub))
    .limit(1);

  if (!employe) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Get existing credentials for exclusion
  const existingCreds = await db
    .select({ id: schema.webauthnCredentials.id, transports: schema.webauthnCredentials.transports })
    .from(schema.webauthnCredentials)
    .where(eq(schema.webauthnCredentials.employeId, employe.id));

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: employe.email,
    userDisplayName: `${employe.firstname} ${employe.lastname}`,
    attestationType: "none",
    excludeCredentials: existingCreds.map((c) => ({
      id: c.id,
      transports: (c.transports as AuthenticatorTransport[] | null) ?? undefined,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
      authenticatorAttachment: "platform",
    },
  });

  await setChallenge(`reg:${session.sub}`, options.challenge);

  return NextResponse.json(options);
}
