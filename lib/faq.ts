export interface FaqItem {
  question: string;
  answer: string;
  category: string;
  relatedServices?: { label: string; href: string }[];
}

export const FAQ_ITEMS: FaqItem[] = [
  // — Devis —
  {
    category: "Devis",
    question: "Comment obtenir un devis ?",
    answer:
      "Remplissez notre formulaire en ligne ou appelez-nous au 09 39 24 55 15. Nous vous envoyons un devis détaillé sous 4 jours après visite technique.",
    relatedServices: [{ label: "Demander un devis", href: "/devis" }],
  },
  {
    category: "Devis",
    question: "Le devis est-il gratuit ?",
    answer:
      "Oui, tous nos devis sont gratuits et sans engagement. La visite technique sur place est incluse, elle nous permet d'évaluer précisément votre projet et de vous proposer un chiffrage au plus juste.",
    relatedServices: [{ label: "Demander un devis gratuit", href: "/devis" }],
  },
  {
    category: "Devis",
    question: "Que contient votre devis ?",
    answer:
      "Notre devis détaille chaque poste de travaux : main-d'oeuvre, matériaux, fournitures, délais prévisionnels et conditions de paiement. Pas de mauvaise surprise : le prix indiqué est le prix final, sauf modification de votre part en cours de chantier.",
    relatedServices: [
      { label: "Voir nos services", href: "/services" },
      { label: "Demander un devis", href: "/devis" },
    ],
  },
  {
    category: "Devis",
    question: "Sous quel délai recevrai-je mon devis ?",
    answer:
      "Nous nous engageons à vous envoyer votre devis sous 4 jours après la visite technique. Pour les projets complexes (façade, photovoltaïque), comptez 5 à 7 jours ouvrés.",
    relatedServices: [
      { label: "Demander un devis", href: "/devis" },
      { label: "Ravalement de façade", href: "/services/ravalement-facade" },
    ],
  },
  // — Travaux —
  {
    category: "Travaux",
    question: "Quelle est votre zone d'intervention ?",
    answer:
      "Nous intervenons à Saint-Louis et dans tout le sud du Haut-Rhin : Huningue, Hésingue, Village-Neuf, Blotzheim, Bartenheim, Kembs, Sierentz, Leymen, Hagenthal-le-Bas, et au-delà sur demande.",
    relatedServices: [
      { label: "Voir nos services", href: "/services" },
      { label: "Nous contacter", href: "/contact" },
    ],
  },
  {
    category: "Travaux",
    question: "Combien de temps durent les travaux ?",
    answer:
      "Cela dépend du projet. À titre indicatif : salle de bain 2-3 semaines, cuisine 3-4 semaines, peinture d'un appartement 1-2 semaines, façade/ITE 3-6 semaines. Le planning précis figure dans le devis.",
    relatedServices: [
      { label: "Rénovation salle de bain", href: "/services/salle-de-bain" },
      { label: "Rénovation cuisine", href: "/services/cuisine" },
      { label: "Ravalement de façade", href: "/services/ravalement-facade" },
    ],
  },
  {
    category: "Travaux",
    question: "Intervenez-vous en copropriété ?",
    answer:
      "Oui : ravalement de façade, isolation, réfection des parties communes, installation de bornes de recharge collectives. Nous travaillons en coordination avec le syndic et respectons le règlement de copropriété.",
    relatedServices: [
      { label: "Ravalement de façade", href: "/services/ravalement-facade" },
      { label: "Isolation thermique (ITE)", href: "/services/isolation" },
      { label: "Bornes de recharge IRVE", href: "/services/bornes-irve" },
    ],
  },
  {
    category: "Travaux",
    question: "Puis-je rester dans mon logement pendant les travaux ?",
    answer:
      "Dans la plupart des cas, oui. Nous organisons le chantier par zones pour limiter les nuisances. Pour une rénovation complète (cuisine + salle de bain simultanément), nous pouvons vous conseiller un hébergement temporaire.",
    relatedServices: [
      { label: "Rénovation cuisine", href: "/services/cuisine" },
      { label: "Rénovation salle de bain", href: "/services/salle-de-bain" },
    ],
  },
  // — Déroulement —
  {
    category: "Déroulement",
    question: "Comment se déroule un chantier type ?",
    answer:
      "Après signature du devis : 1) Planification et commande des matériaux, 2) Protection du chantier et dépose, 3) Travaux techniques (plomberie, électricité), 4) Finitions (carrelage, peinture), 5) Réception des travaux avec vous. Un interlocuteur unique vous tient informé à chaque étape.",
    relatedServices: [
      { label: "Voir nos services", href: "/services" },
      { label: "Demander un devis", href: "/devis" },
    ],
  },
  {
    category: "Déroulement",
    question: "Le chantier sera-t-il propre ?",
    answer:
      "Nous nous engageons à maintenir un chantier propre. Des bâches de protection sont installées dès le premier jour, les gravats sont évacués régulièrement, et un nettoyage complet est effectué à la fin des travaux. Vous récupérez votre logement prêt à vivre.",
  },
  {
    category: "Déroulement",
    question: "Qu'en est-il du bruit et des nuisances pour les voisins ?",
    answer:
      "Nous respectons les horaires de chantier réglementaires (8h-12h / 14h-18h en semaine). Les travaux bruyants (démolition, perçage) sont concentrés sur des plages horaires définies. En copropriété, nous informons les voisins par un courrier avant le début du chantier.",
  },
  {
    category: "Déroulement",
    question: "Aurai-je un interlocuteur dédié ?",
    answer:
      "Oui, Aiman supervise personnellement chaque chantier. Vous avez un numéro direct et pouvez suivre l'avancement de vos travaux en temps réel. Nous envoyons des photos d'avancement régulières par e-mail ou WhatsApp.",
    relatedServices: [{ label: "Nous contacter", href: "/contact" }],
  },
  // — Garanties —
  {
    category: "Garanties",
    question: "Quelles garanties proposez-vous ?",
    answer:
      "Nous sommes couverts par une RC professionnelle et une garantie décennale. Concrètement : garantie de parfait achèvement (1 an), garantie biennale sur les équipements (2 ans) et garantie décennale sur le gros oeuvre et l'étanchéité (10 ans).",
    relatedServices: [
      { label: "Voir nos services", href: "/services" },
      { label: "Nous contacter", href: "/contact" },
    ],
  },
  {
    category: "Garanties",
    question: "Êtes-vous certifié IRVE ?",
    answer:
      "Oui, nous disposons de la certification IRVE (Infrastructure de Recharge pour Véhicule Électrique), obligatoire pour l'installation de bornes de recharge de plus de 3,7 kW. Cette certification vous permet de bénéficier du crédit d'impôt et de la prime ADVENIR.",
    relatedServices: [
      { label: "Bornes de recharge IRVE", href: "/services/bornes-irve" },
      { label: "Demander un devis", href: "/devis" },
    ],
  },
  {
    category: "Garanties",
    question: "Vos artisans sont-ils qualifiés ?",
    answer:
      "Tous nos artisans sont qualifiés et expérimentés dans leur domaine. Notre équipe cumule 19 ans d'expérience dans le bâtiment. Nous disposons des certifications nécessaires (IRVE, habilitations électriques) et suivons régulièrement des formations pour rester à jour des normes et techniques.",
  },
  // — Aides financières —
  {
    category: "Aides financières",
    question: "Qu'est-ce que MaPrimeRénov' ?",
    answer:
      "MaPrimeRénov' est une aide de l'État pour financer vos travaux de rénovation énergétique : isolation, chauffage, ventilation, panneaux solaires. Le montant dépend de vos revenus et du type de travaux. Elle peut couvrir jusqu'à 90% du coût pour les ménages modestes. Nous vous aidons à constituer votre dossier.",
    relatedServices: [
      { label: "Isolation thermique (ITE)", href: "/services/isolation" },
      { label: "Panneaux solaires", href: "/services/panneaux-solaires" },
      { label: "Demander un devis", href: "/devis" },
    ],
  },
  {
    category: "Aides financières",
    question: "Qu'est-ce que les CEE (Certificats d'Économie d'Énergie) ?",
    answer:
      "Les CEE sont des primes versées par les fournisseurs d'énergie (EDF, Engie, TotalEnergies) pour encourager les travaux d'économie d'énergie. Isolation des murs, remplacement de fenêtres, installation d'un chauffe-eau thermodynamique : ces primes sont cumulables avec MaPrimeRénov' et peuvent représenter plusieurs milliers d'euros.",
    relatedServices: [
      { label: "Isolation thermique (ITE)", href: "/services/isolation" },
      { label: "Demander un devis", href: "/devis" },
    ],
  },
  {
    category: "Aides financières",
    question: "Puis-je bénéficier de l'éco-PTZ ?",
    answer:
      "L'éco-prêt à taux zéro (éco-PTZ) permet de financer vos travaux de rénovation énergétique sans payer d'intérêts, jusqu'à 50 000 €. Il est accessible sans condition de revenus, auprès de votre banque. Cumulable avec MaPrimeRénov' et les CEE.",
    relatedServices: [
      { label: "Isolation thermique (ITE)", href: "/services/isolation" },
      { label: "Panneaux solaires", href: "/services/panneaux-solaires" },
    ],
  },
  {
    category: "Aides financières",
    question: "La TVA est-elle réduite sur mes travaux ?",
    answer:
      "Oui, pour les logements de plus de 2 ans : TVA à 10% pour les travaux de rénovation classiques (peinture, carrelage, plomberie), TVA à 5,5% pour les travaux de rénovation énergétique (isolation, panneaux solaires de moins de 3 kWc). La TVA réduite s'applique automatiquement sur notre devis.",
    relatedServices: [
      { label: "Voir nos services", href: "/services" },
      { label: "Demander un devis", href: "/devis" },
    ],
  },
  {
    category: "Aides financières",
    question: "Pouvez-vous m'aider à monter mes dossiers d'aides ?",
    answer:
      "Absolument. Nous vous accompagnons dans toutes les démarches : simulation des aides auxquelles vous avez droit, constitution des dossiers MaPrimeRénov' et CEE, demande d'éco-PTZ auprès de votre banque. Notre objectif est de réduire au maximum votre reste à charge.",
    relatedServices: [
      { label: "Nous contacter", href: "/contact" },
      { label: "Demander un devis", href: "/devis" },
    ],
  },
  // — Paiement —
  {
    category: "Paiement",
    question: "Quelles sont les modalités de paiement ?",
    answer:
      "Acompte de 30% à la signature du devis, puis paiements échelonnés selon l'avancement des travaux (généralement à mi-chantier), et solde à la réception des travaux. Nous acceptons les virements et les chèques.",
    relatedServices: [{ label: "Demander un devis", href: "/devis" }],
  },
  {
    category: "Paiement",
    question: "Puis-je échelonner le paiement ?",
    answer:
      "Oui, le paiement est naturellement échelonné selon l'avancement du chantier. Pour les projets importants, nous pouvons adapter l'échéancier à votre situation. L'éco-PTZ (prêt à taux zéro) est également une solution pour étaler le financement sans frais.",
    relatedServices: [
      { label: "Nous contacter", href: "/contact" },
      { label: "Demander un devis", href: "/devis" },
    ],
  },
];
