import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/lib/faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes sur la rénovation, devis, garanties et aides financières.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <section className="pt-32 pb-20 bg-black min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-heading text-5xl md:text-6xl mb-4"><span className="text-[#E50000]">FAQ</span></h1>
          <p className="text-gray-400 text-lg mb-12">Les réponses à vos questions les plus fréquentes.</p>
          {categories.map((category) => (
            <div key={category} className="mb-10">
              <h2 className="font-heading text-lg text-[#E50000] mb-4 uppercase tracking-wider">{category}</h2>
              <Accordion className="space-y-2">
                {FAQ_ITEMS.filter((f) => f.category === category).map((item, i) => (
                  <AccordionItem key={i} value={`${category}-${i}`} className="border border-white/10 rounded-lg px-6 bg-[#111111]">
                    <AccordionTrigger className="text-white text-left hover:text-[#E50000]">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-400">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
