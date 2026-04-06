import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SERVICES, PHOTO_MAP, ICON_MAP } from "@/lib/services";
import { COMPANY } from "@/lib/constants";
import { LinkButton } from "@/components/ui/link-button";
import { ScrollReveal } from "@/components/sections/scroll-reveal";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: `${service.title} ${t("service_meta_suffix")}`,
    description: `${service.description} ${t("service_meta_desc_suffix")}`,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const t = await getTranslations({ locale, namespace: "services" });

  // Static JSON-LD schema - no user input, safe to inline
  const serviceJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://aiman-renovation.fr/#organization",
      name: "Aiman Renovation",
    },
    areaServed: {
      "@type": "City",
      name: "Saint-Louis",
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
      },
    },
  });

  const photo = PHOTO_MAP[service.slug];
  const icon = ICON_MAP[service.slug];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: serviceJsonLd }}
      />
      {/* Hero full-bleed avec photo */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        {photo && (
          <>
            <Image
              src={photo}
              alt={`${service.title} — Aiman Renovation Saint-Louis 68`}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          </>
        )}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 pt-40">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-1 rounded-full bg-[#002B7F]" />
            <div className="w-6 h-1 rounded-full bg-white" />
            <div className="w-6 h-1 rounded-full bg-[#CE1126]" />
          </div>
          {icon && (
            <Image
              src={icon}
              alt=""
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 mb-6 drop-shadow-2xl"
            />
          )}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight">
            {service.title.toUpperCase()}
          </h1>
          <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
            {service.description}
          </p>
          <div className="mt-8">
            <LinkButton
              href="/devis"
              size="lg"
              className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4"
            >
              {t("cta_hero_button")}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Description longue */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#0A0A0A] py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4">
                <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                <h2 className="font-heading text-2xl md:text-3xl leading-tight">
                  {t("detail_title")} <span className="text-[#E50000]">{t("detail_title_highlight")}</span>
                </h2>
              </div>
              <div className="md:col-span-8 space-y-5 text-gray-400 text-lg leading-relaxed">
                {service.longDescription.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Bandeau photo plein ecran */}
      {photo && (
        <section className="relative z-10 h-[40vh] md:h-[50vh] overflow-hidden">
          <Image
            src={photo}
            alt={`Travaux ${service.title.toLowerCase()} en cours — artisan Haut-Rhin`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
          <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
            <p className="font-heading text-2xl md:text-4xl text-white">
              {t("quality_text")} <span className="text-[#E50000]">{t("quality_highlight")}</span>
            </p>
          </div>
        </section>
      )}

      {/* Ce que nous realisons */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 bg-black py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
            <h2 className="font-heading text-2xl md:text-3xl mb-12">
              {t("features_title")}{" "}
              <span className="text-[#E50000]">{t("features_title_highlight")}</span>
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-4 bg-[#111111] rounded-xl p-5 border border-white/5 hover:border-[#E50000]/20 transition-colors"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[#E50000]/10 flex items-center justify-center">
                    <span className="text-[#E50000] text-lg">→</span>
                  </div>
                  <span className="text-gray-300 text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ScrollReveal>

      {/* Processus etape par etape */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#0A0A0A] py-24 md:py-32 overflow-hidden">
          {photo && (
            <>
              <Image
                src={photo}
                alt=""
                fill
                className="object-cover opacity-[0.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
            </>
          )}
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
            <h2 className="font-heading text-2xl md:text-3xl mb-12">
              {t("process_title")} <span className="text-[#E50000]">{t("process_title_highlight")}</span>
            </h2>
            <div className="space-y-6">
              {service.process.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-6 bg-black/60 backdrop-blur-sm border border-white/5 rounded-xl p-6 md:p-8 hover:border-[#E50000]/20 transition-colors"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-[#E50000] flex items-center justify-center">
                    <span className="font-heading text-white text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg md:text-xl text-white mb-2">
                      {step.step}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Pourquoi un pro + Budget */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 bg-black py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#111111] border border-white/5 rounded-xl p-8 md:p-10">
                <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                <h2 className="font-heading text-xl md:text-2xl mb-6">
                  {t("why_pro_title")}{" "}
                  <span className="text-[#E50000]">{t("why_pro_highlight")}</span>
                </h2>
                <p className="text-gray-400 leading-relaxed">{service.whyPro}</p>
              </div>

              <div className="bg-[#111111] border border-[#E50000]/20 rounded-xl p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                  <h2 className="font-heading text-xl md:text-2xl mb-6">
                    {t("budget_title")} <span className="text-[#E50000]">{t("budget_highlight")}</span>
                  </h2>
                  <p className="text-2xl md:text-3xl font-heading text-white mb-4">
                    {service.priceRange}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t("budget_disclaimer")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA final */}
      <section className="relative z-10 overflow-hidden">
        {photo && (
          <>
            <Image
              src={photo}
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
          </>
        )}
        <div className="relative z-10 py-24 md:py-32 max-w-5xl mx-auto px-6">
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl md:text-5xl mb-6 leading-tight">
              {t("cta_title_line1")}<br />
              {t("cta_title_line2")} <span className="text-[#E50000]">{t("cta_title_highlight")}</span> ?
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {t("cta_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <LinkButton
                href="/devis"
                size="lg"
                className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4"
              >
                {t("cta_button")}
              </LinkButton>
              <a
                href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#E50000]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
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
