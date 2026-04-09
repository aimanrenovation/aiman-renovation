import { NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { db, schema } from "@/lib/db/client";
import { getEmployeSession } from "@/lib/auth/session";
import { getChallenge } from "@/lib/auth/webauthn-challenges";
import { rpID, origin } from "@/lib/auth/webauthn-config";
import type { RegistrationResponseJSON } from "@simplewebauthn/server";

export async function POST(request: Request) {
  const session = await getEmployeSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: { response: RegistrationResponseJSON; deviceName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const expectedChallenge = await getChallenge(`reg:${session.sub}`);
  if (!expectedChallenge) {
    return NextResponse.json({ error: "challenge_expired" }, { status: 400 });
  }

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body.response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });
  } catch {
    return NextResponse.json({ error: "verification_failed" }, { status: 400 });
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: "verification_failed" }, { status: 400 });
  }

  const { credential } = verification.registrationInfo;

  // Store credential — publicKey is a Uint8Array, encode as base64url
  const publicKeyB64 = Buffer.from(credential.publicKey).toString("base64url");

  await db.insert(schema.webauthnCredentials).values({
    id: credential.id,
    employeId: session.sub,
    publicKey: publicKeyB64,
    counter: credential.counter,
    deviceName: body.deviceName ?? null,
    transports: credential.transports ?? null,
  });

  return NextResponse.json({ ok: true });
}
