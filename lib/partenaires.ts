// Liste des partenaires métier d'AIMAN RENOVATION.
// Chaque partenaire est un acteur local avec lequel nous échangeons recommandations et backlinks.
// Pour ajouter un partenaire, ajoutez une entrée en respectant la structure ci-dessous.

export type PartenaireCategorie =
  | "fournisseur"
  | "architecte"
  | "decorateur"
  | "paysagiste"
  | "immobilier"
  | "expert"
  | "ecole"
  | "association";

export interface Partenaire {
  slug: string;
  name: string;
  categorie: PartenaireCategorie;
  description: string;
  ville: string;
  pays: "FR" | "CH" | "DE";
  url?: string;
  logo?: string;
  since: string; // ISO date
}

export const PARTENAIRES: Partenaire[] = [
  // Section vide au démarrage — sera remplie au fil des partenariats signés.
  // Les premiers partenaires confirmés viendront s'ajouter ici.
];

export const PARTENAIRE_CATEGORIES: Record<PartenaireCategorie, { fr: string; de: string; en: string }> = {
  fournisseur: {
    fr: "Fournisseurs matériaux",
    de: "Materialzulieferer",
    en: "Material suppliers",
  },
  architecte: {
    fr: "Architectes",
    de: "Architekten",
    en: "Architects",
  },
  decorateur: {
    fr: "Décorateurs d'intérieur",
    de: "Innenarchitekten",
    en: "Interior designers",
  },
  paysagiste: {
    fr: "Paysagistes",
    de: "Gartenbauer",
    en: "Landscape designers",
  },
  immobilier: {
    fr: "Agences immobilières",
    de: "Immobilienagenturen",
    en: "Real estate agencies",
  },
  expert: {
    fr: "Experts & diagnostiqueurs",
    de: "Sachverständige & Gutachter",
    en: "Experts & inspectors",
  },
  ecole: {
    fr: "Écoles & CFA partenaires",
    de: "Bildungspartner",
    en: "Education partners",
  },
  association: {
    fr: "Associations & institutions",
    de: "Verbände & Institutionen",
    en: "Associations & institutions",
  },
};
