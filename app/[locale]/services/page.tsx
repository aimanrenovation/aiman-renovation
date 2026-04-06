import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServicesPageContent } from "@/components/services/services-page-content";
import { getAlternates } from "@/lib/i18n-helpers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const title = t("seo_title");
  const description = t("seo_description");
  return {
    title,
    description,
    alternates: getAlternates("/services"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/services",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
          width: 1200,
          height: 630,
          alt: "Services de rénovation — Aiman Renovation Saint-Louis",
        },
      ],
    },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPageContent />;
}
