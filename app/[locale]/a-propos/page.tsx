import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/lib/i18n-helpers";
import AProposClient from "./a-propos-client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("seo_title"),
    description: t("seo_description"),
    alternates: getAlternates("/a-propos"),
  };
}

export default async function AProposPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AProposClient />;
}
