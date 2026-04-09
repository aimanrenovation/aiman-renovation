import { and, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, schema } from "@/lib/db/client";
import { hashRefreshToken } from "@/lib/auth/jwt";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/session";

export async function POST(request: Request) {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    const hash = hashRefreshToken(refreshToken);
    await db
      .update(schema.employesSessions)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(schema.employesSessions.refreshTokenHash, hash),
          isNull(schema.employesSessions.revokedAt)
        )
      );
  }

  const response = NextResponse.redirect(new URL("/espace-employes/login", request.url));
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete({ name: REFRESH_COOKIE, path: "/api/employes/auth" });
  return response;
}
