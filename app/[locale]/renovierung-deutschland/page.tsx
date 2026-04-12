import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { VILLES_DE } from "@/lib/villes-de";
import { LinkButton } from "@/components/ui/link-button";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isDE = locale === "de";
  const isFR = locale === "fr";

  const title = isDE
    ? "Renovierung in Deutschland | AIMAN RENOVATION — Französische Handwerker im Dreiländereck"
    : isFR
      ? "Rénovation en Allemagne (Bade-Wurtemberg) | AIMAN RENOVATION"
      : "Renovation in Germany (Baden-Württemberg) | AIMAN RENOVATION";

  const description = isDE
    ? "Renovierung in Deutschland: Weil am Rhein, Lörrach, Grenzach-Wyhlen, Kandern. Französische Qualität direkt aus dem Elsass. Kostenlose Offerte in 48 Stunden."
    : isFR
      ? "Rénovation tous corps d'état en Allemagne (Bade-Wurtemberg) — Weil am Rhein, Lörrach, Kandern. Devis gratuit en 48h."
      : "Full-service renovation in Germany (Baden-Württemberg). French craftsman from Saint-Louis. Free quote within 48h.";

  const BASE = "https://aiman-renovation.fr";
  const path = "/renovierung-deutschland";
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
          url: `${BASE}/images/villes/weil-am-rhein.webp`,
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
      images: [`${BASE}/images/villes/weil-am-rhein.webp`],
    },
  };
}

