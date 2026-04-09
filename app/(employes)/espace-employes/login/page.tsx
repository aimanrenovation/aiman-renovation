import { redirect } from "next/navigation";
import { LoginForm } from "@/components/employes/login-form";
import { getEmployeSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getEmployeSession();
  if (session) redirect("/espace-employes/dashboard");

  return (
    <div className="flex min-h-[70dvh] flex-col justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Espace équipe</h1>
        <p className="mt-2 text-sm text-neutral-500">Connectez-vous pour démarrer votre journée.</p>
      </div>
      <LoginForm />
    </div>
  );
}
