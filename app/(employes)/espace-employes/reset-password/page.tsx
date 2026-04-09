import Image from "next/image";
import { ResetPasswordForm } from "@/components/employes/reset-password-form";
import { NewPasswordForm } from "@/components/employes/new-password-form";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-[#111] px-6">
      <Image
        src="/images/ambiance-resultat.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-20 blur-sm"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center animate-in fade-in duration-700">
        <Image
          src="/logo/logo-white.png"
          alt="Aiman Rénovation"
          width={180}
          height={60}
          className="mb-8"
          priority
        />

        {token ? (
          <>
            <h1 className="mb-2 text-xl font-bold tracking-tight text-white">Nouveau mot de passe</h1>
            <p className="mb-8 text-center text-sm text-neutral-400">
              Choisissez votre nouveau mot de passe.
            </p>
            <NewPasswordForm token={token} />
          </>
        ) : (
          <>
            <h1 className="mb-2 text-xl font-bold tracking-tight text-white">Mot de passe oublié</h1>
            <p className="mb-8 text-center text-sm text-neutral-400">
              Entrez votre email, vous recevrez un lien pour choisir un nouveau mot de passe.
            </p>
            <ResetPasswordForm />
          </>
        )}

        <a
          href="/espace-employes/login"
          className="mt-6 text-xs text-neutral-400 underline-offset-2 hover:text-white hover:underline"
        >
          ← Retour à la connexion
        </a>
      </div>
    </div>
  );
}
