"use client";

import { useState, useEffect } from "react";
import { Leaf, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "popup-jardin-dismissed";
const DISMISS_DAYS = 7;

function isGardenSeason(): boolean {
  const month = new Date().getMonth();
  return month === 3 || month === 4; // April or May
}

function wasDismissedRecently(): boolean {
  if (typeof window === "undefined") return true;
  const dismissed = localStorage.getItem(STORAGE_KEY);
  if (!dismissed) return false;
  const diff = Date.now() - Number(dismissed);
  return diff < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function SeasonalPopup() {
  const t = useTranslations("popup_jardin");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isGardenSeason() || wasDismissedRecently()) return;

    function onScroll() {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.35) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 text-center relative shadow-2xl">
        {/* Close button — padded for 44px touch target */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-2 right-2 p-2.5 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <Leaf className="w-8 h-8 text-green-400" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-3">{t("title")}</h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-8">{t("subtitle")}</p>

        {/* CTA */}
        <Link
          href="/devis?reset=1&zone=jardin&work=entretien-jardin"
          onClick={dismiss}
          className="block w-full bg-[#E50000] hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          {t("cta")}
        </Link>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="mt-4 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          {t("dismiss")}
        </button>

        {/* Mention */}
        <p className="mt-6 text-gray-600 text-xs">{t("mention")}</p>
      </div>
    </div>
  );
}
