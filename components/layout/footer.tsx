"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { COMPANY } from "@/lib/constants";

interface TranslatedService {
  slug: string;
  shortTitle: string;
}

export function Footer() {
  const t = useTranslations();
  const tFooter = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tServices = useTranslations();
  const serviceItems = tServices.raw("service_items") as TranslatedService[];

  return (
    <footer className="bg-[#111111] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Image src="/logo/logo-white.png" alt="Aiman Renovation" width={120} height={35} />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">{tCommon("slogan")}</p>
            <div className="flex gap-1 mt-4">
              <div className="w-8 h-1 rounded-full bg-[#002B7F]" />
              <div className="w-8 h-1 rounded-full bg-white" />
              <div className="w-8 h-1 rounded-full bg-[#CE1126]" />
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-4">{tFooter("services_title")}</h4>
            <ul className="space-y-2">
              {serviceItems.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">{s.shortTitle}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-4">{tFooter("navigation_title")}</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav("home")}</Link></li>
              <li><Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav("services")}</Link></li>
              <li><Link href="/realisations" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav("realisations")}</Link></li>
              <li><Link href="/a-propos" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav("about")}</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav("contact")}</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav("faq")}</Link></li>
              <li><Link href="/carrieres" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav("carrieres")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-4">{tFooter("contact_title")}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{COMPANY.mobile}</a></li>
              <li><a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">{COMPANY.email}</a></li>
              <li>{tCommon("city_and_surroundings")}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">{tCommon("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">{tFooter("legal_links.mentions")}</Link>
            <Link href="/cgv" className="hover:text-white transition-colors">{tFooter("legal_links.cgv")}</Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">{tFooter("legal_links.privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
