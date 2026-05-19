import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { getAlternates } from "@/lib/i18n-helpers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const title = "Devis Salle de Bain Saint-Louis 68 | Rénovation Complète";
  const description =
    "Devis gratuit salle de bain à Saint-Louis 68 et Haut-Rhin. Douche italienne, carrelage, plomberie complète, étanchéité DTU. Artisan qualifié. Réponse sous 48h.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/devis-salle-de-bain",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/photo-salle-de-bain.jpg",
          width: 1200,
          height: 630,
          alt: "Rénovation salle de bain — Aiman Renovation Saint-Louis 68",
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ["https://aiman-renovation.fr/images/photo-salle-de-bain.jpg"],
    },
    alternates: getAlternates("/devis-salle-de-bain"),
  };
}

const faqItems = [
  {
    question: "Combien coûte la rénovation d'une salle de bain ?",
    answer:
      "Le prix dépend de la surface et des prestations. Comptez à partir de 5 000 € pour une rénovation partielle et entre 8 000 € et 15 000 € pour une salle de bain complète (douche italienne, carrelage, plomberie, meubles vasque).",
  },
  {
    question: "Combien de temps durent les travaux ?",
    answer:
      "Une rénovation complète de salle de bain prend généralement entre 2 et 4 semaines, selon l'ampleur des travaux et les délais de livraison des matériaux.",
  },
  {
    question: "Quels matériaux utilisez-vous ?",
    answer:
      "Nous travaillons avec des matériaux de qualité professionnelle : carrelage grès cérame, robinetterie Grohe ou Hansgrohe, receveurs de douche extra-plats, et meubles vasque sur mesure.",
  },
  {
    question: "Existe-t-il des aides financières pour rénover ma salle de bain ?",
    answer:
      "Oui, selon votre situation, vous pouvez bénéficier de la TVA réduite à 10 %, de MaPrimeAdapt' pour l'adaptation du logement, ou d'aides de l'Anah. Nous vous accompagnons dans vos démarches.",
  },
  {
    question: "Proposez-vous la douche italienne ?",
    answer:
      "Absolument ! La douche italienne est notre spécialité. Nous réalisons des douches à l'italienne sur mesure avec une étanchéité parfaite, un receveur extra-plat et le carrelage de votre choix.",
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
  name: "Rénovation Salle de Bain",
  description:
    "Rénovation complète de salle de bain à Saint-Louis et dans le Haut-Rhin : douche italienne, plomberie, carrelage, meubles vasque.",
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
  serviceType: "Rénovation salle de bain",
  offers: {
    "@type": "Offer",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "EUR",
      price: "5000",
      description: "À partir de 5 000 €",
    },
  },
};

export default async function DevisSalleDeBainPage({ params }: Props) {
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
      <Breadcrumb items={[
        { name: "Accueil", url: "/" },
        { name: "Services", url: "/services" },
        { name: "Devis Salle de Bain", url: "/devis-salle-de-bain" },
      ]} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-700 to-red-900 py-20 px-4 text-center text-white md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-amber-400 px-4 py-1.5 text-sm font-semibold text-amber-900">
            Réponse sous 48h
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight lg:text-5xl">
            Rénovation Salle de Bain à Saint-Louis et Haut-Rhin — Devis Gratuit
          </h1>
          <p className="mt-6 text-lg text-white/80 lg:text-xl">
            Transformez votre salle de bain avec un artisan local de confiance.
            Douche italienne, plomberie complète, carrelage sur mesure.
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
            Pourquoi nous confier votre salle de bain ?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🔑",
                title: "Clé en main",
                desc: "De la conception à la livraison, on s'occupe de tout : plomberie, carrelage, électricité, peinture.",
              },
              {
                icon: "🚿",
                title: "Douche italienne",
                desc: "Notre spécialité : des douches à l'italienne sur mesure, étanches et élégantes.",
              },
              {
                icon: "🔧",
                title: "Plomberie complète",
                desc: "Remplacement ou création de canalisations, raccordements, robinetterie haut de gamme.",
              },
              {
                icon: "🛡️",
                title: "Garantie décennale",
                desc: "Tous nos travaux sont couverts par une assurance décennale pour votre tranquillité.",
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
                desc: "Un artisan se déplace chez vous pour prendre les mesures et affiner le devis.",
              },
              {
                step: "3",
                title: "Travaux clé en main",
                desc: "Nous réalisons les travaux dans les délais convenus. Vous n'avez rien à faire.",
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
            <p className="text-center text-4xl font-bold text-red-700">
              À partir de 5 000 €
            </p>
            <p className="mt-2 text-center text-neutral-500">
              Salle de bain complète : 8 000 – 15 000 €
            </p>
            <ul className="mt-6 space-y-3 text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Dépose de l&apos;ancienne salle de bain
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Plomberie et raccordements
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Carrelage sol et murs
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Douche italienne ou baignoire
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Meuble vasque et miroir
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Peinture et finitions
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
                name: "Sophie M.",
                city: "Saint-Louis",
                stars: 5,
                text: "Rénovation complète de notre salle de bain avec douche italienne. Travail soigné, dans les délais et le budget annoncé. Je recommande vivement Aiman Renovation !",
              },
              {
                name: "Marc D.",
                city: "Huningue",
                stars: 5,
                text: "Excellente prestation pour notre salle d'eau. L'équipe a été à l'écoute, les finitions sont impeccables et le chantier a été laissé propre chaque soir.",
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
            Prêt à rénover votre salle de bain ?
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
            <Link href="/devis-cuisine" className="text-red-700 underline hover:text-red-800">
              Rénovation cuisine
            </Link>{" "}
            ·{" "}
            <Link href="/devis-facade" className="text-red-700 underline hover:text-red-800">
              Ravalement de façade
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
