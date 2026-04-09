import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export const POST = requireAuth(async (request, _ctx, session) => {
  let body: { current_password?: string; new_password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { current_password, new_password } = body;
  if (!current_password || !new_password || new_password.length < 8) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  if (current_password === new_password) {
    return NextResponse.json({ error: "same_password" }, { status: 400 });
  }

  const [employe] = await db
    .select({ passwordHash: schema.employes.passwordHash })
    .from(schema.employes)
    .where(eq(schema.employes.id, session.sub))
    .limit(1);

  if (!employe) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const ok = await verifyPassword(current_password, employe.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "wrong_password" }, { status: 401 });
  }

  const hash = await hashPassword(new_password);
  await db
    .update(schema.employes)
    .set({ passwordHash: hash, passwordMustChange: false, updatedAt: new Date() })
    .where(eq(schema.employes.id, session.sub));

  return NextResponse.json({ ok: true });
});
