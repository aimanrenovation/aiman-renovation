import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const title = "Devis Cuisine Équipée Mulhouse 68 | Pose Complète";
  const description =
    "Devis gratuit pour votre cuisine sur mesure à Mulhouse et dans le Haut-Rhin. Conception 3D, pose complète, plomberie et électricité. Réponse sous 48h.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://aiman-renovation.fr/devis-cuisine",
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: "https://aiman-renovation.fr/images/photo-cuisine.jpg",
          width: 1200,
          height: 630,
          alt: "Cuisine sur mesure — Aiman Renovation Mulhouse",
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ["https://aiman-renovation.fr/images/photo-cuisine.jpg"],
    },
    alternates: {
      canonical: "https://aiman-renovation.fr/devis-cuisine",
    },
  };
}

const faqItems = [
  {
    question: "Combien coûte une rénovation de cuisine complète ?",
    answer:
      "Le budget dépend de la taille et des finitions. Comptez entre 8 000 € et 25 000 € pour une cuisine complète avec meubles, plan de travail, crédence, plomberie et électricité.",
  },
  {
    question: "Combien de temps durent les travaux ?",
    answer:
      "Une rénovation complète de cuisine prend entre 3 et 6 semaines, selon l'ampleur des travaux (déplacement de cloisons, création d'une cuisine ouverte, etc.).",
  },
  {
    question: "Incluez-vous l'électroménager ?",
    answer:
      "Nous pouvons intégrer l'électroménager dans le devis si vous le souhaitez. Sinon, nous installons les appareils que vous fournissez (four, plaque, hotte, lave-vaisselle).",
  },
  {
    question: "Pouvez-vous créer une cuisine ouverte ?",
    answer:
      "Oui ! Nous réalisons l'ouverture de murs porteurs (avec étude structure), la création de bars ou îlots centraux, et l'aménagement complet de cuisines ouvertes sur le salon.",
  },
  {
    question: "Proposez-vous une conception 3D ?",
    answer:
      "Absolument. Avant de démarrer les travaux, nous réalisons une modélisation 3D de votre future cuisine pour que vous puissiez visualiser le résultat et valider chaque détail.",
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
  name: "Rénovation Cuisine",
  description:
    "Cuisine sur mesure à Mulhouse et dans le Haut-Rhin : conception 3D, pose complète, plomberie, électricité, plan de travail.",
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
  serviceType: "Rénovation cuisine",
  offers: {
    "@type": "Offer",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "EUR",
      price: "8000",
      description: "À partir de 8 000 €",
    },
  },
};

export default async function DevisCuisinePage({ params }: Props) {
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
        { name: "Devis Cuisine", url: "/devis-cuisine" },
      ]} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-700 to-red-900 py-20 px-4 text-center text-white md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-amber-400 px-4 py-1.5 text-sm font-semibold text-amber-900">
            Réponse sous 48h
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight lg:text-5xl">
            Cuisine sur Mesure à Mulhouse et Haut-Rhin — Devis Gratuit
          </h1>
          <p className="mt-6 text-lg text-white/80 lg:text-xl">
            Créez la cuisine de vos rêves avec un artisan local.
            Conception 3D, pose complète, plomberie et électricité incluses.
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
            Pourquoi nous confier votre cuisine ?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "📐",
                title: "Conception 3D",
                desc: "Visualisez votre future cuisine en 3D avant les travaux. Chaque détail est validé avec vous.",
              },
              {
                icon: "🍳",
                title: "Électroménager intégré",
                desc: "Fourniture et pose d'électroménager encastrable : four, plaque, hotte, lave-vaisselle.",
              },
              {
                icon: "🔌",
                title: "Plomberie & électricité",
                desc: "Mise aux normes complète : circuits électriques, arrivées d'eau, évacuations.",
              },
              {
                icon: "🪨",
                title: "Plan de travail",
                desc: "Granit, quartz, stratifié ou bois massif — découpe et pose sur mesure.",
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
                desc: "Un artisan prend les mesures, discute de vos envies et vous présente la modélisation 3D.",
              },
              {
                step: "3",
                title: "Travaux clé en main",
                desc: "Dépose, plomberie, électricité, pose des meubles et finitions — tout est géré.",
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
              8 000 – 25 000 €
            </p>
            <p className="mt-2 text-center text-neutral-500">
              Cuisine complète selon configuration
            </p>
            <ul className="mt-6 space-y-3 text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Dépose de l&apos;ancienne cuisine
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Plomberie et électricité
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Meubles hauts et bas sur mesure
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Plan de travail et crédence
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Pose de l&apos;électroménager
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
                name: "Nathalie R.",
                city: "Mulhouse",
                stars: 5,
                text: "Cuisine entièrement refaite avec un îlot central. La conception 3D nous a permis de tout valider avant les travaux. Le résultat est exactement ce qu'on voulait !",
              },
              {
                name: "François K.",
                city: "Sierentz",
                stars: 5,
                text: "Très satisfait de la rénovation de notre cuisine. L'équipe a géré la plomberie, l'électricité et la pose des meubles en 3 semaines. Travail soigné et propre.",
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
            Prêt à créer votre cuisine idéale ?
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
