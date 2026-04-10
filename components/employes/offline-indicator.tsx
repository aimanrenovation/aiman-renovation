"use client";
import { useCallback, useEffect, useState } from "react";
import { getQueueCount } from "@/lib/employes/offline-queue";

type NetState = "online" | "offline" | "syncing";

export function OfflineIndicator() {
  const [state, setState] = useState<NetState>("online");
  const [queueCount, setQueueCount] = useState(0);
  const [showConnected, setShowConnected] = useState(false);

  const refreshQueue = useCallback(async () => {
    try {
      const count = await getQueueCount();
      setQueueCount(count);
    } catch {
      // IndexedDB not available
    }
  }, []);

  useEffect(() => {
    setState(navigator.onLine ? "online" : "offline");
    refreshQueue();

    function handleOnline() {
      setState("online");
      setShowConnected(true);
      refreshQueue();
    }

    function handleOffline() {
      setState("offline");
      setShowConnected(false);
      refreshQueue();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for SW sync messages
    function handleSWMessage(event: MessageEvent) {
      if (event.data?.type === "OFFLINE_SYNC_START") {
        setState("syncing");
      }
      if (event.data?.type === "OFFLINE_SYNC_COMPLETE") {
        setState("online");
        setShowConnected(true);
        refreshQueue();
      }
      if (event.data?.type === "OFFLINE_QUEUE_UPDATED") {
        refreshQueue();
      }
    }

    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("message", handleSWMessage);
    }

    // Poll queue count every 3s while mounted (lightweight IDB count)
    const interval = setInterval(refreshQueue, 3000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener("message", handleSWMessage);
      }
      clearInterval(interval);
    };
  }, [refreshQueue]);

  // Auto-hide "Connecté" banner after 2s
  useEffect(() => {
    if (!showConnected) return;
    const t = setTimeout(() => setShowConnected(false), 2000);
    return () => clearTimeout(t);
  }, [showConnected]);

  // Nothing to show: online, no pending items, connected banner hidden
  if (state === "online" && !showConnected && queueCount === 0) return null;

  const bgColor =
    state === "offline"
      ? "bg-[#E50000]"
      : state === "syncing"
        ? "bg-amber-500"
        : "bg-green-600";

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 flex flex-col items-center justify-center gap-0.5 px-4 py-2 text-sm font-medium text-white ${bgColor}`}
    >
      <div className="flex items-center gap-2">
        {state === "offline" && (
          <>
            <WifiOffIcon />
            Hors ligne
          </>
        )}
        {state === "syncing" && (
          <>
            <SyncIcon />
            Synchronisation...
          </>
        )}
        {state === "online" && showConnected && (
          <>
            <WifiIcon />
            Connecté
          </>
        )}
      </div>
      {queueCount > 0 && state !== "syncing" && (
        <div className="text-xs opacity-90">
          {queueCount} action{queueCount > 1 ? "s" : ""} en attente de synchronisation
        </div>
      )}
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────────────── */

function WifiIcon() {
  return (
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
  );
}

function WifiOffIcon() {
  return (
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
  );
}

function SyncIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
