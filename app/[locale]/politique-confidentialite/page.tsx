import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Politique de confidentialité du site ${COMPANY.website}`,
};

export default function PolitiqueConfidentialitePage() {
  return (
    <section className="pt-32 pb-20 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-sm">
        <h1 className="font-heading text-4xl mb-8">
          POLITIQUE DE <span className="text-[#E50000]">CONFIDENTIALITÉ</span>
        </h1>

        <p>
          <strong>{COMPANY.name}</strong> accorde une grande importance à la
          protection de vos données personnelles. Cette politique décrit
          comment nous collectons et utilisons vos informations.
        </p>

        <h2>Données collectées</h2>
        <p>Nous collectons les données suivantes via notre formulaire de devis :</p>
        <ul>
          <li>Nom et prénom</li>
          <li>Numéro de téléphone</li>
          <li>Adresse email</li>
          <li>Adresse du chantier</li>
          <li>Description et photos du projet</li>
        </ul>

        <h2>Finalité</h2>
        <p>
          Ces données sont utilisées exclusivement pour :
        </p>
        <ul>
          <li>Répondre à votre demande de devis</li>
          <li>Vous contacter pour organiser une visite technique</li>
          <li>Établir un devis personnalisé</li>
        </ul>

        <h2>Durée de conservation</h2>
        <p>
          Vos données sont conservées pendant 3 ans à compter de votre
          dernière interaction avec {COMPANY.name}, sauf obligation légale
          de conservation plus longue.
        </p>

        <h2>Partage des données</h2>
        <p>
          Vos données ne sont jamais vendues ni transmises à des tiers à des
          fins commerciales. Elles peuvent être transmises à nos
          sous-traitants techniques (hébergeur, service email) dans le cadre
          strict du traitement de votre demande.
        </p>

        <h2>Vos droits (RGPD)</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données,
          vous disposez des droits suivants :
        </p>
        <ul>
          <li>Droit d&apos;accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit de suppression</li>
          <li>Droit à la portabilité</li>
          <li>Droit d&apos;opposition</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-[#E50000]">
            {COMPANY.email}
          </a>{" "}
          ou par courrier au {COMPANY.address}, {COMPANY.zip} {COMPANY.city}.
        </p>

        <h2>Cookies</h2>
        <p>
          Ce site utilise uniquement des cookies techniques nécessaires à son
          fonctionnement. Aucun cookie de suivi publicitaire n&apos;est
          utilisé.
        </p>

        <h2>Contact</h2>
        <p>
          Pour toute question relative à cette politique, contactez-nous :<br />
          Email : {COMPANY.email}<br />
          Téléphone : {COMPANY.phone}
        </p>
      </div>
    </section>
  );
}
