import { and, eq, gte, sql as dsql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  generateRefreshToken,
  signAccessToken,
  type EmployeRole,
} from "@/lib/auth/jwt";
import { verifyPassword } from "@/lib/auth/password";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/session";

const MAX_FAILS = 5;
const WINDOW_MINUTES = 15;

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  // Rate limit
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const fails = await db
    .select({ n: dsql<number>`count(*)::int` })
    .from(schema.loginAttempts)
    .where(
      and(
        eq(schema.loginAttempts.identifier, email),
        eq(schema.loginAttempts.success, false),
        gte(schema.loginAttempts.attemptedAt, since)
      )
    );
  if ((fails[0]?.n ?? 0) >= MAX_FAILS) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const [employe] = await db
    .select()
    .from(schema.employes)
    .where(eq(schema.employes.email, email))
    .limit(1);

  const recordAttempt = async (success: boolean) => {
    await db.insert(schema.loginAttempts).values({
      identifier: email,
      ip,
      success,
    });
  };

  if (!employe || !employe.actif) {
    await recordAttempt(false);
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, employe.passwordHash);
  if (!ok) {
    await recordAttempt(false);
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await recordAttempt(true);

  // Issue tokens
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

  const response = NextResponse.json({
    ok: true,
    employe: {
      id: employe.id,
      firstname: employe.firstname,
      lastname: employe.lastname,
      email: employe.email,
      role: employe.role,
      cguAccepted: !!employe.cguAcceptedAt,
      passwordMustChange: employe.passwordMustChange,
    },
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
  });

  response.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });
  response.cookies.set(REFRESH_COOKIE, refresh.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/employes/auth",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });

  return response;
}
