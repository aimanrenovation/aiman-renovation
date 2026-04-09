import { eq } from "drizzle-orm";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";

const RESET_TTL_SECONDS = 60 * 60; // 1h

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true }); // anti-énumération
  }
  const email = body.email?.trim().toLowerCase();
  if (!email) return NextResponse.json({ ok: true });

  const [employe] = await db
    .select()
    .from(schema.employes)
    .where(eq(schema.employes.email, email))
    .limit(1);

  // Always 200 to avoid account enumeration.
  if (!employe || !employe.actif) return NextResponse.json({ ok: true });

  const secret = process.env.JWT_SECRET;
  if (!secret) return NextResponse.json({ ok: true });

  const token = await new SignJWT({ purpose: "reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(employe.id)
    .setIssuedAt()
    .setExpirationTime(`${RESET_TTL_SECONDS}s`)
    .sign(new TextEncoder().encode(secret));

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiman-renovation.fr"}/espace-employes/reset-password?token=${token}`;

  // Send email via Resend
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? "Aiman Rénovation <noreply@aiman-renovation.fr>",
          to: employe.email,
          subject: "Réinitialisation de votre mot de passe — Espace équipe",
          html: `<p>Bonjour ${employe.firstname},</p>
            <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe (valable 1h) :</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`,
        }),
      });
      if (!resendRes.ok) {
        const errBody = await resendRes.text().catch(() => "");
        console.error(`[reset-password] Resend error ${resendRes.status}: ${errBody}`);
      }
    } else {
      console.error("[reset-password] RESEND_API_KEY not set");
    }
  } catch (err) {
    console.error("[reset-password] Failed to send email:", err);
  }

  return NextResponse.json({ ok: true });
}
