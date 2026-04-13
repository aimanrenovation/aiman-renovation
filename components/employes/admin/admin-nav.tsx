"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Building2,
  Download,
  CalendarOff,
  Zap,
  ArrowLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/espace-employes/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/espace-employes/admin/employes", label: "Employes", icon: Users },
  { href: "/espace-employes/admin/planning", label: "Planning", icon: CalendarDays },
  { href: "/espace-employes/admin/absences", label: "Absences", icon: CalendarOff },
  { href: "/espace-employes/admin/missions", label: "Missions urgentes", icon: Zap },
  { href: "/espace-employes/admin/chantiers", label: "Chantiers", icon: Building2 },
  { href: "/espace-employes/admin/export", label: "Export", icon: Download },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      <Link
        href="/espace-employes/dashboard"
        className="mb-3 flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour espace employe
      </Link>
      <div className="mb-4 px-2">
        <h2 className="text-lg font-bold text-white">
          <span className="text-red-500">Admin</span> Panel
        </h2>
      </div>
      {NAV_ITEMS.map(({ href, label, icon: Icon, ...rest }) => {
        const exact = "exact" in rest && rest.exact;
        const active = exact ? pathname === href : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-red-600/20 text-red-400"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile top bar for admin — shown on small screens */
export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto pb-2 lg:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon, ...rest }) => {
        const exact = "exact" in rest && rest.exact;
        const active = exact ? pathname === href : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              active
                ? "bg-red-600/20 text-red-400"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
