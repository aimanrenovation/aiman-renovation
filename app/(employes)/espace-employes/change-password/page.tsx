import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { getEmployeSession } from "@/lib/auth/session";
import { ChangePasswordForm } from "@/components/employes/change-password-form";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const session = await getEmployeSession();
  if (!session) redirect("/espace-employes/login");

  const [employe] = await db
    .select({ passwordMustChange: schema.employes.passwordMustChange, firstname: schema.employes.firstname })
    .from(schema.employes)
    .where(eq(schema.employes.id, session.sub))
    .limit(1);

  if (!employe || !employe.passwordMustChange) {
    redirect("/espace-employes/dashboard");
  }

  return (
    <div className="flex min-h-[70dvh] flex-col justify-center">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold tracking-tight">Changez votre mot de passe</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {employe.firstname}, votre mot de passe provisoire doit être remplacé avant de continuer.
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
