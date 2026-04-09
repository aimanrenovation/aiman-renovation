"use client";

import { useRouter } from "next/navigation";

export function ErrorRetry() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      {/* Warning icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-[#E50000]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>

      <div>
        <p className="text-base font-semibold text-neutral-800">
          Impossible de charger les données
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Vérifiez votre connexion et réessayez.
        </p>
      </div>

      <button
        type="button"
        onClick={() => router.refresh()}
        className="rounded-2xl bg-[#E50000] px-6 py-3 text-sm font-semibold text-white shadow-sm"
      >
        Réessayer
      </button>
    </div>
  );
}
