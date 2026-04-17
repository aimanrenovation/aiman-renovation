import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { VILLES_CH } from "@/lib/villes-ch";
import { SERVICES } from "@/lib/services";
import { LinkButton } from "@/components/ui/link-button";
import { ScrollReveal } from "@/components/sections/scroll-reveal";

interface Props {
  params: Promise<{ ville: string; locale: string }>;
}

export function generateStaticParams() {
  return VILLES_CH.map((v) => ({ ville: v.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { ville: villeSlug, locale } = await params;
  const ville = VILLES_CH.find((v) => v.slug === villeSlug);
  if (!ville) return {};

  const isDE = locale === "de";
  const isFR = locale === "fr";

  const title = isDE
    ? ville.seoTitleDE
    : isFR
      ? ville.seoTitleFR
      : `Renovation in ${ville.name} | Builder from Saint-Louis`;

  const description = isDE
    ? ville.seoDescriptionDE
    : isFR
      ? ville.seoDescriptionFR
      : `Renovation in ${ville.name} (${ville.canton}): French craftsman from Saint-Louis. Free quote in CHF or EUR.`;

  const BASE = "https://aiman-renovation.fr";
  const path = `/renovierung-schweiz/${ville.slug}`;
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
          url: `https://aiman-renovation.fr${ville.featuredImage}`,
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
      images: [`https://aiman-renovation.fr${ville.featuredImage}`],
    },
  };
}

const FEATURED_SERVICE_SLUGS = [
  "cuisine",
  "salle-de-bain",
  "sols-carrelage",
  "peinture",
  "isolation",
  "facade",
];

// Static JSON-LD data — server-side only, no user input
function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data);
  // eslint-disable-next-line react/no-danger
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export default async function VilleCHPage({ params }: Props) {
  const { ville: villeSlug, locale } = await params;
  setRequestLocale(locale);

  const ville = VILLES_CH.find((v) => v.slug === villeSlug);
  if (!ville) notFound();

  const featuredServices = SERVICES.filter((s) =>
    FEATURED_SERVICE_SLUGS.includes(s.slug),
  ).slice(0, 6);

  const isDE = locale === "de";
  const isFR = locale === "fr";

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": "https://aiman-renovation.fr/#organization",
    name: "Aiman Renovation",
    url: "https://aiman-renovation.fr",
    telephone: "+33633496925",
    email: "contact@aiman-renovation.fr",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Saint-Louis",
      addressLocality: "Saint-Louis",
      postalCode: "68300",
      addressCountry: "FR",
    },
    areaServed: [
      {
        "@type": "City",
        name: ville.name,
        addressCountry: "CH",
        addressRegion: ville.canton,
      },
      { "@type": "City", name: "Basel", addressCountry: "CH" },
      { "@type": "City", name: "Saint-Louis", addressCountry: "FR" },
    ],
    priceRange: "€€",
    image: `https://aiman-renovation.fr${ville.featuredImage}`,
    description: isDE ? ville.seoDescriptionDE : ville.seoDescriptionFR,
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isDE
      ? `Renovierung in ${ville.name}`
      : `Rénovation à ${ville.nameFr}`,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://aiman-renovation.fr/#organization",
      name: "Aiman Renovation",
    },
    areaServed: {
      "@type": "City",
      name: ville.name,
      addressCountry: "CH",
      addressRegion: ville.canton,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "CHF",
      description: isDE
        ? "Kostenlose Offerte in CHF oder EUR"
        : "Devis gratuit en CHF ou EUR",
    },
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
          ? `Renovierung in ${ville.name}`
          : `Rénovation à ${ville.nameFr}`,
        item: `https://aiman-renovation.fr/renovierung-schweiz/${ville.slug}`,
      },
    ],
  };

  const warumArguments = [
    {
      icon: "💶",
      title: "30–40% günstiger",
      desc: "Als Schweizer Handwerksbetriebe — gleiche Qualität, deutlich tieferer Preis durch günstigere Betriebskosten in Frankreich.",
    },
    {
      icon: "🏅",
      title: "Französische Qualität",
      desc: "DTU-Normen, RGE-Zertifizierung, Materialien von zertifizierten Lieferanten: Cedeo, Point P, Rexel.",
    },
    {
      icon: "💱",
      title: "Offerte in CHF oder EUR",
      desc: "Transparente Preisgestaltung in der Währung Ihrer Wahl — kein Währungsrisiko.",
    },
    {
      icon: "📋",
      title: "MwSt nach Schweizer Recht",
      desc: "Werkvertrag nach Schweizer Recht, korrekte Steuerregelung für grenzüberschreitende Leistungen.",
    },
    {
      icon: "🌿",
      title: "Minergie & SIA 380/1",
      desc: "Wir kennen Schweizer Normen: Minergie-Standard, SIA 380/1 für Wärmedämmung — konforme Ausführung.",
    },
    {
      icon: "📍",
      title: `${ville.distance} Min. von Saint-Louis`,
      desc: `Kurze Anfahrtswege — ${ville.name} liegt nur ${ville.distance} km von unserem Standort. Schnelle Reaktion, zuverlässige Termine.`,
    },
  ];

  const villeContentDE = getVilleContentDE(ville);
  const villeContentFR = getVilleContentFR(ville);

  return (
    <>
      <JsonLd data={localBusinessData} />
      <JsonLd data={serviceData} />
      <JsonLd data={breadcrumbData} />

      {/* Breadcrumb visuel */}
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
          <li aria-hidden="true" className="text-gray-700">
            /
          </li>
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
          <li aria-hidden="true" className="text-gray-700">
            /
          </li>
          <li className="text-white font-medium truncate">{ville.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={ville.featuredImage}
            alt={`Renovierung in ${ville.name} — Aiman Renovation`}
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
              Kanton {ville.canton} · {ville.distance} km von Saint-Louis
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
            Renovierung in {ville.name}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-3 font-light">
            Handwerker AIMAN RENOVATION — Ihr Spezialist aus dem Elsass
          </p>

          <p className="text-sm md:text-base text-gray-400 mb-8 italic">
            Rénovation à {ville.nameFr} ({ville.canton}) | Artisan frontalier
            depuis Saint-Louis
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton href="/devis" variant="default" size="lg">
              Offerte anfragen
            </LinkButton>
            <LinkButton href="/contact" variant="outline" size="lg">
              Demander un devis
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Section principale allemande */}
      <section className="bg-black py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Ihre Renovierung in {ville.name}
            </h2>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              {villeContentDE.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold text-white mb-4">
                Warum {ville.name}? Unsere lokalen Kenntnisse
              </h3>
              <ul className="space-y-3">
                {ville.specificitesDE.map((spec, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-white font-bold mt-0.5 shrink-0">
                      →
                    </span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section française */}
      <section className="bg-zinc-950 py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Votre rénovation à {ville.nameFr}
            </h2>

            <div className="space-y-4 text-gray-400 leading-relaxed">
              {villeContentFR.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8">
              <ul className="space-y-2">
                {ville.specificitesFR.map((spec, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400">
                    <span className="text-gray-500 mt-0.5 shrink-0">→</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Leistungen / Services */}
      <section className="bg-black py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Unsere Leistungen in {ville.name}
            </h2>
            <p className="text-gray-400 mb-2 text-sm">
              Nos prestations à {ville.nameFr}
            </p>
            <p className="text-gray-300 mb-10 max-w-2xl">
              Wir bieten alle Renovierungsleistungen für Privat- und
              Gewerbekunden in {ville.name} und der gesamten Region Basel an.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {featuredServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group border border-white/10 rounded-xl p-5 hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                >
                  <div className="text-2xl mb-3">{service.icon}</div>
                  <h3 className="text-white font-semibold text-sm group-hover:text-gray-100">
                    {service.shortTitle}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {service.description.slice(0, 80)}…
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <LinkButton href="/services" variant="outline" size="default">
                Alle Leistungen ansehen →
              </LinkButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Warum AIMAN RENOVATION */}
      <section className="bg-zinc-950 py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
              Warum AIMAN RENOVATION?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {warumArguments.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 border border-white/10 rounded-xl bg-white/5">
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-white">Schweizer Normen:</strong> Als
                grenzüberschreitender Handwerksbetrieb kennen wir die
                spezifischen Anforderungen der Schweiz. Wir arbeiten gemäss{" "}
                <strong className="text-white">Minergie</strong>-Standard und
                berücksichtigen die{" "}
                <strong className="text-white">SIA 380/1</strong>-Norm für
                Wärmedämmung bei allen unseren Dämmarbeiten in {ville.name} und
                der Region {ville.canton}.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-black py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Offerte anfragen für {ville.name}
            </h2>
            <p className="text-gray-400 mb-2">
              Kostenlose Offerte — Antwort innerhalb 24 Stunden
            </p>
            <p className="text-gray-500 text-sm mb-8 italic">
              Demander un devis gratuit pour {ville.nameFr} — réponse sous 24h
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LinkButton href="/devis" variant="default" size="lg">
                Offerte anfragen →
              </LinkButton>
              <LinkButton href="tel:+33633496925" variant="outline" size="lg">
                06 33 49 69 25
              </LinkButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

// ─── Contenus uniques par ville (allemand) ───────────────────────────────────

function getVilleContentDE(ville: (typeof VILLES_CH)[number]): string {
  const contents: Record<string, string> = {
    basel: `Basel ist das Herzstück der trinationalen Metropolregion am Rheinknie. Als grösste Stadt der Nordwestschweiz vereint Basel historisches Erbe mit modernstem Städtebau: die romanisch-gotische Kathedrale ragt über die Basler Altstadt, während nur wenige Kilometer entfernt die avantgardistischen Roche-Türme und der Novartis-Campus die Pharmaindustrie der Welt repräsentieren.

Für Renovierungsarbeiten in Basel bringt AIMAN RENOVATION eine besondere Positionierung mit: Unser Standort in Saint-Louis, direkt hinter der Grenze, erlaubt uns eine Anfahrtzeit von unter 10 Minuten in die Basler Innenstadt. Wir sind seit Jahren in Basel tätig und kennen die unterschiedlichen Stadtquartiere aus eigener Erfahrung — von den dichten Wohngebieten in Kleinbasel über die bürgerlichen Viertel Gundeldingen und Breite bis hin zu den gehobenen Lagen am Bruderholz.

Renovierungen in Basel verlangen oft viel Fingerspitzengefühl: denkmalgeschützte Bausubstanz in der Altstadt, Wohngebäude der Nachkriegszeit in St. Johann, moderne Lofts in ehemaligen Industriegebäuden entlang des Rheins. Unser Team ist ausgebildet für all diese Situationen — mit dem klaren Vorteil, dass unsere Preise 30 bis 40 Prozent unter dem Niveau Schweizer Handwerksbetriebe liegen, bei gleicher oder höherer Qualität dank unserer DTU-zertifizierten Verfahren.

Wir erstellen Ihre Offerte in CHF oder EUR, regeln die Mehrwertsteuer korrekt nach Schweizer Werkvertragsrecht und liefern Materialien von führenden europäischen Grosshändlern: Cedeo, Point P und Rexel garantieren Erstklassigkeit vom ersten bis zum letzten Handgriff.`,

    allschwil: `Allschwil ist die erste Schweizer Gemeinde hinter der französischen Grenze — direkt verbunden mit Hégenheim im Elsass. Diese Grenznähe macht Allschwil zu einem unserer wichtigsten Einsatzgebiete: Viele unserer Mitarbeiter kennen den Weg hierher aus dem Alltag, und unsere Anfahrtszeiten sind mit unter 10 Minuten unschlagbar kurz.

Die Gemeinde Allschwil hat sich in den letzten Jahrzehnten zu einem bedeutenden Pharma- und Biotechnologiestandort entwickelt. Grosse internationale Unternehmen haben hier ihre Europazentrale, was zu einer gut situierten, anspruchsvollen Einwohnerschaft geführt hat. Die typischen Einfamilienhäuser aus den 1970er und 1980er Jahren — viele davon in ruhigen Quartieren rund um den Ortskern — sind heute in einem Renovierungsalter angelangt, das vollständige Modernisierungen erfordert.

AIMAN RENOVATION führt in Allschwil alle Renovierungsleistungen aus: von der kompletten Küchenrenovierung über Badezimmersanierungen bis hin zu Bodenbelägen, Malerarbeiten und Fassadendämmung. Wir arbeiten nach DTU-Normen, bieten eine RGE-Zertifizierung für energetische Massnahmen und erstellen Ihnen eine transparente Offerte in CHF oder EUR — ohne versteckte Kosten.

Unser grenzüberschreitendes Modell bedeutet für Sie als Auftraggeber in Allschwil: ein verlässlicher Ansprechpartner, kürzeste Reaktionszeiten, und eine Kostenersparnis, die im Vergleich zu lokalen Schweizer Betrieben spürbar ist.`,

    binningen: `Binningen liegt auf einer Anhöhe südwestlich von Basel und zählt zu den bevorzugtesten Wohnlagen im Kanton Baselland. Die direkte Grenze zu Basel macht die Gemeinde besonders attraktiv für Fachkräfte, die in der Stadt arbeiten, aber das ruhige Wohnen in einer Vorortsgemeinde schätzen. Viele Strassen Binningens sind geprägt von Reihenhäusern der 1960er und 1970er Jahre — Baujahre, die heute einen intensiven Renovierungsbedarf aufweisen.

AIMAN RENOVATION ist in Binningen vor allem für Badezimmer- und Küchensanierungen tätig, da diese Räume in Häusern dieser Ära häufig seit der Erbauung nicht grundlegend modernisiert wurden. Wir erkennen die Chancen solcher Projekte: Mit modernen Materialien, zeitgemässer Aufteilung und energieeffizienter Technik kann ein Haus aus den 1970er Jahren in wenigen Wochen zu einem komfortablen, zeitgemässen Zuhause werden.

Unsere Handwerker erreichen Binningen von Saint-Louis aus in 15 Minuten — zuverlässig und pünktlich. Wir erstellen Ihnen eine detaillierte Offerte in CHF, berücksichtigen bei Dämmarbeiten die Anforderungen des SIA 380/1-Standards und bieten für energetische Sanierungen die nötigen Nachweise gemäss Minergie-Empfehlungen.`,

    bottmingen: `Das Schloss Bottmingen — ein mittelalterliches Wasserschloss am Rande des Waldes — prägt das Bild dieser kleinen, exklusiven Gemeinde südlich von Basel. Bottmingen ist bekannt für seine gehobene Wohnqualität: grosszügige Villen, gepflegte Gärten und eine Einwohnerschaft, die höchste Ansprüche an Handwerksqualität stellt.

In einer Gemeinde wie Bottmingen reicht es nicht, nur gute Arbeit zu leisten — Sorgfalt, Diskretion und das Einhalten von Terminen sind ebenso wichtig. Genau diese Qualitäten zeichnen AIMAN RENOVATION aus. Seit unserer Gründung haben wir immer wieder gehobene Wohnobjekte saniert und verstehen, wie man mit hochwertigen Materialien und präziser Ausführung auch anspruchsvolle Kunden überzeugt.

Wir führen in Bottmingen sowohl Innen- als auch Aussenrenovierungen durch: Fassadensanierungen mit qualitativ hochwertigen Verputzsystemen, Badezimmer mit Premium-Fliesen und Designer-Armaturen, Böden in Naturstein oder Hochwertigparkett, sowie Malerarbeiten mit feinsten Materialien. Unsere Offerten erfolgen in CHF, transparent und nachvollziehbar.`,

    riehen: `Riehen ist eines der wohlhabendsten Quartiere des Kantons Basel-Stadt — eine eigenständige Gemeinde, die für ihre historischen Villen, alten Kirschenplantagen und die weltberühmte Fondation Beyeler bekannt ist. Hier wohnen Kunstsammler, Akademiker und gut situierte Basler Familien, die Wert auf die Erhaltung und Verbesserung ihrer Immobilien legen.

Renovierungsarbeiten in Riehen sind oft komplex: Viele Gebäude stammen aus dem 19. oder frühen 20. Jahrhundert und haben historische Bausubstanz, die besondere Sorgfalt erfordert. Gleichzeitig erwarten die Eigentümer modernsten Komfort hinter den Fassaden. AIMAN RENOVATION bringt die Erfahrung mit, beides zu vereinen — denkmalgerechte Restaurierung und zeitgemässe Modernisierung.

Für unsere Auftraggeber in Riehen sind wir von Saint-Louis aus in knapp 15 Minuten erreichbar. Wir verstehen das besondere Ambiente dieser Gemeinde und passen unsere Arbeit entsprechend an. Ob historische Parkettböden aufarbeiten, Bäder in Jugendstilhäusern modernisieren oder Fassaden aus der Gründerzeit sanieren — unser Team ist für diese Aufgaben ausgebildet und zertifiziert.`,

    birsfelden: `Birsfelden am Hochrhein ist eine Gemeinde im Wandel: Der ehemalige Rheinhafen und die industriellen Flächen werden zunehmend zu modernen Wohnquartieren umgewandelt. Gleichzeitig gibt es noch viele ältere Wohngebäude aus den Aufbaujahrzehnten der 1950er bis 1970er, die dringend einer Gesamtsanierung bedürfen.

AIMAN RENOVATION ist in Birsfelden besonders für zwei Typen von Aufträgen aktiv: erstens die Gesamtrenovierung älterer Mehrfamilienhäuser — Böden, Bäder, Küchen, Malerarbeiten, Fenster —, und zweitens die Umnutzung und Renovierung von ehemaligen Gewerbe- oder Lagerflächen zu modernen Wohn- oder Büroräumen. Beide Bereiche verlangen Handwerker, die Erfahrung mit unterschiedlichen Bautypen haben.

Unsere Stärke liegt in der Koordination aller Gewerke: Wir bieten Ihnen einen einzigen Ansprechpartner für das gesamte Projekt, von der Planung bis zur Schlüsselübergabe. So sparen Sie Zeit, Nerven und — dank unserer günstigen Preisstruktur — auch Geld.`,

    muttenz: `Muttenz vereint zwei Welten: das historische Dorfbild rund um die romanische St.-Arbogast-Kirche mit ihren gotischen Fresken auf der einen Seite, und die grossen Chemie- und Industrieflächen entlang der Autobahn auf der anderen. Diese Mischung macht Muttenz zu einer dynamischen Gemeinde mit breitem Renovierungsbedarf — sowohl im historischen Bestand als auch in den neueren Wohnsiedlungen.

Die St.-Arbogast-Kirche ist das kulturelle Herzstück von Muttenz und steht unter Denkmalschutz. Für Privatgebäude in der Umgebung gilt: Wer nahe solcher Stätten renoviert, muss das Ortsbild respektieren. AIMAN RENOVATION kennt diese Anforderungen und arbeitet mit Materialien und Techniken, die in solchen Umgebungen zugelassen sind.

Für Neubauten und Standardrenovierungen in Muttenz bieten wir das volle Leistungsspektrum: Küche, Bad, Böden, Fassade, Malerarbeiten, Isolation. Alles aus einer Hand, mit klarer Kostentransparenz in CHF.`,

    "reinach-bl": `Reinach ist mit rund 19.000 Einwohnern die zweitgrösste Gemeinde im Kanton Baselland und eine typische Schweizer Agglomeration: zahlreiche Mehrfamilienhäuser und Reihenhäuser aus den 1970er und 1980er Jahren, eine gut ausgebaute Infrastruktur und eine enge Anbindung an Basel über die Autobahn A18.

Diese Bauepoche bedeutet heute einen enormen Renovierungsbedarf: Badezimmer mit alten Fliesen und veralteter Sanitärtechnik, Böden mit Teppich oder abgenutztem Parkett, Fassaden ohne zeitgemässe Dämmung, Küchen, die seit ihrer Einbauzeit nicht mehr angepasst wurden. AIMAN RENOVATION ist der richtige Partner für diese Renovierungsgeneration.

Wir kennen die typischen Grundrisse und baulichen Herausforderungen dieser Häuser und können schnell und präzise kalkulieren. Ob einzelne Räume oder eine komplette Wohnung — wir bieten Ihnen eine faire Offerte in CHF und führen die Arbeiten zuverlässig aus. Unsere Anfahrtzeit von Saint-Louis nach Reinach beträgt etwa 20 Minuten.`,

    "oberwil-bl": `Oberwil liegt im Leimental, einem Talkessel südlich von Basel, der für seine Ruhe und die hohe Wohnqualität bekannt ist. Das historische Dorfzentrum mit alten Bauernhäusern und Fachwerkgebäuden ist gut erhalten und bildet einen charaktervollen Kontrast zu den neueren Wohnsiedlungen am Rand der Gemeinde.

Für Renovierungen in Oberwil bringt AIMAN RENOVATION das Wissen mit, unterschiedliche Bautypen zu bearbeiten: einerseits die historischen Altbauten im Dorfkern mit ihren besonderen Anforderungen an Materialwahl und Handwerkstechnik, andererseits die Einfamilienhäuser und Mehrfamilienhäuser der Nachkriegs- und Boom-Jahrzehnte, die heute vollständig saniert werden müssen.

Wir sind von Saint-Louis aus in rund 20 Minuten in Oberwil — schnell genug für Notfälle und gut planbar für reguläre Projekte. Unsere Offerten werden in CHF erstellt, und wir halten uns an Schweizer Normen wie SIA 380/1 für Wärmedämmung.`,

    therwil: `Therwil ist eine ruhige Familiengemeinde im Leimental, bekannt für ihre guten Schulen, die grüne Umgebung und das hohe Freizeitangebot. Viele Familien haben sich hier in den 1980er und 1990er Jahren ihr Eigenheim gebaut — und diese Häuser sind nun in einem Alter, in dem eine Gesamtrenovierung sinnvoll und oft notwendig ist.

AIMAN RENOVATION betreut in Therwil vor allem Einfamilienhäuser dieser Generation: Badezimmer mit veralteter Sanitärtechnik ersetzen, Böden ausbessern oder erneuern, Küchen modernisieren, Fassaden nachträglich dämmen. Wir verstehen, was es bedeutet, im bewohnten Haus zu renovieren — daher arbeiten wir sauber, termingerecht und mit minimaler Beeinträchtigung des Alltags.

Unsere Stärke ist die Koordination aller Gewerke: Sanitär, Elektrik, Fliesen, Maler — alles von einem einzigen Anbieter. Das vereinfacht die Planung und garantiert ein stimmiges Endergebnis.`,

    muenchenstein: `Münchenstein liegt direkt an der Birs, zwischen Basel und dem Birseck-Tal. Die Gemeinde ist gut an Basel angebunden und hat in den letzten Jahren durch mehrere Entwicklungsprojekte an Attraktivität gewonnen. Das historische Eisenbahnviadukt über die Birs ist ein Wahrzeichen des Ortes und prägt das Ortsbild.

Wohnen in Münchenstein bedeutet oft: ältere Gebäude entlang des Birsufers, Einfamilienhäuser an den Hängen und neuere Mehrfamilienhäuser in der Ortsebene. Dieses breite Spektrum macht Münchenstein zu einem attraktiven Markt für Renovierungen aller Art.

AIMAN RENOVATION ist für alle Projekttypen in Münchenstein gerüstet. Von der Altbausanierung über die komplette Küchenrenovierung bis hin zu Fassadensanierungen und Bodenbelägen — wir bieten alle Leistungen aus einer Hand, transparent in CHF kalkuliert und zuverlässig ausgeführt.`,

    arlesheim: `Arlesheim ist eines der schönsten Dörfer im Kanton Baselland — geprägt vom prächtigen Dom St. Maria, einem Barockjuwel des 17. Jahrhunderts, und von einer Vielzahl gut erhaltener Bürgerhäuser aus dem 18. und 19. Jahrhundert. Das Dorf liegt am Rand des Arlesheimer Ermlins, eines der ältesten Englischen Gärten auf dem Kontinent, und in unmittelbarer Nähe des Goetheanums in Dornach.

Renovierungen in Arlesheim verlangen besonderes Fingerspitzengefühl: Die historische Bausubstanz ist wertvoll und oft denkmalgeschützt. AIMAN RENOVATION hat Erfahrung mit dieser Art von Aufgaben — wir verwenden geeignete Materialien, respektieren Originalsubstanz und stimmen uns bei denkmalschutzrelevanten Aspekten mit den zuständigen Stellen ab.

Gleichzeitig gibt es in Arlesheim auch neuere Wohnsiedlungen und Einfamilienhäuser, die eine zeitgemässe Renovierung benötigen. Für alle diese Projekte bieten wir faire Offerten in CHF und eine zuverlässige, handwerklich einwandfreie Ausführung.`,

    pratteln: `Pratteln ist die Industriegemeinde schlechthin im Kanton Baselland: Der Chemiepark Schweizerhalle, grosse Logistikzentren und Lagerhallen prägen das Bild entlang des Rheins. Gleichzeitig gibt es attraktive Wohnquartiere am Hang, die von der guten Anbindung an Basel und die Autobahn A2 profitieren.

AIMAN RENOVATION ist in Pratteln für zwei Arten von Projekten aktiv: erstens für Renovierungen in den Wohnquartieren — Einfamilienhäuser und Mehrfamilienhäuser, die eine vollständige oder teilweise Sanierung benötigen —, und zweitens für die Umnutzung von Gewerbe- und Industrieflächen zu modernen Wohn- oder Büroflächen, ein wachsender Trend in der Region.

Für Wohnprojekte kalkulieren wir in CHF, halten uns an Schweizer Normen und sind schnell vor Ort — rund 25 Minuten von Saint-Louis. Für gewerbliche Umnutzungen erstellen wir auf Wunsch auch grössere Konzeptofferten.`,

    "aesch-bl": `Aesch liegt im Birseck-Tal, eingebettet zwischen Weinbergen und dem Naturpark Gantrisch. Das Dorf ist geprägt von einer langen Weinbautradition: Alte Bauernhäuser mit Weinkellern, Scheunen und charaktervollen Fassaden zeugen von Jahrhunderten dörflichen Lebens. Diese historischen Bauten brauchen heute fachkundige Renovierung, die Originalsubstanz und Modernisierung in Einklang bringt.

AIMAN RENOVATION schätzt diese Art von Aufgabe: Alte Bauernhäuser in Aesch sind herausfordernde Objekte, die besondere Materialien und handwerkliche Erfahrung erfordern. Wir können Natursteinfassaden instandsetzen, historische Holzböden aufarbeiten, alte Küchen modernisieren und Bäder in beengten Grundrissen neu gestalten.

Neben den historischen Gebäuden gibt es in Aesch auch modernere Wohnsiedlungen am Dorfrand, für die wir Standardrenovierungen zu fairen Preisen in CHF anbieten. Unsere Anfahrt von Saint-Louis beträgt etwa 25 Minuten.`,

    dornach: `Dornach, im Kanton Solothurn direkt an der Grenze zu Baselland, ist weltweit bekannt als Sitz der Anthroposophischen Gesellschaft und als Standort des Goetheanums — jenem einzigartigen Gebäude in organischer Architektur, das Rudolf Steiner entworfen hat und das jährlich Tausende von Besuchern aus aller Welt anzieht.

Diese kulturelle Einzigartigkeit prägt ganz Dornach: Viele Gebäude in der Gemeinde sind vom Geist der Anthroposophie geprägt, mit organischen Formen, natürlichen Materialien und einem besonderen Anspruch an Nachhaltigkeit. Renovierungen in Dornach verlangen entsprechendes Feingefühl — man renoviert hier nicht in einem gewöhnlichen Wohnquartier, sondern in einem kulturell bedeutsamen Umfeld.

AIMAN RENOVATION bietet in Dornach alle Renovierungsleistungen für Privathäuser, Wohnungen und gewerbliche Objekte an. Wir kennen die baurechtlichen Besonderheiten des Kantons Solothurn und stimmen uns bei Bedarf mit den Kantonsdenkmalbehörden ab. Unsere Offerten werden in CHF erstellt, und wir berücksichtigen auf Wunsch nachhaltige Materialien und Techniken.`,

    liestal: `Liestal ist die Kantonshauptstadt von Baselland — ein historisches Städtchen mit mittelalterlicher Altstadt, restauriertem Stadttor und einer dichten Abfolge von Bürgerhäusern aus verschiedenen Epochen. Die Rathausstrasse und die Altstadt sind gut erhalten und stehen in Teilen unter Denkmalschutz.

Für Renovierungen in Liestal ist AIMAN RENOVATION ein erfahrener Partner, der sowohl mit historischen als auch mit modernen Gebäudetypen umgehen kann. In der Altstadt verlangen Fassadensanierungen, Fensterersatz und Innenrenovierungen besondere Sensibilität und gute Abstimmung mit der kantonalen Denkmalpflege. In den neueren Quartieren rund um das Stadtzentrum sind Standardrenovierungen von Wohnungen und Einfamilienhäusern gefragt.

Liestal ist mit dem Auto von Saint-Louis in rund 30 Minuten erreichbar. Für grössere Projekte planen wir gerne auch mehrtägige Arbeitseinsätze direkt vor Ort. Offerten erstellen wir in CHF, transparent und ohne versteckte Kosten.`,
  };

  return (
    contents[ville.slug] ??
    `Renovierung in ${ville.name} — AIMAN RENOVATION ist Ihr zuverlässiger Handwerker aus Saint-Louis für alle Renovierungsarbeiten in ${ville.name} und der Region ${ville.canton}. Wir bieten alle Leistungen von Küche über Bad bis Fassade, mit Offerten in CHF.`
  );
}

// ─── Contenus uniques par ville (français) ───────────────────────────────────

function getVilleContentFR(ville: (typeof VILLES_CH)[number]): string {
  const contents: Record<string, string> = {
    basel: `Bâle est la grande ville suisse la plus proche de notre base à Saint-Louis — seulement 5 km nous séparent. Cette proximité nous permet d'intervenir rapidement sur tous types de chantiers, qu'il s'agisse d'un appartement en Kleinbasel, d'une maison bourgeoise en Grossbasel ou d'un local commercial près du campus Novartis.

Notre entreprise travaille régulièrement à Bâle depuis plusieurs années. Nous connaissons les exigences des propriétaires bâlois, les normes suisses applicables (SIA, Minergie), et nous établissons nos devis en CHF ou en EUR selon votre préférence. Notre certification RGE et nos références DTU françaises vous garantissent un niveau de qualité irréprochable, à un tarif 30 à 40% inférieur aux artisans locaux.`,

    allschwil: `Allschwil est notre commune suisse la plus proche : la frontière avec Hégenheim est littéralement à quelques mètres. Nous y intervenons régulièrement pour des rénovations complètes, notamment dans les maisons individuelles des années 80 typiques du quartier résidentiel.

Nos artisans connaissent bien le tissu local et peuvent répondre rapidement à toute demande. Devis en CHF, respect des normes suisses, matériaux certifiés — nous vous offrons le meilleur des deux pays.`,

    binningen: `Binningen, commune résidentielle huppée au sud-ouest de Bâle, compte de nombreuses maisons mitoyennes et villas des années 60-70 qui nécessitent une remise à niveau. Nous y réalisons principalement des rénovations de salles de bain, cuisines et sols.

Depuis Saint-Louis, nous atteignons Binningen en 15 minutes. Nos devis sont établis en CHF, et nous respectons les standards Minergie pour les travaux d'isolation thermique.`,

    bottmingen: `Bottmingen, avec son château d'eau médiéval emblématique, est une commune haut de gamme où les propriétaires attendent une qualité d'exécution irréprochable. Nous y intervenons pour des travaux intérieurs et extérieurs de standing : carrelage premium, enduits de façade, salle de bain de luxe.

Chaque devis est détaillé, en CHF, sans surprise cachée.`,

    riehen: `Riehen est l'une des communes les plus prisées de Bâle-Ville, avec ses villas historiques et la Fondation Beyeler. Nous y réalisons des rénovations soignées, notamment la restauration de parquets anciens, la modernisation de salles de bain dans des maisons de maître, et des travaux de peinture intérieure haut de gamme.`,

    birsfelden: `Birsfelden, port rhénan en pleine mutation, offre de belles opportunités de rénovation : immeubles anciens des années 50-70 et reconversion d'espaces industriels en logements. Nous intervenons pour tous les corps de métier, en coordination complète.`,

    muttenz: `Muttenz est une commune dynamique entre patrimoine et industrie. Nous y réalisons des rénovations de logements individuels et collectifs, en respectant les normes suisses et le voisinage de l'église historique St-Arbogast.`,

    "reinach-bl": `Reinach BL, deuxième ville du canton, concentre un grand nombre d'immeubles des années 70-80 à rénover. Nous y proposons des rénovations complètes : salle de bain, cuisine, sols, façade — un seul interlocuteur pour tout le projet.`,

    "oberwil-bl": `Oberwil, au coeur du Leimental, mêle bâtiments historiques et constructions récentes. Nous y intervenons pour des rénovations adaptées à chaque époque : restauration de l'ancien ou modernisation du contemporain.`,

    therwil: `Therwil est une commune familiale où de nombreuses maisons individuelles des années 80-90 sont mûres pour une rénovation. Nous y proposons des interventions ciblées ou des rénovations complètes, avec coordination de tous les corps de métier.`,

    muenchenstein: `Münchenstein, aux portes de Bâle, combine habitat ancien le long de la Birse et quartiers plus récents. Nous y réalisons toutes les rénovations intérieures et extérieures, avec des devis transparents en CHF.`,

    arlesheim: `Arlesheim, village classé avec sa cathédrale baroque, demande une approche respectueuse du patrimoine. Nous intervenons sur des bâtiments anciens et modernes, avec les savoir-faire adaptés à chaque configuration.`,

    pratteln: `Pratteln, commune industrielle et résidentielle, offre un marché de la rénovation varié. Nous y travaillons sur des logements et des locaux professionnels, avec une logistique rodée depuis Saint-Louis.`,

    "aesch-bl": `Aesch, village viticole du Birseck, compte de nombreuses fermes et maisons anciennes à rénover. Nous apportons une expertise en rénovation de l'ancien : pierres, bois, enduits naturels, modernisation de salles de bain.`,

    dornach: `Dornach, canton de Soleure et siège du Goetheanum, est un environnement culturel unique. Nous y rénovons des maisons et appartements en respectant l'esprit du lieu, avec des matériaux adaptés et une sensibilité architecturale particulière.`,

    liestal: `Liestal, chef-lieu de Bâle-Campagne, mêle vieille ville médiévale et quartiers modernes. Nous y intervenons pour des rénovations patrimoniales et standard, toujours avec un devis détaillé en CHF.`,
  };

  return (
    contents[ville.slug] ??
    `Rénovation à ${ville.nameFr} (${ville.canton}) : AIMAN RENOVATION intervient depuis Saint-Louis pour tous vos travaux. Devis gratuit en CHF ou EUR.`
  );
}
