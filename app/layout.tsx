import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SmoothScrollProvider from '@/components/3d/providers/SmoothScrollProvider';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const archivoBlack = localFont({
  src: "./fonts/ArchivoBlack-Regular.ttf",
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rénovation Maison Saint-Louis 68300 | Devis Gratuit — Aiman Renovation",
    template: "%s | Aiman Renovation",
  },
  description:
    "Artisan rénovation à Saint-Louis (68300) : cuisine, salle de bain, façades, isolation, peinture, carrelage. 19 ans d'expérience en Haut-Rhin. Devis gratuit sous 48h.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://aiman-renovation.fr"),
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Aiman Renovation",
    title: "Rénovation Maison Saint-Louis 68300 | Devis Gratuit — Aiman Renovation",
    description:
      "Artisan rénovation à Saint-Louis (68300) : cuisine, salle de bain, façades, isolation, peinture, carrelage. 19 ans d'expérience en Haut-Rhin. Devis gratuit sous 48h.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rénovation Maison Saint-Louis 68300 | Devis Gratuit — Aiman Renovation",
    description:
      "Artisan rénovation à Saint-Louis (68300) : cuisine, salle de bain, façades, isolation, peinture, carrelage. 19 ans d'expérience en Haut-Rhin. Devis gratuit sous 48h.",
  },
};

// Static JSON-LD for SEO - no user input, safe to inline
const schemaJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://aiman-renovation.fr/#organization",
  name: "Aiman Renovation",
  url: "https://aiman-renovation.fr",
  logo: "https://aiman-renovation.fr/favicon.png",
  image: "https://aiman-renovation.fr/images/ambiance-resultat.jpg",
  telephone: "+33356894403",
  email: "contact@aiman-renovation.fr",
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    streetAddress: "14 rue de la Paix",
    addressLocality: "Saint-Louis",
    addressRegion: "Grand Est",
    postalCode: "68300",
    addressCountry: "FR",
  },
  geo: { "@type": "GeoCoordinates", latitude: 47.5845, longitude: 7.5596 },
  areaServed: [
    { "@type": "City", name: "Saint-Louis", sameAs: "https://fr.wikipedia.org/wiki/Saint-Louis_(Haut-Rhin)" },
    { "@type": "City", name: "Huningue" },
    { "@type": "City", name: "Hésingue" },
    { "@type": "City", name: "Village-Neuf" },
    { "@type": "City", name: "Blotzheim" },
    { "@type": "City", name: "Bartenheim" },
    { "@type": "City", name: "Kembs" },
    { "@type": "City", name: "Sierentz" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services de rénovation",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rénovation de cuisine" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rénovation salle de bain" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Électricité" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Plomberie" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Carrelage" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Façades et isolation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Aménagement paysager" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Peinture et finitions" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Borne de recharge" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Panneaux photovoltaïques" } },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "47",
    bestRating: "5",
  },
  slogan: "Nous rénovons jusqu'au bout de vos rêves !",
  foundingDate: "2024",
  numberOfEmployees: { "@type": "QuantitativeValue", value: 5 },
  knowsLanguage: ["fr", "de", "ar"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${archivoBlack.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJsonLd }} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
