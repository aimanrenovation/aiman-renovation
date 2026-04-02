export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  { category: "Devis", question: "Comment obtenir un devis ?", answer: "Remplissez notre formulaire en ligne ou appelez-nous au 03 56 89 44 03. Nous vous envoyons un devis détaillé sous 48h après visite technique." },
  { category: "Devis", question: "Le devis est-il gratuit ?", answer: "Oui, tous nos devis sont gratuits et sans engagement. La visite technique est incluse." },
  { category: "Travaux", question: "Quelle est votre zone d'intervention ?", answer: "Nous intervenons à Saint-Louis et dans tout le Haut-Rhin : Huningue, Hésingue, Village-Neuf, Blotzheim, Bartenheim, Kembs, et au-delà sur demande." },
  { category: "Travaux", question: "Combien de temps durent les travaux ?", answer: "Cela dépend du projet. Salle de bain : 2-3 semaines, cuisine : 3-4 semaines, façade : 2-6 semaines. Planning précis dans le devis." },
  { category: "Travaux", question: "Intervenez-vous en copropriété ?", answer: "Oui : ravalement, isolation, parties communes. Nous travaillons en coordination avec le syndic." },
  { category: "Garanties", question: "Quelles garanties proposez-vous ?", answer: "RC professionnelle et garantie décennale. Garantie de parfait achèvement (1 an) et décennale (10 ans) sur tous nos travaux." },
  { category: "Garanties", question: "Êtes-vous certifié IRVE ?", answer: "Oui, nous disposons de la certification IRVE pour l'installation de bornes de recharge." },
  { category: "Paiement", question: "Quelles sont les modalités de paiement ?", answer: "Acompte de 30% à la signature, paiements échelonnés selon l'avancement, solde à la réception des travaux." },
  { category: "Paiement", question: "Existe-t-il des aides financières ?", answer: "Oui : MaPrimeRénov', CEE, éco-PTZ, crédit d'impôt selon les travaux. Nous vous accompagnons dans les démarches." },
];
