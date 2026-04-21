import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/3d/providers/SmoothScrollProvider";
import { JsonLd } from "@/components/seo/json-ld";
import { ExitIntentPopup } from "@/components/sections/exit-intent-popup";
import { FloatingTrustBar } from "@/components/sections/floating-trust-bar";
import { ChatWidget } from "@/components/chat/chat-widget";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  const tc = await getTranslations({ locale, namespace: "common" });
  const ts = await getTranslations({ locale, namespace: "schema" });

  const isFr = locale === "fr";

  const frenchCities = [
    "Saint-Louis",
    "Huningue",
    "Hésingue",
    "Village-Neuf",
    "Blotzheim",
    "Bartenheim",
    "Kembs",
    "Sierentz",
    "Rosenau",
    "Hégenheim",
  ];

  const swissCities = [
    "Basel",
    "Riehen",
    "Allschwil",
    "Binningen",
    "Lörrach",
    "Weil am Rhein",
  ];

  const frenchAreas = [
    ...frenchCities.map((name) => ({ "@type": "City", name })),
    { "@type": "AdministrativeArea", name: "Haut-Rhin" },
    { "@type": "Country", name: "France" },
  ];

  const triboarderAreas = [
    ...frenchCities.map((name) => ({ "@type": "City", name })),
    ...swissCities.map((name) => ({ "@type": "City", name })),
    { "@type": "AdministrativeArea", name: "Haut-Rhin" },
    { "@type": "AdministrativeArea", name: "Basel-Stadt" },
    { "@type": "AdministrativeArea", name: "Basel-Landschaft" },
    { "@type": "AdministrativeArea", name: "Baden-Württemberg" },
    { "@type": "Country", name: "France" },
    { "@type": "Country", name: "Suisse" },
    { "@type": "Country", name: "Allemagne" },
  ];

  const areaServed = isFr ? frenchAreas : triboarderAreas;

  const serviceNames = ts.raw("service_names") as string[];

  const catalogName = ts("catalog_name");

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://aiman-renovation.fr/#website",
    url: "https://aiman-renovation.fr",
    name: "Aiman Renovation",
    description: tc("slogan"),
    publisher: {
      "@id": "https://aiman-renovation.fr/#organization",
    },
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://aiman-renovation.fr/services/{search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": "https://aiman-renovation.fr/#organization",
    name: tc("company_name"),
    alternateName: "Aiman Renovation",
    legalName: `${tc("company_name")} ${tc("legal_form")}`,
    url: tc("website"),
    logo: {
      "@type": "ImageObject",
      url: "https://aiman-renovation.fr/images/logo.png",
      width: 200,
      height: 60,
    },
    image: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
    description: tc("slogan"),
    slogan: tc("slogan"),
    inLanguage: locale,
    telephone: tc("phone"),
    email: tc("email"),
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Rue de Bâle",
      addressLocality: "Saint-Louis",
      postalCode: "68300",
      addressRegion: "Haut-Rhin",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.5894,
      longitude: 7.5605,
    },
    areaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: catalogName,
      itemListElement: serviceNames.map((name) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name,
          provider: {
            "@id": "https://aiman-renovation.fr/#organization",
          },
          areaServed: { "@type": "City", name: "Saint-Louis" },
        },
      })),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "47",
      bestRating: "5",
      worstRating: "1",
    },
    priceRange: "€€",
    currenciesAccepted: ts("price_currency"),
    paymentAccepted: "Cash, Bank transfer, Check",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:00",
        closes: "12:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/aimanrenovation",
      "https://www.instagram.com/aimanrenovation",
      "https://www.linkedin.com/company/aiman-renovation",
      "https://www.tiktok.com/@aimanrenovation",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: tc("phone"),
      contactType: "customer service",
      areaServed: "FR",
      availableLanguage: ["French", "Arabic"],
    },
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <SmoothScrollProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingTrustBar />
        <ExitIntentPopup />
        <ChatWidget />
      </SmoothScrollProvider>
    </NextIntlClientProvider>
  );
}
