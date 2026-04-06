import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${COMPANY.website}`,
};

export default function MentionsLegalesPage() {
  return (
    <section className="pt-32 pb-20 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-sm">
        <h1 className="font-heading text-4xl mb-8">
          MENTIONS <span className="text-[#E50000]">LÉGALES</span>
        </h1>

        <h2>Éditeur du site</h2>
        <p>
          <strong>{COMPANY.name}</strong><br />
          Forme juridique : {COMPANY.legalForm}<br />
          Adresse : {COMPANY.address}, {COMPANY.zip} {COMPANY.city}<br />
          Téléphone : {COMPANY.phone}<br />
          Email : {COMPANY.email}<br />
          Directeur de la publication : Aiman, gérant
        </p>

        <h2>Hébergement</h2>
        <p>
          Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133,
          Covina, CA 91723, États-Unis.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu de ce site (textes, images, logos, vidéos)
          est la propriété exclusive d&apos;{COMPANY.name} ou de ses
          partenaires. Toute reproduction, même partielle, est interdite sans
          autorisation écrite préalable.
        </p>

        <h2>Données personnelles</h2>
        <p>
          Les données personnelles collectées via le formulaire de devis sont
          utilisées uniquement pour répondre à votre demande. Elles ne sont ni
          vendues ni transmises à des tiers. Conformément au RGPD, vous
          disposez d&apos;un droit d&apos;accès, de rectification et de
          suppression de vos données. Contactez-nous à{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-[#E50000]">
            {COMPANY.email}
          </a>
          .
        </p>

        <h2>Cookies</h2>
        <p>
          Ce site utilise des cookies techniques nécessaires à son
          fonctionnement. Aucun cookie publicitaire ou de suivi n&apos;est
          utilisé.
        </p>

        <h2>Responsabilité</h2>
        <p>
          {COMPANY.name} s&apos;efforce d&apos;assurer l&apos;exactitude des
          informations présentes sur ce site. Toutefois, elle ne peut garantir
          que les informations soient complètes, précises ou à jour.
          {COMPANY.name} décline toute responsabilité en cas d&apos;erreur ou
          d&apos;omission.
        </p>

        <h2>Crédits</h2>
        <p>
          Conception et développement : {COMPANY.name}<br />
          Images : générées par intelligence artificielle
        </p>
      </div>
    </section>
  );
}
