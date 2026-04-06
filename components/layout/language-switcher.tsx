"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";

const FLAGS: Record<string, { label: string; flag: React.ReactNode }> = {
  fr: {
    label: "Fran\u00e7ais",
    flag: (
      <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="7" height="14" fill="#002B7F" />
        <rect x="7" width="6" height="14" fill="#FFFFFF" />
        <rect x="13" width="7" height="14" fill="#CE1126" />
      </svg>
    ),
  },
  de: {
    label: "Deutsch",
    flag: (
      <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* German half (left) */}
        <clipPath id="de-left">
          <polygon points="0,0 20,0 0,14" />
        </clipPath>
        <g clipPath="url(#de-left)">
          <rect width="20" height="4.67" fill="#000000" />
          <rect y="4.67" width="20" height="4.67" fill="#DD0000" />
          <rect y="9.33" width="20" height="4.67" fill="#FFCC00" />
        </g>
        {/* Swiss half (right) */}
        <clipPath id="de-right">
          <polygon points="20,0 20,14 0,14" />
        </clipPath>
        <g clipPath="url(#de-right)">
          <rect width="20" height="14" fill="#D52B1E" />
          <rect x="8.5" y="3.5" width="3" height="7" fill="#FFFFFF" />
          <rect x="6.5" y="5.5" width="7" height="3" fill="#FFFFFF" />
        </g>
      </svg>
    ),
  },
  en: {
    label: "English",
    flag: (
      <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="14" fill="#012169" />
        <path d="M0 0L20 14M20 0L0 14" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M0 0L20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.2" />
        <path d="M10 0V14M0 7H20" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M10 0V14M0 7H20" stroke="#C8102E" strokeWidth="2.2" />
      </svg>
    ),
  },
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(newLocale: string) {
    setOpen(false);
    router.replace(pathname, { locale: newLocale });
  }

  const current = FLAGS[locale] ?? FLAGS.fr;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        aria-label="Change language"
      >
        {current.flag}
        <span className="text-xs text-white/80 uppercase">{locale}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden min-w-[140px] shadow-xl z-50">
          {routing.locales.map((loc) => {
            const item = FLAGS[loc];
            if (!item) return null;
            const isActive = loc === locale;
            return (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-left text-sm transition-colors ${
                  isActive ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.flag}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
