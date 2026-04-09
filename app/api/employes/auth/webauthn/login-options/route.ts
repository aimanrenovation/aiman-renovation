import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { setChallenge } from "@/lib/auth/webauthn-challenges";
import { rpID } from "@/lib/auth/webauthn-config";

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { email } = body;
  if (!email) {
    return NextResponse.json({ error: "missing_email" }, { status: 400 });
  }

  const [employe] = await db
    .select({ id: schema.employes.id, actif: schema.employes.actif })
    .from(schema.employes)
    .where(eq(schema.employes.email, email))
    .limit(1);

  if (!employe || !employe.actif) {
    // Don't reveal whether the email exists — return generic options with no allowCredentials
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "preferred",
    });
    // Store with a fake key that won't match anything
    await setChallenge(`auth:__unknown__`, options.challenge);
    return NextResponse.json(options);
  }

  const credentials = await db
    .select({ id: schema.webauthnCredentials.id, transports: schema.webauthnCredentials.transports })
    .from(schema.webauthnCredentials)
    .where(eq(schema.webauthnCredentials.employeId, employe.id));

  if (credentials.length === 0) {
    // No passkeys registered — return generic options
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "preferred",
    });
    await setChallenge(`auth:__no_creds__`, options.challenge);
    return NextResponse.json(options);
  }

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
    allowCredentials: credentials.map((c) => ({
      id: c.id,
      transports: (c.transports as AuthenticatorTransport[] | null) ?? undefined,
    })),
  });

  await setChallenge(`auth:${employe.id}`, options.challenge);

  return NextResponse.json(options);
}
