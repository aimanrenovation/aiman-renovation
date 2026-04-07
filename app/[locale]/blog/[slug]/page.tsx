import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ARTICLES } from "@/lib/articles";
import { SERVICES } from "@/lib/services";
import { COMPANY } from "@/lib/constants";
import { LinkButton } from "@/components/ui/link-button";
import { getAlternates } from "@/lib/i18n-helpers";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
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

async function getTranslatedArticle(
  locale: string,
  slug: string
): Promise<TranslatedArticle | undefined> {
  const tRoot = await getTranslations({ locale });
  const items = tRoot.raw("article_items") as TranslatedArticle[];
  return items.find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  const translated = await getTranslatedArticle(locale, slug);
  const title = translated?.seoTitle ?? translated?.title ?? slug;
  const description = translated?.seoDescription ?? translated?.excerpt ?? "";

  return {
    title,
    description,
    alternates: getAlternates(`/blog/${slug}`),
    openGraph: {
      title,
      description,
      url: `https://aiman-renovation.fr/blog/${slug}`,
      siteName: "Aiman Renovation",
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      images: [
        {
          url: `https://aiman-renovation.fr${article.featuredImage}`,
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
      images: [`https://aiman-renovation.fr${article.featuredImage}`],
    },
  };
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-none space-y-2 mb-6">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-white/80">
              <span className="mt-1.5 w-1.5 h-1.5 bg-[#E50000] rounded-full flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={key++} className="font-heading text-2xl font-bold mt-10 mb-4 text-white">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="font-heading text-xl font-semibold mt-8 mb-3 text-white/90">
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
    } else {
      flushList();
      elements.push(
        <p
          key={key++}
          className="text-white/70 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{
            __html: trimmed.replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>"),
          }}
        />
      );
    }
  }
  flushList();
  return elements;
}

const CATEGORY_COLORS: Record<string, string> = {
  prix: "bg-[#E50000]/20 text-[#E50000] border-[#E50000]/30",
  guide: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  conseil: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  normes: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  tendance: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  prix: { fr: "Prix", en: "Prices", de: "Preise" },
  guide: { fr: "Guide", en: "Guide", de: "Ratgeber" },
  conseil: { fr: "Conseil", en: "Advice", de: "Tipps" },
  normes: { fr: "Normes", en: "Standards", de: "Normen" },
  tendance: { fr: "Tendance", en: "Trends", de: "Trends" },
};

export default async function ArticlePage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const translated = await getTranslatedArticle(locale, slug);
  if (!translated) notFound();

  const tRoot = await getTranslations({ locale });
  const allItems = tRoot.raw("article_items") as TranslatedArticle[];

  const localePrefix = locale === "fr" ? "" : `/${locale}`;
  const BASE = "https://aiman-renovation.fr";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: translated.seoTitle,
    description: translated.seoDescription,
    image: `${BASE}${article.featuredImage}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Person",
      name: translated.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Aiman Renovation",
      url: BASE,
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/images/logo.png`,
      },
    },
    url: `${BASE}${localePrefix}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE}${localePrefix}/blog/${slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: `${BASE}${localePrefix}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${BASE}${localePrefix}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: translated.title,
        item: `${BASE}${localePrefix}/blog/${slug}`,
      },
    ],
  };

  const relatedServices = SERVICES.filter((s) =>
    (article.relatedServices ?? []).includes(s.slug)
  );

  const relatedArticles = await Promise.all(
    (article.relatedSlugs ?? []).map(async (relSlug) => {
      const relData = ARTICLES.find((a) => a.slug === relSlug);
      const relTranslated = allItems.find((x) => x.slug === relSlug);
      if (!relData || !relTranslated) return null;
      return { data: relData, translated: relTranslated };
    })
  ).then((results) => results.filter(Boolean));

  return (
    <main className="min-h-screen bg-black text-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero image */}
      <section className="relative h-[50vh] min-h-[320px] max-h-[520px] overflow-hidden">
        <Image
          src={article.featuredImage}
          alt={translated.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${CATEGORY_COLORS[article.category]}`}
            >
              {CATEGORY_LABELS[article.category]?.[locale] ?? article.category}
            </span>
            <h1 className="font-heading text-2xl md:text-4xl font-bold leading-tight">
              {translated.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Meta bar */}
      <section className="px-4 py-4 border-b border-white/10">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-4 text-white/50 text-sm">
          <span>{translated.author}</span>
          <span>·</span>
          <span>{article.datePublished}</span>
          <span>·</span>
          <span>{article.readTime} min</span>
          <div className="ml-auto flex gap-2 text-xs">
            <Link href={`${localePrefix}/blog`} className="hover:text-white transition-colors">
              ← Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/80 text-lg leading-relaxed mb-8 font-medium">
            {translated.excerpt}
          </p>
          <div className="prose-custom">{renderContent(translated.content)}</div>
        </div>
      </article>

      {/* Related services */}
      {relatedServices.length > 0 && (
        <section className="px-4 py-10 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-xl font-bold mb-6">
              {locale === "de" ? "Unsere Services" : locale === "en" ? "Our services" : "Nos services"}
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`${localePrefix}/services/${s.slug}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:border-[#E50000]/50 hover:text-[#E50000] transition-all"
                >
                  {s.shortTitle}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="px-4 py-10 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-xl font-bold mb-6">
              {locale === "de" ? "Ähnliche Artikel" : locale === "en" ? "Related articles" : "Articles similaires"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => {
                if (!rel) return null;
                return (
                  <Link
                    key={rel.data.slug}
                    href={`${localePrefix}/blog/${rel.data.slug}`}
                    className="group flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#E50000]/50 transition-all"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={rel.data.featuredImage}
                        alt={rel.translated.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-semibold leading-snug group-hover:text-[#E50000] transition-colors line-clamp-2">
                        {rel.translated.title}
                      </p>
                      <p className="text-white/40 text-xs mt-1">{rel.data.readTime} min</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-4 py-16 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">
            {locale === "de"
              ? "Kostenloses Angebot anfordern"
              : locale === "en"
              ? "Get a free quote"
              : "Demandez votre devis gratuit"}
          </h2>
          <p className="text-white/60 mb-8">
            {locale === "de"
              ? `Artisan qualifiziert — ${COMPANY.name} — Antwort in 24h`
              : locale === "en"
              ? `Qualified artisan — ${COMPANY.name} — Response within 24h`
              : `Artisan qualifié — ${COMPANY.name} — Réponse sous 24h`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton href={`${localePrefix}/devis`}>
              {locale === "de" ? "Angebot anfordern" : locale === "en" ? "Request a quote" : "Demander un devis"}
            </LinkButton>
            <a
              href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              {COMPANY.mobile}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
