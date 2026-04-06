import { getTranslations, setRequestLocale } from "next-intl/server";
import { COMPANY } from "@/lib/constants";
import { getAlternates } from "@/lib/i18n-helpers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cgv" });
  const title = t("seo_title");
  const description = t("seo_description");
  return {
    title,
    description,
    alternates: getAlternates("/cgv"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/cgv",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
  };
}

export default async function CgvPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "cgv" });

  const sections = t.raw("sections") as { title: string; content: string }[];

  return (
    <section className="relative z-10 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4">
          {t("page_title")} <span className="text-[#E50000]">{t("page_title_highlight")}</span>
        </h1>
        <p className="text-gray-500 text-sm mb-12">
          {COMPANY.name} — SASU — {t("last_update")}
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-lg text-white mb-3">{section.title}</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {section.content
                  .replace(/\{company\}/g, COMPANY.name)
                  .replace(/\{city\}/g, COMPANY.city)
                  .replace(/\{email\}/g, COMPANY.email)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
