import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { VILLES_CH, type VilleCH } from "@/lib/villes-ch";
import { LinkButton } from "@/components/ui/link-button";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";

interface Props {
  params: Promise<{ kanton: string; locale: string }>;
}

type CantonCode = "BS" | "BL" | "SO" | "AG" | "JU";

interface CantonMeta {
  code: CantonCode;
  slug: string;
  nameDE: string;
  nameFR: string;
  nameEN: string;
  capital: string;
  population: number;
  surfaceKm2: number;
  seoTitleDE: string;
  seoDescriptionDE: string;
  seoTitleFR: string;
  seoDescriptionFR: string;
  introDE: string;
  introFR: string;
  highlights: string[];
  featuredImage: string;
}

const CANTONS: Record<string, CantonMeta> = {
  "basel-stadt": {
    code: "BS",
    slug: "basel-stadt",
    nameDE: "Basel-Stadt",
    nameFR: "Bâle-Ville",
    nameEN: "Basel-City",
    capital: "Basel",
    population: 195000,
    surfaceKm2: 37,
    seoTitleDE:
      "Renovierung Kanton Basel-Stadt | AIMAN RENOVATION — Französische Handwerker",
    seoDescriptionDE:
      "Renovierung im Kanton Basel-Stadt: Komplettsanierung, Bad, Küche, Malerarbeiten. Französische Qualität, Offerte in CHF oder EUR. Kostenlos in 48h.",
    seoTitleFR:
      "Rénovation Canton Bâle-Ville | AIMAN RENOVATION Saint-Louis",
    seoDescriptionFR:
      "Rénovation tous corps d'état dans le canton de Bâle-Ville. Devis gratuit en 48h, en CHF ou EUR. Artisan frontalier français à 5 km de Bâle.",
    introDE:
      "Der Kanton Basel-Stadt — der kleinste und gleichzeitig dichteste Kanton der Schweiz — vereint mit seinen rund 195 000 Einwohnern auf nur 37 km² ein einzigartiges urbanes Renovierungspotenzial. Von den repräsentativen Bürgerhäusern im Grossbasel über die historischen Liegenschaften im Kleinbasel bis hin zu den eleganten Villen in Riehen — jede Immobilie hat ihre eigene Geschichte und ihre eigenen Renovierungsherausforderungen.\n\nAIMAN RENOVATION ist seit Jahren der bevorzugte Renovierungspartner von Eigentümern in Basel, Riehen und Bettingen. Unsere Position in Saint-Louis (nur 5 Kilometer Luftlinie vom Marktplatz) erlaubt uns kurze Anfahrtswege, schnelle Reaktionen und Preise, die 30 bis 40 % unter denen Schweizer Mitbewerber liegen — bei gleicher handwerklicher Qualität und voller Konformität mit den Schweizer Bauvorschriften.\n\nUnser Team arbeitet zweisprachig (Deutsch und Französisch), kennt die Eigenheiten des Basler Baurechts, die Anforderungen der Denkmalpflege im Altstadtperimeter und die SIA-Normen, die für jede Renovation in der Schweiz gelten.",
    introFR:
      "Le canton de Bâle-Ville — le plus petit mais aussi le plus dense de Suisse — concentre sur seulement 37 km² environ 195 000 habitants et un patrimoine bâti d'une richesse exceptionnelle. Des maisons bourgeoises du Grossbasel aux immeubles historiques du Kleinbasel en passant par les villas élégantes de Riehen, chaque propriété a son histoire et ses défis de rénovation.\n\nAIMAN RENOVATION est depuis plusieurs années le partenaire rénovation privilégié des propriétaires de Bâle, Riehen et Bettingen. Notre implantation à Saint-Louis (à seulement 5 km à vol d'oiseau du Marktplatz) nous permet des temps de trajet courts, une réactivité élevée et des prix 30 à 40 % inférieurs à ceux de la concurrence suisse — à qualité artisanale égale et dans le respect total des normes de construction suisses.",
    highlights: [
      "Spezialist für Liegenschaften im Altstadtperimeter (Denkmalpflege Basel-Stadt)",
      "Erfahrung mit den lokalen Bauvorschriften: BPG, Lärmschutz, Brandschutz BS",
      "Konformität mit SIA 380/1 und Minergie-Standards für Wärmedämmung",
      "Zweisprachiges Team Deutsch/Französisch — keine Sprachbarriere",
      "Kostenvoranschlag in CHF oder EUR — kein Währungsrisiko für Sie",
      "Lieferung von zertifiziertem Material (Cedeo, Point P, Rexel)",
    ],
    featuredImage: "/images/villes/basel.webp",
  },
  "basel-landschaft": {
    code: "BL",
    slug: "basel-landschaft",
    nameDE: "Basel-Landschaft",
    nameFR: "Bâle-Campagne",
    nameEN: "Basel-Country",
    capital: "Liestal",
    population: 290000,
    surfaceKm2: 518,
    seoTitleDE:
      "Renovierung Kanton Basel-Landschaft | AIMAN RENOVATION Saint-Louis",
    seoDescriptionDE:
      "Renovierung im Kanton Basel-Landschaft: Allschwil, Binningen, Muttenz, Pratteln, Liestal. Französisches Handwerk, Offerte CHF/EUR in 48h.",
    seoTitleFR:
      "Rénovation Canton Bâle-Campagne | AIMAN RENOVATION Saint-Louis",
    seoDescriptionFR:
      "Rénovation tous corps d'état dans le canton de Bâle-Campagne (Liestal, Allschwil, Muttenz...). Devis gratuit en 48h, en CHF ou EUR.",
    introDE:
      "Der Kanton Basel-Landschaft umfasst über 290 000 Einwohner verteilt auf 86 Gemeinden und eine Fläche von 518 km². Von den dicht besiedelten Agglomerationsgemeinden wie Allschwil, Binningen oder Muttenz bis hin zur ländlichen Landschaft des oberen Baselbiets — die Vielfalt des Wohnbestands ist beeindruckend.\n\nDie Mehrheit der Einfamilienhäuser im Baselbiet stammt aus den 1960er bis 1980er Jahren und weist heute einen erheblichen Renovierungsbedarf auf: Wärmedämmung, Heizungserneuerung, Bad- und Küchenmodernisierung, Elektrosanierung. Die Eigentümer dieser Generation suchen nach zuverlässigen Handwerkern, die bezahlbare Preise und Schweizer Standards verbinden — genau das bieten wir.\n\nAIMAN RENOVATION ist von Saint-Louis aus innerhalb von 15 bis 25 Minuten in jeder Baselbieter Gemeinde — von Allschwil im Norden bis Liestal im Süden. Wir kennen die typischen Bautypen, die Wärmedämmungsproblematiken der 70er-Jahre-Häuser und die kantonalen Förderprogramme für energetische Sanierungen.",
    introFR:
      "Le canton de Bâle-Campagne compte plus de 290 000 habitants répartis sur 86 communes et une superficie de 518 km². Des communes denses de l'agglomération comme Allschwil, Binningen ou Muttenz jusqu'aux paysages ruraux du Haut-Baselbiet, la diversité du parc immobilier est impressionnante.\n\nLa majorité des maisons individuelles du Baselbiet datent des années 1960 à 1980 et présentent aujourd'hui d'importants besoins de rénovation : isolation thermique, remplacement de chauffage, modernisation de salle de bain et de cuisine, mise aux normes électriques.",
    highlights: [
      "Erfahrung mit Häusern der Baujahre 1960–1980 (typischer Baselbieter Bestand)",
      "Komplettangebot Wärmedämmung — innen, aussen, Dachboden, Boden",
      "Modernisierung von Bad und Küche mit hochwertigen Schweizer Marken",
      "Beratung zu kantonalen Förderprogrammen für energetische Sanierungen",
      "Schnelle Anfahrt von Saint-Louis: 15–25 Minuten in jede Gemeinde",
      "Vollständiges Werkvertragsmanagement nach Schweizer Recht",
    ],
    featuredImage: "/images/villes/allschwil.webp",
  },
  solothurn: {
    code: "SO",
    slug: "solothurn",
    nameDE: "Solothurn",
    nameFR: "Soleure",
    nameEN: "Solothurn",
    capital: "Solothurn",
    population: 280000,
    surfaceKm2: 791,
    seoTitleDE:
      "Renovierung Kanton Solothurn (Region Dorneck) | AIMAN RENOVATION",
    seoDescriptionDE:
      "Renovierung in der Region Dorneck (Kanton Solothurn): Dornach und Umgebung. Französische Handwerker, Offerte CHF/EUR. Kostenlos in 48h.",
    seoTitleFR:
      "Rénovation Canton Soleure (région Dorneck) | AIMAN RENOVATION",
    seoDescriptionFR:
      "Rénovation dans la région du Dorneck (canton de Soleure). Devis gratuit en 48h, en CHF ou EUR.",
    introDE:
      "Wir bedienen die Region Dorneck im nördlichsten Teil des Kantons Solothurn — eine Region, die geografisch und kulturell eng mit dem Baselbiet verbunden ist. Dornach und seine umliegenden Gemeinden profitieren von unserer Nähe und unseren wettbewerbsfähigen Preisen für alle Renovierungsarbeiten.",
    introFR:
      "Nous intervenons dans la région du Dorneck, à l'extrême nord du canton de Soleure — une région géographiquement et culturellement liée au Baselbiet. Dornach et ses communes voisines bénéficient de notre proximité et de nos prix compétitifs.",
    highlights: [
      "Spezialist für die Region Dorneck (Dornach und Umgebung)",
      "Kompetenz in allen Gewerken — von der Malerarbeit bis zur Komplettsanierung",
      "Offerte zweisprachig und in der Währung Ihrer Wahl",
    ],
    featuredImage: "/images/villes/dornach.webp",
  },
  aargau: {
    code: "AG",
    slug: "aargau",
    nameDE: "Aargau",
    nameFR: "Argovie",
    nameEN: "Aargau",
    capital: "Aarau",
    population: 700000,
    surfaceKm2: 1404,
    seoTitleDE:
      "Renovierung Kanton Aargau (Region Fricktal) | AIMAN RENOVATION",
    seoDescriptionDE:
      "Renovierung im Kanton Aargau: Region Fricktal, Rheinfelden (CH), Kaiseraugst. Französische Handwerker, Offerte CHF/EUR. Kostenlos in 48h.",
    seoTitleFR:
      "Rénovation Canton Argovie (région Fricktal) | AIMAN RENOVATION",
    seoDescriptionFR:
      "Rénovation dans le Fricktal (canton d'Argovie) : Rheinfelden, Kaiseraugst. Devis gratuit en 48h, en CHF ou EUR.",
    introDE:
      "Der Kanton Aargau grenzt im Nordwesten direkt an das Baselbiet und ist über die Autobahn A3 in weniger als 30 Minuten von Saint-Louis aus erreichbar. Insbesondere die Region Fricktal — mit den Gemeinden Rheinfelden (CH), Kaiseraugst, Möhlin und Stein — weist einen hohen Bestand an Einfamilienhäusern aus den 1970er und 1980er Jahren auf, die heute dringend renoviert werden müssen.\n\nDie Nähe zum Wirtschaftsraum Basel macht das Fricktal zu einem begehrten Wohngebiet für Pendler. Die Immobilienpreise steigen, und damit auch die Bereitschaft der Eigentümer, in hochwertige Renovierungen zu investieren: neue Bäder, moderne Küchen, Wärmedämmung nach Minergie-Standard.\n\nAIMAN RENOVATION bedient die Region Fricktal seit mehreren Jahren und kennt die typischen Bautypen, die kantonalen Förderprogramme und die lokalen Bauvorschriften. Wir bieten Ihnen französische Handwerksqualität zu wettbewerbsfähigen Preisen — mit Offerte in CHF oder EUR.",
    introFR:
      "Le canton d'Argovie borde directement le Baselbiet au nord-ouest et se trouve à moins de 30 minutes de Saint-Louis par l'autoroute A3. La région du Fricktal en particulier — avec les communes de Rheinfelden (CH), Kaiseraugst, Möhlin et Stein — possède un parc immobilier important de maisons individuelles des années 1970-1980 nécessitant une rénovation.\n\nLa proximité du bassin économique bâlois fait du Fricktal une zone résidentielle prisée des pendulaires. Les prix immobiliers augmentent, et avec eux la volonté des propriétaires d'investir dans des rénovations de qualité.",
    highlights: [
      "Spezialisiert auf die Region Fricktal (Rheinfelden CH, Kaiseraugst, Möhlin)",
      "Erfahrung mit Einfamilienhäusern der 1970er–1980er Jahre",
      "Beratung zu kantonalen Energieförderprogrammen (Aargau Energie)",
      "Schnelle Anfahrt über die A3 — unter 30 Minuten ab Saint-Louis",
      "Offerte zweisprachig in CHF oder EUR",
      "Alle Gewerke aus einer Hand: Bad, Küche, Böden, Fassade, Dämmung",
    ],
    featuredImage: "/images/villes/basel.webp",
  },
  jura: {
    code: "JU",
    slug: "jura",
    nameDE: "Jura",
    nameFR: "Jura",
    nameEN: "Jura",
    capital: "Delémont",
    population: 73000,
    surfaceKm2: 839,
    seoTitleDE:
      "Renovierung Kanton Jura (Delémont, Porrentruy) | AIMAN RENOVATION",
    seoDescriptionDE:
      "Renovierung im Kanton Jura: Delémont und Umgebung. Französische Handwerker, Offerte CHF/EUR. Kostenlos in 48h.",
    seoTitleFR:
      "Rénovation Canton du Jura (Delémont, Porrentruy) | AIMAN RENOVATION",
    seoDescriptionFR:
      "Rénovation dans le canton du Jura : Delémont, Porrentruy et environs. Devis gratuit en 48h, en CHF ou EUR.",
    introDE:
      "Der Kanton Jura ist der jüngste Kanton der Schweiz (gegründet 1979) und liegt im Nordwesten des Landes, direkt erreichbar über die A16 (Transjurane). Von Saint-Louis aus erreichen wir Delémont in etwa 45 Minuten — eine vernünftige Distanz, die wir regelmässig für grössere Renovierungsprojekte zurücklegen.\n\nDer Kanton Jura ist der einzige rein französischsprachige Kanton der Nordwestschweiz. Die Kommunikation mit unseren frankophonen Handwerkern ist daher besonders einfach und reibungslos. Der Immobilienbestand — Bauernhäuser, Stadthäuser in Delémont und Porrentruy, sowie Einfamilienhäuser der Nachkriegszeit — bietet zahlreiche Renovierungsmöglichkeiten.\n\nUnsere Preise liegen deutlich unter denen lokaler Schweizer Betriebe, bei gleichwertiger Qualität und voller Konformität mit den jurassischen Bauvorschriften.",
    introFR:
      "Le canton du Jura est le plus jeune canton suisse (fondé en 1979) et se situe au nord-ouest du pays, accessible directement par l'A16 (Transjurane). Depuis Saint-Louis, nous atteignons Delémont en environ 45 minutes — une distance raisonnable que nous parcourons régulièrement pour des projets de rénovation d'envergure.\n\nLe canton du Jura est le seul canton exclusivement francophone du nord-ouest de la Suisse. La communication avec nos artisans francophones est donc particulièrement simple et fluide. Le parc immobilier — fermes, maisons de ville à Delémont et Porrentruy, maisons individuelles d'après-guerre — offre de nombreuses possibilités de rénovation.",
    highlights: [
      "Seul canton entièrement francophone de la Suisse du Nord-Ouest — communication fluide",
      "Delémont en 45 minutes depuis Saint-Louis par l'A16",
      "Artisans francophones qualifiés pour maisons jurassiennes",
      "Prix 30–40 % inférieurs aux entreprises suisses locales",
      "Devis bilingue français/allemand en CHF ou EUR",
      "Spécialisé fermes jurassiennes, maisons de maître, rénovation complète",
    ],
    featuredImage: "/images/villes/dornach.webp",
  },
};

