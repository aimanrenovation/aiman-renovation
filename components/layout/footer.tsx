import Link from "next/link";
import Image from "next/image";
import { COMPANY, NAV_LINKS } from "@/lib/constants";
import { SERVICES } from "@/lib/services";

export function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Image src="/logo/logo-white.png" alt="Aiman Renovation" width={120} height={35} />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">{COMPANY.slogan}</p>
            <div className="flex gap-1 mt-4">
              <div className="w-8 h-1 rounded-full bg-[#002B7F]" />
              <div className="w-8 h-1 rounded-full bg-white" />
              <div className="w-8 h-1 rounded-full bg-[#CE1126]" />
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">{s.shortTitle}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
              <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{COMPANY.mobile}</a></li>
              <li><a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">{COMPANY.email}</a></li>
              <li>{COMPANY.city} et environs</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
