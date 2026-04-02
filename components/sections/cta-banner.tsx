import { LinkButton } from "@/components/ui/link-button";
import { COMPANY } from "@/lib/constants";

export function CtaBanner() {
  return (
    <section className="bg-[#E50000] py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-heading text-3xl md:text-5xl text-white">UN PROJET EN TÊTE ?</h2>
        <p className="mt-4 text-white/80 text-lg">Décrivez-nous votre projet et recevez un devis gratuit sous 48h.</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <LinkButton href="/devis" size="lg" className="bg-black hover:bg-gray-900 text-white text-lg px-8 py-6">
            Demander un devis gratuit
          </LinkButton>
          <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="text-white/90 hover:text-white text-lg font-semibold">
            ou appelez le {COMPANY.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
