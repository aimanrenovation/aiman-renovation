import { getTranslations, setRequestLocale } from "next-intl/server";
import { RealisationsGrid } from "@/components/sections/realisations-grid";
import { CtaBanner } from "@/components/sections/cta-banner";
import { getAlternates } from "@/lib/i18n-helpers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "realisations" });
  return {
    title: t("seo_title"),
    description: t("seo_description"),
    alternates: getAlternates("/realisations"),
  };
}

export default async function RealisationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "realisations" });

  return (
    <>
      <section className="relative z-10 pt-32 pb-10 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl">
              {t("hero_title")} <span className="text-[#E50000]">{t("hero_title_highlight")}</span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
              {t("hero_subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <RealisationsGrid />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
