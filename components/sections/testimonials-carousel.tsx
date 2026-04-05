"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    name: "michel schlachter",
    text: "Nous sommes extrêmement satisfaits de la rénovation de nos deux pièces. Le travail de ponçage, d'enduits et de peinture a été réalisé avec un grand professionnalisme et beaucoup de soin. Chantier propre, délais respectés et très bons conseils tout au long du projet. Un travail de grande qualité que nous recommandons sans hésiter !",
    rating: 5,
  },
  {
    name: "Nadia MEZIANI",
    text: "J'ai fait appel à Aiman Rénovation pour des travaux chez ma mère, installation d'une douche et d'un lavabo PMR, pose d'une nouvelle porte et réfection du plafond de la cuisine, suite à un dégât des eaux.",
    rating: 5,
  },
  {
    name: "F R",
    text: "Highly recommended! Excellent communication in English, very precise and conscientious work at a fair price. Also very flexible when it comes to working hours. Top craftsman!",
    rating: 5,
  },
  {
    name: "yves lesueur",
    text: "Rénovation d'un appartement réalisé avec soin, sérieux et professionnalisme. Je recommande vivement cette entreprise. Contact et échanges rapides.",
    rating: 5,
  },
  {
    name: "Youssef Yo",
    text: "Très professionnel, il veille à ce que tout soit nickel et bien organisé. Excellent service.",
    rating: 5,
  },
  {
    name: "Sarah Runser",
    text: "Travail impeccable changement de VMC et technicien très aimable a recommander.",
    rating: 5,
  },
  {
    name: "Yann Dos santos",
    text: "Ravi des services ! Je recommande sans réserves !",
    rating: 5,
  },
  {
    name: "Jc ALL (Tuc)",
    text: "Réparation d'une fuite sur sous un radiateur, très bon travail.",
    rating: 5,
  },
];

const GOOGLE_REVIEW_URL = "https://www.google.com/maps/place/Aiman+Renovation";

export function TestimonialsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
        <h2 ref={titleRef} className="font-heading text-3xl md:text-4xl mb-4" style={{ clipPath: "inset(0 100% 0 0)" }}>
          ILS NOUS FONT <span className="text-[#E50000]">CONFIANCE</span>
        </h2>
        <div className="flex items-center gap-3 mb-16">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-white font-heading text-lg">5.0</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              ))}
            </div>
          </div>
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="text-gray-500 text-sm hover:text-white transition-colors">
            Avis Google vérifiés
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="bg-[#111111] rounded-lg p-6 md:p-8 border border-white/5"
            >
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>

              <blockquote className="text-white text-lg leading-relaxed mb-6 font-light">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#E50000]/10 flex items-center justify-center">
                  <span className="text-[#E50000] font-heading text-sm">{t.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-gray-500 text-xs">Avis Google</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
            Voir tous les avis sur Google →
          </a>
        </div>
      </div>
    </section>
  );
}
