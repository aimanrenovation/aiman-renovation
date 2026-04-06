import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/3d/providers/SmoothScrollProvider";

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

  const areaServed = isFr
    ? frenchCities.map((name) => ({ "@type": "City", name }))
    : [...frenchCities, ...swissCities].map((name) => ({ "@type": "City", name }));

  const serviceNames = ts.raw("service_names") as string[];

  const catalogName = ts("catalog_name");

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ts("organization_type"),
    "@id": "https://aiman-renovation.fr/#organization",
    name: tc("company_name"),
    legalName: `${tc("company_name")} ${tc("legal_form")}`,
    url: tc("website"),
    logo: "https://aiman-renovation.fr/images/logo.png",
    image: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
    description: tc("slogan"),
    slogan: tc("slogan"),
    inLanguage: locale,
    telephone: tc("phone"),
    email: tc("email"),
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Rue de Bâle",
      addressLocality: "Saint-Louis",
      postalCode: "68300",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.5879,
      longitude: 7.5596,
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
        },
      })),
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
    sameAs: ["https://www.facebook.com/aimansarl"],
  };

  // All data is internal/static — no user input, XSS-safe
  const jsonLdString = JSON.stringify(organizationJsonLd);

  return (
    <NextIntlClientProvider messages={messages}>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />
      <SmoothScrollProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </NextIntlClientProvider>
  );
}
