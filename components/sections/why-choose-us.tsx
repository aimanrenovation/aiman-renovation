"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const ARG_IMAGES = [
  "/images/element-casque.jpg",
  "/images/element-niveau.jpg",
  "/images/ambiance-alsace.jpg",
  "/images/element-marteau.jpg",
  "/images/element-cle.jpg",
  "/images/ambiance-resultat.jpg",
];

export function WhyChooseUs() {
  const t = useTranslations("sections.why_choose_us");
  const args = t.raw("arguments") as { title: string; desc: string }[];

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      rowsRef.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(row,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none reverse" } }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 bg-[#0A0A0A] py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <h2 ref={titleRef} className="font-heading text-2xl sm:text-3xl md:text-5xl mb-10 md:mb-16" style={{ clipPath: "inset(0 100% 0 0)" }}>
          {t("title")} <span className="text-[#E50000]">{t("title_highlight")}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {args.map((arg: { title: string; desc: string }, i: number) => (
            <div
              key={arg.title}
              ref={(el) => { rowsRef.current[i] = el; }}
              className="relative bg-[#111111] rounded-xl overflow-hidden group hover:ring-1 hover:ring-[#E50000]/20 transition-all"
            >
              {/* Image de fond subtile */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <Image src={ARG_IMAGES[i] || ARG_IMAGES[0]} alt="" fill className="object-cover" />
              </div>
              <div className="relative p-8">
                <h3 className="text-white font-heading text-lg mb-2">{arg.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{arg.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
