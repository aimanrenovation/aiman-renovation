import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  let body: { token?: string; new_password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const { token, new_password } = body;
  if (!token || !new_password || new_password.length < 8) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) return NextResponse.json({ error: "server_config" }, { status: 500 });

  let employeId: string;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (payload.purpose !== "reset" || typeof payload.sub !== "string") {
      return NextResponse.json({ error: "invalid_token" }, { status: 400 });
    }
    employeId = payload.sub;
  } catch {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  const hash = await hashPassword(new_password);
  await db
    .update(schema.employes)
    .set({ passwordHash: hash, updatedAt: new Date() })
    .where(eq(schema.employes.id, employeId));

  // Revoke all existing sessions for this employe
  await db
    .update(schema.employesSessions)
    .set({ revokedAt: new Date() })
    .where(eq(schema.employesSessions.employeId, employeId));

  return NextResponse.json({ ok: true });
}
