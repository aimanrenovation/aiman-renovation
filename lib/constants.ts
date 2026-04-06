export const COMPANY = {
  name: "Aiman Renovation",
  legalForm: "SASU",
  slogan: "Nous rénovons jusqu'au bout de vos rêves !",
  phone: "06 33 49 69 25",
  mobile: "06 33 49 69 25",
  email: "contact@aiman-renovation.fr",
  address: "12 Rue de Bâle",
  city: "Saint-Louis",
  zip: "68300",
  region: "Haut-Rhin, Alsace",
  experience: 19,
  projects: 50,
  founded: 2024,
  website: "https://aiman-renovation.fr",
  social: {
    facebook: "https://www.facebook.com/aimanrenovation",
    instagram: "https://www.instagram.com/aimanrenovation",
    linkedin: "https://www.linkedin.com/company/aiman-renovation",
    tiktok: "https://www.tiktok.com/@aimanrenovation",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

export const CTA_LINK = { href: "/devis", label: "Devis gratuit" } as const;
