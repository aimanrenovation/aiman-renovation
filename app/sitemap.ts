import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.aiman-renovation.fr";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    ...SERVICES.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/realisations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/devis`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
