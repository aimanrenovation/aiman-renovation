import { NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { getChallenge } from "@/lib/auth/webauthn-challenges";
import { rpID, origin } from "@/lib/auth/webauthn-config";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  generateRefreshToken,
  signAccessToken,
  type EmployeRole,
} from "@/lib/auth/jwt";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/session";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server";

export async function POST(request: Request) {
  let body: { email?: string; response?: AuthenticationResponseJSON };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { email, response: authResponse } = body;
  if (!email || !authResponse) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // Find the employe
  const [employe] = await db
    .select()
    .from(schema.employes)
    .where(eq(schema.employes.email, email))
    .limit(1);

  if (!employe || !employe.actif) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  // Find the credential
  const credentialId = authResponse.id;
  const [credential] = await db
    .select()
    .from(schema.webauthnCredentials)
    .where(eq(schema.webauthnCredentials.id, credentialId))
    .limit(1);

  if (!credential || credential.employeId !== employe.id) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const expectedChallenge = await getChallenge(`auth:${employe.id}`);
  if (!expectedChallenge) {
    return NextResponse.json({ error: "challenge_expired" }, { status: 400 });
  }

  // Decode stored public key from base64url
  const publicKey = Buffer.from(credential.publicKey, "base64url");

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: authResponse,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
      credential: {
        id: credential.id,
        publicKey: new Uint8Array(publicKey),
        counter: credential.counter,
        transports: (credential.transports as AuthenticatorTransport[] | null) ?? undefined,
      },
    });
  } catch {
    return NextResponse.json({ error: "verification_failed" }, { status: 400 });
  }

  if (!verification.verified) {
    return NextResponse.json({ error: "verification_failed" }, { status: 400 });
  }

  // Update counter and lastUsedAt
  await db
    .update(schema.webauthnCredentials)
    .set({
      counter: verification.authenticationInfo.newCounter,
      lastUsedAt: new Date(),
    })
    .where(eq(schema.webauthnCredentials.id, credential.id));

  // Issue tokens — same logic as password login
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  const accessToken = await signAccessToken(employe.id, employe.role as EmployeRole);
  const refresh = generateRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  await db.insert(schema.employesSessions).values({
    employeId: employe.id,
    refreshTokenHash: refresh.hash,
    ip,
    userAgent,
    expiresAt,
  });

  const res = NextResponse.json({
    ok: true,
    employe: {
      id: employe.id,
      firstname: employe.firstname,
      lastname: employe.lastname,
      email: employe.email,
      role: employe.role,
      cguAccepted: !!employe.cguAcceptedAt,
    },
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
  });

  res.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });
  res.cookies.set(REFRESH_COOKIE, refresh.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/employes/auth",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });

  return res;
}
