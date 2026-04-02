import { LinkButton } from "@/components/ui/link-button";
import { COMPANY } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div id="hero-3d-container" className="absolute inset-0" data-placeholder="3d-hero" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-1 rounded-full bg-[#002B7F]" />
          <div className="w-8 h-1 rounded-full bg-white" />
          <div className="w-8 h-1 rounded-full bg-[#CE1126]" />
        </div>
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight">
          RÉNOVATION<br /><span className="text-[#E50000]">SUR MESURE</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          {COMPANY.slogan} Spécialiste de la rénovation à {COMPANY.city} et environs depuis {COMPANY.experience} ans.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <LinkButton href="/devis" size="lg" className="bg-[#E50000] hover:bg-[#B80000] text-white text-lg px-8 py-6 rounded-md">
            Devis gratuit
          </LinkButton>
          <LinkButton href="/realisations" variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-md">
            Nos réalisations
          </LinkButton>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
