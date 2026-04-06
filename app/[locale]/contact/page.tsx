import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { COMPANY } from "@/lib/constants";
import { LinkButton } from "@/components/ui/link-button";
import { ContactForm } from "@/components/sections/contact-form";
import { getAlternates } from "@/lib/i18n-helpers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const title = t("seo_title");
  const description = t("seo_description");
  return {
    title,
    description,
    alternates: getAlternates("/contact"),
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/contact",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/ambiance-contact.jpg",
          width: 1200,
          height: 630,
          alt: "Contactez Aiman Renovation — Saint-Louis Haut-Rhin",
        },
      ],
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/ambiance-contact.jpg"
            alt="Contactez Aiman Renovation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 w-full">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-none">
            <span className="text-[#E50000]">{t("hero_title_highlight")}</span> {t("hero_title")}
          </h1>
          <p className="mt-4 text-gray-300 text-lg max-w-xl">
            {t("hero_subtitle")}
          </p>
        </div>
      </section>

      {/* Bandeau rassurant */}
      <section className="relative z-10 bg-[#0A0A0A] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>, text: t("reassurance_devis") },
              { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, text: t("reassurance_response") },
              { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>, text: t("reassurance_engagement") },
            ].map((item) => (
              <div key={item.text} className="flex items-center justify-center gap-2 text-gray-400">
                <span className="text-[#E50000]">{item.icon}</span>
                <span className="text-sm font-medium text-white">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="relative z-10 py-16 md:py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

            {/* Formulaire — 3 colonnes */}
            <div className="md:col-span-3 bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-10">
              <ContactForm />
            </div>

            {/* Infos — 2 colonnes */}
            <div className="md:col-span-2 space-y-8">

              {/* Mobile */}
              <a href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`} className="group block bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-[#E50000]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E50000]/10 flex items-center justify-center text-[#E50000] group-hover:bg-[#E50000]/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold group-hover:text-[#E50000] transition-colors">{COMPANY.mobile}</p>
                    <p className="text-gray-500 text-sm">{t("mobile_whatsapp")}</p>
                  </div>
                </div>
              </a>

              {/* WhatsApp */}
              <a href={`https://wa.me/${COMPANY.mobile.replace(/\s/g, "").replace(/^0/, "33")}?text=${encodeURIComponent(tc("whatsapp_message"))}`} target="_blank" rel="noopener noreferrer" className="group block bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-[#25D366]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366]/20 transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold group-hover:text-[#25D366] transition-colors">{t("whatsapp")}</p>
                    <p className="text-gray-500 text-sm">{t("whatsapp_subtitle")}</p>
                  </div>
                </div>
              </a>

              {/* Email */}
              <a href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(tc("email_subject"))}&body=${encodeURIComponent(tc("email_body"))}`} className="group block bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-[#E50000]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E50000]/10 flex items-center justify-center text-[#E50000] group-hover:bg-[#E50000]/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold group-hover:text-[#E50000] transition-colors">{COMPANY.email}</p>
                    <p className="text-gray-500 text-sm">{t("email_prefilled")}</p>
                  </div>
                </div>
              </a>

              {/* Horaires */}
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#E50000]/10 flex items-center justify-center text-[#E50000]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-lg text-white">{t("hours_title")}</h2>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-400">{t("hours_weekdays")}</span>
                    <span className="text-white font-medium">{t("hours_weekdays_value")}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">{t("hours_saturday")}</span>
                    <span className="text-white font-medium">{t("hours_saturday_value")}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">{t("hours_sunday")}</span>
                    <span className="text-gray-600">{t("hours_sunday_value")}</span>
                  </li>
                </ul>
              </div>

              {/* CTA Devis */}
              <LinkButton
                href="/devis"
                size="lg"
                className="bg-[#E50000] hover:bg-[#B80000] text-white w-full py-5 rounded-2xl"
              >
                {t("cta_devis")}
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps pleine largeur */}
      <section className="relative z-10 h-[400px] md:h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10706!2d7.5596!3d47.5845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4791b7b2a0e7ddd7%3A0x40a5fb99a3f0dd0!2sSaint-Louis!5e0!3m2!1sfr!2sfr"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Zone intervention Aiman Renovation"
        />
      </section>
    </>
  );
}
