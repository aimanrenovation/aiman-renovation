import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", preload: true, variable: "--font-inter" });

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${archivoBlack.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
