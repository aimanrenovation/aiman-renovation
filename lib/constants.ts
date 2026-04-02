export const COMPANY = {
  name: "Aiman Renovation",
  legalForm: "SASU",
  slogan: "Nous rénovons jusqu'au bout de vos rêves !",
  phone: "03 56 89 44 03",
  mobile: "06 33 49 69 25",
  email: "contact@aiman-renovation.fr",
  address: "14 rue de la Paix",
  city: "Saint-Louis",
  zip: "68300",
  region: "Haut-Rhin, Alsace",
  experience: 19,
  projects: 50,
  founded: 2024,
  website: "https://aiman-renovation.fr",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

export const CTA_LINK = { href: "/devis", label: "Devis gratuit" } as const;
