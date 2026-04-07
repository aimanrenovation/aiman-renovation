import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { LinkButton } from "@/components/ui/link-button";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import {
  PARTENAIRES,
  PARTENAIRE_CATEGORIES,
  type PartenaireCategorie,
} from "@/lib/partenaires";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isDE = locale === "de";
  const isFR = locale === "fr";

  const title = isDE
    ? "Unsere Partner | AIMAN RENOVATION — Vertrauensnetzwerk im Dreiländereck"
    : isFR
      ? "Nos partenaires | AIMAN RENOVATION — Réseau de confiance tri-frontière"
      : "Our partners | AIMAN RENOVATION — Trusted network tri-border area";

  const description = isDE
    ? "Unsere Partner: Architekten, Lieferanten, Immobilienagenturen und Bildungspartner im Dreiländereck Frankreich/Schweiz/Deutschland."
    : isFR
      ? "Nos partenaires de confiance : architectes, fournisseurs, agences immobilières, écoles. Un réseau local sur la zone tri-frontière France/Suisse/Allemagne."
      : "Our trusted partners: architects, suppliers, real estate agencies, schools across the France/Switzerland/Germany border area.";

  const BASE = "https://aiman-renovation.fr";
  const path = "/partenaires";
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
      type: "website",
      locale: isDE ? "de_DE" : isFR ? "fr_FR" : "en_US",
    },
  };
}

