import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServicesPageContent } from "@/components/services/services-page-content";
import { getAlternates } from "@/lib/i18n-helpers";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { SERVICES } from "@/lib/services";

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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://aiman-renovation.fr/images/ambiance-resultat.jpg"],
    },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Services de rénovation — Aiman Renovation Saint-Louis 68",
    url: "https://aiman-renovation.fr/services",
    itemListElement: SERVICES.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.seoTitle ?? service.title,
        description: service.seoDescription ?? service.description,
        url: `https://aiman-renovation.fr/services/${service.slug}`,
        provider: {
          "@type": "HomeAndConstructionBusiness",
          "@id": "https://aiman-renovation.fr/#organization",
          name: "Aiman Renovation",
        },
        areaServed: { "@type": "City", name: "Saint-Louis" },
      },
    })),
  };

  return (
    <>
      <Breadcrumb
        items={[
          { name: "Accueil", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />
      <JsonLd data={itemListSchema} />
      <ServicesPageContent />
    </>
  );
}
