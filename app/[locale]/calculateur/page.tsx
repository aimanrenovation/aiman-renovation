import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getAlternates } from "@/lib/i18n-helpers";
import { CalculateurClient } from "@/components/calculateur/calculateur-client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calculateur" });

  const title = t("meta_title");
  const description = t("meta_description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/calculateur",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
          width: 1200,
          height: 630,
          alt: "Calculateur de devis — Aiman Renovation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ["https://aiman-renovation.fr/images/ambiance-resultat.jpg"],
    },
    alternates: getAlternates("/calculateur"),
  };
}

export default async function CalculateurPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CalculateurClient />;
}
