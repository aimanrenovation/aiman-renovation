"use client";

import { useState, useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { X } from "lucide-react";

const DISMISSED_KEY = "trust-bar-dismissed";

export function FloatingTrustBar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const lastScrollY = useRef(0);

  // Hide on employee pages
  const isEmployeePage = pathname.startsWith("/espace-employes");

  // Check localStorage once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");
    }
  }, []);

  useEffect(() => {
    if (isEmployeePage || dismissed) return;

    // Small initial delay so the bar doesn't flash on page load
    const initTimer = setTimeout(() => {
      setShow(true);
    }, 1500);

    function handleScroll() {
      const currentY = window.scrollY;
      if (currentY < 100) {
        // Near top — always show
        setShow(true);
      } else if (currentY < lastScrollY.current) {
        // Scrolling up
        setShow(true);
      } else {
        // Scrolling down
        setShow(false);
      }
      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isEmployeePage, dismissed]);

  function handleDismiss() {
    setDismissed(true);
    setShow(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISSED_KEY, "1");
    }
  }

  if (isEmployeePage || dismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Trust text */}
          <div className="flex-1 min-w-0">
            <p className="text-zinc-700 text-xs sm:text-sm leading-snug">
              <span className="text-yellow-500">&#9733;</span>{" "}
              <span className="font-semibold">4.9/5</span> sur Google
              <span className="hidden sm:inline">
                {" "}
                &middot; 50+ projets &middot; Devis gratuit en 48h
              </span>
              <span className="sm:hidden block text-zinc-500 text-[11px]">
                50+ projets &middot; Devis gratuit en 48h
              </span>
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/devis"
            className="shrink-0 bg-[#E50000] hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Demander un devis
          </Link>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            aria-label="Fermer"
            className="shrink-0 p-1 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
