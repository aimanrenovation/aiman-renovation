// Service Worker — Espace Employés Aiman Rénovation
const CACHE_VERSION = "employes-v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const OFFLINE_URL = "/employes-offline.html";

// Shell to pre-cache on install
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/favicon.png",
  "/logo/logo-white.png",
  "/employes-manifest.webmanifest",
];

// ── IndexedDB helpers for offline queue ──────────────────────────────
function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("employes-offline-queue", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("requests")) {
        db.createObjectStore("requests", { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function enqueueRequest(url, options) {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("requests", "readwrite");
    tx.objectStore("requests").add({
      url,
      method: options.method || "POST",
      headers: Object.fromEntries(new Headers(options.headers || {}).entries()),
      body: options.body || null,
      timestamp: Date.now(),
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function replayQueue() {
  const db = await openOfflineDB();
  const items = await new Promise((resolve, reject) => {
    const tx = db.transaction("requests", "readonly");
    const req = tx.objectStore("requests").getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  if (items.length === 0) return;

  for (const item of items) {
    try {
      await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
      });
      // Remove from queue on success
      const delTx = db.transaction("requests", "readwrite");
      delTx.objectStore("requests").delete(item.id);
      await new Promise((r) => { delTx.oncomplete = r; });
    } catch {
      // Still offline — stop replaying, will retry later
      break;
    }
  }

  // Notify all clients that sync completed
  const clients = await self.clients.matchAll({ type: "window" });
  for (const client of clients) {
    client.postMessage({ type: "OFFLINE_SYNC_COMPLETE" });
  }
}

// ── Install ──────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ── Activate — clean old caches ──────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // POST requests to pointage/rapport APIs — queue if offline
  if (
    request.method === "POST" &&
    (url.pathname.startsWith("/api/employes/pointage") ||
      url.pathname.startsWith("/api/employes/rapports"))
  ) {
    event.respondWith(
      fetch(request.clone()).catch(async () => {
        const body = await request.clone().text();
        const headers = Object.fromEntries(request.headers.entries());
        await enqueueRequest(request.url, { method: "POST", headers, body });
        return new Response(
          JSON.stringify({ queued: true, message: "Sauvegardé hors ligne" }),
          {
            status: 202,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // API calls (GET) — network-first
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (_next/static, images, fonts) — cache-first
  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
            return res;
          })
      )
    );
    return;
  }

  // HTML pages under /espace-employes/ — network-first with offline fallback
  if (url.pathname.startsWith("/espace-employes")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }
});

// ── Background Sync ──────────────────────────────────────────────────
self.addEventListener("sync", (event) => {
  if (event.tag === "employes-offline-sync") {
    event.waitUntil(replayQueue());
  }
});

// ── Message handler (manual sync trigger) ────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data === "REPLAY_QUEUE") {
    event.waitUntil(replayQueue());
  }
});
