"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES, PHOTO_MAP } from "@/lib/services";

gsap.registerPlugin(ScrollTrigger);

const HERO_SERVICES = ["cuisine", "facade-isolation", "paysager"];

export function ServicesPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const heroBlocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Titre — même reveal clipPath que "Notre savoir-faire"
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power4.inOut",
            scrollTrigger: { trigger: titleRef.current, start: "top 80%", end: "top 50%", scrub: 1 } }
        );
      }

      heroBlocksRef.current.forEach((block) => {
        if (!block) return;
        const title = block.querySelector("[data-title]");
        const desc = block.querySelector("[data-desc]");
        const line = block.querySelector("[data-line]");
        const img = block.querySelector("[data-img]");

        if (title) gsap.fromTo(title, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: block, start: "top 75%", toggleActions: "play none none reverse" } });
        if (line) gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut", scrollTrigger: { trigger: block, start: "top 70%", toggleActions: "play none none reverse" } });
        if (desc) gsap.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out", scrollTrigger: { trigger: block, start: "top 70%", toggleActions: "play none none reverse" } });
        if (img) gsap.fromTo(img, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: block, start: "top 75%", toggleActions: "play none none reverse" } });
      });

      if (gridRef.current) {
        gsap.fromTo(gridRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 80%", toggleActions: "play none none reverse" } }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const heroServices = SERVICES.filter((s) => HERO_SERVICES.includes(s.slug));
  const otherServices = SERVICES.filter((s) => !HERO_SERVICES.includes(s.slug));

  return (
    <section ref={sectionRef} className="relative z-10 bg-black">
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 ref={titleRef} className="font-heading text-3xl md:text-5xl" style={{ clipPath: "inset(0 100% 0 0)" }}>NOS <span className="text-[#E50000]">SERVICES</span></h2>
        </div>
      </div>

      {/* 3 services phares avec photos */}
      {heroServices.map((service, i) => (
        <Link key={service.slug} href={`/services/${service.slug}`} className="block">
          <div
            ref={(el) => { heroBlocksRef.current[i] = el; }}
            className="relative border-t border-white/5 hover:bg-white/[0.02] transition-colors duration-500 overflow-hidden"
          >
            {/* Photo du service en fond */}
            <div data-img className="absolute right-0 top-0 bottom-0 w-1/2 opacity-0 hidden md:block">
              <Image
                src={PHOTO_MAP[service.slug] || ""}
                alt={service.title}
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center py-16 md:py-24 relative">
              <div>
                <div data-line className="w-12 h-0.5 bg-[#E50000] mb-6 origin-left" style={{ transform: "scaleX(0)" }} />
                <h3 data-title className="font-heading text-3xl md:text-4xl text-white leading-tight">{service.title.toUpperCase()}</h3>
              </div>
              <div data-desc>
                <p className="text-gray-400 text-lg leading-relaxed mb-4">{service.description}</p>
                <span className="text-[#E50000] text-sm font-medium uppercase tracking-wider">Découvrir →</span>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* Autres services avec photos miniatures */}
      <div className="border-t border-white/5 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="font-heading text-xl text-gray-500 mb-12 uppercase tracking-wider">Tous nos services</h3>
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {otherServices.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}
                className="group border-t border-white/5 py-6 flex items-center gap-5 pr-4"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                  <Image
                    src={PHOTO_MAP[service.slug] || ""}
                    alt={service.shortTitle}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white text-base group-hover:text-[#E50000] transition-colors flex-1">{service.title}</span>
                <span className="text-gray-600 group-hover:text-[#E50000] transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
