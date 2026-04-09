import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { hashPassword } from "@/lib/auth/password";
import { randomBytes } from "node:crypto";

/** GET /api/employes/admin/employes — list all employes */
export const GET = requireAuth(async () => {
  const rows = await db
    .select({
      id: schema.employes.id,
      firstname: schema.employes.firstname,
      lastname: schema.employes.lastname,
      email: schema.employes.email,
      phone: schema.employes.phone,
      role: schema.employes.role,
      hourlyRateCents: schema.employes.hourlyRateCents,
      actif: schema.employes.actif,
      createdAt: schema.employes.createdAt,
    })
    .from(schema.employes)
    .orderBy(desc(schema.employes.createdAt));

  return NextResponse.json({ employes: rows });
}, ["patron"]);

/** POST /api/employes/admin/employes — create an employe */
export const POST = requireAuth(async (request) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { firstname, lastname, email, phone, role, hourlyRateCents } = body as {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    role?: string;
    hourlyRateCents?: number;
  };

  if (!firstname || !lastname || !email) {
    return NextResponse.json(
      { error: "missing_fields", required: ["firstname", "lastname", "email"] },
      { status: 400 }
    );
  }

  const validRoles = ["employe", "chef_chantier", "patron"];
  if (role && !validRoles.includes(role)) {
    return NextResponse.json({ error: "invalid_role" }, { status: 400 });
  }

  // Generate a random password
  const plainPassword = randomBytes(8).toString("base64url");
  const passwordHash = await hashPassword(plainPassword);

  try {
    const [created] = await db
      .insert(schema.employes)
      .values({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        role: role || "employe",
        hourlyRateCents: hourlyRateCents ?? null,
        passwordHash,
      })
      .returning({
        id: schema.employes.id,
        firstname: schema.employes.firstname,
        lastname: schema.employes.lastname,
        email: schema.employes.email,
        role: schema.employes.role,
        createdAt: schema.employes.createdAt,
      });

    return NextResponse.json({ employe: created, tempPassword: plainPassword }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "email_already_exists" }, { status: 409 });
    }
    throw err;
  }
}, ["patron"]);
