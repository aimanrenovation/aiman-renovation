"use client";

import { useEffect, useRef, useState } from "react";
import { showToast } from "@/lib/employes/use-toast";
import { attachOnlineListener } from "@/lib/employes/offline-queue";

export function PwaRegister() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const deferredPrompt = useRef<any>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const cleanup = attachOnlineListener();

    // Register SW
    navigator.serviceWorker
      .register("/employes-sw.js", { scope: "/espace-employes/" })
      .then((reg) => {
        // Check for updates
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New version available
              showToast("Nouvelle version disponible — Tap pour mettre à jour", "info");
              // Listen for clicks to activate new SW
              const handleClick = () => {
                newWorker.postMessage("SKIP_WAITING");
                window.location.reload();
                document.removeEventListener("click", handleClick);
              };
              document.addEventListener("click", handleClick, { once: true });
            }
          });
        });
      })
      .catch((err) => {
        console.error("SW registration failed:", err);
      });

    // Install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      cleanup();
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const result = await deferredPrompt.current.userChoice;
    if (result.outcome === "accepted") {
      showToast("Application installée !", "success");
    }
    deferredPrompt.current = null;
    setShowInstallBanner(false);
    setInstallPrompt(null);
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+5rem)]">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-neutral-900 px-4 py-3 shadow-lg">
        <span className="text-sm font-medium text-white">
          Installer l&apos;app
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={dismissBanner}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
          >
            Plus tard
          </button>
          <button
            onClick={handleInstall}
            className="rounded-lg bg-[#E50000] px-4 py-1.5 text-xs font-semibold text-white"
          >
            Installer
          </button>
        </div>
      </div>
    </div>
  );
}
