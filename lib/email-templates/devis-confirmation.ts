import type { DevisState } from "@/components/devis/devis-types";
import { ZONES_CONFIG } from "@/components/devis/devis-zones-config";
import frMessages from "@/messages/fr.json";
import enMessages from "@/messages/en.json";
import deMessages from "@/messages/de.json";

interface GenerateEmailProps {
  data: DevisState;
  isClientCopy: boolean;
  locale: string;
  /** IP source (optionnel, capté depuis la route API) */
  sourceIp?: string;
  /** User-Agent simplifié (optionnel) */
  userAgent?: string;
  /** Nombre de photos jointes */
  photosCount?: number;
}

type Messages = typeof frMessages;

function getMessages(locale: string): Messages {
  switch (locale) {
    case "en":
      return enMessages;
    case "de":
      return deMessages;
    default:
      return frMessages;
  }
}

function getZoneLabel(messages: Messages, zoneKey: string): string {
  const zones = messages.devis.zones as Record<
    string,
    { label: string; workItems: Record<string, string> }
  >;
  return zones[zoneKey]?.label ?? zoneKey;
}

function getWorkLabel(
  messages: Messages,
  zoneKey: string,
  workKey: string,
): string {
  const zones = messages.devis.zones as Record<
    string,
    { label: string; workItems: Record<string, string> }
  >;
  return zones[zoneKey]?.workItems?.[workKey] ?? workKey;
}

