import type { DevisState } from "@/components/devis/devis-types";
import { ZONES_CONFIG } from "@/components/devis/devis-zones-config";
import frMessages from "@/messages/fr.json";
import enMessages from "@/messages/en.json";
import deMessages from "@/messages/de.json";

interface GenerateEmailProps {
  data: DevisState;
  isClientCopy: boolean;
  locale: string;
}

type Messages = typeof frMessages;

function getMessages(locale: string): Messages {
  switch (locale) {
    case "en": return enMessages;
    case "de": return deMessages;
    default: return frMessages;
  }
}

function getZoneLabel(messages: Messages, zoneKey: string): string {
  const zones = messages.devis.zones as Record<string, { label: string; workItems: Record<string, string> }>;
  return zones[zoneKey]?.label ?? zoneKey;
}

function getWorkLabel(messages: Messages, zoneKey: string, workKey: string): string {
  const zones = messages.devis.zones as Record<string, { label: string; workItems: Record<string, string> }>;
  return zones[zoneKey]?.workItems?.[workKey] ?? workKey;
}

function getEmailText(messages: Messages, key: string, replacements?: Record<string, string | number>): string {
  const email = messages.email as Record<string, string>;
  let text = email[key] ?? key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export function generateDevisEmailHtml({ data, isClientCopy, locale }: GenerateEmailProps): string {
  const messages = getMessages(locale);

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
          return item ? getWorkLabel(messages, zone.labelKey, item.labelKey) : workId;
        })
        .join(", ");

      const note = data.zoneNotes[zone.id];
      const noteLabel = getEmailText(messages, "label_note");
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;font-weight:600;vertical-align:top;width:160px;color:#333;">
            ${getZoneLabel(messages, zone.labelKey)}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;color:#555;">
            ${works}${note ? `<br/><span style="color:#888;font-size:13px;">${noteLabel} ${note}</span>` : ""}
          </td>
        </tr>`;
    })
    .join("");

  const title = isClientCopy
    ? getEmailText(messages, "devis_client_title")
    : getEmailText(messages, "devis_admin_title", { firstName: data.contact.firstName, lastName: data.contact.lastName });

  const intro = isClientCopy
    ? `<p style="color:#555;font-size:15px;line-height:1.6;">${getEmailText(messages, "devis_client_intro", { firstName: data.contact.firstName }).replace(/\n/g, "<br/>")}</p>`
    : `<p style="color:#555;font-size:15px;line-height:1.6;">${getEmailText(messages, "devis_admin_intro")}</p>`;

  const sectionContact = getEmailText(messages, "section_contact");
  const labelName = getEmailText(messages, "label_name");
  const labelPhone = getEmailText(messages, "label_phone");
  const labelEmail = getEmailText(messages, "label_email");
  const labelAddress = getEmailText(messages, "label_address");
  const sectionWorks = getEmailText(messages, "section_works", { totalWorks, totalZones: zonesWithWorks.length });
  const sectionBudget = getEmailText(messages, "section_budget");
  const sectionMagicplan = getEmailText(messages, "section_magicplan");
  const sectionMessage = getEmailText(messages, "section_message");
  const footer = getEmailText(messages, "footer");

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
        <h2 style="font-size:16px;color:#333;margin:24px 0 12px;border-bottom:2px solid #E50000;padding-bottom:8px;">${sectionContact}</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#888;width:120px;">${labelName}</td><td style="padding:6px 0;color:#333;">${data.contact.firstName} ${data.contact.lastName}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">${labelPhone}</td><td style="padding:6px 0;color:#333;"><a href="tel:${data.contact.phone}" style="color:#E50000;">${data.contact.phone}</a></td></tr>
          <tr><td style="padding:6px 0;color:#888;">${labelEmail}</td><td style="padding:6px 0;color:#333;"><a href="mailto:${data.contact.email}" style="color:#E50000;">${data.contact.email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#888;">${labelAddress}</td><td style="padding:6px 0;color:#333;">${data.contact.address}</td></tr>
        </table>

        <!-- Travaux -->
        <h2 style="font-size:16px;color:#333;margin:24px 0 12px;border-bottom:2px solid #E50000;padding-bottom:8px;">
          ${sectionWorks}
        </h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${zonesHtml}
        </table>

        ${data.budget ? `
        <h2 style="font-size:16px;color:#333;margin:24px 0 12px;border-bottom:2px solid #E50000;padding-bottom:8px;">${sectionBudget}</h2>
        <p style="color:#333;font-size:15px;">${data.budget} €</p>
        ` : ""}

        ${"magicplanLink" in data && data.magicplanLink ? `
        <h2 style="font-size:16px;color:#333;margin:24px 0 12px;border-bottom:2px solid #E50000;padding-bottom:8px;">${sectionMagicplan}</h2>
        <p style="font-size:14px;"><a href="${data.magicplanLink}" style="color:#E50000;">${data.magicplanLink}</a></p>
        ` : ""}

        ${data.message ? `
        <h2 style="font-size:16px;color:#333;margin:24px 0 12px;border-bottom:2px solid #E50000;padding-bottom:8px;">${sectionMessage}</h2>
        <p style="color:#555;font-size:14px;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
        ` : ""}
      </div>

      <!-- Footer -->
      <div style="padding:16px 32px;background:#f9f9f9;border-top:1px solid #eee;">
        <p style="margin:0;color:#999;font-size:12px;text-align:center;">
          ${footer.includes("aiman-renovation.fr") ? footer.replace("aiman-renovation.fr", '<a href="https://aiman-renovation.fr" style="color:#E50000;">aiman-renovation.fr</a>') : footer}
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
