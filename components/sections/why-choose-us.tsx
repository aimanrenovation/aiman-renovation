"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ARGUMENTS = [
  { title: "Garantie décennale", desc: "Tous nos travaux couverts par une assurance décennale et RC professionnelle.", img: "/images/element-casque.jpg" },
  { title: "Devis gratuit sous 48h", desc: "Visite technique incluse, devis détaillé et transparent. Sans engagement.", img: "/images/element-niveau.jpg" },
  { title: "Artisan local", desc: "Basés à Saint-Louis, nous connaissons le terrain et les fournisseurs locaux.", img: "/images/ambiance-alsace.jpg" },
  { title: "19 ans d'expérience", desc: "Un savoir-faire éprouvé sur tous les corps de métier de la rénovation.", img: "/images/element-marteau.jpg" },
  { title: "Accompagnement aides", desc: "MaPrimeRénov', CEE, éco-PTZ — nous montons vos dossiers.", img: "/images/element-cle.jpg" },
  { title: "Chantier propre", desc: "Protection, évacuation, nettoyage. Vous récupérez un logement prêt à vivre.", img: "/images/ambiance-resultat.jpg" },
];

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
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
        <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl mb-10 md:mb-16">
          POURQUOI NOUS <span className="text-[#E50000]">CHOISIR</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARGUMENTS.map((arg, i) => (
            <div
              key={arg.title}
              ref={(el) => { rowsRef.current[i] = el; }}
              className="relative bg-[#111111] rounded-xl overflow-hidden group hover:ring-1 hover:ring-[#E50000]/20 transition-all"
            >
              {/* Image de fond subtile */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <Image src={arg.img} alt="" fill className="object-cover" />
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