function getEmailText(
  messages: Messages,
  key: string,
  replacements?: Record<string, string | number>,
): string {
  const email = messages.email as Record<string, string>;
  let text = email[key] ?? key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

/** Mapping exhaustif slug -> label lisible FR (15 services + zones intérieures/extérieures) */
const SERVICE_LABELS: Record<string, string> = {
  // Zones intérieures
  salon: "Salon",
  sam: "Séjour / Salle à manger",
  cuisine: "Cuisine",
  vestibule: "Entrée / Couloir",
  wc: "WC",
  sdb: "Salle de bain",
  chambre1: "Chambre 1",
  chambre2: "Chambre 2",
  garage: "Garage",
  // Zones extérieures
  terrasse: "Terrasse",
  jardin: "Jardin",
  haie: "Haie / Clôture",
  facades: "Façades",
  toiture: "Toiture",
  // Slugs services (tirets et underscores)
  "renovation-cuisine": "Rénovation cuisine",
  renovation_cuisine: "Rénovation cuisine",
  "salle-de-bain": "Rénovation salle de bain",
  salle_de_bain: "Rénovation salle de bain",
  electricite: "Électricité",
  plomberie: "Plomberie",
  paysager: "Aménagement paysager",
  "borne-recharge": "Borne de recharge IRVE",
  borne_recharge: "Borne de recharge IRVE",
  irve: "Borne de recharge IRVE",
  "panneaux-photovoltaiques": "Panneaux photovoltaïques",
  panneaux_photovoltaiques: "Panneaux photovoltaïques",
  photovoltaique: "Panneaux photovoltaïques",
  "entretien-exterieur": "Entretien espaces extérieurs",
  entretien_exterieur: "Entretien espaces extérieurs",
  "depannage-urgence": "Dépannage urgence",
  depannage_urgence: "Dépannage urgence",
  depannage: "Dépannage urgence",
  peinture: "Peinture intérieure/extérieure",
  "sols-carrelage": "Sols et carrelage",
  sols_carrelage: "Sols et carrelage",
  "renovation-complete": "Rénovation complète",
  renovation_complete: "Rénovation complète",
  isolation: "Isolation thermique / acoustique",
  facade: "Ravalement de façade",
  "nettoyage-haute-pression": "Nettoyage haute pression",
  nettoyage_hp: "Nettoyage haute pression",
  "nettoyage_haute-pression": "Nettoyage haute pression",
  nettoyage_haute_pression: "Nettoyage haute pression",
  autre: "Autre / Non précisé",
  travaux: "Travaux divers",
};

/** Budget range -> libellé FR */
const BUDGET_LABELS: Record<string, string> = {
  "< 5000": "Moins de 5 000 €",
  "5000-15000": "5 000 € – 15 000 €",
  "15000-30000": "15 000 € – 30 000 €",
  "30000-50000": "30 000 € – 50 000 €",
  "> 50000": "Plus de 50 000 €",
};

const EMPTY = '<em style="color:#aaa;font-style:italic;">Non renseigné</em>';

function val(v: string | null | undefined): string {
  if (v === null || v === undefined) return EMPTY;
  const s = String(v).trim();
  return s.length > 0 ? s : EMPTY;
}

function sectionHeader(title: string): string {
  return `<h2 style="font-size:15px;color:#333;margin:28px 0 10px;border-bottom:2px solid #E50000;padding-bottom:7px;letter-spacing:0.01em;">${title}</h2>`;
}

function row(label: string, content: string): string {
  return `<tr>
    <td style="padding:7px 12px 7px 0;color:#888;font-size:13px;vertical-align:top;width:160px;white-space:nowrap;">${label}</td>
    <td style="padding:7px 0;color:#333;font-size:14px;vertical-align:top;">${content}</td>
  </tr>`;
}

function resolveServiceLabel(slug: string): string {
  return (
    SERVICE_LABELS[slug] ??
    SERVICE_LABELS[slug.toLowerCase().replace(/-/g, "_")] ??
    SERVICE_LABELS[slug.toLowerCase().replace(/_/g, "-")] ??
    slug
  );
}

export function generateDevisEmailHtml({
  data,
  isClientCopy,
  locale,
  sourceIp,
  userAgent,
  photosCount = 0,
}: GenerateEmailProps): string {
  const messages = getMessages(locale);

  const zonesWithWorks = ZONES_CONFIG.filter(
    (z) => data.selectedWorks[z.id] && data.selectedWorks[z.id].length > 0,
  );

  const totalWorks = zonesWithWorks.reduce(
    (sum, z) => sum + data.selectedWorks[z.id].length,
    0,
  );

  // Travaux zones connues (wizard 2D)
  const zonesHtml = zonesWithWorks
    .map((zone) => {
      const works = data.selectedWorks[zone.id]
        .map((workId) => {
          const item = zone.workItems.find((w) => w.id === workId);
          return item
            ? getWorkLabel(messages, zone.labelKey, item.labelKey)
            : resolveServiceLabel(workId);
        })
        .join(", ");
      const note = data.zoneNotes?.[zone.id];
      const zoneLabel =
        getZoneLabel(messages, zone.labelKey) ||
        resolveServiceLabel(zone.labelKey);
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;vertical-align:top;width:140px;color:#333;font-size:14px;">${zoneLabel}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;font-size:14px;">${works || EMPTY}${note ? `<br/><span style="color:#888;font-size:12px;font-style:italic;">Note : ${note}</span>` : ""}</td>
      </tr>`;
    })
    .join("");

  // Travaux supplémentaires (JSON callers, slugs hors ZONES_CONFIG)
  const coveredZoneIds = new Set(zonesWithWorks.map((z) => z.id));
  const extraEntries = Object.entries(data.selectedWorks).filter(
    ([zoneId, works]) =>
      !coveredZoneIds.has(zoneId as never) && works && works.length > 0,
  );
  const extraWorksHtml = extraEntries
    .map(([zoneId, works]) => {
      const label = resolveServiceLabel(zoneId);
      const worksStr = works.map((w) => resolveServiceLabel(w)).join(", ");
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;vertical-align:top;width:140px;color:#333;font-size:14px;">${label}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;font-size:14px;">${worksStr || EMPTY}</td>
      </tr>`;
    })
    .join("");

  const totalZones = zonesWithWorks.length + extraEntries.length;
  const totalWorksAll =
    totalWorks +
    extraEntries.reduce((s, [, w]) => s + (w ? w.length : 0), 0);

  const title = isClientCopy
    ? getEmailText(messages, "devis_client_title")
    : getEmailText(messages, "devis_admin_title", {
        firstName: data.contact.firstName,
        lastName: data.contact.lastName,
      });

  const intro = isClientCopy
    ? `<p style="color:#555;font-size:15px;line-height:1.6;">${getEmailText(messages, "devis_client_intro", { firstName: data.contact.firstName }).replace(/\n/g, "<br/>")}</p>`
    : `<p style="color:#555;font-size:15px;line-height:1.6;">${getEmailText(messages, "devis_admin_intro")}</p>`;

  const mapsUrl =
    data.contact.addressLat && data.contact.addressLng
      ? `https://www.google.com/maps?q=${data.contact.addressLat},${data.contact.addressLng}`
      : data.contact.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.contact.address)}`
        : null;
  const addressCell = data.contact.address
    ? `${data.contact.address}${mapsUrl ? ` <a href="${mapsUrl}" style="color:#E50000;font-size:12px;">[Google Maps]</a>` : ""}`
    : EMPTY;

  const budgetLabel = data.budget
    ? (BUDGET_LABELS[data.budget] ?? data.budget)
    : null;

  const submissionDate = new Date().toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const footer = getEmailText(messages, "footer");
  const footerHtml = footer.includes("aiman-renovation.fr")
    ? footer.replace(
        "aiman-renovation.fr",
        '<a href="https://aiman-renovation.fr" style="color:#E50000;">aiman-renovation.fr</a>',
      )
    : footer;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:620px;margin:0 auto;padding:32px 12px;">
    <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <div style="background:#E50000;padding:24px 32px;">
        <h1 style="margin:0;color:#fff;font-size:19px;font-weight:700;">${title}</h1>
      </div>
      <div style="padding:24px 32px;">
        ${intro}

        ${sectionHeader("👤 Coordonnées du client")}
        <table style="width:100%;border-collapse:collapse;">
          ${row("Prénom", val(data.contact.firstName))}
          ${row("Nom", val(data.contact.lastName))}
          ${row("Téléphone", data.contact.phone ? `<a href="tel:${data.contact.phone}" style="color:#E50000;font-weight:600;">${data.contact.phone}</a>` : EMPTY)}
          ${row("Email", data.contact.email ? `<a href="mailto:${data.contact.email}" style="color:#E50000;">${data.contact.email}</a>` : EMPTY)}
        </table>

        ${sectionHeader("📍 Localisation du chantier")}
        <table style="width:100%;border-collapse:collapse;">
          ${row("Adresse complète", addressCell)}
          ${row("Coordonnées GPS", data.contact.addressLat && data.contact.addressLng ? `${data.contact.addressLat.toFixed(5)}, ${data.contact.addressLng.toFixed(5)}` : EMPTY)}
          ${row("Adresse validée", data.contact.addressValidated ? '<span style="color:green;font-weight:600;">✓ Géocodée</span>' : '<span style="color:#c07000;">⚠ Non validée</span>')}
        </table>

        ${sectionHeader(`🔨 Travaux demandés — ${totalWorksAll} travail(s) sur ${totalZones} zone(s)`)}
        ${zonesHtml || extraWorksHtml ? `<table style="width:100%;border-collapse:collapse;">${zonesHtml}${extraWorksHtml}</table>` : `<p style="color:#c07000;font-size:14px;font-style:italic;">⚠ Aucun travail sélectionné dans les données reçues</p>`}

        ${sectionHeader("💰 Budget souhaité")}
        <p style="margin:6px 0 0;">${budgetLabel ? `<span style="background:#fff3e0;color:#b35c00;padding:5px 14px;border-radius:20px;font-size:14px;font-weight:600;display:inline-block;">${budgetLabel}</span>` : EMPTY}</p>

        ${sectionHeader("💬 Message du client")}
        ${data.message && data.message.trim() ? `<div style="background:#f9f9f9;border-left:4px solid #E50000;padding:12px 16px;border-radius:4px;color:#333;font-size:14px;line-height:1.7;white-space:pre-wrap;">${data.message}</div>` : `<p style="color:#aaa;font-style:italic;font-size:14px;margin:4px 0;">Aucun message saisi</p>`}

        ${sectionHeader("📷 Photos / Pièces jointes")}
        ${photosCount > 0 ? `<p style="color:#333;font-size:14px;margin:4px 0;">✅ <strong>${photosCount} photo(s)</strong> reçue(s) — voir pièces jointes.</p>` : `<p style="color:#aaa;font-style:italic;font-size:14px;margin:4px 0;">Aucune photo envoyée</p>`}

        ${sectionHeader("🏗️ MagicPlan")}
        <table style="width:100%;border-collapse:collapse;">
          ${row("Projet ID", val(data.magicplanProjectId))}
          ${row("Lien plan", data.magicplanLink && data.magicplanLink.trim() ? `<a href="${data.magicplanLink}" style="color:#E50000;">${data.magicplanLink}</a>` : EMPTY)}
        </table>

        ${!isClientCopy ? `${sectionHeader("🔍 Métadonnées")}
        <table style="width:100%;border-collapse:collapse;">
          ${row("Date soumission", submissionDate)}
          ${row("IP source", sourceIp ? `<code style="font-size:12px;background:#f0f0f0;padding:2px 6px;border-radius:3px;">${sourceIp}</code>` : EMPTY)}
          ${row("User-Agent", userAgent ? `<span style="font-size:11px;color:#666;">${userAgent.substring(0, 120)}${userAgent.length > 120 ? "…" : ""}</span>` : EMPTY)}
          ${row("Photos reçues", String(photosCount))}
          ${row("Locale", locale || "fr")}
        </table>` : ""}
      </div>
      <div style="padding:16px 32px;background:#f9f9f9;border-top:1px solid #eee;">
        <p style="margin:0;color:#999;font-size:12px;text-align:center;">${footerHtml}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
