"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Home, MessageCircle, Timer, User, Zap } from "lucide-react";

const TABS = [
  { href: "/espace-employes/dashboard", label: "Accueil", icon: Home, badgeKey: null },
  { href: "/espace-employes/pointage", label: "Pointage", icon: Timer, badgeKey: null },
  { href: "/espace-employes/missions", label: "Missions", icon: Zap, badgeKey: "openMissions" as const },
  { href: "/espace-employes/messages", label: "Messages", icon: MessageCircle, badgeKey: "unreadMessages" as const },
  { href: "/espace-employes/profil", label: "Profil", icon: User, badgeKey: null },
] as const;

type BadgeKey = "unreadMessages" | "openMissions";

interface Badges {
  unreadMessages: number;
  openMissions: number;
}

const POLL_INTERVAL = 30_000;

export function BottomNav() {
  const pathname = usePathname();
  const [badges, setBadges] = useState<Badges>({ unreadMessages: 0, openMissions: 0 });

  const fetchBadges = useCallback(async () => {
    try {
      const res = await fetch("/api/employes/me/badges");
      if (res.ok) {
        const data = await res.json();
        setBadges({ unreadMessages: data.unreadMessages ?? 0, openMissions: data.openMissions ?? 0 });
      }
    } catch {
      // silently ignore network errors
    }
  }, []);

  useEffect(() => {
    fetchBadges();
    const id = setInterval(fetchBadges, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchBadges]);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md border-t border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95">
      {TABS.map(({ href, label, icon: Icon, badgeKey }) => {
        const active = pathname?.startsWith(href);
        const badgeCount = badgeKey ? badges[badgeKey] : 0;
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
              active ? "text-[#E50000] dark:text-[#E50000]" : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            <span className="relative">
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
              {badgeCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E50000] text-[9px] font-bold leading-none text-white">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
