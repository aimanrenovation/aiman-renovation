import { NextRequest, NextResponse } from "next/server";
import { resend, DEVIS_FROM_EMAIL, DEVIS_RECIPIENT_EMAIL } from "@/lib/email";
import { generateDevisEmailHtml } from "@/lib/email-templates/devis-confirmation";
import type { DevisState } from "@/components/devis/devis-types";
import { ZONES_CONFIG } from "@/components/devis/devis-zones-config";

export async function POST(request: NextRequest) {
  try {
    const data: DevisState = await request.json();

    // Validation basique
    if (
      !data.contact.firstName ||
      !data.contact.phone ||
      !data.contact.email
    ) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Au moins 1 travail sélectionné
    const hasWork = Object.values(data.selectedWorks).some(
      (works) => works && works.length > 0
    );
    if (!hasWork) {
      return NextResponse.json(
        { error: "Veuillez sélectionner au moins un travail" },
        { status: 400 }
      );
    }

    // Compter zones et travaux pour le subject
    const zonesWithWorks = ZONES_CONFIG.filter(
      (z) => data.selectedWorks[z.id] && data.selectedWorks[z.id].length > 0
    );
    const totalWorks = Object.values(data.selectedWorks).reduce(
      (sum, works) => sum + (works ? works.length : 0),
      0
    );
    const zonesShort = zonesWithWorks.map((z) => z.label).join(", ");

    // Email a Aiman Renovation
    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: DEVIS_RECIPIENT_EMAIL,
      subject: `Nouvelle demande de devis — ${data.contact.firstName} ${data.contact.lastName} — ${zonesWithWorks.length} zone(s), ${totalWorks} travaux — ${zonesShort}`,
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
