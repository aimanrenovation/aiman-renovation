"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, CalendarX2, ClipboardList, Home, MessageCircle, Timer, Zap } from "lucide-react";

const TABS = [
  { href: "/espace-employes/dashboard", label: "Accueil", icon: Home },
  { href: "/espace-employes/planning", label: "Planning", icon: CalendarDays },
  { href: "/espace-employes/pointage", label: "Pointage", icon: Timer },
  { href: "/espace-employes/missions", label: "Missions", icon: Zap },
  { href: "/espace-employes/rapport", label: "Rapport", icon: ClipboardList },
  { href: "/espace-employes/absences", label: "Absences", icon: CalendarX2 },
  { href: "/espace-employes/messages", label: "Messages", icon: MessageCircle },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md border-t border-neutral-200 bg-white/95 backdrop-blur">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
              active ? "text-[#E50000]" : "text-neutral-500"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
