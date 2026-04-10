"use client";

import { Phone } from "lucide-react";

export function CallPatronFab() {
  return (
    <a
      href="tel:0633496925"
      aria-label="Appeler le patron"
      className="fixed bottom-[5.5rem] right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#E50000] text-white shadow-lg shadow-red-500/30 transition-transform active:scale-95"
    >
      <Phone className="h-5 w-5" />
    </a>
  );
}
