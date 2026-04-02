import type { DevisFormState } from "@/components/devis/devis-types";

interface DevisEmailProps {
  data: DevisFormState;
  isClientCopy: boolean;
}

export function generateDevisEmailHtml({
  data,
  isClientCopy,
}: DevisEmailProps): string {
  const zonesLabels: Record<string, string> = {
    cuisine: "Cuisine",
    "salle-de-bain": "Salle de bain",
    facade: "Facade / Isolation",
    toit: "Toiture",
    garage: "Garage",
    exterieur: "Exterieur / Jardin",
  };

  const selectedZonesText = data.selectedZones
    .map((z) => zonesLabels[z] || z)
    .join(", ");

  const problemsText = Object.entries(data.problems)
    .filter(([, problems]) => problems.length > 0)
    .map(([zone, problems]) => `${zonesLabels[zone] || zone}: ${problems.join(", ")}`)
    .join("<br/>");

  const optionsText = Object.entries(data.renovationOptions)
    .filter(([, options]) => options.length > 0)
    .map(([zone, options]) => `${zonesLabels[zone] || zone}: ${options.join(", ")}`)
    .join("<br/>");

  const budgetLabels: Record<string, string> = {
    "< 5000": "Moins de 5 000 EUR",
    "5000-15000": "5 000 - 15 000 EUR",
    "15000-30000": "15 000 - 30 000 EUR",
    "30000-50000": "30 000 - 50 000 EUR",
    "> 50000": "Plus de 50 000 EUR",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: Inter, Arial, sans-serif; color: #0A0A0A; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0A0A0A; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FFFFFF; font-size: 24px; margin: 0;">
          ${isClientCopy ? "Votre demande de devis" : "Nouvelle demande de devis"}
        </h1>
        <p style="color: #E50000; font-size: 14px; margin: 8px 0 0;">Aiman Renovation</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        ${isClientCopy ? "<p>Merci pour votre demande ! Voici le recapitulatif. Nous vous recontactons sous 24h.</p>" : ""}

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Contact</h2>
        <p><strong>Nom :</strong> ${data.contact.firstName} ${data.contact.lastName}</p>
        <p><strong>Telephone :</strong> ${data.contact.phone}</p>
        <p><strong>Email :</strong> ${data.contact.email}</p>
        <p><strong>Adresse du chantier :</strong> ${data.contact.address}</p>

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Zones a renover</h2>
        <p>${selectedZonesText}</p>

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Problemes constates</h2>
        <p>${problemsText || "Non renseigne"}</p>

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Renovation souhaitee</h2>
        <p>${optionsText || "Non renseigne"}</p>

        <h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Surface et budget</h2>
        <p><strong>Surface :</strong> ${data.surface ? `${data.surface} m²` : "Non renseigne"}</p>
        <p><strong>Budget :</strong> ${data.budget ? budgetLabels[data.budget] || data.budget : "Non renseigne"}</p>

        ${data.photos.length > 0 ? `<p><strong>Photos jointes :</strong> ${data.photos.length} fichier(s)</p>` : ""}
        ${data.message ? `<h2 style="color: #E50000; font-size: 18px; border-bottom: 2px solid #E50000; padding-bottom: 8px;">Message</h2><p>${data.message}</p>` : ""}

        <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            Aiman Renovation — 14 rue de la Paix, 68300 Saint-Louis<br/>
            03 56 89 44 03 — contact@aiman-renovation.fr
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
