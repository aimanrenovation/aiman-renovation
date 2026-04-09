import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/employes/bottom-nav";
import { getEmployeSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Espace équipe — Aiman Rénovation",
  robots: { index: false, follow: false },
};

export default async function EmployesLayout({ children }: { children: ReactNode }) {
  const session = await getEmployeSession();

  return (
    <div className="min-h-dvh bg-neutral-50 font-sans text-neutral-900">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur">
          <Link href="/espace-employes/dashboard" className="text-sm font-semibold tracking-tight">
            <span className="text-[#E50000]">Aiman</span> · Équipe
          </Link>
          {session && (
            <form action="/api/employes/auth/logout" method="post">
              <button
                type="submit"
                className="text-xs font-medium text-neutral-500 underline-offset-2 hover:underline"
              >
                Déconnexion
              </button>
            </form>
          )}
        </header>

        <main className="flex-1 px-4 pb-24 pt-4">{children}</main>

        {session && <BottomNav />}
      </div>
    </div>
  );
}
