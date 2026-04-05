import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { SERVICES, PHOTO_MAP, ICON_MAP } from "@/lib/services";
import { COMPANY } from "@/lib/constants";
import { LinkButton } from "@/components/ui/link-button";
import { ScrollReveal } from "@/components/sections/scroll-reveal";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const photo = PHOTO_MAP[service.slug];
  const icon = ICON_MAP[service.slug];

  return (
    <>
      {/* ─── Hero full-bleed avec photo ─── */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        {photo && (
          <>
            <Image
              src={photo}
              alt={service.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          </>
        )}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 pt-40">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-1 rounded-full bg-[#002B7F]" />
            <div className="w-6 h-1 rounded-full bg-white" />
            <div className="w-6 h-1 rounded-full bg-[#CE1126]" />
          </div>
          {icon && (
            <Image
              src={icon}
              alt=""
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 mb-6 drop-shadow-2xl"
            />
          )}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight">
            {service.title.toUpperCase()}
          </h1>
          <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
            {service.description}
          </p>
          <div className="mt-8">
            <LinkButton
              href="/devis"
              size="lg"
              className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4"
            >
              Demander un devis gratuit
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ─── Description longue ─── */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#0A0A0A] py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4">
                <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                <h2 className="font-heading text-2xl md:text-3xl leading-tight">
                  EN <span className="text-[#E50000]">DÉTAIL</span>
                </h2>
              </div>
              <div className="md:col-span-8 space-y-5 text-gray-400 text-lg leading-relaxed">
                {service.longDescription.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ─── Bandeau photo plein écran ─── */}
      {photo && (
        <section className="relative z-10 h-[40vh] md:h-[50vh] overflow-hidden">
          <Image
            src={photo}
            alt={service.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
          <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
            <p className="font-heading text-2xl md:text-4xl text-white">
              LA QUALITÉ <span className="text-[#E50000]">SANS COMPROMIS</span>
            </p>
          </div>
        </section>
      )}

      {/* ─── Ce que nous réalisons ─── */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 bg-black py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
            <h2 className="font-heading text-2xl md:text-3xl mb-12">
              CE QUE NOUS{" "}
              <span className="text-[#E50000]">RÉALISONS</span>
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-4 bg-[#111111] rounded-xl p-5 border border-white/5 hover:border-[#E50000]/20 transition-colors"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[#E50000]/10 flex items-center justify-center">
                    <span className="text-[#E50000] text-lg">→</span>
                  </div>
                  <span className="text-gray-300 text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ScrollReveal>

      {/* ─── Processus étape par étape ─── */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#0A0A0A] py-24 md:py-32 overflow-hidden">
          {/* Photo en fond subtile */}
          {photo && (
            <>
              <Image
                src={photo}
                alt=""
                fill
                className="object-cover opacity-[0.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
            </>
          )}
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
            <h2 className="font-heading text-2xl md:text-3xl mb-12">
              NOTRE <span className="text-[#E50000]">PROCESSUS</span>
            </h2>
            <div className="space-y-6">
              {service.process.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-6 bg-black/60 backdrop-blur-sm border border-white/5 rounded-xl p-6 md:p-8 hover:border-[#E50000]/20 transition-colors"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-[#E50000] flex items-center justify-center">
                    <span className="font-heading text-white text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg md:text-xl text-white mb-2">
                      {step.step}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ─── Pourquoi un pro + Budget côte à côte ─── */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 bg-black py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pourquoi un pro */}
              <div className="bg-[#111111] border border-white/5 rounded-xl p-8 md:p-10">
                <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                <h2 className="font-heading text-xl md:text-2xl mb-6">
                  POURQUOI UN{" "}
                  <span className="text-[#E50000]">PRO</span>
                </h2>
                <p className="text-gray-400 leading-relaxed">{service.whyPro}</p>
              </div>

              {/* Budget indicatif */}
              <div className="bg-[#111111] border border-[#E50000]/20 rounded-xl p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-0.5 bg-[#E50000] mb-6" />
                  <h2 className="font-heading text-xl md:text-2xl mb-6">
                    BUDGET <span className="text-[#E50000]">INDICATIF</span>
                  </h2>
                  <p className="text-2xl md:text-3xl font-heading text-white mb-4">
                    {service.priceRange}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Prix indicatifs TTC pour la région de Saint-Louis et le Haut-Rhin.
                    Chaque projet est unique — le devis détaillé après visite technique
                    est le seul document engageant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ─── CTA final plein écran ─── */}
      <section className="relative z-10 overflow-hidden">
        {photo && (
          <>
            <Image
              src={photo}
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
          </>
        )}
        <div className="relative z-10 py-24 md:py-32 max-w-5xl mx-auto px-6">
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl md:text-5xl mb-6 leading-tight">
              INTÉRESSÉ PAR<br />
              CE <span className="text-[#E50000]">SERVICE</span> ?
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Décrivez votre projet et recevez un devis gratuit sous 4 jours.
              Sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <LinkButton
                href="/devis"
                size="lg"
                className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4"
              >
                Demander un devis
              </LinkButton>
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-4"
              >
                <span className="text-lg">📞</span>
                {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
