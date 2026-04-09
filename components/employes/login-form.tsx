"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";
import { showToast } from "@/lib/employes/use-toast";

function IconMail() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-neutral-500">
      <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
      <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-neutral-500">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
  );
}

function IconFingerprint() {
  return (
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
  );
}

const LAST_EMAIL_KEY = "webauthn-last-email";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [webauthnSupported, setWebauthnSupported] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setWebauthnSupported(
      typeof window !== "undefined" &&
        typeof window.PublicKeyCredential !== "undefined"
    );
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/employes/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        employe?: { cguAccepted?: boolean };
      };
      if (!res.ok || !data.ok) {
        if (data.error === "rate_limited") setError("Trop de tentatives. Réessayez dans 15 min.");
        else setError("Email ou mot de passe incorrect.");
        return;
      }
      // Save email for biometric login next time
      try { localStorage.setItem(LAST_EMAIL_KEY, email); } catch { /* ignore */ }
      // Flag for webauthn registration prompt
      try { sessionStorage.setItem("just-logged-in-password", "1"); } catch { /* ignore */ }
      router.push(data.employe?.cguAccepted ? "/espace-employes/dashboard" : "/espace-employes/cgu");
      router.refresh();
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  async function handleBiometricLogin() {
    setError(null);
    setBiometricLoading(true);
    try {
      // Get email from input or localStorage
      let loginEmail = email;
      if (!loginEmail) {
        try { loginEmail = localStorage.getItem(LAST_EMAIL_KEY) ?? ""; } catch { /* ignore */ }
      }
      if (!loginEmail) {
        setError("Entrez votre email pour utiliser Face ID / Touch ID.");
        return;
      }

      // Get authentication options
      const optionsRes = await fetch("/api/employes/auth/webauthn/login-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail }),
      });
      if (!optionsRes.ok) {
        setError("Impossible de lancer l\u2019authentification biométrique.");
        return;
      }
      const options = await optionsRes.json();

      // Start biometric authentication
      const authResponse = await startAuthentication({ optionsJSON: options });

      // Verify with backend
      const verifyRes = await fetch("/api/employes/auth/webauthn/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, response: authResponse }),
      });
      const data = (await verifyRes.json()) as {
        ok?: boolean;
        error?: string;
        employe?: { cguAccepted?: boolean };
      };

      if (!verifyRes.ok || !data.ok) {
        setError("Authentification biométrique échouée.");
        return;
      }

      try { localStorage.setItem(LAST_EMAIL_KEY, loginEmail); } catch { /* ignore */ }
      showToast("Connexion réussie", "success");
      router.push(data.employe?.cguAccepted ? "/espace-employes/dashboard" : "/espace-employes/cgu");
      router.refresh();
    } catch (err) {
      // User cancelled or WebAuthn error
      const message = err instanceof Error ? err.message : "";
      if (message.includes("cancelled") || message.includes("abort")) {
        // User cancelled — do nothing
      } else {
        setError("Authentification biométrique échouée.");
      }
    } finally {
      setBiometricLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      {/* Email */}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <IconMail />
        </span>
        <input
          type="email"
          autoComplete="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-900/80 pl-12 pr-4 text-base text-white placeholder:text-neutral-500 focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/30"
        />
      </div>

      {/* Mot de passe */}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <IconLock />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-900/80 pl-12 pr-11 text-base text-white placeholder:text-neutral-500 focus:border-[#E50000] focus:outline-none focus:ring-2 focus:ring-[#E50000]/30"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-300"
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.092 1.092a4 4 0 0 0-5.558-5.558Z" clipRule="evenodd" />
              <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 4.09 5.12L6.38 7.41a4 4 0 0 0 4.368 6.52Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Mot de passe oublié */}
      <a
        href="/espace-employes/reset-password"
        className="self-end text-xs text-neutral-400 underline-offset-2 hover:text-white hover:underline"
      >
        Mot de passe oublié ?
      </a>

      {/* Erreur */}
      {error && (
        <div className="rounded-lg bg-red-900/40 px-3 py-2 text-sm text-red-300" role="alert">
          {error}
        </div>
      )}

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-12 rounded-xl bg-[#E50000] text-base font-semibold text-white shadow-lg shadow-red-900/30 transition-all hover:bg-[#cc0000] active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Connexion\u2026" : "Se connecter"}
      </button>

      {/* Biometric login */}
      {webauthnSupported && (
        <>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-700" />
            <span className="text-xs text-neutral-500">ou</span>
            <div className="h-px flex-1 bg-neutral-700" />
          </div>

          <button
            type="button"
            disabled={biometricLoading}
            onClick={handleBiometricLogin}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900/80 text-base font-medium text-white transition-all hover:border-neutral-500 active:scale-[0.98] disabled:opacity-60"
          >
            <IconFingerprint />
            {biometricLoading ? "Vérification\u2026" : "Se connecter avec Face ID"}
          </button>
        </>
      )}
    </form>
  );
}
