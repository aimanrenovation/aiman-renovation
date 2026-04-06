import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { COMPANY } from "@/lib/constants";
import { FAQ_ITEMS } from "@/lib/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "FAQ Rénovation — Questions Fréquentes",
  description:
    "Réponses à vos questions sur la rénovation : devis gratuit, délais, garanties, aides financières. Artisan Saint-Louis, Haut-Rhin.",
};

// Static FAQ schema - no user input, safe to inline
const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

export default function FaqPage() {
  const categories = [...new Set(FAQ_ITEMS.map((f) => f.category))];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />

      {/* Hero */}
      <section className="relative h-[40vh] flex items-end pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/ambiance-contact.jpg"
            alt="Questions fréquentes"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 w-full">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-none">
            QUESTIONS <span className="text-[#E50000]">FRÉQUENTES</span>
          </h1>
          <p className="mt-3 text-gray-300 text-lg max-w-xl">
            Tout ce que vous devez savoir avant de lancer votre projet.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 bg-black py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          {categories.map((category) => (
            <div key={category} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-[#E50000]" />
                <h2 className="font-heading text-lg text-white uppercase tracking-wider">
                  {category}
                </h2>
              </div>
              <Accordion className="space-y-3">
                {FAQ_ITEMS.filter((f) => f.category === category).map(
                  (item, i) => (
                    <AccordionItem
                      key={i}
                      value={`${category}-${i}`}
                      className="border border-white/5 rounded-xl px-6 bg-[#111111] hover:border-[#E50000]/20 transition-colors"
                    >
                      <AccordionTrigger className="text-white text-left hover:text-[#E50000]">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400 leading-relaxed">
                        {item.answer}
                        {item.relatedServices && item.relatedServices.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                            {item.relatedServices.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-[#E50000] hover:underline"
                              >
                                {link.label} →
                              </Link>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
              </Accordion>
            </div>
          ))}

          <div className="mt-16 bg-[#111111] border border-white/5 rounded-2xl p-8 text-center">
            <p className="text-gray-400 mb-4">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`}
                className="text-[#E50000] hover:underline font-semibold"
              >
                Appelez le {COMPANY.mobile}
              </a>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <Link href="/contact" className="text-[#E50000] hover:underline font-semibold">
                Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
