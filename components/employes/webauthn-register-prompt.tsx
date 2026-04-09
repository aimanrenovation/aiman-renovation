"use client";
import { useState, useEffect } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { showToast } from "@/lib/employes/use-toast";

const DISMISS_KEY_PREFIX = "webauthn-dismissed-";

function isDismissed(): boolean {
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(DISMISS_KEY_PREFIX)) {
        const dismissDate = new Date(key.replace(DISMISS_KEY_PREFIX, ""));
        if (!isNaN(dismissDate.getTime())) {
          const daysSince = (Date.now() - dismissDate.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSince < 7) return true;
        }
      }
    }
  } catch { /* ignore */ }
  return false;
}

function dismiss() {
  try {
    // Clean old dismiss keys
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(DISMISS_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    localStorage.setItem(`${DISMISS_KEY_PREFIX}${new Date().toISOString().slice(0, 10)}`, "1");
  } catch { /* ignore */ }
}

export function WebAuthnRegisterPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show if:
    // 1. Just logged in with password (sessionStorage flag)
    // 2. Browser supports WebAuthn
    // 3. Not dismissed recently
    const justLoggedIn = sessionStorage.getItem("just-logged-in-password") === "1";
    const supportsWebAuthn =
      typeof window !== "undefined" && typeof window.PublicKeyCredential !== "undefined";

    if (justLoggedIn && supportsWebAuthn && !isDismissed()) {
      // Clear the flag so it only shows once per login
      sessionStorage.removeItem("just-logged-in-password");
      setVisible(true);
    } else if (justLoggedIn) {
      sessionStorage.removeItem("just-logged-in-password");
    }
  }, []);

  async function handleActivate() {
    setLoading(true);
    try {
      // Get registration options
      const optionsRes = await fetch("/api/employes/auth/webauthn/register-options");
      if (!optionsRes.ok) {
        showToast("Erreur lors de la configuration biométrique.", "error");
        return;
      }
      const options = await optionsRes.json();

      // Start WebAuthn registration
      const regResponse = await startRegistration({ optionsJSON: options });

      // Send to server
      const verifyRes = await fetch("/api/employes/auth/webauthn/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: regResponse,
          deviceName: navigator.userAgent.includes("iPhone")
            ? "iPhone"
            : navigator.userAgent.includes("iPad")
              ? "iPad"
              : navigator.userAgent.includes("Android")
                ? "Android"
                : "Appareil",
        }),
      });

      const data = await verifyRes.json();
      if (!verifyRes.ok || !data.ok) {
        showToast("Erreur lors de l\u2019enregistrement biométrique.", "error");
        return;
      }

      showToast("Face ID / Touch ID activé !", "success");
      setVisible(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (!message.includes("cancelled") && !message.includes("abort")) {
        showToast("Erreur lors de l\u2019enregistrement biométrique.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDismiss() {
    dismiss();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E50000]/10 text-[#E50000]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
            <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
            <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
            <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
            <path d="M2 12a10 10 0 0 1 18-6" />
            <path d="M2 16h.01" />
            <path d="M21.8 16c.2-2 .131-5.354 0-6" />
            <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
            <path d="M8.65 22c.21-.66.45-1.32.57-2" />
            <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-900">Activer Face ID / Touch ID ?</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Connectez-vous plus rapidement la prochaine fois.
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={handleActivate}
          className="flex-1 rounded-xl bg-[#E50000] px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#cc0000] active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Activation\u2026" : "Activer"}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="flex-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50 active:scale-[0.98]"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
