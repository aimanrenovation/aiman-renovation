import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 an
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
  },

  async headers() {
    return [
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
      }))
    );
  },
};

export default withNextIntl(nextConfig);
