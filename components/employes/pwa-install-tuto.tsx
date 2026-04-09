"use client";

import { useEffect, useState } from "react";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function detectOS(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/(iPad|iPhone|iPod)/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

const DISMISS_KEY = "pwa-tuto-dismissed";

export function PwaInstallTuto() {
  const [show, setShow] = useState(false);
  const [os, setOs] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    if (isStandalone()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch { /* ignore */ }

    const detected = detectOS();
    if (detected === "other") return;

    setOs(detected);
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss(remember: boolean) {
    setShow(false);
    if (remember) {
      try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+5rem)] animate-slide-up">
      <div className="rounded-2xl bg-white p-5 shadow-xl border border-neutral-200">
        <h3 className="text-base font-bold text-neutral-900">Installer l&apos;app</h3>

        {os === "ios" ? (
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-neutral-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                </svg>
              </div>
              <p className="text-sm text-neutral-700">
                Tapez le bouton <strong>Partager</strong> en bas de Safari
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-neutral-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <p className="text-sm text-neutral-700">
                Puis <strong>&quot;Sur l&apos;écran d&apos;accueil&quot;</strong>
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-neutral-700">
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="18" r="2" />
                </svg>
              </div>
              <p className="text-sm text-neutral-700">
                Tapez les <strong>3 points ⋮</strong> en haut à droite
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5 text-neutral-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <p className="text-sm text-neutral-700">
                Puis <strong>&quot;Ajouter à l&apos;écran d&apos;accueil&quot;</strong>
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-neutral-500">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#E50000]"
              onChange={(e) => {
                if (e.target.checked) {
                  try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
                }
              }}
            />
            Ne plus afficher
          </label>
          <button
            type="button"
            onClick={() => dismiss(false)}
            className="rounded-xl bg-[#E50000] px-5 py-2 text-sm font-semibold text-white"
          >
            Compris !
          </button>
        </div>
      </div>
    </div>
  );
}
