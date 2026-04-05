import type { Metadata } from "next";
import Image from "next/image";
import { COMPANY } from "@/lib/constants";
import { LinkButton } from "@/components/ui/link-button";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact — Rénovation Saint-Louis",
  description: "Contactez Aiman Renovation au 03 56 89 44 03 ou par email. Devis gratuit sous 4 jours pour vos travaux de rénovation à Saint-Louis et Haut-Rhin.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/ambiance-chantier.jpg"
            alt="Contactez Aiman Renovation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 w-full">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-none">
            <span className="text-[#E50000]">PARLONS</span> DE VOTRE PROJET
          </h1>
          <p className="mt-4 text-gray-300 text-lg max-w-xl">
            Premier échange toujours sans engagement.
          </p>
        </div>
      </section>

      {/* Bandeau rassurant */}
      <section className="relative z-10 bg-[#0A0A0A] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>, text: "Devis gratuit" },
              { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, text: "Réponse sous 4 jours" },
              { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>, text: "Sans engagement" },
            ].map((item) => (
              <div key={item.text} className="flex items-center justify-center gap-2 text-gray-400">
                <span className="text-[#E50000]">{item.icon}</span>
                <span className="text-sm font-medium text-white">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="relative z-10 py-16 md:py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

            {/* Formulaire — 3 colonnes */}
            <div className="md:col-span-3 bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-10">
              <ContactForm />
            </div>

            {/* Infos — 2 colonnes */}
            <div className="md:col-span-2 space-y-8">

              {/* Téléphone */}
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="group block bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-[#E50000]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E50000]/10 flex items-center justify-center text-[#E50000] group-hover:bg-[#E50000]/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold group-hover:text-[#E50000] transition-colors">{COMPANY.phone}</p>
                    <p className="text-gray-500 text-sm">Fixe</p>
                  </div>
                </div>
              </a>

              {/* Mobile */}
              <a href={`tel:${COMPANY.mobile.replace(/\s/g, "")}`} className="group block bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-[#E50000]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E50000]/10 flex items-center justify-center text-[#E50000] group-hover:bg-[#E50000]/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold group-hover:text-[#E50000] transition-colors">{COMPANY.mobile}</p>
                    <p className="text-gray-500 text-sm">Mobile / WhatsApp</p>
                  </div>
                </div>
              </a>

              {/* Email */}
              <a href={`mailto:${COMPANY.email}`} className="group block bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-[#E50000]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E50000]/10 flex items-center justify-center text-[#E50000] group-hover:bg-[#E50000]/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold group-hover:text-[#E50000] transition-colors">{COMPANY.email}</p>
                    <p className="text-gray-500 text-sm">Email</p>
                  </div>
                </div>
              </a>

              {/* Horaires */}
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#E50000]/10 flex items-center justify-center text-[#E50000]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-lg text-white">HORAIRES</h2>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Lundi – Vendredi</span>
                    <span className="text-white font-medium">8h – 18h</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Samedi</span>
                    <span className="text-white font-medium">Sur rendez-vous</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Dimanche</span>
                    <span className="text-gray-600">Fermé</span>
                  </li>
                </ul>
              </div>

              {/* CTA Devis */}
              <LinkButton
                href="/devis"
                size="lg"
                className="bg-[#E50000] hover:bg-[#B80000] text-white w-full py-5 rounded-2xl"
              >
                Demander un devis gratuit
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps pleine largeur */}
      <section className="relative z-10 h-[400px] md:h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10706!2d7.5596!3d47.5845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4791b7b2a0e7ddd7%3A0x40a5fb99a3f0dd0!2sSaint-Louis!5e0!3m2!1sfr!2sfr"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Zone intervention Aiman Renovation"
        />
      </section>
    </>
  );
}
