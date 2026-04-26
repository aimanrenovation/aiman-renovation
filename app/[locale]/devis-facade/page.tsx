import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const title = "Devis Ravalement Façade Haut-Rhin | Artisan RGE";
  const description =
    "Devis gratuit pour le ravalement de façade en Alsace. Enduit, ITE, bardage, colombages. Artisan RGE, conformité PLU, aides MaPrimeRénov'. Réponse sous 48h.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/devis-facade",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/photo-facade.jpg",
          width: 1200,
          height: 630,
          alt: "Ravalement de façade — Aiman Renovation Haut-Rhin",
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ["https://aiman-renovation.fr/images/photo-facade.jpg"],
    },
    alternates: {
      canonical: "https://aiman-renovation.fr/devis-facade",
    },
  };
}

const faqItems = [
  {
    question: "Combien coûte un ravalement de façade ?",
    answer:
      "Le prix varie selon la surface et le type de travaux. Comptez 30 à 60 €/m² pour un ravalement simple (nettoyage + enduit) et 100 à 180 €/m² pour une isolation thermique par l'extérieur (ITE).",
  },
  {
    question: "Quelle est la meilleure saison pour un ravalement ?",
    answer:
      "Le printemps et l'automne sont idéaux. Il faut éviter les fortes chaleurs (au-dessus de 35 °C) et le gel. Nous planifions vos travaux en fonction de la météo pour un résultat optimal.",
  },
  {
    question: "Puis-je bénéficier de MaPrimeRénov' pour ma façade ?",
    answer:
      "Oui, si les travaux incluent une isolation thermique par l'extérieur (ITE), vous pouvez bénéficier de MaPrimeRénov', des CEE (Certificats d'Économies d'Énergie) et de l'éco-PTZ. Nous vous aidons à monter le dossier.",
  },
  {
    question: "Faut-il une autorisation pour un ravalement ?",
    answer:
      "Oui, une déclaration préalable de travaux est obligatoire en mairie. Dans certaines zones (ABF, secteur sauvegardé), des contraintes supplémentaires s'appliquent. Nous vérifions la conformité PLU pour vous.",
  },
  {
    question: "Travaillez-vous sur les copropriétés ?",
    answer:
      "Absolument. Nous intervenons régulièrement sur des immeubles en copropriété. Nous pouvons fournir un devis détaillé pour présentation en assemblée générale.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Ravalement de Façade",
  description:
    "Ravalement de façade en Alsace et Haut-Rhin : enduit, isolation thermique par l'extérieur (ITE), bardage, rénovation de colombages.",
  provider: {
    "@type": "LocalBusiness",
    name: "Aiman Renovation",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Saint-Louis",
      postalCode: "68300",
      addressRegion: "Haut-Rhin",
      addressCountry: "FR",
    },
    telephone: "+33389700000",
    url: "https://aiman-renovation.fr",
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 47.59,
      longitude: 7.56,
    },
    geoRadius: "50000",
  },
  serviceType: "Ravalement de façade",
  offers: {
    "@type": "Offer",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "EUR",
      price: "30",
      unitText: "par m²",
      description: "À partir de 30 €/m²",
    },
  },
};

