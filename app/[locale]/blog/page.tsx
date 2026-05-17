import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { getAlternates } from "@/lib/i18n-helpers";
import { Breadcrumb } from "@/components/breadcrumb";

type Props = { params: Promise<{ locale: string }> };

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  prix: { fr: "Prix", en: "Prices", de: "Preise" },
  guide: { fr: "Guide", en: "Guide", de: "Ratgeber" },
  conseil: { fr: "Conseil", en: "Advice", de: "Tipps" },
  normes: { fr: "Normes", en: "Standards", de: "Normen" },
  tendance: { fr: "Tendance", en: "Trends", de: "Trends" },
};

const CATEGORY_COLORS: Record<string, string> = {
  prix: "bg-[#E50000]/20 text-[#E50000] border-[#E50000]/30",
  guide: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  conseil: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  normes: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  tendance: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "Blog Rénovation Haut-Rhin | Conseils, Prix & Guides",
    en: "Renovation Blog Haut-Rhin | Advice, Prices & Guides",
    de: "Renovierungsblog Elsass | Tipps, Preise & Ratgeber",
  };
  const descs: Record<string, string> = {
    fr: "Conseils d'experts, grilles de prix et guides pratiques pour votre rénovation à Saint-Louis 68300, Mulhouse et Bâle. Artisan qualifié en Haut-Rhin.",
    en: "Expert advice, price guides and practical tips for your renovation in Saint-Louis, Mulhouse and Basel. Qualified craftsman in Haut-Rhin.",
    de: "Expertentipps, Preisleitfäden und Ratgeber für Ihre Renovierung in Saint-Louis, Mulhouse und Basel. Qualifizierter Handwerker im Elsass.",
  };
  const title = titles[locale] ?? titles.fr;
  const description = descs[locale] ?? descs.fr;
  return {
    title,
    description,
    alternates: getAlternates("/blog"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/blog",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://aiman-renovation.fr/images/ambiance-resultat.jpg"],
    },
  };
}

interface TranslatedArticle {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  author: string;
  content: string;
}

const JSON_LD_LIST_NAME: Record<string, string> = {
  fr: "Articles blog rénovation — Aiman Renovation",
  en: "Renovation blog articles — Aiman Renovation",
  de: "Renovierungsblog-Artikel — Aiman Renovation",
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tRoot = await getTranslations({ locale });
  const items = tRoot.raw("article_items") as TranslatedArticle[];

  const BASE = "https://aiman-renovation.fr";
  const localePrefix = locale === "fr" ? "" : `/${locale}`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: JSON_LD_LIST_NAME[locale] ?? JSON_LD_LIST_NAME.fr,
    numberOfItems: ARTICLES.length,
    itemListElement: ARTICLES.map((a, i) => {
      const tr = items.find((x) => x.slug === a.slug);
      return {
        "@type": "ListItem",
        position: i + 1,
        name: tr?.title ?? a.slug,
        url: `${BASE}${localePrefix}/blog/${a.slug}`,
      };
    }),
  };

  const headings: Record<string, string> = {
    fr: "Blog Rénovation",
    en: "Renovation Blog",
    de: "Renovierungsblog",
  };
  const subtitles: Record<string, string> = {
    fr: "Conseils d'experts, grilles de prix et guides pratiques pour rénover en Alsace et région de Bâle.",
    en: "Expert advice, price guides and practical tips for renovation in Alsace and the Basel region.",
    de: "Expertentipps, Preisleitfäden und praktische Ratgeber für Renovierungen im Elsass und der Baseler Region.",
  };

  return (
    <>
    <Breadcrumb items={[{ name: "Accueil", url: "/" }, { name: "Blog", url: "/blog" }]} />
    <main className="min-h-screen bg-black text-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6">
            <span className="w-8 h-1 bg-[#E50000] rounded-full" />
            <span className="w-8 h-1 bg-white rounded-full" />
            <span className="w-8 h-1 bg-[#E50000] rounded-full" />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {headings[locale] ?? headings.fr}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {subtitles[locale] ?? subtitles.fr}
          </p>
        </div>
      </section>

      {/* Category badges */}
      <section className="px-4 pb-10">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 justify-center">
          {Object.entries(CATEGORY_LABELS).map(([cat, labels]) => (
            <span
              key={cat}
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[cat]}`}
            >
              {labels[locale] ?? labels.fr}
            </span>
          ))}
        </div>
      </section>

      {/* Articles grid */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article) => {
            const tr = items.find((x) => x.slug === article.slug);
            if (!tr) return null;
            const href = `${localePrefix}/blog/${article.slug}`;
            const catLabel = CATEGORY_LABELS[article.category]?.[locale] ?? article.category;

            return (
              <Link
                key={article.slug}
                href={href}
                className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#E50000]/50 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.featuredImage}
                    alt={tr.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span
                    className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[article.category]}`}
                  >
                    {catLabel}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h2 className="font-heading text-base font-bold leading-snug group-hover:text-[#E50000] transition-colors line-clamp-2">
                    {tr.title}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-3 flex-1">
                    {tr.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-white/40 text-xs mt-auto pt-3 border-t border-white/10">
                    <span>{article.datePublished}</span>
                    <span>{article.readTime} min</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-2xl mx-auto text-center bg-white/5 border border-white/10 rounded-2xl p-10">
          <h2 className="font-heading text-2xl font-bold mb-4">
            {locale === "de"
              ? "Kostenloses Angebot anfordern"
              : locale === "en"
              ? "Get a free quote"
              : "Demandez un devis gratuit"}
          </h2>
          <p className="text-white/60 mb-6">
            {locale === "de"
              ? "Artisan qualifiziert, Haut-Rhin — Reaktion innerhalb von 24h"
              : locale === "en"
              ? "Qualified artisan, Haut-Rhin — Response within 24h"
              : "Artisan qualifié, Haut-Rhin — Réponse sous 24h"}
          </p>
          <Link
            href={`${localePrefix}/devis`}
            className="inline-block bg-[#E50000] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#E50000]/90 transition-colors"
          >
            {locale === "de" ? "Angebot anfordern" : locale === "en" ? "Request a quote" : "Demander un devis"}
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}
