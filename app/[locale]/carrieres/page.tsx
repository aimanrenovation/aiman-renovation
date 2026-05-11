import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/lib/i18n-helpers";
import CarrieresClient from "./carrieres-client";
import { Breadcrumb } from "@/components/breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "carrieres" });
  const title = t("seo_title");
  const description = t("seo_description");
  return {
    title,
    description,
    alternates: getAlternates("/carrieres"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/carrieres",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
          width: 1200,
          height: 630,
          alt: "Recrutement Aiman Renovation — artisan rénovation Saint-Louis 68",
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

export default async function CarrieresPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb items={[{ name: "Accueil", url: "/" }, { name: "Carrières", url: "/carrieres" }]} />
      <CarrieresClient />
    </>
  );
}