export default async function DevisFacadePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* JSON-LD structured data — static content, safe to inline */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-700 to-red-900 py-20 px-4 text-center text-white md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-amber-400 px-4 py-1.5 text-sm font-semibold text-amber-900">
            Réponse sous 48h
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight lg:text-5xl">
            Ravalement de Façade en Alsace — Devis Gratuit sous 48h
          </h1>
          <p className="mt-6 text-lg text-white/80 lg:text-xl">
            Redonnez vie à votre façade avec un artisan RGE local.
            Enduit, ITE, bardage, colombages — conformité PLU garantie.
          </p>
          <Link
            href="/devis"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 text-lg font-bold text-red-700 shadow-lg transition hover:bg-neutral-100 hover:shadow-xl"
          >
            Obtenir mon devis gratuit →
          </Link>
        </div>
      </section>

      {/* Trust bar */}
      <section className="relative z-10 mx-auto -mt-8 max-w-3xl px-4">
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-white p-6 shadow-lg sm:flex-row sm:gap-10">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-700">★ 4.9/5</p>
            <p className="text-sm text-neutral-500">Avis Google</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-700">50+</p>
            <p className="text-sm text-neutral-500">Projets réalisés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-700">48h</p>
            <p className="text-sm text-neutral-500">Devis envoyé</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-neutral-50 py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-neutral-900">
            Pourquoi nous confier votre façade ?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🏠",
                title: "Enduit & crépi",
                desc: "Application d'enduit neuf ou rénovation du crépi existant. Finitions grattées, talochées ou projetées.",
              },
              {
                icon: "🧱",
                title: "ITE — Isolation extérieure",
                desc: "Isolation thermique par l'extérieur pour réduire vos factures et améliorer le confort.",
              },
              {
                icon: "🪵",
                title: "Bardage & colombages",
                desc: "Pose de bardage bois ou composite, restauration de colombages alsaciens traditionnels.",
              },
              {
                icon: "📋",
                title: "Conformité PLU",
                desc: "Nous vérifions les règles d'urbanisme et déposons la déclaration préalable pour vous.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 text-lg font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-neutral-900">
            Comment ça marche ?
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Demandez votre devis",
                desc: "Remplissez notre formulaire en ligne en 2 minutes. C'est gratuit et sans engagement.",
              },
              {
                step: "2",
                title: "Visite technique offerte",
                desc: "Un artisan se déplace pour inspecter votre façade et établir un diagnostic complet.",
              },
              {
                step: "3",
                title: "Travaux clé en main",
                desc: "Échafaudage, préparation, traitement et finition — on gère tout de A à Z.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-700 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-neutral-50 py-16 px-4">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900">
            Nos tarifs transparents
          </h2>
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">30 – 60 €/m²</p>
                <p className="mt-1 text-neutral-500">Ravalement simple</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-700">100 – 180 €/m²</p>
                <p className="mt-1 text-neutral-500">ITE complète</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3 text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Diagnostic et état des lieux
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Montage et démontage d&apos;échafaudage
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Nettoyage haute pression
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Traitement anti-mousse
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Application enduit ou isolant
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Finition et peinture
              </li>
            </ul>
            <div className="mt-8 text-center">
              <Link
                href="/devis"
                className="inline-block rounded-xl bg-red-700 px-8 py-3 font-bold text-white shadow transition hover:bg-red-800"
              >
                Demander un devis détaillé →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-neutral-900">
            Ce que nos clients disent
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                name: "Jean-Pierre L.",
                city: "Blotzheim",
                stars: 5,
                text: "Ravalement complet de notre maison avec ITE. Les murs sont parfaitement isolés, on a déjà constaté une baisse de notre facture de chauffage. Travail très propre.",
              },
              {
                name: "Catherine B.",
                city: "Hésingue",
                stars: 5,
                text: "Rénovation des colombages et enduit de notre maison alsacienne. Le résultat est magnifique, fidèle au style traditionnel. Merci à toute l'équipe !",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="mt-3 text-neutral-700">&ldquo;{review.text}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-neutral-900">
                  {review.name}
                </p>
                <p className="text-sm text-neutral-500">{review.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-700 py-16 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold lg:text-4xl">
            Prêt à rénover votre façade ?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Demandez votre devis gratuit et recevez une réponse sous 48h.
          </p>
          <Link
            href="/devis"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 text-lg font-bold text-red-700 shadow-lg transition hover:bg-neutral-100 hover:shadow-xl"
          >
            Obtenir mon devis gratuit →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-neutral-900">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-neutral-200 bg-white"
              >
                <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-neutral-900 marker:[content:''] group-open:border-b group-open:border-neutral-100">
                  {item.question}
                </summary>
                <p className="px-6 py-4 text-neutral-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="bg-neutral-50 py-12 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-neutral-500">
            Découvrez aussi nos services :{" "}
            <Link href="/devis-salle-de-bain" className="text-red-700 underline hover:text-red-800">
              Rénovation salle de bain
            </Link>{" "}
            ·{" "}
            <Link href="/devis-cuisine" className="text-red-700 underline hover:text-red-800">
              Rénovation cuisine
            </Link>{" "}
            ·{" "}
            <Link href="/services" className="text-red-700 underline hover:text-red-800">
              Tous nos services
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
