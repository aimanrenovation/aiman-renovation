import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/lib/i18n-helpers";
import { TESTIMONIALS, getAverageRating } from "@/lib/testimonials";
import { TestimonialCard } from "@/components/testimonial-card";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "avis" });
  const title = t("seo_title");
  const description = t("seo_description");
  return {
    title,
    description,
    alternates: getAlternates("/avis"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/avis",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
          width: 1200,
          height: 630,
          alt: "Avis clients AIMAN RENOVATION — artisan rénovation Saint-Louis 68",
        },
      ],
    },
  };
}

export default async function AvisPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "avis" });

  const avgRating = getAverageRating();
  const reviewCount = TESTIMONIALS.length;

  const aggregateSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "AIMAN RENOVATION",
    url: "https://aiman-renovation.fr",
    telephone: "+33633496925",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Saint-Louis",
      addressLocality: "Saint-Louis",
      postalCode: "68300",
      addressCountry: "FR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    review: TESTIMONIALS.map((testimonial) => ({
      "@type": "Review",
      author: { "@type": "Person", name: testimonial.author },
      datePublished: testimonial.date,
      reviewBody: testimonial.commentFR,
      reviewRating: {
        "@type": "Rating",
        ratingValue: testimonial.rating.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://aiman-renovation.fr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb"),
        item: "https://aiman-renovation.fr/avis",
      },
    ],
  };

  const schemaStr = JSON.stringify(aggregateSchema);
  const breadcrumbStr = JSON.stringify(breadcrumbSchema);

  const services = [
    { slug: "all", label: t("filter_all") },
    { slug: "cuisine", label: "Cuisine" },
    { slug: "salle-de-bain", label: "Salle de bain" },
    { slug: "peinture", label: "Peinture" },
    { slug: "sols-carrelage", label: "Sols & carrelage" },
    { slug: "electricite", label: "Électricité" },
    { slug: "plomberie", label: "Plomberie" },
    { slug: "isolation", label: "Isolation" },
    { slug: "facade", label: "Façade" },
    { slug: "renovation-complete", label: "Rénovation complète" },
    { slug: "borne-recharge", label: "Borne recharge" },
    { slug: "panneaux-photovoltaiques", label: "Photovoltaïque" },
    { slug: "depannage-urgence", label: "Dépannage urgence" },
  ];

  return (
    <>
      {/* JSON-LD structured data — static server-generated content, safe */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaStr }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbStr }}
      />

      {/* Breadcrumb */}
      <section className="relative z-10 pt-32 pb-0 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <nav aria-label="Fil d'Ariane" className="text-sm text-zinc-500 mb-6">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li className="text-zinc-700">/</li>
              <li className="text-white">{t("breadcrumb")}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="relative z-10 pb-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl mb-4">
              {t("hero_title")}{" "}
              <span className="text-[#E50000]">
                {t("hero_title_highlight")}
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              {t("hero_subtitle")}
            </p>

            {/* Note agrégée */}
            <div className="inline-flex flex-col items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-6">
              <div className="text-6xl font-heading text-white">
                {avgRating.toFixed(1)}
                <span className="text-2xl text-zinc-400">/5</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i < Math.round(avgRating) ? "text-yellow-400" : "text-zinc-700"} fill-current`}
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-400 text-sm">
                {reviewCount} {t("reviews_count_label")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres service */}
      <section className="relative z-10 bg-black border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 py-4">
            {services.map((s) => (
              <span
                key={s.slug}
                className="px-4 py-1.5 rounded-full border border-zinc-700 text-zinc-300 text-xs hover:border-[#E50000]/50 hover:text-white transition-all"
              >
                {s.label}
              </span>
            ))}
          </div>

          {/* Filtres pays */}
          <div className="flex flex-wrap gap-3 pb-4">
            <span className="text-zinc-500 text-xs self-center">
              {t("filter_country")}
            </span>
            {[
              { code: "FR", label: "🇫🇷 France" },
              { code: "CH", label: "🇨🇭 Suisse" },
              { code: "DE", label: "🇩🇪 Allemagne" },
            ].map((c) => (
              <span
                key={c.code}
                className="px-3 py-1 rounded-full border border-zinc-700 text-zinc-300 text-xs hover:border-[#E50000]/50 hover:text-white transition-all"
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Grille testimonials */}
      <section className="relative z-10 bg-zinc-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA bas de page */}
      <section className="relative z-10 bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-4">
            {t("cta_title")}{" "}
            <span className="text-[#E50000]">{t("cta_title_highlight")}</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg">{t("cta_subtitle")}</p>
          <Link
            href="/devis"
            className="inline-flex items-center gap-2 bg-[#E50000] hover:bg-[#E50000]/90 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base"
          >
            {t("cta_button")}
          </Link>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
