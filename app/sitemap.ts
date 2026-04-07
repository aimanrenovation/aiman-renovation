import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";
import { ARTICLES } from "@/lib/articles";
import { VILLES_DE } from "@/lib/villes-de";
import { VILLES_CH } from "@/lib/villes-ch";
import { VILLES_FR } from "@/lib/villes-fr";

const BASE = "https://aiman-renovation.fr";
const LOCALES = ["fr", "de", "en"] as const;

function localizedUrl(path: string, locale: string) {
  return locale === "fr" ? `${BASE}${path}` : `${BASE}/${locale}${path}`;
}

function localizedEntry(path: string, priority: number, freq: "weekly" | "monthly" | "yearly") {
  return LOCALES.map((locale) => ({
    url: localizedUrl(path, locale),
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [l, localizedUrl(path, l)])),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...localizedEntry("/", 1, "weekly"),
    ...localizedEntry("/services", 0.9, "monthly"),
    ...SERVICES.flatMap((s) => localizedEntry(`/services/${s.slug}`, 0.8, "monthly")),
    ...localizedEntry("/realisations", 0.8, "weekly"),
    ...localizedEntry("/avis", 0.7, "weekly"),
    ...localizedEntry("/a-propos", 0.6, "monthly"),
    ...localizedEntry("/devis", 0.9, "monthly"),
    ...localizedEntry("/contact", 0.7, "monthly"),
    ...localizedEntry("/faq", 0.6, "monthly"),
    ...localizedEntry("/carrieres", 0.7, "monthly"),
    ...localizedEntry("/partenaires", 0.6, "monthly"),
    ...localizedEntry("/cgv", 0.3, "yearly"),
    ...localizedEntry("/mentions-legales", 0.3, "yearly"),
    ...localizedEntry("/politique-confidentialite", 0.3, "yearly"),
    ...localizedEntry("/blog", 0.8, "weekly"),
    ...ARTICLES.flatMap((a) => localizedEntry(`/blog/${a.slug}`, 0.7, "monthly")),
    ...VILLES_FR.flatMap((v) =>
      localizedEntry(`/renovation/${v.slug}`, 0.8, "monthly")
    ),
    // Hub pages — country-level entry points
    ...localizedEntry("/renovierung-schweiz", 0.9, "weekly"),
    ...localizedEntry("/renovierung-deutschland", 0.9, "weekly"),
    ...VILLES_DE.flatMap((v) =>
      localizedEntry(`/renovierung-deutschland/${v.slug}`, 0.8, "monthly")
    ),
    ...VILLES_CH.flatMap((v) =>
      localizedEntry(`/renovierung-schweiz/${v.slug}`, 0.8, "monthly")
    ),
    // Canton hub pages — high priority for Swiss SEO
    ...localizedEntry("/renovierung-schweiz/kanton/basel-stadt", 0.85, "monthly"),
    ...localizedEntry("/renovierung-schweiz/kanton/basel-landschaft", 0.85, "monthly"),
    ...localizedEntry("/renovierung-schweiz/kanton/solothurn", 0.7, "monthly"),
    ...VILLES_FR.flatMap((v) =>
      localizedEntry(`/renovation/${v.slug}`, 0.7, "monthly")
    ),
  ];
}
