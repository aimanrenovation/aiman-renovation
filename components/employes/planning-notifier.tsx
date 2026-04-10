"use client";

import { useEffect, useRef } from "react";
import { showToast } from "@/lib/employes/use-toast";

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return hash.toString(36);
}

export function PlanningNotifier() {
  const initialised = useRef(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    async function check() {
      try {
        const res = await fetch("/api/employes/planning");
        if (!res.ok) return;
        const data = await res.json();
        const body = JSON.stringify(data);
        const hash = simpleHash(body);
        const today = new Date().toISOString().slice(0, 10);
        const key = `planning-hash-${today}`;
        const prev = localStorage.getItem(key);

        if (!initialised.current) {
          // First run: store hash, don't notify
          localStorage.setItem(key, hash);
          initialised.current = true;
          return;
        }

        if (prev && prev !== hash) {
          showToast("Planning modifié — vérifiez vos missions", "info");
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(200);
          }
        }
        localStorage.setItem(key, hash);
      } catch {
        // ignore polling errors
      }
    }

    // Initial check
    check();

    // Poll every 60 seconds
    timer = setInterval(check, 60_000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  return null;
}
