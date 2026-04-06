"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMPANY } from "@/lib/constants";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export function SavoirFaire() {
  const t = useTranslations("home.savoir_faire");

  const lines = t.raw("lines") as string[];
  const STATS = [
    { value: COMPANY.projects, prefix: "+", suffix: "", label: t("stats.projects") },
    { value: COMPANY.experience, prefix: "", suffix: " ans", label: t("stats.experience") },
    { value: 10, prefix: "", suffix: "", label: t("stats.services") },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linesRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power4.inOut",
            scrollTrigger: { trigger: titleRef.current, start: "top 80%", end: "top 50%", scrub: 1 } }
        );
      }

      linesRef.current.forEach((line) => {
        if (!line) return;
        gsap.fromTo(line, { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { trigger: line, start: "top 85%", end: "top 70%", scrub: 0.5 } }
        );
      });

      if (imgRef.current) {
        gsap.fromTo(imgRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 1.2,
            scrollTrigger: { trigger: imgRef.current, start: "top 80%", toggleActions: "play none none reverse" } }
        );
      }

      const counters = section.querySelectorAll("[data-counter]");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-counter") || "0");
        const prefix = counter.getAttribute("data-prefix") || "";
        const suffix = counter.getAttribute("data-suffix") || "";
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2, ease: "power2.out",
          scrollTrigger: { trigger: counter, start: "top 85%", toggleActions: "play none none reset" },
          onUpdate: () => { (counter as HTMLElement).textContent = `${prefix}${Math.round(obj.val)}${suffix}`; },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 bg-black py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Texte */}
          <div>
            <h2 ref={titleRef} className="font-heading text-3xl md:text-5xl leading-tight mb-10" style={{ clipPath: "inset(0 100% 0 0)" }}>
              {t("title")} <span className="text-[#E50000]">{t("title_highlight")}</span>
            </h2>
            <div className="space-y-5 mb-12">
              {lines.map((line: string, i: number) => (
                <p key={i} ref={(el) => { linesRef.current[i] = el; }} className="text-lg text-gray-400 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap gap-8 md:gap-12">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#E50000]"
                    data-counter={stat.value} data-prefix={stat.prefix} data-suffix={stat.suffix}
                  >{stat.prefix}0{stat.suffix}</div>
                  <div className="text-gray-500 text-xs mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image casque rouge sur fond noir — style Apple */}
          <div ref={imgRef} className="flex justify-center order-first md:order-last">
            <Image
              src="/images/element-casque.jpg"
              alt="Casque de chantier Aiman Renovation"
              width={500}
              height={500}
              className="w-48 sm:w-64 md:w-full md:max-w-md h-auto rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
