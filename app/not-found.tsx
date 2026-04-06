import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Page non trouvée — Aiman Renovation",
  description:
    "La page demandée n'existe pas. Retournez à l'accueil d'Aiman Renovation.",
};

export default function NotFound() {
  return (
    <section className="min-h-[calc(100vh-64px)] bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E50000]/5 rounded-full blur-[150px]" />

      <div className="text-center max-w-lg mx-auto relative z-10">
        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="font-heading text-[140px] md:text-[200px] leading-none text-white/[0.03] select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-[#E50000]/10 border border-[#E50000]/20 flex items-center justify-center mx-auto">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#E50000]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <p className="text-[#E50000] text-xs font-semibold tracking-[0.3em] uppercase">
                Erreur 404
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="font-heading text-3xl md:text-4xl text-white mb-3">
          Cette page n&apos;existe pas
        </h1>
        <p className="text-white/40 text-base mb-10 max-w-sm mx-auto">
          Pas de panique — même les meilleurs plans ont parfois un mur au mauvais endroit.
        </p>

        {/* CTA principal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <LinkButton
            href="/"
            className="bg-[#E50000] text-white hover:bg-[#B80000] px-8 h-12 text-base font-semibold rounded-xl w-full sm:w-auto"
          >
            Retour à l&apos;accueil
          </LinkButton>
          <LinkButton
            href="/devis"
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10 px-8 h-12 text-base rounded-xl w-full sm:w-auto"
          >
            Demander un devis
          </LinkButton>
        </div>

        {/* Liens rapides */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            { href: "/services", label: "Nos services" },
            { href: "/realisations", label: "Réalisations" },
            { href: "/contact", label: "Contact" },
            { href: "/a-propos", label: "À propos" },
          ].map((link) => (
            <LinkButton
              key={link.href}
              href={link.href}
              variant="ghost"
              className="text-white/30 hover:text-white text-sm"
            >
              {link.label}
            </LinkButton>
          ))}
        </div>

        {/* Separator + Contact */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-white/20 text-xs mb-3">Besoin d&apos;aide ?</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <LinkButton
              href="tel:0633496925"
              external
              variant="ghost"
              className="text-white/40 hover:text-[#E50000]"
            >
              06 33 49 69 25
            </LinkButton>
            <span className="text-white/10">|</span>
            <LinkButton
              href="mailto:contact@aiman-renovation.fr"
              external
              variant="ghost"
              className="text-white/40 hover:text-[#E50000]"
            >
              contact@aiman-renovation.fr
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
