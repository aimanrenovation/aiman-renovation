import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "Conditions générales de vente d'Aiman Renovation — travaux de rénovation du bâtiment.",
};

const SECTIONS = [
  {
    title: "Article 1 — Objet et champ d'application",
    content: `Les présentes Conditions Générales de Vente (ci-après « CGV ») s'appliquent à l'ensemble des prestations de travaux de rénovation du bâtiment réalisées par la société ${COMPANY.name}, SASU au capital social défini dans ses statuts, immatriculée au Registre du Commerce et des Sociétés, dont le siège social est situé à ${COMPANY.city} (ci-après « l'Entreprise »), pour le compte de ses clients particuliers ou professionnels (ci-après « le Client »).

Toute commande de travaux implique l'acceptation sans réserve des présentes CGV, qui prévalent sur tout autre document du Client, sauf conditions particulières convenues par écrit entre les parties.`,
  },
  {
    title: "Article 2 — Devis et formation du contrat",
    content: `2.1. L'Entreprise établit un devis gratuit et détaillé après visite technique sur site. Le devis précise la nature et l'étendue des travaux, les matériaux utilisés, les délais d'exécution prévisionnels et le prix total TTC.

2.2. Le devis est valable trente (30) jours à compter de sa date d'émission, sauf mention contraire.

2.3. Le contrat est formé par la signature du devis par le Client, accompagnée de la mention manuscrite « Bon pour accord ». Le retour du devis signé vaut acceptation des présentes CGV.

2.4. Toute modification du devis initial doit faire l'objet d'un avenant écrit signé par les deux parties. Les travaux supplémentaires non prévus au devis initial ne seront exécutés qu'après acceptation écrite du Client et du nouveau prix correspondant.`,
  },
  {
    title: "Article 3 — Prix et révision",
    content: `3.1. Les prix sont indiqués en euros toutes taxes comprises (TTC). Le taux de TVA applicable est celui en vigueur au jour de la facturation (10 % pour les travaux de rénovation dans les logements de plus de 2 ans, 20 % dans les autres cas, 5,5 % pour les travaux de rénovation énergétique éligibles).

3.2. Les prix s'entendent hors fourniture de matériaux par le Client, sauf stipulation contraire au devis.

3.3. En cas de variation significative du coût des matériaux ou de la main-d'œuvre entre la date du devis et le début des travaux (supérieure à 5 %), l'Entreprise se réserve le droit de réviser le prix après en avoir informé le Client, qui dispose d'un délai de quinze (15) jours pour accepter ou refuser la révision.`,
  },
  {
    title: "Article 4 — Conditions de paiement",
    content: `4.1. Sauf accord particulier, les modalités de paiement sont les suivantes :
— Acompte de 30 % du montant TTC à la signature du devis ;
— Paiement intermédiaire de 40 % à mi-chantier, sur présentation d'un état d'avancement ;
— Solde de 30 % à la réception des travaux.

4.2. Les paiements s'effectuent par virement bancaire, chèque ou espèces dans la limite légale. Les paiements par carte bancaire sont acceptés.

4.3. En cas de retard de paiement, des pénalités de retard seront appliquées de plein droit, au taux légal en vigueur majoré de cinq (5) points, sans qu'un rappel soit nécessaire. Une indemnité forfaitaire de recouvrement de quarante (40) euros sera également due conformément à l'article L.441-10 du Code de commerce.

4.4. L'Entreprise se réserve le droit de suspendre l'exécution des travaux en cas de non-paiement d'une échéance à sa date d'exigibilité, après mise en demeure restée infructueuse pendant huit (8) jours.`,
  },
  {
    title: "Article 5 — Délais d'exécution",
    content: `5.1. Les délais d'exécution mentionnés au devis sont donnés à titre indicatif et courent à compter de la réception de l'acompte et de la fourniture par le Client de tous les éléments nécessaires au démarrage des travaux.

5.2. L'Entreprise s'engage à informer le Client de tout retard prévisible et de ses causes. Les retards dus à des cas de force majeure (intempéries exceptionnelles, pénurie de matériaux, pandémie, grève, etc.), à des modifications demandées par le Client ou à des découvertes imprévues en cours de chantier (amiante, termites, vice caché) ne sauraient engager la responsabilité de l'Entreprise.

5.3. Un retard dans l'exécution des travaux ne peut donner lieu à des dommages et intérêts, à une retenue ou à une annulation de la commande, sauf en cas de retard manifestement excessif et non justifié.`,
  },
  {
    title: "Article 6 — Obligations du Client",
    content: `6.1. Le Client s'engage à :
— Assurer le libre accès au chantier aux horaires convenus ;
— Fournir les autorisations administratives nécessaires (permis de construire, déclaration préalable, accord de copropriété, etc.) ;
— Signaler tout élément susceptible d'affecter le bon déroulement des travaux (présence d'amiante, de plomb, canalisations enterrées, etc.) ;
— Protéger ou déplacer les biens meubles et objets de valeur situés dans la zone de travaux.

6.2. Le Client dispose d'un droit de rétractation de quatorze (14) jours à compter de la signature du devis lorsque celui-ci a été conclu hors établissement (à domicile), conformément aux articles L.221-18 et suivants du Code de la consommation. Ce droit de rétractation ne s'applique pas si les travaux ont commencé avant l'expiration de ce délai avec l'accord exprès du Client.`,
  },
  {
    title: "Article 7 — Réception des travaux",
    content: `7.1. À l'achèvement des travaux, une visite de réception est organisée conjointement entre l'Entreprise et le Client. Un procès-verbal de réception est établi et signé par les deux parties.

7.2. La réception peut être prononcée :
— Sans réserve : les travaux sont conformes au devis et aux règles de l'art ;
— Avec réserves : les défauts constatés sont consignés au procès-verbal et l'Entreprise s'engage à les lever dans un délai raisonnable ;
— Refusée : en cas de non-conformité majeure rendant l'ouvrage impropre à sa destination.

7.3. En l'absence de procès-verbal de réception, la prise de possession des lieux par le Client et le paiement du solde valent réception tacite des travaux.

7.4. La réception marque le point de départ des garanties légales (garantie de parfait achèvement, garantie biennale, garantie décennale).`,
  },
  {
    title: "Article 8 — Garanties",
    content: `8.1. Garantie de parfait achèvement (article 1792-6 du Code civil) : l'Entreprise s'engage à réparer tous les désordres signalés par le Client dans l'année suivant la réception des travaux.

8.2. Garantie biennale de bon fonctionnement (article 1792-3 du Code civil) : les éléments d'équipement dissociables de l'ouvrage sont garantis pendant deux (2) ans à compter de la réception.

8.3. Garantie décennale (articles 1792 et suivants du Code civil) : l'Entreprise est responsable pendant dix (10) ans des dommages compromettant la solidité de l'ouvrage ou le rendant impropre à sa destination. L'Entreprise est titulaire d'une assurance responsabilité civile décennale dont les coordonnées sont communiquées sur demande.

8.4. Les garanties ne couvrent pas les dommages résultant d'un usage anormal, d'un défaut d'entretien, d'une modification réalisée par le Client ou un tiers, ou d'un cas de force majeure.`,
  },
  {
    title: "Article 9 — Responsabilité",
    content: `9.1. L'Entreprise est tenue d'une obligation de résultat quant à la conformité des travaux au devis et aux règles de l'art applicables.

9.2. L'Entreprise est couverte par une assurance Responsabilité Civile Professionnelle pour les dommages causés aux tiers et aux biens du Client pendant l'exécution des travaux.

9.3. La responsabilité de l'Entreprise ne saurait être engagée en cas de dommages résultant de vices cachés de l'ouvrage existant non décelables lors de la visite technique préalable, ni de matériaux fournis par le Client.`,
  },
  {
    title: "Article 10 — Sous-traitance",
    content: `L'Entreprise se réserve le droit de sous-traiter tout ou partie des travaux à des sous-traitants qualifiés, dans le respect de la loi n° 75-1334 du 31 décembre 1975 relative à la sous-traitance. L'Entreprise demeure seule responsable vis-à-vis du Client de la bonne exécution des travaux confiés aux sous-traitants.`,
  },
  {
    title: "Article 11 — Résiliation",
    content: `11.1. En cas de manquement grave de l'une des parties à ses obligations, l'autre partie pourra résilier le contrat de plein droit, trente (30) jours après mise en demeure restée infructueuse adressée par lettre recommandée avec accusé de réception.

11.2. En cas de résiliation du fait du Client, les travaux exécutés et les matériaux approvisionnés restent dus. L'Entreprise facturera les travaux réalisés au prorata, majorés d'une indemnité de résiliation de 10 % du montant des travaux restant à exécuter.

11.3. En cas de résiliation du fait de l'Entreprise, le Client sera remboursé des sommes versées au titre des travaux non encore exécutés.`,
  },
  {
    title: "Article 12 — Protection des données personnelles",
    content: `Les données personnelles collectées dans le cadre de la relation commerciale sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés. Le Client dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données. Pour exercer ces droits, le Client peut adresser sa demande à ${COMPANY.email}.`,
  },
  {
    title: "Article 13 — Litiges et droit applicable",
    content: `13.1. Les présentes CGV sont soumises au droit français.

13.2. En cas de litige relatif à l'exécution ou à l'interprétation des présentes, les parties s'efforceront de trouver une solution amiable. Le Client est informé qu'il peut recourir à un médiateur de la consommation conformément aux articles L.612-1 et suivants du Code de la consommation.

13.3. À défaut de résolution amiable, le litige sera soumis aux tribunaux compétents du ressort du siège social de l'Entreprise.`,
  },
  {
    title: "Article 14 — Propriété intellectuelle",
    content: `Les plans, études techniques, croquis et documents remis par l'Entreprise dans le cadre du devis ou de l'exécution des travaux demeurent sa propriété intellectuelle. Ils ne peuvent être communiqués à des tiers, reproduits ou utilisés sans l'accord écrit préalable de l'Entreprise.`,
  },
];

export default function CgvPage() {
  return (
    <section className="relative z-10 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4">
          CONDITIONS GÉNÉRALES <span className="text-[#E50000]">DE VENTE</span>
        </h1>
        <p className="text-gray-500 text-sm mb-12">
          {COMPANY.name} — SASU — Dernière mise à jour : avril 2026
        </p>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-lg text-white mb-3">{section.title}</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
