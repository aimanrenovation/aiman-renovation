import { getTranslations, setRequestLocale } from "next-intl/server";
import { COMPANY } from "@/lib/constants";
import { getAlternates } from "@/lib/i18n-helpers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  const title = t("seo_title");
  const description = t("seo_description");
  return {
    title,
    description,
    alternates: getAlternates("/mentions-legales"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/mentions-legales",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
  };
}

export default async function MentionsLegalesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <section className="pt-32 pb-20 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-sm">
        <h1 className="font-heading text-4xl mb-8">
          {t("page_title")} <span className="text-[#E50000]">{t("page_title_highlight")}</span>
        </h1>

        <h2>{t("editor_title")}</h2>
        <p>
          <strong>{COMPANY.name}</strong><br />
          {t("editor_legal_form")} {COMPANY.legalForm}<br />
          {t("editor_address")} {COMPANY.address}, {COMPANY.zip} {COMPANY.city}<br />
          {t("editor_phone")} {COMPANY.phone}<br />
          {t("editor_email")} {COMPANY.email}<br />
          {t("editor_director")}
        </p>

        <h2>{t("hosting_title")}</h2>
        <p>{t("hosting_text")}</p>

        <h2>{t("ip_title")}</h2>
        <p>{t("ip_text", { company: COMPANY.name })}</p>

        <h2>{t("data_title")}</h2>
        <p>
          {t("data_text")}{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-[#E50000]">
            {COMPANY.email}
          </a>
          .
        </p>

        <h2>{t("cookies_title")}</h2>
        <p>{t("cookies_text")}</p>

        <h2>{t("liability_title")}</h2>
        <p>{t("liability_text", { company: COMPANY.name })}</p>

        <h2>{t("credits_title")}</h2>
        <p>
          {t("credits_design")} {COMPANY.name}<br />
          {t("credits_images")}
        </p>
      </div>
    </section>
  );
}
