import Link from "next/link";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { BottomNav } from "@/components/employes/bottom-nav";
import { ToastContainer } from "@/components/employes/toast";
import { PwaRegister } from "@/components/employes/pwa-register";
import { PwaInstallTuto } from "@/components/employes/pwa-install-tuto";
import { InactivityGuard } from "@/components/employes/inactivity-guard";
import { NightModeProvider } from "@/components/employes/night-mode-provider";
import { OfflineIndicator } from "@/components/employes/offline-indicator";
import { CallPatronFab } from "@/components/employes/call-patron-fab";
import { PlanningNotifier } from "@/components/employes/planning-notifier";
import { PushPermission } from "@/components/employes/push-permission";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { getEmployeSession } from "@/lib/auth/session";
import { EmployeAvatar } from "@/components/employes/avatar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Espace équipe — Aiman Rénovation",
  robots: { index: false, follow: false },
  manifest: "/employes-manifest.webmanifest",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default async function EmployesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getEmployeSession();

  // Pas de session = login/reset → plein écran sans chrome
  if (!session) {
    return <div className="min-h-dvh font-sans">{children}</div>;
  }

  const [employe] = await db
    .select({
      firstname: schema.employes.firstname,
      lastname: schema.employes.lastname,
      avatarUrl: schema.employes.avatarUrl,
    })
    .from(schema.employes)
    .where(eq(schema.employes.id, session.sub))
    .limit(1);

  return (
    <div className="min-h-dvh bg-neutral-50 font-sans text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-700 dark:bg-neutral-800/90">
          <Link
            href="/espace-employes/dashboard"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            {employe ? (
              <>
                <EmployeAvatar
                  firstname={employe.firstname}
                  lastname={employe.lastname}
                  avatarUrl={employe.avatarUrl}
                  size={28}
                />
                <span>{employe.firstname}</span>
              </>
            ) : (
              <>
                <span className="text-[#E50000]">Aiman</span> · Équipe
              </>
            )}
          </Link>
          <div className="flex items-center gap-2">
            <NightModeProvider />
            <form action="/api/employes/auth/logout" method="post">
              <button
                type="submit"
                className="text-xs font-medium text-neutral-500 underline-offset-2 hover:underline dark:text-neutral-400"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </header>

        <OfflineIndicator />

        <main className="flex-1 px-4 pb-24 pt-4">{children}</main>

        <ToastContainer />
        <PwaRegister />
        <PwaInstallTuto />
        <InactivityGuard />
        <CallPatronFab />
        <PlanningNotifier />
        <PushPermission />
        <BottomNav />
      </div>
    </div>
  );
}
