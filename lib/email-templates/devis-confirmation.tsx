import type { DevisState } from "@/components/devis/devis-types";
import { ZONES_CONFIG } from "@/components/devis/devis-zones-config";

interface DevisEmailProps {
  data: DevisState;
  isClientCopy: boolean;
}

export function generateDevisEmailHtml({
  data,
  isClientCopy,
}: DevisEmailProps): string {
  const budgetLabels: Record<string, string> = {
    "< 5000": "Moins de 5 000 \u20AC",
    "5000-15000": "5 000 - 15 000 \u20AC",
    "15000-30000": "15 000 - 30 000 \u20AC",
    "30000-50000": "30 000 - 50 000 \u20AC",
    "> 50000": "Plus de 50 000 \u20AC",
  };

  // Build zones + work items HTML
  const zonesWithWorks = ZONES_CONFIG.filter(
    (z) => data.selectedWorks[z.id] && data.selectedWorks[z.id].length > 0
  );

  const worksHtml = zonesWithWorks
    .map((zone) => {
      const selectedIds = data.selectedWorks[zone.id];
      const workLabels = selectedIds
        .map((wId) => {
          const item = zone.workItems.find((wi) => wi.id === wId);
          return item ? item.label : wId;
        })
        .join(", ");
      return `<p style="margin: 4px 0;"><strong>${zone.label} :</strong> ${workLabels}</p>`;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: Inter, Arial, sans-serif; color: #0A0A0A; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0A0A0A; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FFFFFF; font-size: 24px; margin: 0; letter-spacing: 2px;">
          AIMAN RENOVATION
        </h1>
        <p style="color: #E50000; font-size: 14px; margin: 8px 0 0;">
          ${isClientCopy ? "Votre demande de devis" : "Nouvelle demande de devis"}
        </p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        ${isClientCopy ? '<p>Merci pour votre demande ! Voici le r\u00E9capitulatif. Nous vous recontactons sous 4 jours.</p>' : ""}

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Contact</h2>
        <p><strong>Nom :</strong> ${data.contact.firstName} ${data.contact.lastName}</p>
        <p><strong>T\u00E9l\u00E9phone :</strong> ${data.contact.phone}</p>
        <p><strong>Email :</strong> ${data.contact.email}</p>
        <p><strong>Adresse du chantier :</strong> ${data.contact.address || "Non renseign\u00E9"}</p>

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Travaux demand\u00E9s</h2>
        ${worksHtml}

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Budget</h2>
        <p>${data.budget ? budgetLabels[data.budget] || data.budget : "Non renseign\u00E9"}</p>

        ${data.message ? `<h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Message</h2><p>${data.message}</p>` : ""}

        <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            Aiman Renovation — Saint-Louis, 68300<br/>
            06 33 49 69 25 — contact@aiman-renovation.fr
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
