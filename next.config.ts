import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
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
