import { and, eq, gt, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, schema } from "@/lib/db/client";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
  type EmployeRole,
} from "@/lib/auth/jwt";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/session";

export async function POST() {
  const store = await cookies();
  const currentRefresh = store.get(REFRESH_COOKIE)?.value;
  if (!currentRefresh) {
    return NextResponse.json({ error: "no_refresh_cookie" }, { status: 401 });
  }

  const hash = hashRefreshToken(currentRefresh);
  const now = new Date();
  const [session] = await db
    .select()
    .from(schema.employesSessions)
    .where(
      and(
        eq(schema.employesSessions.refreshTokenHash, hash),
        isNull(schema.employesSessions.revokedAt),
        gt(schema.employesSessions.expiresAt, now)
      )
    )
    .limit(1);

  if (!session) {
    return NextResponse.json({ error: "invalid_refresh" }, { status: 401 });
  }

  const [employe] = await db
    .select()
    .from(schema.employes)
    .where(eq(schema.employes.id, session.employeId))
    .limit(1);

  if (!employe || !employe.actif) {
    return NextResponse.json({ error: "invalid_account" }, { status: 401 });
  }

  // Rotate refresh token
  const newRefresh = generateRefreshToken();
  const newExpires = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  await db
    .update(schema.employesSessions)
    .set({ revokedAt: now })
    .where(eq(schema.employesSessions.id, session.id));

  await db.insert(schema.employesSessions).values({
    employeId: employe.id,
    refreshTokenHash: newRefresh.hash,
    ip: session.ip,
    userAgent: session.userAgent,
    expiresAt: newExpires,
  });

  const accessToken = await signAccessToken(employe.id, employe.role as EmployeRole);

  const response = NextResponse.json({
    ok: true,
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
  });
  response.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });
  response.cookies.set(REFRESH_COOKIE, newRefresh.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/employes/auth",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });
  return response;
}
