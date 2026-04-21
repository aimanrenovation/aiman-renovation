import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  generateBuildId: () => Date.now().toString(),
  compress: true,
  poweredByHeader: false,
  // cacheComponents: skipped — WS-B-bis requis
  // Raison: conflit avec `export const dynamic = "force-dynamic"` sur les pages espace-employes
  // Action: migrer les pages employes vers fetch cache avant d'activer

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 an
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    remotePatterns: [
      // Scaleway Object Storage — bucket Jarvis médias (photos chantiers)
      {
        protocol: "https",
        hostname: "**.s3.fr-par.scw.cloud",
      },
      // Scaleway CDN alternatif
      {
        protocol: "https",
        hostname: "**.s3.nl-ams.scw.cloud",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    const oldToNew: [string, string][] = [
      ["carrelage", "sols-carrelage"],
      ["peinture-finitions", "peinture"],
      ["facade-isolation", "facade"],
    ];
    const locales = ["", "/de", "/en"];
    return oldToNew.flatMap(([oldSlug, newSlug]) =>
      locales.map((locale) => ({
        source: `${locale}/services/${oldSlug}`,
        destination: `${locale}/services/${newSlug}`,
        permanent: true,
      })),
    );
  },
};

export default withNextIntl(nextConfig);
