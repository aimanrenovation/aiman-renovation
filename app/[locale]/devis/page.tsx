import { getTranslations, setRequestLocale } from "next-intl/server";
import { DevisPageContent } from "@/components/devis/devis-page-content";
import { getAlternates } from "@/lib/i18n-helpers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "devis" });
  return {
    title: t("seo_title"),
    description: t("seo_description"),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
    },
    alternates: getAlternates("/devis"),
  };
}

export default async function DevisPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DevisPageContent />;
}
