"use client";

import { showToast } from "@/lib/employes/use-toast";

// ── IndexedDB helpers ────────────────────────────────────────────────
const DB_NAME = "employes-offline-queue";
const STORE = "requests";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export interface QueuedRequest {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  timestamp: number;
}

export async function enqueueOfflineRequest(
  url: string,
  init: RequestInit
): Promise<void> {
  const db = await openDB();
  const headers: Record<string, string> = {};
  new Headers(init.headers).forEach((v, k) => {
    headers[k] = v;
  });
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add({
      url,
      method: init.method || "POST",
      headers,
      body: typeof init.body === "string" ? init.body : null,
      timestamp: Date.now(),
    } satisfies Omit<QueuedRequest, "id">);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function replayOfflineQueue(): Promise<void> {
  const db = await openDB();
  const items: QueuedRequest[] = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  if (items.length === 0) return;

  let replayed = 0;

  for (const item of items) {
    try {
      await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
      });
      // Delete from queue on success
      const delTx = db.transaction(STORE, "readwrite");
      delTx.objectStore(STORE).delete(item.id!);
      await new Promise<void>((r) => {
        delTx.oncomplete = () => r();
      });
      replayed++;
    } catch {
      // Still offline — stop replaying
      break;
    }
  }

  if (replayed > 0) {
    showToast("Données synchronisées !", "success");
  }
}

export async function getQueueCount(): Promise<number> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return 0;
  }
}

// ── Network listener — auto-replay when back online ──────────────────
let listenerAttached = false;

export function attachOnlineListener(): () => void {
  if (listenerAttached || typeof window === "undefined") return () => {};
  listenerAttached = true;

  const handler = () => {
    replayOfflineQueue();
  };

  window.addEventListener("online", handler);

  // Also listen for SW messages about sync completion
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "OFFLINE_SYNC_COMPLETE") {
        showToast("Données synchronisées !", "success");
      }
    });
  }

  return () => {
    window.removeEventListener("online", handler);
    listenerAttached = false;
  };
}
