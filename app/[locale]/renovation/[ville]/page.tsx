import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { VILLES_FR, type VilleFR } from "@/lib/villes-fr";
import { SERVICES } from "@/lib/services";
import { COMPANY } from "@/lib/constants";
import { LinkButton } from "@/components/ui/link-button";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import { getAlternates } from "@/lib/i18n-helpers";
import { FAQ_VILLES } from "@/lib/faq-villes";

interface Props {
  params: Promise<{ ville: string; locale: string }>;
}

export function generateStaticParams() {
  return VILLES_FR.map((v) => ({ ville: v.slug }));
}

interface VilleContent {
  slug: string;
  hero: { h1: string; subtitle: string };
  intro: string;
  whyLocal: string;
  projectsSection: string;
  communesAlentours: string[];
}

async function getVilleContent(
  locale: string,
  slug: string
): Promise<VilleContent | undefined> {
  const tRoot = await getTranslations({ locale });
  const items = tRoot.raw("ville_fr_items") as VilleContent[];
  return items.find((v) => v.slug === slug);
}

export async function generateMetadata({ params }: Props) {
  const { ville, locale } = await params;
  const villeData = VILLES_FR.find((v) => v.slug === ville);
  if (!villeData) return {};

  const title = villeData.seoTitle;
  const description = villeData.seoDescription;
  const ogImage = villeData.featuredImage;

  return {
    title,
    description,
    alternates: getAlternates(`/renovation/${ville}`),
    openGraph: {
      title,
      description,
      url: `https://aiman-renovation.fr/renovation/${ville}`,
      siteName: "Aiman Renovation",
      images: [
        {
          url: `https://aiman-renovation.fr${ogImage}`,
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
      images: [`https://aiman-renovation.fr${ogImage}`],
    },
  };
}

function buildSchemas(v: VilleFR) {
  const localBusiness = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": "https://aiman-renovation.fr/#organization",
    name: "Aiman Renovation",
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
    areaServed: {
      "@type": "City",
      name: v.name,
      postalCode: v.codePostal,
    },
    description: v.seoDescription,
  });

  const service = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Rénovation à ${v.name}`,
    description: v.seoDescription,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://aiman-renovation.fr/#organization",
      name: "Aiman Renovation",
    },
    areaServed: {
      "@type": "City",
      name: v.name,
      postalCode: v.codePostal,
    },
  });

  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://aiman-renovation.fr/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Zones d'intervention",
        item: "https://aiman-renovation.fr/renovation",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: v.name,
        item: `https://aiman-renovation.fr/renovation/${v.slug}`,
      },
    ],
  });

  const faqItems = FAQ_VILLES[v.slug] ?? [];
  const faqPage = faqItems.length > 0
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      })
    : null;

  return { localBusiness, service, breadcrumb, faqPage };
}

