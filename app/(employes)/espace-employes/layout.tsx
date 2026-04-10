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
import { getEmployeSession } from "@/lib/auth/session";

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

export default async function EmployesLayout({ children }: { children: ReactNode }) {
  const session = await getEmployeSession();

  // Pas de session = login/reset → plein écran sans chrome
  if (!session) {
    return (
      <div className="min-h-dvh font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-50 font-sans text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-700 dark:bg-neutral-800/90">
          <Link href="/espace-employes/dashboard" className="text-sm font-semibold tracking-tight">
            <span className="text-[#E50000]">Aiman</span> · Équipe
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
        <BottomNav />
      </div>
    </div>
  );
}
