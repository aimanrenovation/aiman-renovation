import type { DevisState } from "@/components/devis/devis-types";
import { ZONES_CONFIG } from "@/components/devis/devis-zones-config";

interface GenerateEmailProps {
  data: DevisState;
  isClientCopy: boolean;
}

export function generateDevisEmailHtml({ data, isClientCopy }: GenerateEmailProps): string {
  const zonesWithWorks = ZONES_CONFIG.filter(
    (z) => data.selectedWorks[z.id] && data.selectedWorks[z.id].length > 0
  );

  const totalWorks = zonesWithWorks.reduce(
    (sum, z) => sum + data.selectedWorks[z.id].length,
    0
  );

  const zonesHtml = zonesWithWorks
    .map((zone) => {
      const works = data.selectedWorks[zone.id]
        .map((workId) => {
          const item = zone.workItems.find((w) => w.id === workId);
          return item?.label ?? workId;
        })
        .join(", ");

      const note = data.zoneNotes[zone.id];
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;font-weight:600;vertical-align:top;width:160px;color:#333;">
            ${zone.label}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;color:#555;">
            ${works}${note ? `<br/><span style="color:#888;font-size:13px;">Note : ${note}</span>` : ""}
          </td>
        </tr>`;
    })
    .join("");

  const title = isClientCopy
    ? "Votre demande de devis a bien été envoyée"
    : `Nouveau devis — ${data.contact.firstName} ${data.contact.lastName}`;

  const intro = isClientCopy
    ? `<p style="color:#555;font-size:15px;line-height:1.6;">Bonjour ${data.contact.firstName},<br/>Nous avons bien reçu votre demande. Voici le récapitulatif. Nous vous recontactons sous 24h.</p>`
    : `<p style="color:#555;font-size:15px;line-height:1.6;">Nouvelle demande reçue depuis le site.</p>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <!-- Header -->
      <div style="background:#E50000;padding:24px 32px;">
        <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;">${title}</h1>
      </div>

      <div style="padding:24px 32px;">
        ${intro}

        <!-- Contact -->
        <h2 style="font-size:16px;color:#333;margin:24px 0 12px;border-bottom:2px solid #E50000;padding-bottom:8px;">Coordonnées</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#888;width:120px;">Nom</td><td style="padding:6px 0;color:#333;">${data.contact.firstName} ${data.contact.lastName}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Téléphone</td><td style="padding:6px 0;color:#333;"><a href="tel:${data.contact.phone}" style="color:#E50000;">${data.contact.phone}</a></td></tr>
          <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;color:#333;"><a href="mailto:${data.contact.email}" style="color:#E50000;">${data.contact.email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#888;">Adresse chantier</td><td style="padding:6px 0;color:#333;">${data.contact.address}</td></tr>
        </table>

        <!-- Travaux -->
        <h2 style="font-size:16px;color:#333;margin:24px 0 12px;border-bottom:2px solid #E50000;padding-bottom:8px;">
          Travaux demandés — ${totalWorks} travaux / ${zonesWithWorks.length} zone${zonesWithWorks.length > 1 ? "s" : ""}
        </h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${zonesHtml}
        </table>

        ${data.budget ? `
        <h2 style="font-size:16px;color:#333;margin:24px 0 12px;border-bottom:2px solid #E50000;padding-bottom:8px;">Budget</h2>
        <p style="color:#333;font-size:15px;">${data.budget} €</p>
        ` : ""}

        ${data.message ? `
        <h2 style="font-size:16px;color:#333;margin:24px 0 12px;border-bottom:2px solid #E50000;padding-bottom:8px;">Message</h2>
        <p style="color:#555;font-size:14px;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
        ` : ""}
      </div>

      <!-- Footer -->
      <div style="padding:16px 32px;background:#f9f9f9;border-top:1px solid #eee;">
        <p style="margin:0;color:#999;font-size:12px;text-align:center;">
          Aiman Renovation — 68300 Saint-Louis — <a href="https://aiman-renovation.fr" style="color:#E50000;">aiman-renovation.fr</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
