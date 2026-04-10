"use client";
import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    // Initialise from current state
    setOnline(navigator.onLine);

    function handleOnline() {
      setOnline(true);
      setShowReconnected(true);
    }
    function handleOffline() {
      setOnline(false);
      setShowReconnected(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-hide reconnected banner after 3s
  useEffect(() => {
    if (!showReconnected) return;
    const t = setTimeout(() => setShowReconnected(false), 3000);
    return () => clearTimeout(t);
  }, [showReconnected]);

  if (online && !showReconnected) return null;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white ${
        online ? "bg-green-600" : "bg-[#E50000]"
      }`}
    >
      {online ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" />
          </svg>
          Connexion rétablie
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
          Vous êtes hors ligne
        </>
      )}
    </div>
  );
}
