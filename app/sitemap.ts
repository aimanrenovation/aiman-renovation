import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";

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
    ...localizedEntry("/cgv", 0.3, "yearly"),
    ...localizedEntry("/mentions-legales", 0.3, "yearly"),
    ...localizedEntry("/politique-confidentialite", 0.3, "yearly"),
  ];
}
