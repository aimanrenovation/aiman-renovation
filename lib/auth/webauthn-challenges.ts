/**
 * Ephemeral in-memory challenge store with 5-minute TTL.
 * Key = employeId, Value = challenge string.
 */

const TTL_MS = 5 * 60 * 1000; // 5 minutes

interface Entry {
  challenge: string;
  expiresAt: number;
}

const store = new Map<string, Entry>();

export function setChallenge(key: string, challenge: string): void {
  store.set(key, { challenge, expiresAt: Date.now() + TTL_MS });
}

export function getChallenge(key: string): string | null {
  const entry = store.get(key);
  if (!entry) return null;
  store.delete(key);
  if (Date.now() > entry.expiresAt) return null;
  return entry.challenge;
}

// Periodic cleanup every 10 minutes
if (typeof globalThis !== "undefined") {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.expiresAt) store.delete(key);
    }
  }, 10 * 60 * 1000);
  // Allow process to exit without waiting for the interval
  if (typeof interval === "object" && "unref" in interval) {
    interval.unref();
  }
}
