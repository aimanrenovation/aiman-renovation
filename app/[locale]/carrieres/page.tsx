import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/lib/i18n-helpers";
import CarrieresClient from "./carrieres-client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "carrieres" });
  return {
    title: t("seo_title"),
    description: t("seo_description"),
    alternates: getAlternates("/carrieres"),
  };
}

export default async function CarrieresPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CarrieresClient />;
}
