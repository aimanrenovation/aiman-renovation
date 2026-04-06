"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LinkButton } from "@/components/ui/link-button";
import { COMPANY } from "@/lib/constants";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export function CtaBanner() {
  const t = useTranslations("sections.cta_banner");

  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none reverse" },
          }
        );
      }
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-24 md:py-40 flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #E50000 50%, #0A0A0A 100%)" }}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 ref={titleRef} className="font-heading text-3xl sm:text-4xl md:text-6xl text-white mb-6 leading-tight">
          {t("title")}
        </h2>
        <p className="text-white/60 text-lg mb-10">{t("subtitle")}</p>
        <LinkButton href="/devis" size="lg" className="bg-white text-black hover:bg-gray-200 px-12 py-6 rounded-md font-semibold">
          {t("button")}
        </LinkButton>
        <p className="mt-6 text-white/30 text-sm">
          {t("call_prefix")}{" "}
          <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="text-white/50 hover:text-white transition-colors">
            {COMPANY.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
