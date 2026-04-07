import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/lib/i18n-helpers";
import AProposClient from "./a-propos-client";
import { Breadcrumb } from "@/components/breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("seo_title");
  const description = t("seo_description");
  return {
    title,
    description,
    alternates: getAlternates("/a-propos"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/a-propos",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/ambiance-alsace.jpg",
          width: 1200,
          height: 630,
          alt: "Aiman Renovation — Artisan rénovation Saint-Louis Haut-Rhin",
        },
      ],
    },
  };
}

export default async function AProposPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Breadcrumb
        items={[
          { name: "Accueil", url: "/" },
          { name: "À propos", url: "/a-propos" },
        ]}
      />
      <AProposClient />
    </>
  );
}
