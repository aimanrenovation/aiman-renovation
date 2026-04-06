"use client";

import { useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES, PHOTO_MAP } from "@/lib/services";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

interface TranslatedService {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
}

export function ServicesPageContent() {
  const t = useTranslations("services");
  const tc = useTranslations("common");
  const tRoot = useTranslations();
  const serviceItems = tRoot.raw("service_items") as TranslatedService[];
  const serviceMap = new Map(serviceItems.map((s) => [s.slug, s]));

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Titre reveal */
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power4.inOut",
            scrollTrigger: { trigger: titleRef.current, start: "top 85%", end: "top 55%", scrub: 1 } }
        );
      }

      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { trigger: subtitleRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
        );
      }

      /* Cards — stagger reveal */
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const img = card.querySelector("[data-img]");
        const overlay = card.querySelector("[data-overlay]");
        const text = card.querySelector("[data-text]");

        if (img) {
          gsap.fromTo(img,
            { scale: 1.15 },
            { scale: 1, duration: 1.5, ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" } }
          );
        }
        if (overlay) {
          gsap.fromTo(overlay,
            { opacity: 0 },
            { opacity: 1, duration: 0.8,
              scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" } }
          );
        }
        if (text) {
          gsap.fromTo(text,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.2,
              scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" } }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="h-[60vh] flex items-end pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/ambiance-resultat.jpg"
            alt="Nos services de renovation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 w-full">
          <h1
            ref={titleRef}
            className="font-heading text-4xl sm:text-5xl md:text-7xl leading-none"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            {t("hero_title")} <span className="text-[#E50000]">{t("hero_title_highlight")}</span>
          </h1>
          <p ref={subtitleRef} className="mt-4 text-gray-300 text-lg md:text-xl max-w-xl" style={{ opacity: 0 }}>
            {t("hero_subtitle")}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SERVICES.map((service, i) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`group relative block overflow-hidden rounded-2xl ${
                i === 0 || i === 5 ? "md:col-span-2 h-[50vh]" : "h-[40vh]"
              }`}
            >
              {/* Photo */}
              <div data-img className="absolute inset-0">
                <Image
                  src={PHOTO_MAP[service.slug] || ""}
                  alt={serviceMap.get(service.slug)?.title ?? service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Overlay */}
              <div
                data-overlay
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                style={{ opacity: 0 }}
              />

              {/* Texte */}
              <div
                data-text
                className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10"
                style={{ opacity: 0 }}
              >
                <div className="w-10 h-0.5 bg-[#E50000] mb-4" />
                <h2 className="font-heading text-2xl md:text-3xl text-white group-hover:text-[#E50000] transition-colors leading-tight">
                  {(serviceMap.get(service.slug)?.title ?? service.title).toUpperCase()}
                </h2>
                <p className="mt-2 text-gray-300 text-sm md:text-base leading-relaxed max-w-lg line-clamp-2">
                  {serviceMap.get(service.slug)?.description ?? service.description}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[#E50000] text-sm font-medium uppercase tracking-wider">{tc("discover")}</span>
                  <span className="text-[#E50000] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
