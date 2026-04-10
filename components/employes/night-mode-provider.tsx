"use client";

import { useEffect, useState, useCallback } from "react";

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h >= 20 || h < 6;
}

export function NightModeProvider() {
  const [override, setOverride] = useState<"light" | "dark" | null>(null);

  const apply = useCallback((dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Auto-detect + interval
  useEffect(() => {
    if (override !== null) return;

    apply(isNightTime());

    const id = setInterval(() => {
      apply(isNightTime());
    }, 60_000);

    return () => clearInterval(id);
  }, [override, apply]);

  // Manual override
  useEffect(() => {
    if (override === null) return;
    apply(override === "dark");
  }, [override, apply]);

  const isDark = override !== null ? override === "dark" : isNightTime();

  return (
    <button
      type="button"
      aria-label={isDark ? "Passer en mode jour" : "Passer en mode nuit"}
      onClick={() => {
        if (override === null) {
          // First click: toggle away from auto
          setOverride(isNightTime() ? "light" : "dark");
        } else {
          // Second click: back to auto
          setOverride(null);
        }
      }}
      className="flex items-center justify-center rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
    >
      {isDark ? (
        /* Sun icon */
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        /* Moon icon */
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
