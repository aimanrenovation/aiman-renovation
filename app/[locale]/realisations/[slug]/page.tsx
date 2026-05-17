import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { CtaBanner } from "@/components/sections/cta-banner";
import { LinkButton } from "@/components/ui/link-button";
import { getAlternates } from "@/lib/i18n-helpers";
import { GalerieAvantApres } from "@/components/realisations/GalerieAvantApres";
import {
  getAllRealisationSlugs,
  getRealisationBySlug,
} from "@/lib/realisations";
import { routing } from "@/i18n/routing";

export const runtime = "nodejs";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  const slugs = getAllRealisationSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const realisation = getRealisationBySlug(slug);
  if (!realisation) return {};

  const title = realisation.meta_title || realisation.titre;
  const description = realisation.meta_description || realisation.description;
  const heroImage =
    realisation.photos_apres[0] || realisation.photos_avant[0] || null;

  return {
    title,
    description,
    alternates: getAlternates(`/realisations/${slug}`),
    openGraph: {
      title,
      description,
      url: `https://aiman-renovation.fr/realisations/${slug}`,
      siteName: "Aiman Renovation",
      locale: locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "article",
      publishedTime: realisation.date_publication ?? realisation.date_livraison,
      ...(heroImage && {
        images: [{ url: heroImage, width: 1200, height: 630, alt: title }],
      }),
    },
  };
}

export default async function RealisationDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const realisation = getRealisationBySlug(slug);
  if (!realisation) notFound();

  const t = await getTranslations({ locale, namespace: "realisations" });

  const heroImage =
    realisation.photos_apres[0] || realisation.photos_avant[0] || null;

  return (
    <>
      <Breadcrumb
        items={[
          { name: "Accueil", url: "/" },
          { name: "Réalisations", url: "/realisations" },
          { name: realisation.titre, url: `/realisations/${slug}` },
        ]}
      />

      {/* Hero */}
      <section className="relative z-10 pt-28 pb-10 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          {heroImage && (
            <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden mb-8 border border-white/10">
              <Image
                src={heroImage}
                alt={realisation.titre}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="text-xs text-gray-300 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  {realisation.ville}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {realisation.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full border border-white/20 text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            {realisation.titre}
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
            {realisation.description}
          </p>

          {(realisation.date_publication ?? realisation.date_livraison) && (
            <p className="mt-3 text-xs text-gray-600">
              Publié le{" "}
              {new Date(
                (realisation.date_publication ??
                  realisation.date_livraison) as string,
              ).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </section>

      {/* Galerie avant / après — comparatif côte à côte */}
      {(realisation.photos_avant.length > 0 ||
        realisation.photos_apres.length > 0) && (
        <section className="relative z-10 py-12 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-lg font-semibold text-white mb-6">
              Avant / Après
            </h2>
            <GalerieAvantApres
              photosAvant={realisation.photos_avant}
              photosApres={realisation.photos_apres}
            />
          </div>
        </section>
      )}

      {/* Galerie pendant les travaux */}
      {realisation.photos_pendant.length > 0 && (
        <section className="relative z-10 py-10 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto px-6">
            <PhotoGallerySection
              titre="Pendant les travaux"
              photos={realisation.photos_pendant}
              accentClass="text-blue-400"
            />
          </div>
        </section>
      )}

      {/* Vidéo du chantier */}
      {realisation.video_url && (
        <section className="relative z-10 py-10 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Vidéo du chantier
            </h2>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={realisation.video_url}
              controls
              className="w-full rounded-xl border border-white/10 bg-black"
              style={{ maxHeight: "480px" }}
            />
          </div>
        </section>
      )}

      {/* Info chantier */}
      <section className="relative z-10 py-10 bg-black border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap gap-6 text-sm text-gray-400">
          <div>
            <span className="text-white font-semibold">Type :</span>{" "}
            {realisation.type_chantier}
          </div>
          <div>
            <span className="text-white font-semibold">Ville :</span>{" "}
            {realisation.ville}
          </div>
          {realisation.surface_m2 != null && (
            <div>
              <span className="text-white font-semibold">Surface :</span>{" "}
              {realisation.surface_m2} m²
            </div>
          )}
          {realisation.reference_dossier && (
            <div>
              <span className="text-white font-semibold">Réf :</span>{" "}
              {realisation.reference_dossier}
            </div>
          )}
        </div>
      </section>

      {/* CTA devis */}
      <section className="relative z-10 py-14 bg-black">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xl font-semibold text-white">
              Ce projet vous inspire ?
            </p>
            <p className="text-gray-400 mt-1">
              Obtenez un devis gratuit pour votre rénovation.
            </p>
          </div>
          <LinkButton href="/devis" variant="default" size="lg">
            Demander un devis gratuit
          </LinkButton>
        </div>
      </section>

      {/* Retour aux réalisations */}
      <section className="relative z-10 pb-10 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/realisations"
            className="text-sm text-[#E50000] hover:underline"
          >
            ← Toutes nos réalisations
          </Link>
        </div>
      </section>

      {/* Schema.org JSON-LD */}
      {realisation.schema_org && typeof realisation.schema_org === "object" && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(realisation.schema_org).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      )}

      {/* CreativeWork schema — rich snippets chantiers */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: realisation.titre,
            description: realisation.description,
            dateCreated: realisation.date_livraison ?? realisation.date_publication,
            datePublished: realisation.date_publication ?? realisation.date_livraison,
            ...(heroImage && { image: heroImage }),
            locationCreated: {
              "@type": "Place",
              name: realisation.ville,
              address: {
                "@type": "PostalAddress",
                addressLocality: realisation.ville,
                addressRegion: "Haut-Rhin",
                addressCountry: "FR",
              },
            },
            creator: {
              "@type": "HomeAndConstructionBusiness",
              "@id": "https://aiman-renovation.fr/#organization",
              name: "Aiman Renovation",
            },
            about: {
              "@type": "Service",
              name: realisation.type_chantier,
              provider: { "@id": "https://aiman-renovation.fr/#organization" },
            },
          }).replace(/</g, "\\u003c"),
        }}
      />

      <CtaBanner />
    </>
  );
}

function PhotoGallerySection({
  titre,
  photos,
  accentClass,
}: {
  titre: string;
  photos: string[];
  accentClass: string;
}) {
  if (!photos || photos.length === 0) return null;

  return (
    <div>
      <h2 className={`text-lg font-semibold mb-4 ${accentClass}`}>{titre}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((url, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-[#E50000]/30 transition-colors"
          >
            <Image
              src={url}
              alt={`${titre} — photo ${i + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
