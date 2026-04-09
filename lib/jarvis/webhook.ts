import { createHmac } from "node:crypto";
import { after } from "next/server";

export type JarvisEventType =
  | "pointage.start"
  | "pointage.stop"
  | "pointage.off_site"
  | "rapport.created"
  | "photo.uploaded"
  | "materiel.requested"
  | "message.sent";

export interface JarvisEventPayload {
  type: JarvisEventType;
  employe_id: string;
  employe_nom?: string;
  chantier_id: string;
  chantier_nom?: string;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Fire-and-forget dispatch to the Super Jarvis webhook.
 * Uses Next.js `after()` so the HTTP response to the employee is not blocked.
 * Signs the body with HMAC-SHA256 using EMPLOYES_WEBHOOK_SECRET.
 */
export function dispatchJarvisEvent(payload: JarvisEventPayload): void {
  const url = process.env.EMPLOYES_WEBHOOK_URL;
  const secret = process.env.EMPLOYES_WEBHOOK_SECRET;

  if (!url || !secret) {
    console.warn("[jarvis] webhook env vars missing, skipping dispatch");
    return;
  }

  const body = JSON.stringify(payload);
  const signature = createHmac("sha256", secret).update(body).digest("hex");

  after(async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Jarvis-Signature": `sha256=${signature}`,
          "X-Jarvis-Event-Type": payload.type,
        },
        body,
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        console.warn(`[jarvis] webhook ${payload.type} failed: ${res.status}`);
      }
    } catch (err) {
      console.warn(`[jarvis] webhook ${payload.type} error:`, err);
    }
  });
}
