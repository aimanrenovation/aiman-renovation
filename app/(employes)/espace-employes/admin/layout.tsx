import Link from "next/link";
import type { ReactNode } from "react";
import { AdminNav, AdminMobileNav } from "@/components/employes/admin/admin-nav";
import { requirePatron } from "@/lib/employes/admin-guard";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requirePatron();

  return (
    <div className="min-h-dvh bg-gray-950 font-sans text-white">
      {/* Desktop header */}
      <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/espace-employes/admin" className="text-sm font-semibold tracking-tight">
            <span className="text-red-500">Aiman</span> · Admin
          </Link>
          <Link
            href="/espace-employes/dashboard"
            className="text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-300 hover:underline"
          >
            Retour
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 border-r border-gray-800 p-4 lg:block">
          <AdminNav />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 pb-20 lg:p-6 lg:pb-6">
          <div className="mb-4 lg:hidden">
            <AdminMobileNav />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