export default async function PartenairesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isDE = locale === "de";
  const isFR = locale === "fr";

  // Group partners by category
  const partnersByCategory = PARTENAIRES.reduce(
    (acc, p) => {
      if (!acc[p.categorie]) acc[p.categorie] = [];
      acc[p.categorie].push(p);
      return acc;
    },
    {} as Record<PartenaireCategorie, typeof PARTENAIRES>
  );

  const orgData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://aiman-renovation.fr/#organization",
    name: "Aiman Renovation",
    url: "https://aiman-renovation.fr",
    logo: "https://aiman-renovation.fr/images/logo.png",
    knowsAbout: [
      "Renovation",
      "Construction",
      "Interior Design",
      "Bathroom Renovation",
      "Kitchen Renovation",
    ],
    member: PARTENAIRES.map((p) => ({
      "@type": "Organization",
      name: p.name,
      url: p.url,
      address: {
        "@type": "PostalAddress",
        addressLocality: p.ville,
        addressCountry: p.pays,
      },
    })),
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
        name: isDE ? "Partner" : isFR ? "Partenaires" : "Partners",
        item: "https://aiman-renovation.fr/partenaires",
      },
    ],
  };

  return (
    <>
      <JsonLd data={orgData} />
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
            {isDE ? "Partner" : isFR ? "Partenaires" : "Partners"}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative bg-black py-24 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium tracking-widest text-gray-300 uppercase">
              {isDE ? "🤝 Vertrauensnetzwerk" : "🤝 Réseau de confiance"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            {isDE
              ? "Unsere Partner"
              : isFR
                ? "Nos partenaires"
                : "Our partners"}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-3 font-light max-w-2xl mx-auto">
            {isDE
              ? "Ein Netzwerk vertrauenswürdiger lokaler Akteure im Dreiländereck"
              : isFR
                ? "Un réseau d'acteurs locaux de confiance dans le tri-frontière"
                : "A network of trusted local players in the tri-border area"}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-zinc-950 py-16 px-6 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {isDE
                ? "Warum wir mit Partnern arbeiten"
                : isFR
                  ? "Pourquoi nous travaillons avec des partenaires"
                  : "Why we work with partners"}
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              {isDE ? (
                <>
                  <p>
                    Eine Renovation ist ein komplexes Projekt, das oft mehrere
                    Spezialisten erfordert: einen Architekten für die Planung,
                    einen Innendesigner für die Atmosphäre, einen Diagnostiker
                    für die Energiebilanz, einen Notar oder Makler beim
                    Eigentumswechsel.
                  </p>
                  <p>
                    Wir haben ein Netzwerk lokaler Vertrauenspartner aufgebaut,
                    die wir unseren Kunden empfehlen können, wenn sie jemanden
                    außerhalb unseres direkten Kompetenzbereichs benötigen. Alle
                    unsere Partner teilen unsere Werte: Qualität, Transparenz
                    und kompromissloser Respekt vor dem Kunden.
                  </p>
                  <p>
                    <strong className="text-white">Sind Sie ein Profi im Dreiländereck?</strong>{" "}
                    Wir sind immer offen für neue Partnerschaften mit lokalen
                    Akteuren, deren Tätigkeit unsere ergänzt.
                  </p>
                </>
              ) : isFR ? (
                <>
                  <p>
                    Une rénovation est un projet complexe qui nécessite souvent
                    plusieurs spécialistes : un architecte pour le plan, un
                    décorateur pour l&apos;ambiance, un diagnostiqueur pour le DPE,
                    un notaire ou agent immobilier en cas de changement de
                    propriété.
                  </p>
                  <p>
                    Nous avons construit un réseau de partenaires locaux de
                    confiance vers qui nous orientons nos clients lorsqu&apos;ils
                    ont besoin d&apos;un professionnel hors de notre domaine direct.
                    Tous nos partenaires partagent nos valeurs : qualité,
                    transparence, et respect sans concession du client.
                  </p>
                  <p>
                    <strong className="text-white">Vous êtes un pro dans le tri-frontière ?</strong>{" "}
                    Nous sommes toujours ouverts à de nouveaux partenariats avec
                    des acteurs locaux dont l&apos;activité complète la nôtre.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    A renovation is a complex project that often requires
                    multiple specialists: an architect for the plan, an interior
                    designer for the atmosphere, an inspector for the energy
                    audit, a notary or real estate agent in case of property
                    transfer.
                  </p>
                  <p>
                    We have built a network of trusted local partners to whom we
                    refer our clients when they need a professional outside our
                    direct field. All our partners share our values: quality,
                    transparency, and uncompromising respect for the client.
                  </p>
                  <p>
                    <strong className="text-white">Are you a pro in the tri-border area?</strong>{" "}
                    We are always open to new partnerships with local players
                    whose activity complements ours.
                  </p>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Partners by category */}
      <section className="bg-black py-20 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          {PARTENAIRES.length === 0 ? (
            <ScrollReveal>
              <div className="max-w-2xl mx-auto text-center bg-zinc-950 border border-white/10 rounded-2xl p-12">
                <div className="text-5xl mb-6">🌱</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {isDE
                    ? "Unser Netzwerk wächst"
                    : isFR
                      ? "Notre réseau se construit"
                      : "Our network is growing"}
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  {isDE
                    ? "Wir bauen unser Partnernetzwerk schrittweise auf. Die ersten Partnerschaften werden hier in Kürze aufgeführt."
                    : isFR
                      ? "Nous construisons notre réseau de partenaires progressivement. Les premiers partenariats seront listés ici très bientôt."
                      : "We are building our partner network step by step. The first partnerships will be listed here very soon."}
                </p>
                <p className="text-sm text-gray-500">
                  {isDE
                    ? "In der Zwischenzeit entdecken Sie unsere Dienstleistungen oder kontaktieren Sie uns für eine Renovation."
                    : isFR
                      ? "En attendant, découvrez nos services ou contactez-nous pour une rénovation."
                      : "In the meantime, discover our services or contact us for a renovation."}
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="space-y-16">
              {(Object.keys(PARTENAIRE_CATEGORIES) as PartenaireCategorie[]).map((cat) => {
                const partners = partnersByCategory[cat] || [];
                if (partners.length === 0) return null;
                const catLabel = PARTENAIRE_CATEGORIES[cat][isDE ? "de" : isFR ? "fr" : "en"];

                return (
                  <ScrollReveal key={cat}>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                      {catLabel}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {partners.map((partner) => (
                        <div
                          key={partner.slug}
                          className="bg-zinc-950 border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all"
                        >
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {partner.url ? (
                              <a
                                href={partner.url}
                                target="_blank"
                                rel="noopener"
                                className="hover:text-white"
                              >
                                {partner.name}
                              </a>
                            ) : (
                              partner.name
                            )}
                          </h3>
                          <p className="text-xs text-gray-500 mb-3">
                            {partner.ville} · {partner.pays}
                          </p>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {partner.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA — devenir partenaire */}
      <section className="bg-zinc-950 py-20 px-6 border-b border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isDE
                ? "Werden Sie unser Partner"
                : isFR
                  ? "Devenez partenaire"
                  : "Become a partner"}
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              {isDE
                ? "Wenn Sie ein Profi im Bereich Bau, Immobilien, Architektur oder Innendesign im Dreiländereck sind, sprechen wir gerne über eine Partnerschaft. Gegenseitige Empfehlungen, Linkaustausch oder gemeinsame Projekte — die Möglichkeiten sind vielfältig."
                : isFR
                  ? "Si vous êtes un professionnel du bâtiment, de l'immobilier, de l'architecture ou de la décoration dans le tri-frontière, parlons d'un partenariat. Recommandations mutuelles, échange de liens ou projets communs — les possibilités sont multiples."
                  : "If you are a professional in construction, real estate, architecture, or interior design in the tri-border area, let's discuss a partnership. Mutual referrals, link exchange, or joint projects — possibilities are many."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LinkButton href="/contact" variant="default" size="lg">
                {isDE ? "Kontakt aufnehmen" : isFR ? "Nous contacter" : "Contact us"}
              </LinkButton>
              <LinkButton href="/" variant="outline" size="lg">
                {isDE ? "Zurück zur Startseite" : isFR ? "Retour à l'accueil" : "Back to home"}
              </LinkButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
