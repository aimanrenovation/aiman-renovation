import { NextRequest, NextResponse } from "next/server";
import { resend, DEVIS_FROM_EMAIL, DEVIS_RECIPIENT_EMAIL } from "@/lib/email";
import { generateDevisEmailHtml } from "@/lib/email-templates/devis-confirmation";
import type { DevisFormState } from "@/components/devis/devis-types";

export async function POST(request: NextRequest) {
  try {
    const data: DevisFormState = await request.json();

    // Validation basique
    if (
      !data.contact.email ||
      !data.contact.firstName ||
      !data.contact.phone ||
      data.selectedZones.length === 0
    ) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const zonesLabels: Record<string, string> = {
      cuisine: "Cuisine",
      "salle-de-bain": "SDB",
      facade: "Facade",
      toit: "Toit",
      garage: "Garage",
      exterieur: "Exterieur",
    };

    const zonesShort = data.selectedZones
      .map((z) => zonesLabels[z] || z)
      .join(", ");

    // Email a Aiman Renovation
    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: DEVIS_RECIPIENT_EMAIL,
      subject: `Nouvelle demande de devis — ${data.contact.firstName} ${data.contact.lastName} — ${zonesShort}`,
      html: generateDevisEmailHtml({ data, isClientCopy: false }),
    });

    // Email de confirmation au client
    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: data.contact.email,
      subject: "Votre demande de devis — Aiman Renovation",
      html: generateDevisEmailHtml({ data, isClientCopy: true }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi devis:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du devis" },
      { status: 500 }
    );
  }
}