export default async function RenovierungDeutschlandPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isDE = locale === "de";
  const isFR = locale === "fr";

  const villesByDistance = [...VILLES_DE].sort((a, b) => a.distance - b.distance);

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
      { "@type": "Country", name: "Germany" },
      { "@type": "AdministrativeArea", name: "Baden-Württemberg", addressCountry: "DE" },
      { "@type": "AdministrativeArea", name: "Landkreis Lörrach", addressCountry: "DE" },
    ],
    priceRange: "€€",
    image: "https://aiman-renovation.fr/images/villes/weil-am-rhein.webp",
    description: isDE
      ? "Französisches Renovierungsunternehmen für Baden-Württemberg."
      : "Entreprise de rénovation française pour le Bade-Wurtemberg.",
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
          ? "Renovierung Deutschland"
          : isFR
            ? "Rénovation Allemagne"
            : "Renovation Germany",
        item: "https://aiman-renovation.fr/renovierung-deutschland",
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
              ? "Renovierung Deutschland"
              : isFR
                ? "Rénovation Allemagne"
                : "Renovation Germany"}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/villes/weil-am-rhein.webp"
            alt="Renovierung Baden-Württemberg — Aiman Renovation"
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
              🇩🇪 {VILLES_DE.length}{" "}
              {isDE ? "Städte bedient" : isFR ? "villes desservies" : "cities served"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
            {isDE
              ? "Renovierung in Baden-Württemberg"
              : isFR
                ? "Rénovation en Bade-Wurtemberg"
                : "Renovation in Baden-Württemberg"}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-3 font-light">
            {isDE
              ? "Französische Handwerker direkt aus Saint-Louis · Landkreis Lörrach"
              : "Artisans français depuis Saint-Louis · district de Lörrach"}
          </p>

          <p className="text-sm md:text-base text-gray-400 mb-8 italic">
            {isDE
              ? "Schnelle Anfahrt im Dreiländereck · Zweisprachige Beratung"
              : "Intervention rapide dans le tri-frontière · Conseil bilingue"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton href="/devis" variant="default" size="lg">
              {isDE ? "Angebot anfragen" : "Demander un devis"}
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
                ? "Ihr Renovierungspartner im Landkreis Lörrach"
                : "Votre partenaire rénovation dans le district de Lörrach"}
            </h2>

            {isDE ? (
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  AIMAN RENOVATION ist ein französisches Renovierungsunternehmen
                  aus Saint-Louis im Elsass — direkt an der deutsch-französischen
                  Grenze, nur wenige Minuten von Weil am Rhein und Lörrach
                  entfernt. Wir bedienen den gesamten Landkreis Lörrach im
                  Dreiländereck.
                </p>
                <p>
                  Unser Angebot umfasst alle Gewerke: Komplettsanierung,
                  Badezimmer- und Küchenrenovation, Malerarbeiten, Plattenleger-
                  und Bodenbelagsarbeiten, Sanitär- und Elektroinstallationen,
                  Wärmedämmung sowie Fassadenrenovation.
                </p>
                <p>
                  <strong className="text-white">Warum französische Handwerker im Markgräflerland?</strong>{" "}
                  Die Lohnkosten in Frankreich sind tiefer als in Deutschland,
                  und unsere Materialien stammen von zertifizierten Lieferanten
                  (Cedeo, Point P, Rexel). Wir kennen die deutschen DIN-Normen
                  ebenso gut wie die französischen DTU. Unser zweisprachiges Team
                  bietet Beratung und Offerten auf Deutsch oder Französisch — ohne
                  Sprachbarriere, ohne Missverständnisse.
                </p>
                <p>
                  Ob klassisches Markgräflerhaus aus dem 19. Jahrhundert,
                  Reihenhaus aus den 1970ern oder moderner Neubau in Weil am
                  Rhein: wir beraten Sie individuell und schlagen die beste
                  technische Lösung mit dem optimalen Preis-Leistungs-Verhältnis vor.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  AIMAN RENOVATION est une entreprise de rénovation française
                  basée à Saint-Louis (Alsace), juste à la frontière franco-
                  allemande, à quelques minutes de Weil am Rhein et Lörrach.
                  Nous intervenons dans tout le district de Lörrach (Landkreis)
                  dans la zone tri-frontière.
                </p>
                <p>
                  Notre offre couvre tous les corps d'état : rénovation complète,
                  salles de bains, cuisines, peinture, carrelage et sols, plomberie,
                  électricité, isolation thermique et façades.
                </p>
                <p>
                  <strong className="text-white">Pourquoi un artisan français pour le Markgräflerland ?</strong>{" "}
                  Les coûts salariaux en France sont inférieurs à ceux de
                  l'Allemagne, et nos matériaux proviennent de fournisseurs
                  certifiés (Cedeo, Point P, Rexel). Nous connaissons les normes
                  allemandes DIN aussi bien que les normes françaises DTU. Notre
                  équipe bilingue propose conseil et devis en allemand ou en
                  français — sans barrière linguistique.
                </p>
                <p>
                  Que ce soit une maison traditionnelle du 19e siècle, une maison
                  mitoyenne des années 1970 ou un logement neuf à Weil am Rhein,
                  nous vous conseillons individuellement et vous proposons la
                  meilleure solution technique au meilleur rapport qualité-prix.
                </p>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Cities grid */}
      <section className="bg-zinc-950 py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
              {isDE
                ? "Bedient Städte und Gemeinden"
                : "Villes et communes desservies"}
            </h2>
            <p className="text-gray-400 text-center mb-12">
              {isDE
                ? `${VILLES_DE.length} Städte im Landkreis Lörrach — sortiert nach Entfernung`
                : `${VILLES_DE.length} villes dans le district de Lörrach — par distance`}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {villesByDistance.map((ville) => (
                <Link
                  key={ville.slug}
                  href={`/renovierung-deutschland/${ville.slug}`}
                  className="group bg-black border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-white">
                      {ville.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {ville.distance} km
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    {ville.kreis}
                    {ville.population && ` · ${ville.population.toLocaleString("de-DE")} Einw.`}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {ville.specificitesDE[0]}
                  </p>
                  <span className="inline-block mt-4 text-xs text-white/70 group-hover:text-white transition-colors">
                    {isDE ? "Details ansehen →" : "Voir les détails →"}
                  </span>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isDE
                ? "Bereit für Ihre Renovierung in Deutschland?"
                : "Prêt pour votre rénovation en Allemagne ?"}
            </h2>
            <p className="text-gray-400 mb-8">
              {isDE
                ? "Kostenloses Angebot in 48 Stunden. Unverbindlich, transparent."
                : "Devis gratuit en 48h. Sans engagement, transparent."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LinkButton href="/devis" variant="default" size="lg">
                {isDE ? "Angebot anfragen" : "Demander un devis"}
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
