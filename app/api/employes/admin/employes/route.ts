import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
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

  const normalizedEmail = email.trim().toLowerCase();

  // Check if a deactivated account with this email exists — reactivate it
  const [existing] = await db
    .select({ id: schema.employes.id, actif: schema.employes.actif })
    .from(schema.employes)
    .where(eq(schema.employes.email, normalizedEmail))
    .limit(1);

  const plainPassword = randomBytes(8).toString("base64url");
  const passwordHash = await hashPassword(plainPassword);

  if (existing && !existing.actif) {
    const [reactivated] = await db
      .update(schema.employes)
      .set({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        phone: phone?.trim() || null,
        role: role || "employe",
        hourlyRateCents: hourlyRateCents ?? null,
        passwordHash,
        actif: true,
        passwordMustChange: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.employes.id, existing.id))
      .returning({
        id: schema.employes.id,
        firstname: schema.employes.firstname,
        lastname: schema.employes.lastname,
        email: schema.employes.email,
        role: schema.employes.role,
        createdAt: schema.employes.createdAt,
      });

    return NextResponse.json({ employe: reactivated, tempPassword: plainPassword, reactivated: true }, { status: 201 });
  }

  if (existing) {
    return NextResponse.json({ error: "email_already_exists" }, { status: 409 });
  }

  const [created] = await db
    .insert(schema.employes)
    .values({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || null,
      role: role || "employe",
      hourlyRateCents: hourlyRateCents ?? null,
      passwordHash,
      passwordMustChange: true,
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
}, ["patron"]);
