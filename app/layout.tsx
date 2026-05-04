import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const archivoBlack = localFont({
  src: "./fonts/ArchivoBlack-Regular.ttf",
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://aiman-renovation.fr"),
  manifest: "/manifest.webmanifest",
  openGraph: {
    siteName: "Aiman Renovation",
    type: "website",
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
