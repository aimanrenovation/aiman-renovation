"use client";

import { Phone } from "lucide-react";

export function CallPatronFab() {
  return (
    <a
      href="tel:0633496925"
      aria-label="Appeler le patron"
      className="fixed bottom-[5.5rem] right-4 z-30 flex items-center gap-2 rounded-full bg-[#E50000] px-4 py-3 text-white shadow-lg shadow-red-500/30 transition-transform active:scale-95"
    >
      <Phone className="h-4 w-4" />
      <span className="text-xs font-semibold">Appeler</span>
    </a>
  );
}
