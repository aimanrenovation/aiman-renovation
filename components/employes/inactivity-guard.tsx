"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes
const EVENTS = ["mousedown", "keydown", "touchstart", "scroll"] as const;

export function InactivityGuard() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/employes/auth/logout", { method: "POST" });
    } catch {}
    router.replace("/espace-employes/login?reason=inactivity");
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, INACTIVITY_MS);
  }, [logout]);

  useEffect(() => {
    resetTimer();
    for (const evt of EVENTS) {
      window.addEventListener(evt, resetTimer, { passive: true });
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const evt of EVENTS) {
        window.removeEventListener(evt, resetTimer);
      }
    };
  }, [resetTimer]);

  return null;
}
