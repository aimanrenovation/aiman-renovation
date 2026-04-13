import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/jarvis/carplay
 * Triggered by iOS Shortcut when patron connects to CarPlay.
 * Fetches next Google Calendar event and sends WhatsApp briefing via Jarvis webhook.
 */
export async function POST(request: Request) {
  // Verify the request is from the patron (simple secret token)
  const authHeader = request.headers.get("Authorization");
  const CARPLAY_SECRET = process.env.CARPLAY_SECRET?.trim();

  if (!CARPLAY_SECRET || authHeader !== `Bearer ${CARPLAY_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Forward to Jarvis system with "mode voiture" command
  const JARVIS_API_URL = process.env.JARVIS_API_URL?.trim();
  const JARVIS_API_KEY = process.env.JARVIS_API_KEY?.trim();

  if (!JARVIS_API_URL) {
    // Fallback: send WhatsApp directly via webhook
    const webhookUrl = process.env.EMPLOYES_WEBHOOK_URL?.trim();
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.EMPLOYES_WEBHOOK_SECRET
            ? { "X-Webhook-Secret": process.env.EMPLOYES_WEBHOOK_SECRET }
            : {}),
        },
        body: JSON.stringify({
          type: "carplay_trigger",
          command: "je suis en voiture",
          timestamp: new Date().toISOString(),
        }),
      });
      return NextResponse.json({ ok: true, method: "webhook" });
    }
    return NextResponse.json(
      { error: "jarvis_unavailable" },
      { status: 503 },
    );
  }

  // Call Jarvis API directly
  try {
    const res = await fetch(`${JARVIS_API_URL}/api/v1/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(JARVIS_API_KEY
          ? { Authorization: `Bearer ${JARVIS_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        from: "carplay",
        message: "je suis en voiture",
        mode: "patron",
      }),
    });

    if (!res.ok) {
      console.error(`Jarvis API error: ${res.status}`);
      return NextResponse.json({ error: "jarvis_error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, method: "jarvis_api" });
  } catch (err) {
    console.error("CarPlay trigger error:", err);
    return NextResponse.json({ error: "jarvis_error" }, { status: 502 });
  }
}
