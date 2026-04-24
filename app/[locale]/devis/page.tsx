import { getTranslations, setRequestLocale } from "next-intl/server";
import { DevisPageContent } from "@/components/devis/devis-page-content";
import { getAlternates } from "@/lib/i18n-helpers";
import { Breadcrumb } from "@/components/breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "devis" });
  const title = t("seo_title");
  const description = t("seo_description");
  return {
    title,
    description,
    alternates: getAlternates("/devis"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/devis",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
          width: 1200,
          height: 630,
          alt: "Devis gratuit rénovation — Aiman Renovation Saint-Louis",
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ["https://aiman-renovation.fr/images/ambiance-resultat.jpg"],
    },
  };
}

export default async function DevisPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb
        items={[
          { name: "Accueil", url: "/" },
          { name: "Devis gratuit", url: "/devis" },
        ]}
      />
      <DevisPageContent />
    </>
  );
}
