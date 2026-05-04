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

    const contentType = request.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    let formData: FormData | null = null;
    let jsonBody: Record<string, unknown> | null = null;

    if (isJson) {
      jsonBody = await request.json();
    } else {
      formData = await request.formData();
    }

    // --- Honeypot — silent rejection ---
    const honeypot = formData ? formData.get("website") : null;
    if (typeof honeypot === "string" && honeypot.trim() !== "") {
      // Pretend success — bots don't get feedback
      return NextResponse.json({ success: true, magicplanProjectId: null });
    }

    let data: Omit<DevisState, "zonePhotos">;
    let locale: string;

    if (isJson && jsonBody) {
      // JSON callers (calculateur, wizard-2d) send a flat object
      // Normalise into the DevisState shape expected by email template
      const j = jsonBody as Record<string, unknown>;
      data = {
        contact: {
          firstName:
            (j.firstName as string) || (j.nom as string)?.split(" ")[0] || "",
          lastName:
            (j.lastName as string) ||
            (j.nom as string)?.split(" ").slice(1).join(" ") ||
            "",
          email: (j.email as string) || "",
          phone: (j.telephone as string) || (j.phone as string) || "",
          address: (j.address as string) || (j.ville as string) || "",
          addressValidated: true, // JSON callers don't geocode, trust them
        },
        selectedWorks: (j.selectedWorks as DevisState["selectedWorks"]) || {
          [(j.type_travaux as string) || "autre"]: [
            (j.type_travaux as string) || "travaux",
          ],
        },
        budget:
          (j.budget as string) ||
          (j.estimation_basse
            ? `${j.estimation_basse}–${j.estimation_haute}`
            : undefined),
        message: (j.message as string) || undefined,
        zoneNotes: {},
        zonePhotos: {},
      } as unknown as Omit<DevisState, "zonePhotos">;
      locale = (j.locale as string) || "fr";
    } else {
      const dataStr = formData!.get("data") as string;
      if (!dataStr) {
        return NextResponse.json(
          { error: "Donnees manquantes" },
          { status: 400 },
        );
      }
      data = JSON.parse(dataStr);
      locale = (formData!.get("locale") as string) || "fr";
    }

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
        {
          error: "validation_failed",
          field: contactCheck.field,
          code: contactCheck.code,
        },
        { status: 400 },
      );
    }

    const hasWork = Object.values(data.selectedWorks).some(
      (works) => works && works.length > 0,
    );
    if (!hasWork) {
      return NextResponse.json(
        { error: "Veuillez selectionner au moins un travail" },
        { status: 400 },
      );
    }

    // Recuperer les photos du FormData (only available for multipart submissions)
    const attachments: { filename: string; content: Buffer }[] = [];
    for (const [key, value] of (formData ?? new FormData()).entries()) {
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
      (z) => data.selectedWorks[z.id] && data.selectedWorks[z.id].length > 0,
    );
    const totalWorks = Object.values(data.selectedWorks).reduce(
      (sum, works) => sum + (works ? works.length : 0),
      0,
    );
    // Zone names in email subject always in French for Aiman
    const zonesShort = zonesWithWorks.map((z) => z.labelKey).join(", ");

    // Email a Aiman Renovation (avec photos) — always French
    const resendAiman = await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: DEVIS_RECIPIENT_EMAIL,
      subject: `Nouvelle demande de devis — ${data.contact.firstName} ${data.contact.lastName} — ${zonesWithWorks.length} zone(s), ${totalWorks} travaux — ${zonesShort}`,
      html: generateDevisEmailHtml({
        data: data as DevisState,
        isClientCopy: false,
        locale: "fr",
      }),
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    if (resendAiman.error) {
      console.error(
        "[Resend] Email Aiman FAILED:",
        JSON.stringify(resendAiman.error),
      );
      throw new Error(`Resend error (aiman): ${resendAiman.error.message}`);
    }
    console.log(
      "[Resend] Email Aiman sent OK — id:",
      resendAiman.data?.id,
      "to:",
      DEVIS_RECIPIENT_EMAIL,
      "from:",
      DEVIS_FROM_EMAIL,
    );

    // Email de confirmation au client (sans photos) — in client's locale
    const resendClient = await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: data.contact.email,
      subject:
        locale === "de"
          ? "Ihre Offerte-Anfrage — Aiman Renovation"
          : locale === "en"
            ? "Your quote request — Aiman Renovation"
            : "Votre demande de devis — Aiman Renovation",
      html: generateDevisEmailHtml({
        data: data as DevisState,
        isClientCopy: true,
        locale,
      }),
    });
    if (resendClient.error) {
      console.error(
        "[Resend] Email client FAILED:",
        JSON.stringify(resendClient.error),
      );
      throw new Error(`Resend error (client): ${resendClient.error.message}`);
    }
    console.log(
      "[Resend] Email client sent OK — id:",
      resendClient.data?.id,
      "to:",
      data.contact.email,
    );

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
      { status: 500 },
    );
  }
}
