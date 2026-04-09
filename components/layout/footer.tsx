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
              <li><Link href="/partenaires" className="text-sm text-gray-400 hover:text-white transition-colors">{tNav("partenaires")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-4">{tFooter("contact_title")}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{COMPANY.mobile}</a></li>
              <li><a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">{COMPANY.email}</a></li>
              <li>{tCommon("city_and_surroundings")}</li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a
                href={COMPANY.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E50000]/15 hover:border-[#E50000]/40 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href={COMPANY.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E50000]/15 hover:border-[#E50000]/40 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.645.07-4.849.07-3.205 0-3.584-.012-4.849-.07-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.747 2.163 15.368 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.783 2.295 7.149 2.233 8.416 2.175 8.796 2.163 12 2.163zm0 1.838c-3.142 0-3.504.012-4.74.068-1.16.054-1.79.247-2.21.41a3.69 3.69 0 0 0-1.34.872 3.69 3.69 0 0 0-.872 1.34c-.163.42-.356 1.05-.41 2.21-.056 1.236-.068 1.598-.068 4.74 0 3.142.012 3.504.068 4.74.054 1.16.247 1.79.41 2.21a3.69 3.69 0 0 0 .872 1.34c.42.42.853.69 1.34.872.42.163 1.05.356 2.21.41 1.236.056 1.598.068 4.74.068 3.142 0 3.504-.012 4.74-.068 1.16-.054 1.79-.247 2.21-.41a3.69 3.69 0 0 0 1.34-.872 3.69 3.69 0 0 0 .872-1.34c.163-.42.356-1.05.41-2.21.056-1.236.068-1.598.068-4.74 0-3.142-.012-3.504-.068-4.74-.054-1.16-.247-1.79-.41-2.21a3.69 3.69 0 0 0-.872-1.34 3.69 3.69 0 0 0-1.34-.872c-.42-.163-1.05-.356-2.21-.41-1.236-.056-1.598-.068-4.74-.068zm0 3.13a4.87 4.87 0 1 1 0 9.737 4.87 4.87 0 0 1 0-9.737zm0 8.03a3.16 3.16 0 1 0 0-6.32 3.16 3.16 0 0 0 0 6.32zm6.18-8.21a1.14 1.14 0 1 1-2.28 0 1.14 1.14 0 0 1 2.28 0z" />
                </svg>
              </a>
              <a
                href={COMPANY.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E50000]/15 hover:border-[#E50000]/40 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={COMPANY.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E50000]/15 hover:border-[#E50000]/40 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.94a8.16 8.16 0 0 0 4.77 1.52V7.07a4.85 4.85 0 0 1-1.84-.38z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">{tCommon("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">{tFooter("legal_links.mentions")}</Link>
            <Link href="/cgv" className="hover:text-white transition-colors">{tFooter("legal_links.cgv")}</Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">{tFooter("legal_links.privacy")}</Link>
            <a href="/espace-employes/login" className="hover:text-white transition-colors">Espace équipe</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
