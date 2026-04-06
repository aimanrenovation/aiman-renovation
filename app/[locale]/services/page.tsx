import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServicesPageContent } from "@/components/services/services-page-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("seo_title"),
    description: t("seo_description"),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPageContent />;
}
