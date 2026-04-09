import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { getEmployeSession } from "@/lib/auth/session";
import { CGU_CURRENT_VERSION } from "@/lib/employes/cgu-version";
import { CguAcceptForm } from "@/components/employes/cgu-accept-form";

export const dynamic = "force-dynamic";

export default async function CguPage() {
  const session = await getEmployeSession();
  if (!session) redirect("/espace-employes/login");

  const [employe] = await db
    .select({
      cguAcceptedAt: schema.employes.cguAcceptedAt,
      cguVersion: schema.employes.cguVersion,
    })
    .from(schema.employes)
    .where(eq(schema.employes.id, session.sub))
    .limit(1);

  const upToDate = employe?.cguAcceptedAt && employe.cguVersion === CGU_CURRENT_VERSION;
  if (upToDate) redirect("/espace-employes/dashboard");

  return (
    <article className="prose prose-sm max-w-none">
      <h1 className="text-xl font-bold">Conditions d&apos;utilisation — Espace équipe</h1>
      <p className="text-xs text-neutral-500">
        Version {CGU_CURRENT_VERSION} — Aiman Rénovation
      </p>

      <h2 className="mt-6 text-base font-semibold">1. Données collectées</h2>
      <p>
        L&apos;espace équipe collecte : identité (nom, email, téléphone), heures de pointage,
        position GPS au moment du pointage, rapports journaliers, photos de chantier et demandes
        de matériel.
      </p>

      <h2 className="mt-4 text-base font-semibold">2. Finalités</h2>
      <ul>
        <li>Calcul des heures travaillées et préparation de la paie</li>
        <li>Suivi de rentabilité et de planning des chantiers</li>
        <li>Communication interne et gestion du matériel</li>
        <li>Utilisation des photos pour la communication de l&apos;entreprise</li>
      </ul>

      <h2 className="mt-4 text-base font-semibold">3. Géolocalisation</h2>
      <p>
        Au moment du pointage, votre position GPS est enregistrée afin de vérifier votre présence
        sur le chantier. Vous pouvez refuser, mais votre pointage sera marqué « sans géolocalisation »
        et signalé à votre responsable.
      </p>

      <h2 className="mt-4 text-base font-semibold">4. Durée de conservation</h2>
      <p>
        Les données sont conservées pendant 5 ans après la fin de votre contrat (durée légale pour
        les fiches de paie et documents RH).
      </p>

      <h2 className="mt-4 text-base font-semibold">5. Vos droits (RGPD)</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et de
        portabilité sur vos données. Contactez : <strong>contact@aiman-renovation.fr</strong>.
      </p>

      <h2 className="mt-4 text-base font-semibold">6. Responsable de traitement</h2>
      <p>Aiman Rénovation SAS, siège social, représentée par son gérant.</p>

      <div className="mt-8">
        <CguAcceptForm />
      </div>
    </article>
  );
}
