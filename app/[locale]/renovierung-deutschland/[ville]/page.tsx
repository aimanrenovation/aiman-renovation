import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { VILLES_DE } from "@/lib/villes-de";
import { SERVICES } from "@/lib/services";
import { COMPANY } from "@/lib/constants";
import { LinkButton } from "@/components/ui/link-button";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import { getAlternates } from "@/lib/i18n-helpers";

interface Props {
  params: Promise<{ ville: string; locale: string }>;
}

export function generateStaticParams() {
  return VILLES_DE.map((v) => ({ ville: v.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { ville: villeSlug, locale } = await params;
  const ville = VILLES_DE.find((v) => v.slug === villeSlug);
  if (!ville) return {};

  const title =
    locale === "fr"
      ? ville.seoTitleFR
      : locale === "en"
      ? `Renovation in ${ville.name} — French Craftsman`
      : ville.seoTitleDE;
  const description =
    locale === "fr"
      ? ville.seoDescriptionFR
      : locale === "en"
      ? `Professional renovation in ${ville.name}, Baden-Württemberg. French craftsman from Saint-Louis, ${ville.distance} km away. Free quote in EUR.`
      : ville.seoDescriptionDE;

  return {
    title,
    description,
    alternates: getAlternates(`/renovierung-deutschland/${villeSlug}`),
    openGraph: {
      title,
      description,
      url: `https://aiman-renovation.fr/renovierung-deutschland/${villeSlug}`,
      siteName: "Aiman Renovation",
      images: [
        {
          url: `https://aiman-renovation.fr${ville.featuredImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      locale:
        locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://aiman-renovation.fr${ville.featuredImage}`],
    },
  };
}

interface TranslatedVilleDE {
  slug: string;
  name: string;
  hero: { h1: string; subtitle: string };
  intro: string;
  intro_de_short: string;
  warumAiman: string;
  cta: string;
}

async function getTranslatedVille(
  locale: string,
  slug: string
): Promise<TranslatedVilleDE | undefined> {
  const tRoot = await getTranslations({ locale });
  const items = tRoot.raw("ville_de_items") as TranslatedVilleDE[];
  return items.find((v) => v.slug === slug);
}

const FEATURED_SERVICE_SLUGS = [
  "cuisine",
  "salle-de-bain",
  "sols-carrelage",
  "peinture",
  "facade",
  "isolation",
];

const ARGUMENTE_DE = [
  { icon: "💶", text: "Preiswerter als der deutsche Handwerkermarkt" },
  { icon: "🏅", text: "Französische Qualitätsstandards & RGE-Zertifizierung" },
  { icon: "📍", text: "Kurze Anfahrt von Saint-Louis (5–25 Min.)" },
  { icon: "📋", text: "Kostenloser Kostenvoranschlag in EUR" },
  { icon: "🔧", text: "DIN-Normen und EnEV / GEG beachtet" },
  { icon: "🏗️", text: "Moderne Materialien und professionelles Werkzeug" },
  { icon: "🗺️", text: "Einsatzgebiet gesamter Landkreis Lörrach" },
];

export default async function VilleAllemagnePage({ params }: Props) {
  const { ville: villeSlug, locale } = await params;
  setRequestLocale(locale);

  const ville = VILLES_DE.find((v) => v.slug === villeSlug);
  if (!ville) notFound();

  const translated = await getTranslatedVille(locale, villeSlug);
  if (!translated) notFound();

  const isDE = locale === "de";
  const isFR = locale === "fr";

  const h1 = translated.hero.h1;
  const subtitle = translated.hero.subtitle;
  const introText = translated.intro;
  const warumText = isDE ? translated.warumAiman : "";

  const featuredServices = SERVICES.filter((s) =>
    FEATURED_SERVICE_SLUGS.includes(s.slug)
  );

  // All JSON-LD is derived from static app data only — no user input
  const localBusinessJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": "https://aiman-renovation.fr/#organization",
    name: "Aiman Renovation",
    description: isDE
      ? "Französischer Handwerksbetrieb für Renovierungsarbeiten in Baden-Württemberg"
      : "Artisan français spécialisé en rénovation en Bade-Wurtemberg",
    url: "https://aiman-renovation.fr",
    telephone: COMPANY.phone,
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address,
      addressLocality: COMPANY.city,
      postalCode: COMPANY.zip,
      addressCountry: "FR",
    },
    areaServed: [
      { "@type": "City", name: ville.name, addressCountry: "DE" },
      {
        "@type": "AdministrativeArea",
        name: "Landkreis Lörrach",
        addressCountry: "DE",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.5928,
      longitude: 7.5649,
    },
    priceRange: "€€",
    currenciesAccepted: "EUR",
  });

  const serviceJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: isDE
      ? "Renovierungsarbeiten in " + ville.name
      : "Travaux de rénovation à " + ville.name,
    description: isDE ? ville.seoDescriptionDE : ville.seoDescriptionFR,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://aiman-renovation.fr/#organization",
      name: "Aiman Renovation",
    },
    areaServed: {
      "@type": "City",
      name: ville.name,
      addressCountry: "DE",
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        description: isDE ? "Kostenloser Kostenvoranschlag" : "Devis gratuit",
      },
    },
  });

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isDE ? "Startseite" : isFR ? "Accueil" : "Home",
        item: "https://aiman-renovation.fr/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isDE
          ? "Renovierung Deutschland"
          : isFR
          ? "Rénovation Allemagne"
          : "Renovation Germany",
        item: "https://aiman-renovation.fr/renovierung-deutschland",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: ville.name,
        item:
          "https://aiman-renovation.fr/renovierung-deutschland/" + villeSlug,
      },
    ],
  });

  return (
    <>
      {/* JSON-LD — static app data only, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: localBusinessJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serviceJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label={isDE ? "Brotkrumennavigation" : "Fil d'Ariane"}
        className="relative z-20 bg-black border-b border-white/5 px-6 py-3"
      >
        <ol className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-white transition-colors">
              {isDE ? "Startseite" : isFR ? "Accueil" : "Home"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-700">/</li>
          <li>
            <Link
              href="/renovierung-deutschland"
              className="hover:text-white transition-colors"
            >
              {isDE ? "Deutschland" : isFR ? "Allemagne" : "Germany"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-700">/</li>
          <li className="text-white font-medium">{ville.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <Image
          src={ville.featuredImage}
          alt={ville.name + " — Renovierung Aiman Renovation"}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 pt-40">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-1 rounded-full bg-[#002B7F]" />
            <div className="w-6 h-1 rounded-full bg-white" />
            <div className="w-6 h-1 rounded-full bg-[#CE1126]" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium bg-white/10 text-gray-300 border border-white/10 px-3 py-1 rounded-full">
              {ville.bundesland} · {ville.kreis} Kreis · {ville.distance} km
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight text-white">
            {h1.toUpperCase()}
          </h1>
          <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          {isDE && (
            <p className="mt-2 text-gray-500 text-sm max-w-xl">
              Rénovation à {ville.name} ({ville.bundesland}) | Artisan
              frontalier français
            </p>
          )}
          {isFR && (
            <p className="mt-2 text-gray-500 text-sm max-w-xl">
              Renovierung in {ville.name} · Handwerker aus Saint-Louis
            </p>
          )}

          <div className="mt-8">
            <LinkButton
              href="/devis"
              size="lg"
              className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4"
            >
              {translated.cta}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Main intro */}
      {introText && (
        <ScrollReveal direction="up">
          <section className="relative z-10 bg-[#0A0A0A] py-24 md:py-32">
            <div className="max-w-5xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                <div className="md:col-span-4">
                  <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                  <h2 className="font-heading text-2xl md:text-3xl leading-tight text-white">
                    {isDE ? (
                      <>
                        RENOVIERUNG IN{" "}
                        <span className="text-[#E50000]">
                          {ville.name.toUpperCase()}
                        </span>
                      </>
                    ) : isFR ? (
                      <>
                        RÉNOVATION À{" "}
                        <span className="text-[#E50000]">
                          {ville.name.toUpperCase()}
                        </span>
                      </>
                    ) : (
                      <>
                        RENOVATION IN{" "}
                        <span className="text-[#E50000]">
                          {ville.name.toUpperCase()}
                        </span>
                      </>
                    )}
                  </h2>
                  <div className="mt-6 space-y-2">
                    {(isDE ? ville.specificitesDE : ville.specificitesFR).map(
                      (spec) => (
                        <div
                          key={spec}
                          className="flex items-start gap-2 text-sm text-gray-400"
                        >
                          <span className="text-[#E50000] mt-0.5 shrink-0">
                            →
                          </span>
                          <span>{spec}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="md:col-span-8 space-y-5 text-gray-400 text-lg leading-relaxed">
                  {introText.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Warum AIMAN RENOVATION — DE only */}
      {isDE && warumText && (
        <ScrollReveal direction="up" delay={0.05}>
          <section className="relative z-10 bg-black py-24 md:py-32">
            <div className="max-w-5xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                <div className="md:col-span-5">
                  <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                  <h2 className="font-heading text-2xl md:text-3xl text-white leading-tight">
                    WARUM{" "}
                    <span className="text-[#E50000]">AIMAN RENOVATION?</span>
                  </h2>
                  <div className="mt-8 space-y-4">
                    {ARGUMENTE_DE.map((arg) => (
                      <div
                        key={arg.text}
                        className="flex items-start gap-3 bg-[#111111] rounded-xl p-4 border border-white/5"
                      >
                        <span className="text-2xl leading-none shrink-0">
                          {arg.icon}
                        </span>
                        <span className="text-gray-300 text-sm leading-relaxed">
                          {arg.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-7 space-y-5 text-gray-400 text-lg leading-relaxed">
                  {warumText.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  <div className="mt-8 p-6 bg-[#111111] border border-[#E50000]/20 rounded-xl">
                    <p className="text-white font-heading text-lg mb-2">
                      Ihr Vorteil:
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Aiman Renovation ist in Saint-Louis (Frankreich) ansässig
                      — nur {ville.distance} km von {ville.name}.{" "}
                      Geringe Anfahrtskosten, faire Stundensätze, kostenloser
                      Kostenvoranschlag.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* FR/EN — why choose us */}
      {!isDE && (
        <ScrollReveal direction="up" delay={0.05}>
          <section className="relative z-10 bg-black py-20">
            <div className="max-w-5xl mx-auto px-6">
              <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
              <h2 className="font-heading text-2xl md:text-3xl text-white mb-8">
                {isFR ? (
                  <>
                    POURQUOI CHOISIR{" "}
                    <span className="text-[#E50000]">AIMAN RENOVATION ?</span>
                  </>
                ) : (
                  <>
                    WHY CHOOSE{" "}
                    <span className="text-[#E50000]">AIMAN RENOVATION?</span>
                  </>
                )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ARGUMENTE_DE.map((arg) => (
                  <div
                    key={arg.text}
                    className="flex items-start gap-3 bg-[#111111] rounded-xl p-4 border border-white/5"
                  >
                    <span className="text-xl leading-none shrink-0">
                      {arg.icon}
                    </span>
                    <span className="text-gray-300 text-sm leading-relaxed">
                      {arg.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Services in this city */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#0A0A0A] py-24 md:py-32 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
            <h2 className="font-heading text-2xl md:text-3xl text-white mb-4">
              {isDE ? (
                <>
                  UNSERE LEISTUNGEN{" "}
                  <span className="text-[#E50000]">
                    IN {ville.name.toUpperCase()}
                  </span>
                </>
              ) : isFR ? (
                <>
                  NOS SERVICES À{" "}
                  <span className="text-[#E50000]">
                    {ville.name.toUpperCase()}
                  </span>
                </>
              ) : (
                <>
                  OUR SERVICES IN{" "}
                  <span className="text-[#E50000]">
                    {ville.name.toUpperCase()}
                  </span>
                </>
              )}
            </h2>
            <p className="text-gray-400 mb-10 max-w-2xl">
              {isDE
                ? "Wir bieten das komplette Spektrum an Renovierungsleistungen — koordiniert, termingerecht und zum Festpreis."
                : isFR
                ? "Nous intervenons pour tous vos travaux de rénovation — coordinés, dans les délais, au prix convenu."
                : "We provide full renovation services — coordinated, on time, at agreed price."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredServices.map((service) => (
                <Link
                  key={service.slug}
                  href={"/services/" + service.slug}
                  className="group bg-[#111111] border border-white/5 hover:border-[#E50000]/20 rounded-xl p-6 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{service.icon}</span>
                    <span className="font-heading text-white text-sm group-hover:text-[#E50000] transition-colors">
                      {service.shortTitle.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                  <span className="inline-block mt-4 text-[#E50000] text-xs font-medium">
                    {isDE ? "Mehr erfahren →" : isFR ? "Voir le service →" : "Learn more →"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Distance band */}
      <section className="relative z-10 bg-[#111111] border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-1">
                {isDE
                  ? "Anfahrt von Saint-Louis"
                  : isFR
                  ? "Depuis Saint-Louis"
                  : "From Saint-Louis"}
              </p>
              <p className="font-heading text-2xl text-white">
                {ville.distance} km · ~{Math.round(ville.distance * 1.5)} min
              </p>
            </div>
            <div className="h-px md:h-auto md:w-px bg-white/10 md:self-stretch" />
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-1">
                {isDE ? "Telefon" : isFR ? "Téléphone" : "Phone"}
              </p>
              <a
                href={"tel:" + COMPANY.phone.replace(/\s/g, "")}
                className="font-heading text-white text-xl hover:text-[#E50000] transition-colors"
              >
                {COMPANY.phone}
              </a>
            </div>
            <div className="h-px md:h-auto md:w-px bg-white/10 md:self-stretch" />
            <LinkButton
              href="/devis"
              className="bg-[#E50000] hover:bg-[#B80000] text-white"
              size="lg"
            >
              {translated.cta}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 bg-black py-24 md:py-32 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="w-12 h-0.5 bg-[#E50000] mb-6 mx-auto" />
          <h2 className="font-heading text-3xl md:text-5xl text-white mb-6 leading-tight">
            {isDE ? (
              <>
                BEREIT FÜR IHRE RENOVIERUNG{" "}
                <span className="text-[#E50000]">
                  IN {ville.name.toUpperCase()}?
                </span>
              </>
            ) : isFR ? (
              <>
                PRÊT POUR VOTRE RÉNOVATION{" "}
                <span className="text-[#E50000]">
                  À {ville.name.toUpperCase()} ?
                </span>
              </>
            ) : (
              <>
                READY FOR YOUR RENOVATION{" "}
                <span className="text-[#E50000]">
                  IN {ville.name.toUpperCase()}?
                </span>
              </>
            )}
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {isDE
              ? "Kostenloser Kostenvoranschlag in EUR. Aiman Renovation aus Saint-Louis kommt zu Ihnen — schnelle Anfahrt, faire Preise, erstklassige Qualität."
              : isFR
              ? "Devis gratuit en euros. Aiman Renovation vient chez vous — intervention rapide, prix compétitifs, qualité française."
              : "Free quote in euros. Aiman Renovation comes to you — fast response, competitive pricing, French quality."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton
              href="/devis"
              size="lg"
              className="bg-[#E50000] hover:bg-[#B80000] text-white px-10 py-4"
            >
              {translated.cta}
            </LinkButton>
            <a
              href={"tel:" + COMPANY.phone.replace(/\s/g, "")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-[#E50000]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
