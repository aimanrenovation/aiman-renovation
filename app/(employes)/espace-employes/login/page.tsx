import { redirect } from "next/navigation";
import Image from "next/image";
import { LoginForm } from "@/components/employes/login-form";
import { getEmployeSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getEmployeSession();
  if (session) redirect("/espace-employes/dashboard");

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-[#111] px-6">
      {/* Background chantier flouté */}
      <Image
        src="/images/ambiance-chantier.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-20 blur-sm"
        aria-hidden="true"
      />

      {/* Contenu */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center animate-in fade-in duration-700">
        {/* Logo */}
        <Image
          src="/logo/logo-white.png"
          alt="Aiman Rénovation"
          width={180}
          height={60}
          className="mb-8"
          priority
        />

        <h1 className="mb-2 text-xl font-bold tracking-tight text-white">Espace équipe</h1>
        <p className="mb-8 text-sm text-neutral-400">Connectez-vous pour démarrer votre journée.</p>

        <LoginForm />

        <p className="mt-10 text-center text-xs text-neutral-500">
          Espace réservé à l'équipe AIMAN RENOVATION
        </p>
      </div>
    </div>
  );
}
