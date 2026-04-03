"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    name: "Sophie M.",
    city: "Saint-Louis",
    project: "Rénovation cuisine",
    text: "Aiman et son équipe ont transformé notre cuisine des années 80 en un espace moderne et lumineux. Le résultat dépasse nos attentes.",
  },
  {
    name: "Marc D.",
    city: "Huningue",
    project: "Salle de bain + carrelage",
    text: "Douche à l'italienne, vasque suspendue, carrelage grand format — tout est impeccable. Un vrai travail d'artisan.",
  },
  {
    name: "Catherine L.",
    city: "Blotzheim",
    project: "Isolation façade ITE",
    text: "Depuis l'isolation par l'extérieur, notre facture de chauffage a baissé de 40%. Très professionnel et à l'écoute.",
  },
  {
    name: "Jean-Pierre R.",
    city: "Village-Neuf",
    project: "Borne de recharge IRVE",
    text: "Installation rapide et soignée. Aiman a géré le dossier de crédit d'impôt. Je recommande sans hésiter.",
  },
];

export function TestimonialsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.1,
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 bg-black py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl mb-4">
          ILS NOUS FONT <span className="text-[#E50000]">CONFIANCE</span>
        </h2>
        <p className="text-gray-500 mb-16">Retours de nos clients en Alsace.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="bg-[#111111] rounded-lg p-6 md:p-8 border border-white/5"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-[#E50000] text-xs">●</span>
                ))}
              </div>

              <blockquote className="text-white text-lg leading-relaxed mb-6 font-light">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#E50000]/10 flex items-center justify-center">
                  <span className="text-[#E50000] font-heading text-sm">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.project} — {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
