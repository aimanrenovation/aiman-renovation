import { NextRequest, NextResponse } from "next/server";
import { resend, DEVIS_FROM_EMAIL, DEVIS_RECIPIENT_EMAIL } from "@/lib/email";
import { generateDevisEmailHtml } from "@/lib/email-templates/devis-confirmation";
import type { DevisState } from "@/components/devis/devis-types";
import { ZONES_CONFIG } from "@/components/devis/devis-zones-config";
import { createMagicPlanProject } from "@/lib/magicplan";
import { notifyJarvis } from "@/lib/jarvis-notify";
import {
  validateContactServer,
  checkRateLimit,
  getClientIp,
} from "@/lib/validation/devis-server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // --- Rate limit (per IP, 3/hour) ---
    const ip = getClientIp(request.headers);
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "rate_limited", code: "rate_limited" },
        { status: 429 },
      );
    }

    const formData = await request.formData();

    // --- Honeypot — silent rejection ---
    const honeypot = formData.get("website");
    if (typeof honeypot === "string" && honeypot.trim() !== "") {
      // Pretend success — bots don't get feedback
      return NextResponse.json({ success: true, magicplanProjectId: null });
    }

    const dataStr = formData.get("data") as string;
    if (!dataStr) {
      return NextResponse.json({ error: "Donnees manquantes" }, { status: 400 });
    }

    const data: Omit<DevisState, "zonePhotos"> = JSON.parse(dataStr);
    const locale = (formData.get("locale") as string) || "fr";

    // --- Strict server-side contact validation ---
    const contactCheck = await validateContactServer({
      firstName: data.contact.firstName,
      lastName: data.contact.lastName,
      email: data.contact.email,
      phone: data.contact.phone,
      address: data.contact.address,
      addressValidated: data.contact.addressValidated,
    });
    if (!contactCheck.ok) {
      return NextResponse.json(
        { error: "validation_failed", field: contactCheck.field, code: contactCheck.code },
        { status: 400 },
      );
    }

    const hasWork = Object.values(data.selectedWorks).some(
      (works) => works && works.length > 0
    );
    if (!hasWork) {
      return NextResponse.json({ error: "Veuillez selectionner au moins un travail" }, { status: 400 });
    }

    // Recuperer les photos du FormData
    const attachments: { filename: string; content: Buffer }[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("photo_") && value instanceof File) {
        const zoneId = key.replace("photo_", "");
        const zone = ZONES_CONFIG.find((z) => z.id === zoneId);
        // Use French label for filenames (always readable by Aiman)
        const zoneName = zone?.labelKey ?? zoneId;
        const bytes = await value.arrayBuffer();
        attachments.push({
          filename: `${zoneName} - ${value.name}`,
          content: Buffer.from(bytes),
        });
      }
    }

    // Compter zones et travaux
    const zonesWithWorks = ZONES_CONFIG.filter(
      (z) => data.selectedWorks[z.id] && data.selectedWorks[z.id].length > 0
    );
    const totalWorks = Object.values(data.selectedWorks).reduce(
      (sum, works) => sum + (works ? works.length : 0),
      0
    );
    // Zone names in email subject always in French for Aiman
    const zonesShort = zonesWithWorks.map((z) => z.labelKey).join(", ");

    // Email a Aiman Renovation (avec photos) — always French
    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: DEVIS_RECIPIENT_EMAIL,
      subject: `Nouvelle demande de devis — ${data.contact.firstName} ${data.contact.lastName} — ${zonesWithWorks.length} zone(s), ${totalWorks} travaux — ${zonesShort}`,
      html: generateDevisEmailHtml({ data: data as DevisState, isClientCopy: false, locale: "fr" }),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    // Email de confirmation au client (sans photos) — in client's locale
    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: data.contact.email,
      subject: locale === "de"
        ? "Ihre Offerte-Anfrage — Aiman Renovation"
        : locale === "en"
          ? "Your quote request — Aiman Renovation"
          : "Votre demande de devis — Aiman Renovation",
      html: generateDevisEmailHtml({ data: data as DevisState, isClientCopy: true, locale }),
    });

    // Create a MagicPlan project with the CLIENT's email so MagicPlan invites
    // them to join. The project is visible in AIMAN's account (via customer_id
    // headers) AND accessible to the client through their own MagicPlan
    // account. When the client scans and exports, the webhook notifies AIMAN
    // automatically with the plan files.
    let magicplanProjectId: string | null = null;
    try {
      const refId = `devis-${Date.now()}`;
      const project = await createMagicPlanProject({
        name: `${data.contact.firstName} ${data.contact.lastName}`,
        clientEmail: data.contact.email,
        externalReferenceId: refId,
        address: data.contact.address,
      });
      magicplanProjectId = project.id;
    } catch (err) {
      console.error("MagicPlan project creation failed (non-blocking):", err);
    }

    // Notify Jarvis (non-blocking)
    await notifyJarvis({
      type: "devis_received",
      client: `${data.contact.firstName} ${data.contact.lastName}`,
      phone: data.contact.phone,
      email: data.contact.email,
      address: data.contact.address,
      works_count: totalWorks,
      zones_count: zonesWithWorks.length,
      zones: zonesShort,
      budget: data.budget ?? "N/A",
    });

    return NextResponse.json({
      success: true,
      magicplanProjectId,
    });
  } catch (error) {
    console.error("Erreur envoi devis:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du devis" },
      { status: 500 }
    );
  }
}
