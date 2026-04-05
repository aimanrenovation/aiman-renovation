import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_ITEMS } from "@/lib/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ScrollReveal } from "@/components/sections/scroll-reveal";

export const metadata: Metadata = {
  title: "FAQ Rénovation — Questions Fréquentes",
  description:
    "Réponses à vos questions sur la rénovation : devis gratuit, délais, garanties, aides financières (MaPrimeRénov', CEE, éco-PTZ). Artisan Saint-Louis 68.",
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
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />
      <section className="relative z-10 pt-32 pb-20 bg-black min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-heading text-5xl md:text-6xl mb-4">
            <span className="text-[#E50000]">FAQ</span>
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Les réponses à vos questions les plus fréquentes sur nos services de
            rénovation à Saint-Louis et dans le Haut-Rhin.
          </p>
          <p className="text-gray-500 text-sm mb-12">
            Vous ne trouvez pas la réponse à votre question ? Appelez-nous au{" "}
            <a
              href="tel:0356894403"
              className="text-[#E50000] hover:underline"
            >
              03 56 89 44 03
            </a>{" "}
            ou{" "}
            <a href="/contact" className="text-[#E50000] hover:underline">
              contactez-nous
            </a>
            .
          </p>

          {categories.map((category, catIndex) => (
            <ScrollReveal
              key={category}
              direction="up"
              delay={0.05 * catIndex}
            >
              <div className="mb-10">
                <h2 className="font-heading text-lg text-[#E50000] mb-4 uppercase tracking-wider">
                  {category}
                </h2>
                <Accordion className="space-y-2">
                  {FAQ_ITEMS.filter((f) => f.category === category).map(
                    (item, i) => (
                      <AccordionItem
                        key={i}
                        value={`${category}-${i}`}
                        className="border border-white/10 rounded-lg px-6 bg-[#111111]"
                      >
                        <AccordionTrigger className="text-white text-left hover:text-[#E50000]">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400">
                          {item.answer}
                          {item.relatedServices && item.relatedServices.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
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
            </ScrollReveal>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