export default async function VillePage({ params }: Props) {
  const { ville, locale } = await params;
  setRequestLocale(locale);

  const villeData = VILLES_FR.find((v) => v.slug === ville);
  if (!villeData) notFound();

  const content = await getVilleContent(locale, ville);
  if (!content) notFound();

  const schemas = buildSchemas(villeData);

  return (
    <>
      {/* JSON-LD schemas — données statiques serveur uniquement */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: schemas.localBusiness }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: schemas.service }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: schemas.breadcrumb }}
      />
      {/* FAQ schema — static data, no user input */}
      {schemas.faqPage && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: schemas.faqPage }}
        />
      )}

      {/* Breadcrumb visuel */}
      <nav
        aria-label="Fil d'Ariane"
        className="relative z-20 bg-black border-b border-white/5 px-6 py-3"
      >
        <ol className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-700">/</li>
          <li>
            <Link href="/renovation" className="hover:text-white transition-colors">
              Zones d&apos;intervention
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-700">/</li>
          <li className="text-white font-medium">{villeData.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <Image
          src={villeData.featuredImage}
          alt={`Rénovation à ${villeData.name} — Aiman Renovation Haut-Rhin`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 pt-40">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-1 rounded-full bg-[#002B7F]" />
            <div className="w-6 h-1 rounded-full bg-white" />
            <div className="w-6 h-1 rounded-full bg-[#CE1126]" />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight">
            {content.hero.h1.toUpperCase()}
          </h1>
          <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
            {content.hero.subtitle}
          </p>
          <div className="mt-8">
            <LinkButton
              href="/devis"
              size="lg"
              className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4"
            >
              Demander un devis gratuit
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Intro ville */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#0A0A0A] py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4">
                <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                <h2 className="font-heading text-2xl md:text-3xl leading-tight">
                  ARTISAN RÉNOVATION À{" "}
                  <span className="text-[#E50000]">{villeData.name.toUpperCase()}</span>
                </h2>
                <p className="text-gray-500 text-sm mt-4">
                  {villeData.codePostal} — à {villeData.distance} km de Saint-Louis
                </p>
              </div>
              <div className="md:col-span-8 space-y-5 text-gray-400 text-lg leading-relaxed">
                {content.intro.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Spécificités locales */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 bg-black py-16 md:py-24 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
            <h2 className="font-heading text-xl md:text-2xl mb-8">
              {villeData.name.toUpperCase()} :{" "}
              <span className="text-[#E50000]">UN TERRITOIRE QUE NOUS CONNAISSONS</span>
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {villeData.specificites.map((spec) => (
                <li
                  key={spec}
                  className="flex items-start gap-4 bg-[#111111] rounded-xl p-5 border border-white/5"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[#E50000]/10 flex items-center justify-center mt-0.5">
                    <span className="text-[#E50000] text-lg">→</span>
                  </div>
                  <span className="text-gray-300 text-base leading-relaxed">{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ScrollReveal>

      {/* Grille des 14 services */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#0A0A0A] py-24 md:py-32 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
            <h2 className="font-heading text-2xl md:text-3xl mb-4">
              NOS SERVICES DE RÉNOVATION{" "}
              <span className="text-[#E50000]">À {villeData.name.toUpperCase()}</span>
            </h2>
            <p className="text-gray-400 mb-12 max-w-2xl">
              Aiman Renovation intervient à {villeData.name} pour l&apos;ensemble de vos travaux, du
              gros œuvre aux finitions. Tous nos artisans sont qualifiés et couverts par la
              garantie décennale.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex items-center gap-3 bg-[#111111] rounded-xl p-4 border border-white/5 hover:border-[#E50000]/30 transition-colors"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#E50000]/10 flex items-center justify-center">
                    <span className="text-[#E50000] text-sm">→</span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                    {service.shortTitle}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Pourquoi artisan local */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 bg-black py-24 md:py-32 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4">
                <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                <h2 className="font-heading text-2xl md:text-3xl leading-tight">
                  POURQUOI UN ARTISAN{" "}
                  <span className="text-[#E50000]">LOCAL ?</span>
                </h2>
              </div>
              <div className="md:col-span-8 space-y-5 text-gray-400 text-lg leading-relaxed">
                {content.whyLocal.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Zone d'intervention */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#0A0A0A] py-16 md:py-24 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
            <h2 className="font-heading text-xl md:text-2xl mb-4">
              ZONE D&apos;INTERVENTION{" "}
              <span className="text-[#E50000]">AUTOUR DE {villeData.name.toUpperCase()}</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl">
              Nous intervenons à {villeData.name} et dans les communes environnantes. Chaque
              déplacement est planifié pour minimiser les délais et vous garantir une réactivité
              maximale.
            </p>
            <ul className="flex flex-wrap gap-3">
              <li className="bg-[#E50000]/10 border border-[#E50000]/30 rounded-full px-4 py-2 text-sm text-white font-medium">
                {villeData.name}
              </li>
              {content.communesAlentours.map((commune) => (
                <li
                  key={commune}
                  className="bg-[#111111] border border-white/5 rounded-full px-4 py-2 text-sm text-gray-300"
                >
                  {commune}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ScrollReveal>

      {/* Projets réalisés */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 bg-black py-24 md:py-32 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4">
                <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                <h2 className="font-heading text-2xl md:text-3xl leading-tight">
                  PROJETS RÉALISÉS{" "}
                  <span className="text-[#E50000]">
                    À {villeData.name.toUpperCase()}
                  </span>
                </h2>
              </div>
              <div className="md:col-span-8 space-y-5 text-gray-400 text-lg leading-relaxed">
                {content.projectsSection.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ locale */}
      {(FAQ_VILLES[villeData.slug] ?? []).length > 0 && (
        <ScrollReveal direction="up">
          <section className="relative z-10 bg-[#0A0A0A] py-24 md:py-32 border-t border-white/5">
            <div className="max-w-5xl mx-auto px-6">
              <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
              <h2 className="font-heading text-2xl md:text-3xl mb-12">
                QUESTIONS FRÉQUENTES{" "}
                <span className="text-[#E50000]">À {villeData.name.toUpperCase()}</span>
              </h2>
              <div className="space-y-4">
                {(FAQ_VILLES[villeData.slug] ?? []).map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-[#111111] border border-white/5 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer p-6 text-white font-medium text-base md:text-lg hover:text-[#E50000] transition-colors list-none [&::-webkit-details-marker]:hidden">
                      <span>{faq.question}</span>
                      <span className="shrink-0 w-6 h-6 rounded-full bg-[#E50000]/10 flex items-center justify-center text-[#E50000] text-sm transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Villes proches — maillage interne */}
      {(() => {
        const nearbyVilles = VILLES_FR.filter(
          (v) =>
            v.slug !== villeData.slug &&
            (villeData.communesAlentours.some(
              (c) => c.toLowerCase() === v.name.toLowerCase()
            ) ||
              v.communesAlentours.some(
                (c) => c.toLowerCase() === villeData.name.toLowerCase()
              ))
        ).slice(0, 6);
        if (nearbyVilles.length === 0) return null;
        return (
          <ScrollReveal direction="up" delay={0.05}>
            <section className="relative z-10 bg-black py-16 md:py-24 border-t border-white/5">
              <div className="max-w-5xl mx-auto px-6">
                <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                <h2 className="font-heading text-xl md:text-2xl mb-8">
                  RÉNOVATION{" "}
                  <span className="text-[#E50000]">PRÈS DE {villeData.name.toUpperCase()}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {nearbyVilles.map((v) => (
                    <Link
                      key={v.slug}
                      href={`/renovation/${v.slug}`}
                      className="group flex items-center gap-3 bg-[#111111] rounded-xl p-4 border border-white/5 hover:border-[#E50000]/30 transition-colors"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-full bg-[#E50000]/10 flex items-center justify-center">
                        <span className="text-[#E50000] text-sm">→</span>
                      </div>
                      <div>
                        <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                          Rénovation à {v.name}
                        </span>
                        <span className="block text-gray-600 text-xs">
                          {v.codePostal} — {v.distance} km
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>
        );
      })()}

      {/* CTA final */}
      <section className="relative z-10 overflow-hidden bg-[#0A0A0A] border-t border-white/5">
        <div className="relative z-10 py-24 md:py-32 max-w-5xl mx-auto px-6">
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl md:text-5xl mb-6 leading-tight">
              UN PROJET DE RÉNOVATION
              <br />À {villeData.name.toUpperCase()} ?{" "}
              <span className="text-[#E50000]">PARLONS-EN.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Devis gratuit sous 48h, intervention rapide. Artisan qualifié, garantie décennale.
              Saint-Louis est à {villeData.distance} km — nous connaissons votre secteur.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <LinkButton
                href="/devis"
                size="lg"
                className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4"
              >
                Demander un devis gratuit
              </LinkButton>
              <a
                href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`}
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
                {COMPANY.mobile}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
