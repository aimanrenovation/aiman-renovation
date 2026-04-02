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
    default: "Aiman Renovation | Rénovation à Saint-Louis (68)",
    template: "%s | Aiman Renovation",
  },
  description:
    "Spécialiste rénovation second œuvre, façades, isolation et aménagement paysager à Saint-Louis et environs. 19 ans d'expérience. Devis gratuit.",
};

// Static JSON-LD for SEO - no user input, safe to inline
const schemaJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "Aiman Renovation",
  url: "https://aiman-renovation.fr",
  telephone: "+33356894403",
  email: "contact@aiman-renovation.fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "14 rue de la Paix",
    addressLocality: "Saint-Louis",
    postalCode: "68300",
    addressCountry: "FR",
  },
  geo: { "@type": "GeoCoordinates", latitude: 47.5845, longitude: 7.5596 },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 47.5845, longitude: 7.5596 },
    geoRadius: "30000",
  },
  slogan: "Nous rénovons jusqu'au bout de vos rêves !",
  foundingDate: "2024",
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
        <SmoothScrollProvider>
          <main className="flex-1">{children}</main>
        </SmoothScrollProvider>
        <Footer />
      </body>
    </html>
  );
}
