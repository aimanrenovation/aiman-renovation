import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import { COMPANY } from "@/lib/constants";
import { LinkButton } from "@/components/ui/link-button";
import ServiceScene from "@/components/3d/ServiceScene";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: service.title, description: service.description };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <ServiceScene slug={service.slug} />
      <section className="pt-32 pb-20 bg-black min-h-[60vh] relative">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-1 rounded-full bg-[#002B7F]" />
            <div className="w-6 h-1 rounded-full bg-white" />
            <div className="w-6 h-1 rounded-full bg-[#CE1126]" />
          </div>
          <div className="text-6xl mb-4">{service.icon}</div>
          <h1 className="font-heading text-4xl md:text-6xl">{service.title.toUpperCase()}</h1>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl">{service.description}</p>
        </div>
      </section>
      <section className="bg-[#111111] py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-heading text-2xl mb-8">CE QUE NOUS <span className="text-[#E50000]">RÉALISONS</span></h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 bg-black/50 rounded-lg p-4 border border-white/5">
                <span className="text-[#E50000] text-lg">→</span>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl mb-4">INTÉRESSÉ PAR CE SERVICE ?</h2>
          <p className="text-gray-400 mb-8">Décrivez votre projet et recevez un devis gratuit sous 48h.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkButton href="/devis" size="lg" className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-6">
              Demander un devis
            </LinkButton>
            <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="text-gray-400 hover:text-white">{COMPANY.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
