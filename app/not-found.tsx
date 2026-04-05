import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Page non trouvée",
  description:
    "La page demandée n'existe pas. Retournez à l'accueil d'Aiman Renovation.",
};

export default function NotFound() {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-xl mx-auto">
        <p className="text-[#E50000] text-sm font-medium tracking-widest uppercase mb-6">
          404
        </p>
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          Page non trouvée
        </h1>
        <p className="text-white/50 text-lg mb-10">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-3">
          <LinkButton
            href="/"
            className="bg-[#E50000] text-white hover:bg-[#E50000]/80 px-5 h-10"
          >
            Accueil
          </LinkButton>
          <LinkButton
            href="/services"
            variant="outline"
            className="text-white px-5 h-10"
          >
            Nos services
          </LinkButton>
          <LinkButton
            href="/contact"
            variant="outline"
            className="text-white px-5 h-10"
          >
            Contact
          </LinkButton>
          <LinkButton
            href="/devis"
            variant="outline"
            className="text-white px-5 h-10"
          >
            Devis gratuit
          </LinkButton>
        </nav>
      </div>
    </section>
  );
}
