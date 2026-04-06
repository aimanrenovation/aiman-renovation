import type { Metadata } from "next";
import Image from "next/image";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Page non trouvée — Aiman Renovation",
  description:
    "La page demandée n'existe pas. Retournez à l'accueil d'Aiman Renovation.",
};

const VARIANTS = [
  {
    image: "/images/element-marteau.jpg",
    title: "Oups, mur porteur !",
    subtitle: "Même les meilleurs plans ont parfois un mur au mauvais endroit.",
  },
  {
    image: "/images/element-casque.jpg",
    title: "Zone en travaux",
    subtitle: "Cette page est en cours de démolition... ou n'a jamais existé.",
  },
  {
    image: "/images/element-niveau.jpg",
    title: "Hors niveau !",
    subtitle: "On a vérifié au laser — cette page n'est pas d'aplomb.",
  },
  {
    image: "/images/element-cle.jpg",
    title: "Porte sans serrure",
    subtitle: "La clé existe peut-être, mais la porte n'est pas là.",
  },
  {
    image: "/images/element-truelle.jpg",
    title: "Fondations introuvables",
    subtitle: "Impossible de construire cette page — les fondations manquent.",
  },
  {
    image: "/images/element-rouleau.jpg",
    title: "Coup de peinture raté",
    subtitle: "On a repeint l'URL mais la page a disparu sous la couche.",
  },
  {
    image: "/images/element-carrelage.jpg",
    title: "Carreau manquant",
    subtitle: "Il manque un carreau dans le plan — cette page n'existe pas.",
  },
  {
    image: "/images/ambiance-chantier.jpg",
    title: "Chantier fermé",
    subtitle: "Ce chantier est terminé... ou n'a jamais commencé.",
  },
];

export default function NotFound() {
  const variant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];

  return (
    <section className="min-h-[calc(100vh-64px)] bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={variant.image}
          alt=""
          fill
          className="object-cover opacity-15"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      </div>

      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E50000]/8 rounded-full blur-[120px]" />

      <div className="text-center max-w-lg mx-auto relative z-10">
        {/* 404 badge */}
        <div className="inline-flex items-center gap-2 bg-[#E50000]/10 border border-[#E50000]/20 rounded-full px-4 py-1.5 mb-8">
          <div className="w-2 h-2 rounded-full bg-[#E50000] animate-pulse" />
          <span className="text-[#E50000] text-xs font-semibold tracking-widest uppercase">
            Erreur 404
          </span>
        </div>

        {/* Image card */}
        <div className="relative w-48 h-48 mx-auto mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
          <Image
            src={variant.image}
            alt=""
            fill
            className="object-cover"
            sizes="192px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <span className="font-heading text-5xl text-white/90 drop-shadow-lg">404</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="font-heading text-3xl md:text-4xl text-white mb-3">
          {variant.title}
        </h1>
        <p className="text-white/40 text-base mb-10 max-w-sm mx-auto">
          {variant.subtitle}
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

        {/* Contact */}
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
