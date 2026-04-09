/**
 * DB-backed challenge store for WebAuthn — works in serverless (Vercel).
 * Each challenge is one-time use with a 5-minute TTL.
 * Expired challenges are cleaned up on every call (no cron needed).
 */

import { eq, lt } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";

const TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Cleanup expired challenges (best-effort, non-blocking) */
async function cleanupExpired(): Promise<void> {
  try {
    await db
      .delete(schema.webauthnChallenges)
      .where(lt(schema.webauthnChallenges.expiresAt, new Date()));
  } catch {
    // Ignore cleanup errors — not critical
  }
}

export async function setChallenge(key: string, challenge: string): Promise<void> {
  const expiresAt = new Date(Date.now() + TTL_MS);

  // Upsert: if key already exists (e.g. user retried), overwrite
  await db
    .insert(schema.webauthnChallenges)
    .values({ key, challenge, expiresAt })
    .onConflictDoUpdate({
      target: schema.webauthnChallenges.key,
      set: { challenge, expiresAt },
    });

  // Fire-and-forget cleanup of expired entries
  void cleanupExpired();
}

export async function getChallenge(key: string): Promise<string | null> {
  const [row] = await db
    .select()
    .from(schema.webauthnChallenges)
    .where(eq(schema.webauthnChallenges.key, key))
    .limit(1);

  if (!row) return null;

  // Delete immediately (one-time use)
  await db
    .delete(schema.webauthnChallenges)
    .where(eq(schema.webauthnChallenges.key, key));

  // Check expiry
  if (new Date() > row.expiresAt) return null;

  // Fire-and-forget cleanup of other expired entries
  void cleanupExpired();

  return row.challenge;
}
