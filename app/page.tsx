import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { SavoirFaire } from "@/components/sections/savoir-faire";
import { ServicesPreview } from "@/components/sections/services-preview";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { CtaBanner } from "@/components/sections/cta-banner";
import { LinkButton } from "@/components/ui/link-button";

const ZONES = [
  "Saint-Louis", "Huningue", "Hésingue", "Village-Neuf",
  "Blotzheim", "Bartenheim", "Kembs", "Sierentz",
  "Leymen", "Hagenthal", "Rosenau", "Hégenheim",
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <SavoirFaire />

      {/* Bandeau visuel — rouleau de peinture style Apple */}
      <section className="relative z-10 bg-black py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3 flex justify-center">
            <Image src="/images/element-rouleau.jpg" alt="Rouleau de peinture — rénovation intérieure Saint-Louis" width={300} height={300} className="w-48 md:w-64 h-auto" />
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <p className="font-heading text-2xl md:text-3xl text-white leading-snug">
              Chaque coup de rouleau,<br />
              chaque joint posé,<br />
              chaque câble tiré —<br />
              <span className="text-[#E50000]">c&apos;est notre signature.</span>
            </p>
          </div>
        </div>
      </section>

      <ServicesPreview />

      {/* Bandeau visuel — résultat final */}
      <section className="relative z-10 h-[50vh] overflow-hidden">
        <Image
          src="/images/ambiance-resultat.jpg"
          alt="Salon rénové par Aiman Renovation — rénovation complète Haut-Rhin 68"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
        <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
          <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-white">
            LE RÉSULTAT <span className="text-[#E50000]">PARLE DE LUI-MÊME</span>
          </p>
        </div>
      </section>

      <TestimonialsCarousel />
      <WhyChooseUs />

      {/* Zone d'intervention avec photo Alsace */}
      <section className="relative z-10 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/ambiance-alsace.jpg" alt="Paysage alsacien — zone intervention rénovation Saint-Louis Haut-Rhin" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative py-20 md:py-32 max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl mb-4">
            ZONE D&apos;<span className="text-[#E50000]">INTERVENTION</span>
          </h2>
          <p className="text-gray-400 mb-12">
            Saint-Louis et sud du Haut-Rhin, à la frontière suisse et allemande.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {ZONES.map((zone) => (
              <span key={zone} className="px-5 py-2.5 rounded-full border border-white/20 text-gray-300 text-sm hover:border-[#E50000]/40 hover:text-white transition-all backdrop-blur-sm">
                {zone}
              </span>
            ))}
            <span className="px-5 py-2.5 rounded-full border border-[#E50000]/30 text-[#E50000] text-sm backdrop-blur-sm">
              et au-delà
            </span>
          </div>
          <div className="mt-12">
            <LinkButton href="/contact" size="lg" className="bg-transparent border border-white/20 text-white hover:bg-white/10 px-8 py-5 backdrop-blur-sm">
              Nos coordonnées
            </LinkButton>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
