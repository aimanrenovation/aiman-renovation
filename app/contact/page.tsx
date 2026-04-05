import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";
import { LinkButton } from "@/components/ui/link-button";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez ${COMPANY.name} à ${COMPANY.city}. Devis gratuit sous 4 jours, sans engagement. Appelez-nous ou remplissez le formulaire.`,
};

export default function ContactPage() {
  return (
    <>
      {/* En-tête avec accroche */}
      <section className="relative z-10 pt-32 pb-10 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl mb-6">
            <span className="text-[#E50000]">PARLONS</span> DE VOTRE PROJET
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Vous avez un projet de rénovation ? Nous sommes là pour en discuter.
            Appelez-nous, écrivez-nous ou passez nous voir — le premier échange
            est toujours sans engagement.
          </p>
        </div>
      </section>

      {/* Bandeau rassurant */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#111111] py-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                {
                  icon: "✅",
                  text: "Devis 100% gratuit",
                },
                {
                  icon: "⏱️",
                  text: "Réponse sous 4 jours",
                },
                {
                  icon: "🤝",
                  text: "Sans aucun engagement",
                },
              ].map((item) => (
                <div key={item.text} className="flex items-center justify-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Contenu principal */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 pb-20 pt-16 bg-black">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Colonne gauche : formulaire de contact */}
              <div className="bg-[#111111] border border-white/5 rounded-lg p-6 md:p-8">
                <ContactForm />
              </div>

              {/* Colonne droite : infos + horaires */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-xl text-white mb-4">
                    COORDONNÉES
                  </h2>
                  <ul className="space-y-4 text-gray-400">
                    <li className="flex items-start gap-3">
                      <span className="text-[#E50000] text-xl">📞</span>
                      <div>
                        <a
                          href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                          className="text-white hover:text-[#E50000] transition-colors text-lg font-semibold"
                        >
                          {COMPANY.phone}
                        </a>
                        <p className="text-sm">Fixe</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E50000] text-xl">📱</span>
                      <div>
                        <a
                          href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`}
                          className="text-white hover:text-[#E50000] transition-colors text-lg font-semibold"
                        >
                          {COMPANY.mobile}
                        </a>
                        <p className="text-sm">Mobile</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E50000] text-xl">✉️</span>
                      <a
                        href={`mailto:${COMPANY.email}`}
                        className="text-white hover:text-[#E50000] transition-colors"
                      >
                        {COMPANY.email}
                      </a>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E50000] text-xl">📍</span>
                      <div>
                        <p className="text-white">{COMPANY.address}</p>
                        <p>
                          {COMPANY.zip} {COMPANY.city}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading text-xl text-white mb-4">
                    HORAIRES
                  </h2>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex justify-between">
                      <span>Lundi – Vendredi</span>
                      <span className="text-white">8h – 18h</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Samedi</span>
                      <span className="text-white">Sur rendez-vous</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dimanche</span>
                      <span className="text-gray-600">Fermé</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#111111] border border-white/5 rounded-lg p-6">
                  <h3 className="font-heading text-lg text-white mb-3">
                    COMMENT ÇA SE PASSE ?
                  </h3>
                  <ol className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start gap-3">
                      <span className="text-[#E50000] font-heading shrink-0">01</span>
                      <span>
                        Vous nous contactez par téléphone, e-mail ou via le
                        formulaire de devis en ligne.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E50000] font-heading shrink-0">02</span>
                      <span>
                        Nous échangeons sur votre projet et planifions une visite
                        technique gratuite chez vous.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E50000] font-heading shrink-0">03</span>
                      <span>
                        Vous recevez un devis détaillé sous 48h. Clair,
                        transparent, sans surprise.
                      </span>
                    </li>
                  </ol>
                </div>

                <LinkButton
                  href="/devis"
                  size="lg"
                  className="bg-[#E50000] hover:bg-[#B80000] text-white w-full py-6"
                >
                  Demander un devis gratuit
                </LinkButton>
              </div>
            </div>

            {/* Google Maps - pleine largeur sous le formulaire et les infos */}
            <div className="mt-12 rounded-lg overflow-hidden border border-white/10 h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10706!2d7.5596!3d47.5845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4791b7b2a0e7ddd7%3A0x40a5fb99a3f0dd0!2sSaint-Louis!5e0!3m2!1sfr!2sfr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Aiman Renovation - Saint-Louis 68300"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
