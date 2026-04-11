"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";

const STORAGE_KEY = "exit_popup_dismissed";
const DISMISS_DAYS = 7;
const MOBILE_DELAY_MS = 30_000;

function wasDismissedRecently(): boolean {
  if (typeof window === "undefined") return true;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  return Date.now() - Number(raw) < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function ExitIntentPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }, []);

  useEffect(() => {
    // Don't show on action pages (visitor is already converting)
    const excluded = ["/devis", "/calculateur", "/espace-employes"];
    if (excluded.some((p) => pathname?.startsWith(p))) return;
    if (wasDismissedRecently()) return;

    let fired = false;

    // Desktop: cursor leaves viewport at the top
    function handleMouseOut(e: MouseEvent) {
      if (fired) return;
      if (e.clientY < 0) {
        fired = true;
        setVisible(true);
      }
    }

    // Mobile: fire after 30 seconds
    const mobileTimer = setTimeout(() => {
      if (fired) return;
      // Only fire on mobile (no fine pointer)
      if (window.matchMedia("(pointer: fine)").matches) return;
      fired = true;
      setVisible(true);
    }, MOBILE_DELAY_MS);

    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
      clearTimeout(mobileTimer);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 text-center relative shadow-2xl animate-in slide-in-from-bottom duration-500">
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="absolute top-2 right-2 p-2.5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#E50000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-zinc-900 mb-3">
          Obtenez votre devis gratuit en 2 min
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Cuisine, salle de bain, peinture, facade... Dites-nous votre projet et recevez une estimation sous 48h. Sans engagement.
        </p>

        {/* CTA */}
        <Link
          href="/devis"
          onClick={dismiss}
          className="block w-full bg-[#E50000] hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Demander mon devis gratuit
        </Link>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="mt-4 text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          Non merci, plus tard
        </button>
      </div>
    </div>
  );
}
