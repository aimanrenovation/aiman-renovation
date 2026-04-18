import { getTranslations, setRequestLocale } from "next-intl/server";
import { RealisationsGrid } from "@/components/sections/realisations-grid";
import { RealisationsDynamiques } from "@/components/sections/realisations-dynamiques";
import { CtaBanner } from "@/components/sections/cta-banner";
import { getAlternates } from "@/lib/i18n-helpers";
import { Breadcrumb } from "@/components/breadcrumb";
import { getAllRealisations } from "@/lib/realisations";

export const runtime = "nodejs";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "realisations" });
  const title = t("seo_title");
  const description = t("seo_description");
  return {
    title,
    description,
    alternates: getAlternates("/realisations"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/realisations",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
          width: 1200,
          height: 630,
          alt: "Réalisations Aiman Renovation — projets rénovation Haut-Rhin",
        },
      ],
    },
  };
}

export default async function RealisationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "realisations" });

  // Réalisations dynamiques publiées automatiquement par Jarvis (agent #16)
  const realisationsDynamiques = getAllRealisations();

  return (
    <>
      <Breadcrumb
        items={[
          { name: "Accueil", url: "/" },
          { name: "Réalisations", url: "/realisations" },
        ]}
      />
      <section className="relative z-10 pt-32 pb-10 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl">
              {t("hero_title")}{" "}
              <span className="text-[#E50000]">
                {t("hero_title_highlight")}
              </span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
              {t("hero_subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Réalisations dynamiques Jarvis — publiées automatiquement depuis les chantiers */}
      {realisationsDynamiques.length > 0 && (
        <section className="relative z-10 pb-10 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Derniers chantiers réalisés
            </h2>
            <RealisationsDynamiques realisations={realisationsDynamiques} />
          </div>
        </section>
      )}

      {/* Portfolio statique */}
      <section className="relative z-10 pb-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          {realisationsDynamiques.length > 0 && (
            <h2 className="text-xl font-semibold text-white mb-6">Portfolio</h2>
          )}
          <RealisationsGrid />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
