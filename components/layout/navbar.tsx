"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS, CTA_LINK } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/40 backdrop-blur-xl py-2" : "bg-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center"
        >
          <Image src="/logo/logo-white.png" alt="Aiman Renovation" width={140} height={44} className="h-auto" priority />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors relative pb-1",
                  isActive
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#E50000] after:rounded-full"
                    : "text-white/80 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href={CTA_LINK.href} className={cn(buttonVariants(), "bg-red hover:bg-red-dark text-white rounded-md px-6")}>
            {CTA_LINK.label}
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex flex-col gap-[5px] p-2" aria-label="Menu">
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 mt-3">
          <div className="flex flex-col px-6 py-4 gap-4">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-lg transition-colors",
                    isActive
                      ? "text-white border-l-2 border-[#E50000] pl-3"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href={CTA_LINK.href} onClick={() => setMobileOpen(false)} className={cn(buttonVariants(), "bg-red hover:bg-red-dark text-white w-full mt-2")}>
              {CTA_LINK.label}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
