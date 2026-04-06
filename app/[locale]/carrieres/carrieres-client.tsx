"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Briefcase, Sparkles, Heart, TrendingUp, Send } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { COMPANY } from "@/lib/constants";

const VALUE_ICONS = [Heart, Sparkles, TrendingUp, Briefcase];

export default function CarrieresClient() {
  const t = useTranslations("carrieres");
  const positions = t.raw("positions") as Array<{
    title: string;
    type: string;
    description: string;
    requirements: string[];
  }>;
  const values = t.raw("values") as Array<{ title: string; description: string }>;
  const subject = encodeURIComponent(t("email_subject"));
  const mailto = `mailto:${COMPANY.email}?subject=${subject}`;

  return (
    <main className="bg-black text-white">
      {/* Hero with team image */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/equipe-recrutement.jpg"
            alt={t("hero_image_alt")}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-32 w-full">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E50000]/20 border border-[#E50000]/40 text-[#E50000] text-xs font-semibold tracking-wider uppercase mb-6">
              {t("badge")}
            </span>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
              {t("hero_title_line1")}
              <br />
              <span className="text-[#E50000]">{t("hero_title_line2")}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
              {t("hero_subtitle")}
            </p>
            <a
              href={mailto}
              className="inline-flex items-center gap-2 bg-[#E50000] hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
            >
              <Send className="w-5 h-5" />
              {t("hero_cta")}
            </a>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl mb-4">
              {t("why_title")} <span className="text-[#E50000]">{t("why_title_highlight")}</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t("why_subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = VALUE_ICONS[i] ?? Briefcase;
              return (
                <div
                  key={i}
                  className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-[#E50000]/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E50000]/15 border border-[#E50000]/30 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#E50000]" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl mb-4">
              {t("positions_title")}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t("positions_subtitle")}</p>
          </div>

          <div className="space-y-4">
            {positions.map((pos, i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#E50000]/40 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-white font-bold text-xl md:text-2xl mb-2">{pos.title}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium">
                      {pos.type}
                    </span>
                  </div>
                  <a
                    href={`${mailto}%20${encodeURIComponent(pos.title)}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#E50000] hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    {t("apply_button")}
                  </a>
                </div>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{pos.description}</p>
                <ul className="space-y-1.5">
                  {pos.requirements.map((req, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-[#E50000] mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Spontaneous */}
          <div className="mt-12 bg-gradient-to-br from-[#E50000]/10 to-[#E50000]/5 border border-[#E50000]/30 rounded-2xl p-8 text-center">
            <h3 className="text-white font-bold text-xl md:text-2xl mb-3">
              {t("spontaneous_title")}
            </h3>
            <p className="text-gray-300 text-sm mb-6 max-w-2xl mx-auto">{t("spontaneous_text")}</p>
            <a
              href={mailto}
              className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              <Send className="w-4 h-4" />
              {t("spontaneous_cta")}
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl mb-4">{t("contact_title")}</h2>
          <p className="text-gray-400 mb-12">{t("contact_subtitle")}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`mailto:${COMPANY.email}`}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-[#E50000]/40 transition-colors group"
            >
              <Mail className="w-6 h-6 text-[#E50000] mx-auto mb-3" />
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("contact_email_label")}</p>
              <p className="text-white text-sm font-medium group-hover:text-[#E50000] transition-colors break-all">
                {COMPANY.email}
              </p>
            </a>
            <a
              href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-[#E50000]/40 transition-colors group"
            >
              <Phone className="w-6 h-6 text-[#E50000] mx-auto mb-3" />
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("contact_phone_label")}</p>
              <p className="text-white text-sm font-medium group-hover:text-[#E50000] transition-colors">
                {COMPANY.mobile}
              </p>
            </a>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <MapPin className="w-6 h-6 text-[#E50000] mx-auto mb-3" />
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("contact_location_label")}</p>
              <p className="text-white text-sm font-medium">{COMPANY.city}</p>
            </div>
          </div>

          <div className="mt-12">
            <LinkButton
              href="/contact"
              size="lg"
              className="bg-transparent border border-white/20 text-white hover:bg-white/10"
            >
              {t("contact_more")}
            </LinkButton>
          </div>
        </div>
      </section>
    </main>
  );
}
