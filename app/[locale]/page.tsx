import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/lib/i18n-helpers";
import { Hero } from "@/components/sections/hero";
import { SavoirFaire } from "@/components/sections/savoir-faire";
import { ServicesPreview } from "@/components/sections/services-preview";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { CtaBanner } from "@/components/sections/cta-banner";
import { TestimonialCard } from "@/components/testimonial-card";
import { getFeaturedTestimonials, getAverageRating } from "@/lib/testimonials";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { SeasonalPopup } from "@/components/seasonal-popup";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("home_title");
  const description = t("home_description");
  return {
    title,
    description,
    alternates: getAlternates("/"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
          width: 1200,
          height: 630,
          alt: "Aiman Renovation — Artisan rénovation Saint-Louis Haut-Rhin",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://aiman-renovation.fr/images/ambiance-resultat.jpg"],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const zones = tc.raw("zones") as string[];

  return (
    <>
      <Hero />
      <SavoirFaire />

      {/* Bandeau visuel — rouleau de peinture style Apple */}
      <section className="relative z-10 bg-black py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3 flex justify-center">
            <Image src="/images/element-rouleau.jpg" alt={t("paint_roller.alt")} width={300} height={300} className="w-48 md:w-64 h-auto" />
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <p className="font-heading text-2xl md:text-3xl text-white leading-snug">
              {t("paint_roller.line1")}<br />
              {t("paint_roller.line2")}<br />
              {t("paint_roller.line3")}<br />
              <span className="text-[#E50000]">{t("paint_roller.highlight")}</span>
            </p>
          </div>
        </div>
      </section>

      <ServicesPreview />

      {/* Bandeau visuel — résultat final */}
      <section className="relative z-10 h-[50vh] overflow-hidden">
        <Image
          src="/images/ambiance-resultat.jpg"
          alt={t("result_banner.alt")}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
        <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
          <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-white">
            {t("result_banner.text")} <span className="text-[#E50000]">{t("result_banner.highlight")}</span>
          </p>
        </div>
      </section>

      <TestimonialsCarousel />
      <WhyChooseUs />

      {/* Section avis clients — 6 meilleurs témoignages */}
      <section className="relative z-10 bg-zinc-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-zinc-900 mb-3">
              ILS NOUS FONT{" "}
              <span className="text-[#E50000]">CONFIANCE</span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
              <span className="text-zinc-900 font-semibold text-lg">{getAverageRating().toFixed(1)}/5</span>
              <span>·</span>
              <span>30 avis vérifiés</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFeaturedTestimonials(6).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/avis"
              className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 text-sm font-medium border border-zinc-300 hover:border-zinc-500 px-6 py-3 rounded-xl transition-all"
            >
              Voir tous les avis →
            </Link>
          </div>
        </div>
      </section>

      {/* Zone d'intervention avec photo Alsace */}
      <section className="relative z-10 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/ambiance-alsace.jpg" alt="Paysage alsacien — zone intervention rénovation Saint-Louis Haut-Rhin" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative py-20 md:py-32 max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl mb-4">
            {tc("zone_title")}<span className="text-[#E50000]">{tc("zone_title_highlight")}</span>
          </h2>
          <p className="text-gray-400 mb-12">
            {tc("zones_subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {zones.map((zone: string) => (
              <span key={zone} className="px-5 py-2.5 rounded-full border border-white/20 text-gray-300 text-sm hover:border-[#E50000]/40 hover:text-white transition-all backdrop-blur-sm">
                {zone}
              </span>
            ))}
            <span className="px-5 py-2.5 rounded-full border border-[#E50000]/30 text-[#E50000] text-sm backdrop-blur-sm">
              {tc("zones_and_beyond")}
            </span>
          </div>
          <div className="mt-12">
            <LinkButton href="/contact" size="lg" className="bg-transparent border border-white/20 text-white hover:bg-white/10 px-8 py-5 backdrop-blur-sm">
              {tc("our_coordinates")}
            </LinkButton>
          </div>
        </div>
      </section>

      <CtaBanner />
      <SeasonalPopup />
    </>
  );
}
