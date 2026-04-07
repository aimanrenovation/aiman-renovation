import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/email";
import { notifyJarvis } from "@/lib/jarvis-notify";

const FROM_EMAIL = "contact@aiman-renovation.fr";
const TO_EMAIL = process.env.DEVIS_RECIPIENT_EMAIL || "contact@aiman-renovation.fr";

export async function POST(request: NextRequest) {
  try {
    const { nom, email, telephone, message } = await request.json();

    if (!nom || !email || !message) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    await resend.emails.send({
      from: `Aiman Renovation <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Nouveau message de ${nom}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#E50000">Nouveau message — Site web</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:120px">Nom</td><td style="padding:8px 0;font-weight:bold">${nom}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
            ${telephone ? `<tr><td style="padding:8px 0;color:#666">Téléphone</td><td style="padding:8px 0"><a href="tel:${telephone}">${telephone}</a></td></tr>` : ""}
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="white-space:pre-wrap;line-height:1.6">${message}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="color:#999;font-size:12px">Envoyé depuis aiman-renovation.fr</p>
        </div>
      `,
    });

    // Notify Jarvis (non-blocking)
    await notifyJarvis({
      type: "contact_received",
      name: nom,
      email,
      phone: telephone || "",
      message,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 });
  }
}
