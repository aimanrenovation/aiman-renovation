import type { Metadata } from "next";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import "./globals.css";

// Inter bundlé localement — évite la dépendance réseau à Google Fonts au build
const inter = localFont({
  src: [
    { path: "./fonts/Inter-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Inter-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const archivoBlack = localFont({
  src: "./fonts/ArchivoBlack-Regular.ttf",
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aiman Renovation — Artisan Rénovation Saint-Louis 68",
    template: "%s",
  },
  description: "Artisan rénovation intérieure et extérieure à Saint-Louis 68300, Haut-Rhin et zone tri-frontière. Cuisine, salle de bain, électricité, plomberie, façade, isolation. Devis gratuit.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://aiman-renovation.fr"),
  manifest: "/manifest.webmanifest",
  openGraph: {
    siteName: "Aiman Renovation",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/images/ambiance-resultat.jpg",
        width: 1200,
        height: 630,
        alt: "Aiman Renovation — Artisan rénovation Saint-Louis Haut-Rhin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aimanrenovation",
    creator: "@aimanrenovation",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "theme-color": "#E50000",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${archivoBlack.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
