import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { ServicesPreview } from "@/components/sections/services-preview";
import { CtaBanner } from "@/components/sections/cta-banner";
import HeroScenes from "@/components/3d/HeroScenes";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <section id="transformation-3d" aria-label="Nos transformations en 3D">
        <HeroScenes />
      </section>
      <ServicesPreview />
      <CtaBanner />
    </>
  );
}