export function generateStaticParams() {
  return Object.keys(CANTONS).map((kanton) => ({ kanton }));
}

export async function generateMetadata({ params }: Props) {
  const { kanton: kantonSlug, locale } = await params;
  const canton = CANTONS[kantonSlug];
  if (!canton) return {};

  const isDE = locale === "de";
  const isFR = locale === "fr";

  const title = isDE
    ? canton.seoTitleDE
    : isFR
      ? canton.seoTitleFR
      : `Renovation in Canton ${canton.nameEN} | AIMAN RENOVATION`;

  const description = isDE
    ? canton.seoDescriptionDE
    : isFR
      ? canton.seoDescriptionFR
      : `Renovation in Canton ${canton.nameEN}: French craftsman from Saint-Louis. Free quote in CHF or EUR within 48h.`;

  const BASE = "https://aiman-renovation.fr";
  const path = `/renovierung-schweiz/kanton/${canton.slug}`;
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
          url: `${BASE}${canton.featuredImage}`,
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
      images: [`${BASE}${canton.featuredImage}`],
    },
  };
}

export default async function KantonPage({ params }: Props) {
  const { kanton: kantonSlug, locale } = await params;
  setRequestLocale(locale);

  const canton = CANTONS[kantonSlug];
  if (!canton) notFound();

  const isDE = locale === "de";
  const isFR = locale === "fr";

  const villesInCanton: VilleCH[] = VILLES_CH.filter(
    (v) => v.canton === canton.code
  ).sort((a, b) => a.distance - b.distance);

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
    areaServed: {
      "@type": "AdministrativeArea",
      name: canton.nameDE,
      addressCountry: "CH",
    },
    priceRange: "€€",
    image: `https://aiman-renovation.fr${canton.featuredImage}`,
    description: isDE ? canton.seoDescriptionDE : canton.seoDescriptionFR,
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
      {
        "@type": "ListItem",
        position: 3,
        name: isDE
          ? `Kanton ${canton.nameDE}`
          : `Canton ${canton.nameFR}`,
        item: `https://aiman-renovation.fr/renovierung-schweiz/kanton/${canton.slug}`,
      },
    ],
  };

  const intro = isDE ? canton.introDE : canton.introFR;

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
          <li>
            <Link
              href="/renovierung-schweiz"
              className="hover:text-white transition-colors"
            >
              {isDE
                ? "Renovierung Schweiz"
                : isFR
                  ? "Rénovation Suisse"
                  : "Renovation Switzerland"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-700">/</li>
          <li className="text-white font-medium truncate">
            {isDE ? `Kanton ${canton.nameDE}` : `Canton ${canton.nameFR}`}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={canton.featuredImage}
            alt={`Renovierung Kanton ${canton.nameDE} — Aiman Renovation`}
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
              {canton.code} · {villesInCanton.length}{" "}
              {isDE ? "Gemeinden bedient" : isFR ? "communes desservies" : "municipalities served"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
            {isDE
              ? `Renovierung im Kanton ${canton.nameDE}`
              : `Rénovation au Canton ${canton.nameFR}`}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-3 font-light">
            AIMAN RENOVATION — {isDE ? "Französische Handwerker direkt aus Saint-Louis" : "Artisans français directs depuis Saint-Louis"}
          </p>

          <p className="text-sm md:text-base text-gray-400 mb-8 italic">
            {isDE
              ? `Hauptort: ${canton.capital} · ${canton.population.toLocaleString("de-CH")} Einwohner · ${canton.surfaceKm2} km²`
              : `Chef-lieu : ${canton.capital} · ${canton.population.toLocaleString("fr-FR")} habitants · ${canton.surfaceKm2} km²`}
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

      {/* Intro */}
      <section className="bg-black py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              {isDE
                ? `Ihre Renovierung im Kanton ${canton.nameDE}`
                : `Votre rénovation au canton ${canton.nameFR}`}
            </h2>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              {intro.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-zinc-950 py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
              {isDE
                ? `Warum AIMAN für Ihren Kanton ${canton.nameDE}?`
                : `Pourquoi AIMAN pour votre canton ${canton.nameFR} ?`}
            </h2>

            <ul className="grid md:grid-cols-2 gap-4">
              {canton.highlights.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-black border border-white/5 rounded-xl p-5"
                >
                  <span className="text-white font-bold mt-0.5 shrink-0 text-lg">
                    →
                  </span>
                  <span className="text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* Cities grid */}
      <section className="bg-black py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
              {isDE
                ? `Gemeinden im Kanton ${canton.nameDE}`
                : `Communes du canton ${canton.nameFR}`}
            </h2>
            <p className="text-gray-400 text-center mb-12">
              {isDE
                ? `Wir bedienen ${villesInCanton.length} Gemeinden im Kanton — klicken Sie für lokale Details`
                : `Nous desservons ${villesInCanton.length} communes du canton — cliquez pour les détails locaux`}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {villesInCanton.map((ville) => (
                <Link
                  key={ville.slug}
                  href={`/renovierung-schweiz/${ville.slug}`}
                  className="group bg-zinc-950 border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all"
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
                    {ville.nameFr} · {ville.canton}
                    {ville.population && ` · ${ville.population.toLocaleString("de-CH")} Einw.`}
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
      <section className="bg-zinc-950 py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isDE
                ? `Bereit für Ihre Renovierung im Kanton ${canton.nameDE}?`
                : `Prêt pour votre rénovation au canton ${canton.nameFR} ?`}
            </h2>
            <p className="text-gray-400 mb-8">
              {isDE
                ? "Kostenlose Offerte in 48 Stunden — in CHF oder EUR. Keine Verpflichtung."
                : "Devis gratuit en 48h — en CHF ou EUR. Sans engagement."}
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
