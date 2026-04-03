"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMPANY } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: COMPANY.projects, prefix: "+", suffix: "", label: "projets réalisés" },
  { value: COMPANY.experience, prefix: "", suffix: " ans", label: "d'expérience" },
  { value: 68, prefix: "", suffix: "", label: `${COMPANY.city} et environs` },
];

export function TrustBarAnimated() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const counters = section.querySelectorAll("[data-count]");
      counters.forEach((el) => {
        const target = parseInt(el.getAttribute("data-count") || "0");
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "";
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reset",
          },
          onUpdate: () => {
            (el as HTMLElement).textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 bg-black py-32 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-20 md:gap-32">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div
              className="font-heading text-7xl md:text-8xl lg:text-9xl text-[#E50000]"
              data-count={stat.value}
              data-prefix={stat.prefix}
              data-suffix={stat.suffix}
            >
              {stat.prefix}0{stat.suffix}
            </div>
            <div className="text-gray-500 text-sm md:text-base mt-4 uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
