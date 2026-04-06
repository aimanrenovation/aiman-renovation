import { getTranslations, setRequestLocale } from "next-intl/server";
import { COMPANY } from "@/lib/constants";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("seo_title"),
    description: `${t("seo_title")} — ${COMPANY.website}`,
  };
}

export default async function PolitiqueConfidentialitePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });

  const dataCollectedItems = t.raw("data_collected_items") as string[];
  const purposeItems = t.raw("purpose_items") as string[];
  const rightsItems = t.raw("rights_items") as string[];

  return (
    <section className="pt-32 pb-20 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-sm">
        <h1 className="font-heading text-4xl mb-8">
          {t("page_title")} <span className="text-[#E50000]">{t("page_title_highlight")}</span>
        </h1>

        <p>
          <strong>{COMPANY.name}</strong> {t("intro", { company: COMPANY.name }).replace(COMPANY.name, "").trim()}
        </p>

        <h2>{t("data_collected_title")}</h2>
        <p>{t("data_collected_intro")}</p>
        <ul>
          {dataCollectedItems.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>{t("purpose_title")}</h2>
        <p>{t("purpose_intro")}</p>
        <ul>
          {purposeItems.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>{t("retention_title")}</h2>
        <p>{t("retention_text", { company: COMPANY.name })}</p>

        <h2>{t("sharing_title")}</h2>
        <p>{t("sharing_text")}</p>

        <h2>{t("rights_title")}</h2>
        <p>{t("rights_intro")}</p>
        <ul>
          {rightsItems.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          {t("rights_contact")}{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-[#E50000]">
            {COMPANY.email}
          </a>{" "}
          {t("rights_contact_mail")} {COMPANY.address}, {COMPANY.zip} {COMPANY.city}.
        </p>

        <h2>{t("cookies_title")}</h2>
        <p>{t("cookies_text")}</p>

        <h2>{t("contact_title")}</h2>
        <p>
          {t("contact_intro")}<br />
          {t("contact_email_label")} {COMPANY.email}<br />
          {t("contact_phone_label")} {COMPANY.phone}
        </p>
      </div>
    </section>
  );
}
