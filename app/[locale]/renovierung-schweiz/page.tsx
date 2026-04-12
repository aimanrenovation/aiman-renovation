import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { VILLES_CH } from "@/lib/villes-ch";
import { LinkButton } from "@/components/ui/link-button";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";

interface Props {
  params: Promise<{ locale: string }>;
}

const CANTONS_META = [
  {
    code: "BS",
    slug: "basel-stadt",
    nameDE: "Basel-Stadt",
    nameFR: "Bâle-Ville",
    population: 195000,
  },
  {
    code: "BL",
    slug: "basel-landschaft",
    nameDE: "Basel-Landschaft",
    nameFR: "Bâle-Campagne",
    population: 290000,
  },
  {
    code: "SO",
    slug: "solothurn",
    nameDE: "Solothurn (Dorneck)",
    nameFR: "Soleure (Dorneck)",
    population: 280000,
  },
] as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isDE = locale === "de";
  const isFR = locale === "fr";

  const title = isDE
    ? "Renovierung in der Schweiz | AIMAN RENOVATION — Französische Handwerker Basel"
    : isFR
      ? "Rénovation en Suisse (Bâle, Bâle-Campagne) | AIMAN RENOVATION"
      : "Renovation in Switzerland (Basel area) | AIMAN RENOVATION";

  const description = isDE
    ? "Renovierung in der Schweiz: Komplettsanierung, Bad, Küche, Malerarbeiten in Basel, Riehen, Allschwil, Muttenz... Französische Qualität, 30-40% günstiger. Offerte CHF/EUR in 48h."
    : isFR
      ? "Rénovation tous corps d'état en Suisse — région bâloise. Artisan français à 5 km de Bâle. Devis gratuit en CHF ou EUR sous 48h. 17 communes desservies."
      : "Full-service renovation in Switzerland (Basel region). French craftsman 5 km from Basel. Free quote in CHF or EUR within 48h.";

  const BASE = "https://aiman-renovation.fr";
  const path = "/renovierung-schweiz";
  const canonicalUrl = isFR ? `${BASE}${path}` : `${BASE}/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${BASE}${path}`,
        de: `${BASE}/de${path}`,
        en: `${BASE}/en${path}`,
        "x-default": `${BASE}${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Aiman Renovation",
      images: [
        {
          url: `${BASE}/images/villes/basel.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      locale: isDE ? "de_DE" : isFR ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE}/images/villes/basel.webp`],
    },
  };
}

export default async function RenovierungSchweizPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isDE = locale === "de";
  const isFR = locale === "fr";

  // Cities sorted by distance
  const villesByDistance = [...VILLES_CH].sort((a, b) => a.distance - b.distance);

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": "https://aiman-renovation.fr/#organization",
    name: "Aiman Renovation",
    url: "https://aiman-renovation.fr",
    telephone: "+33939245515",
    email: "contact@aiman-renovation.fr",
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Rue de Bâle",
      addressLocality: "Saint-Louis",
      postalCode: "68300",
      addressCountry: "FR",
    },
    areaServed: [
      { "@type": "Country", name: "Switzerland" },
      { "@type": "AdministrativeArea", name: "Basel-Stadt", addressCountry: "CH" },
      { "@type": "AdministrativeArea", name: "Basel-Landschaft", addressCountry: "CH" },
      { "@type": "City", name: "Basel", addressCountry: "CH" },
    ],
    priceRange: "€€",
    image: "https://aiman-renovation.fr/images/villes/basel.webp",
    description: isDE
      ? "Renovierungsunternehmen aus dem Elsass für die Region Basel."
      : "Entreprise de rénovation française pour la région bâloise.",
  };

  const breadcrumbData = {
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
          ? "Renovierung Schweiz"
          : isFR
            ? "Rénovation Suisse"
            : "Renovation Switzerland",
        item: "https://aiman-renovation.fr/renovierung-schweiz",
      },
    ],
  };

  return (
    <>
      <JsonLd data={localBusinessData} />
      <JsonLd data={breadcrumbData} />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="relative z-20 bg-black border-b border-white/5 px-6 py-3"
      >
        <ol className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-white transition-colors">
              {isDE ? "Startseite" : isFR ? "Accueil" : "Home"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-700">/</li>
          <li className="text-white font-medium">
            {isDE
              ? "Renovierung Schweiz"
              : isFR
                ? "Rénovation Suisse"
                : "Renovation Switzerland"}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/villes/basel.webp"
            alt="Renovierung Basel — Aiman Renovation"
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium tracking-widest text-gray-300 uppercase">
              🇨🇭 {VILLES_CH.length}{" "}
              {isDE ? "Gemeinden bedient" : isFR ? "communes desservies" : "municipalities served"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
            {isDE
              ? "Renovierung in der Schweiz"
              : isFR
                ? "Rénovation en Suisse"
                : "Renovation in Switzerland"}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-3 font-light">
            {isDE
              ? "Französische Handwerker direkt aus Saint-Louis · 5 km von Basel"
              : "Artisans français depuis Saint-Louis · à 5 km de Bâle"}
          </p>

          <p className="text-sm md:text-base text-gray-400 mb-8 italic">
            {isDE
              ? "30–40 % günstiger als Schweizer Mitbewerber · Offerte in CHF oder EUR"
              : "30-40% moins cher qu'un artisan suisse · Devis en CHF ou EUR"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton href="/devis" variant="default" size="lg">
              {isDE ? "Offerte anfragen" : "Demander un devis"}
            </LinkButton>
            <LinkButton href="/contact" variant="outline" size="lg">
              {isDE ? "Kontakt" : "Nous contacter"}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Intro long-form SEO */}
      <section className="bg-black py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              {isDE
                ? "Ihr Renovierungspartner für die Region Basel"
                : "Votre partenaire rénovation pour la région bâloise"}
            </h2>

            {isDE ? (
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  AIMAN RENOVATION ist ein französisches Renovierungsunternehmen aus
                  Saint-Louis (Elsass), nur 5 Kilometer von Basel entfernt. Seit
                  unserer Gründung haben wir uns auf die Bedürfnisse der Schweizer
                  Eigentümer in der Region Nordwestschweiz spezialisiert: schnelle
                  Anfahrt, faire Preise, Schweizer Qualität.
                </p>
                <p>
                  Wir bieten Komplettsanierungen, Badezimmer- und Küchenrenovationen,
                  Malerarbeiten, Plattenlegerarbeiten, Sanitär- und
                  Elektroinstallationen, Wärmedämmungen sowie Fassadenrenovationen.
                  Unsere Handwerker sind zertifiziert (RGE in Frankreich, Schulungen
                  zu SIA-Normen 380/1 für Wärmedämmung).
                </p>
                <p>
                  <strong className="text-white">Warum französische Handwerker für die Schweiz?</strong>{" "}
                  Die Lohnkosten und Sozialabgaben in Frankreich sind deutlich tiefer
                  als in der Schweiz, ohne dass die handwerkliche Qualität darunter
                  leidet — wir verwenden zertifiziertes Material von Cedeo, Point P
                  oder Rexel und arbeiten nach den DTU-Normen, die zu den strengsten
                  Europas gehören. Das Resultat: 30 bis 40 % Ersparnis bei
                  vergleichbarer oder besserer Qualität.
                </p>
                <p>
                  Wir bedienen den gesamten Kanton Basel-Stadt, das Baselbiet und
                  die Region Dorneck im nördlichen Solothurn. Unser zweisprachiges
                  Team (Deutsch/Französisch) erstellt Ihre Offerte in CHF oder EUR
                  — Sie wählen die Währung und sind vor Wechselkursschwankungen
                  geschützt.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  AIMAN RENOVATION est une entreprise de rénovation française basée
                  à Saint-Louis (Alsace), à seulement 5 kilomètres de Bâle. Depuis
                  notre création, nous nous sommes spécialisés dans les besoins des
                  propriétaires suisses de la région de Bâle : intervention rapide,
                  prix justes, qualité suisse.
                </p>
                <p>
                  Nous proposons rénovations complètes, salles de bains, cuisines,
                  peinture, carrelage, plomberie, électricité, isolation thermique
                  et façades. Nos artisans sont certifiés (RGE en France, formés
                  aux normes SIA 380/1 pour l'isolation).
                </p>
                <p>
                  <strong className="text-white">Pourquoi un artisan français pour la Suisse ?</strong>{" "}
                  Les coûts salariaux et les charges sociales en France sont
                  nettement inférieurs à ceux de la Suisse, sans que la qualité
                  artisanale n'en souffre — nous utilisons des matériaux certifiés
                  Cedeo, Point P, Rexel et travaillons selon les normes DTU,
                  parmi les plus strictes d'Europe. Résultat : 30 à 40 % d'économies
                  pour une qualité équivalente ou supérieure.
                </p>
                <p>
                  Nous desservons tout le canton de Bâle-Ville, le Bâle-Campagne
                  et la région Dorneck dans le nord du canton de Soleure. Notre
                  équipe bilingue (allemand/français) vous établit votre devis en
                  CHF ou EUR — vous choisissez la monnaie et vous êtes protégé
                  des fluctuations de change.
                </p>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Cantons grid */}
      <section className="bg-zinc-950 py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
              {isDE
                ? "Wählen Sie Ihren Kanton"
                : "Choisissez votre canton"}
            </h2>
            <p className="text-gray-400 text-center mb-12">
              {isDE
                ? "3 Kantone bedient — Detailseiten mit lokalen Informationen"
                : "3 cantons desservis — pages détaillées avec informations locales"}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {CANTONS_META.map((canton) => {
                const villesCount = VILLES_CH.filter(
                  (v) => v.canton === canton.code
                ).length;
                return (
                  <Link
                    key={canton.slug}
                    href={`/renovierung-schweiz/kanton/${canton.slug}`}
                    className="group bg-black border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all"
                  >
                    <div className="text-4xl mb-3">
                      {canton.code === "BS" ? "🏛️" : canton.code === "BL" ? "🏞️" : "🌲"}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {canton.code}
                    </h3>
                    <p className="text-lg text-gray-300 mb-3">
                      {isDE ? canton.nameDE : canton.nameFR}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {canton.population.toLocaleString("de-CH")}{" "}
                      {isDE ? "Einw." : "hab."} · {villesCount}{" "}
                      {isDE ? "Gemeinden" : "communes"}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm text-white/70 group-hover:text-white transition-colors">
                      {isDE ? "Kanton ansehen" : "Voir le canton"} →
                    </span>
                  </Link>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* All cities grid */}
      <section className="bg-black py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
              {isDE
                ? "Alle bedienten Gemeinden"
                : "Toutes les communes desservies"}
            </h2>
            <p className="text-gray-400 text-center mb-12">
              {isDE
                ? `${VILLES_CH.length} Gemeinden, sortiert nach Entfernung von Saint-Louis`
                : `${VILLES_CH.length} communes, classées par distance depuis Saint-Louis`}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {villesByDistance.map((ville) => (
                <Link
                  key={ville.slug}
                  href={`/renovierung-schweiz/${ville.slug}`}
                  className="group bg-zinc-950 border border-white/5 rounded-lg px-4 py-3 hover:border-white/20 transition-all"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-white font-medium group-hover:text-white">
                      {ville.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {ville.distance} km
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{ville.canton}</span>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-950 py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isDE
                ? "Bereit für Ihre Renovierung in der Schweiz?"
                : "Prêt pour votre rénovation en Suisse ?"}
            </h2>
            <p className="text-gray-400 mb-8">
              {isDE
                ? "Kostenlose Offerte in 48 Stunden — in CHF oder EUR. Keine Verpflichtung, kein Risiko."
                : "Devis gratuit en 48h — en CHF ou EUR. Sans engagement, sans risque."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LinkButton href="/devis" variant="default" size="lg">
                {isDE ? "Offerte anfragen" : "Demander un devis"}
              </LinkButton>
              <LinkButton href="/contact" variant="outline" size="lg">
                {isDE ? "Kontakt" : "Nous contacter"}
              </LinkButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
