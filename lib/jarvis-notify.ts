/**
 * Send a notification to Jarvis webhook.
 * Non-blocking: failures are logged but don't throw.
 */

type JarvisNotificationType =
  | "devis_received"
  | "candidature_received"
  | "magicplan_received"
  | "magicplan_upload_client"
  | "contact_received";

interface JarvisNotification {
  type: JarvisNotificationType;
  [key: string]: unknown;
}

export async function notifyJarvis(payload: JarvisNotification): Promise<void> {
  const url = (process.env.JARVIS_WEBHOOK_URL || "").trim();
  const secret = (process.env.JARVIS_WEBHOOK_SECRET || "").trim();

  if (!url) {
    console.log("[Jarvis] JARVIS_WEBHOOK_URL not set, skipping notification");
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "x-webhook-secret": secret } : {}),
      },
      body: JSON.stringify(payload),
      // Short timeout to avoid blocking the user
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error(`[Jarvis] Notification failed: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error("[Jarvis] Notification error:", err);
  }
}
