import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat/system-prompt";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { visitorId: string; message: string; conversationId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { visitorId, message, conversationId } = body;
  if (!visitorId || !message?.trim()) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // Check business hours (Europe/Paris)
  const parisHour = new Date().toLocaleString("en-US", { timeZone: "Europe/Paris", hour: "numeric", hour12: false });
  const parisDay = new Date().toLocaleString("en-US", { timeZone: "Europe/Paris", weekday: "short" });
  const hour = parseInt(parisHour, 10);
  const isSunday = parisDay === "Sun";
  const isSaturday = parisDay === "Sat";
  const isOpen = !isSunday && (isSaturday ? (hour >= 9 && hour < 13) : (hour >= 8 && hour < 19));

  // Get or create conversation
  let conversation;
  if (conversationId) {
    const [existing] = await db
      .select()
      .from(schema.chatConversations)
      .where(and(
        eq(schema.chatConversations.id, conversationId),
        eq(schema.chatConversations.visitorId, visitorId),
      ))
      .limit(1);
    conversation = existing;
  }

  if (!conversation) {
    const [created] = await db
      .insert(schema.chatConversations)
      .values({ visitorId, messages: [] })
      .returning();
    conversation = created;
  }

  // Build message history
  const history = (conversation.messages as Array<{role: string; content: string}>) || [];
  history.push({ role: "user", content: message.trim() });

  // If outside business hours: save message but return auto-reply in visitor's language
  if (!isOpen) {
    // Detect language from first user message in conversation
    const firstUserMsg = history.find((m) => m.role === "user")?.content || message;
    const lowerMsg = firstUserMsg.toLowerCase();
    const isDE = /^(hallo|guten|ich |wie |mein|wir |haben|können|möchte|brauche|renovier|badezimmer|küche|fassade)/.test(lowerMsg) || /ä|ö|ü|ß/.test(lowerMsg);
    const isEN = /^(hi|hello|hey|good |i |we |my |how |can |do you|would|could|looking|need|want|bathroom|kitchen)/.test(lowerMsg);

    let offlineMsg: string;
    if (isEN) {
      const nextOpen = isSunday || (isSaturday && hour >= 13) ? "Monday at 8am" : "tomorrow at 8am";
      offlineMsg = `Our office is open Monday to Friday from 8am to 7pm and Saturday from 9am to 1pm. Your message has been saved — we will get back to you ${nextOpen}. For emergencies, call +33 6 33 49 69 25.`;
    } else if (isDE) {
      const nextOpen = isSunday || (isSaturday && hour >= 13) ? "Montag ab 8 Uhr" : "morgen ab 8 Uhr";
      offlineMsg = `Unser Büro ist Montag bis Freitag von 8 bis 19 Uhr und Samstag von 9 bis 13 Uhr geöffnet. Ihre Nachricht wurde gespeichert — wir melden uns ${nextOpen}. Bei Notfällen: +33 6 33 49 69 25.`;
    } else {
      const nextOpen = isSunday || (isSaturday && hour >= 13) ? "lundi dès 8h" : "demain dès 8h";
      offlineMsg = `Nos bureaux sont ouverts du lundi au vendredi de 8h à 19h et le samedi de 9h à 13h. Votre message a bien été enregistré — nous vous répondrons ${nextOpen}. En cas d'urgence, appelez le 06 33 49 69 25.`;
    }
    history.push({ role: "assistant", content: offlineMsg });
    await db
      .update(schema.chatConversations)
      .set({ messages: history, updatedAt: new Date() })
      .where(eq(schema.chatConversations.id, conversation.id));
    return NextResponse.json({
      conversationId: conversation.id,
      message: offlineMsg,
      cta: "appel",
      offline: true,
    });
  }

  // Call Claude API
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "chat_unavailable" }, { status: 503 });
  }

  // Use Claude Haiku for speed + cost efficiency
  const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: CHAT_SYSTEM_PROMPT,
      messages: history.map(m => ({ role: m.role, content: m.content })),
    }),
  });

  if (!claudeResponse.ok) {
    return NextResponse.json({ error: "ai_error" }, { status: 502 });
  }

  const aiResult = await claudeResponse.json();
  const rawContent = aiResult.content?.[0]?.text || "";

  // Parse JSON response from Claude (may be wrapped in ```json ... ```)
  let parsed: {
    message: string;
    qualification?: Record<string, string | null>;
    prospect_chaud?: boolean;
    cta?: string | null;
    budget_interne?: number | null;
  };
  try {
    // Strip markdown code fences if present
    let jsonStr = rawContent.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    parsed = JSON.parse(jsonStr);
    // Ensure message field exists
    if (!parsed.message && typeof parsed === "object") {
      parsed.message = rawContent;
    }
  } catch {
    // If Claude didn't return valid JSON, use raw text
    parsed = { message: rawContent };
  }

  // Add assistant message to history
  history.push({ role: "assistant", content: parsed.message });

  // Update conversation in DB
  const updates: Record<string, unknown> = {
    messages: history,
    updatedAt: new Date(),
  };

  // Merge qualification data
  if (parsed.qualification) {
    const existing = (conversation.qualificationData as Record<string, string | null>) || {};
    const merged = { ...existing };
    for (const [key, val] of Object.entries(parsed.qualification)) {
      if (val) merged[key] = val;
    }
    updates.qualificationData = merged;
  }

  // Smart CTA routing based on budget_interne
  let finalCta = parsed.cta || null;
  if (parsed.budget_interne && !finalCta) {
    if (parsed.budget_interne < 5000) finalCta = "calculateur";
    else if (parsed.budget_interne <= 20000) finalCta = "devis";
    else finalCta = "rdv";
  }

  const isProspectHot = parsed.prospect_chaud || finalCta === "rdv";
  if (isProspectHot) {
    updates.prospectChaud = true;
  }

  await db
    .update(schema.chatConversations)
    .set(updates)
    .where(eq(schema.chatConversations.id, conversation.id));

  // If prospect is hot (>20K or rdv), send webhook to Jarvis
  if (isProspectHot && !conversation.prospectChaud) {
    notifyJarvisProspect(conversation.id, updates.qualificationData, parsed.budget_interne).catch(() => {});
  }

  return NextResponse.json({
    conversationId: conversation.id,
    message: parsed.message,
    cta: finalCta,
    qualification: updates.qualificationData || conversation.qualificationData || null,
  });
}

async function notifyJarvisProspect(conversationId: string, qualification: unknown, budgetEstime?: number | null) {
  const webhookUrl = process.env.EMPLOYES_WEBHOOK_URL;
  if (!webhookUrl) return;
  const webhookSecret = process.env.EMPLOYES_WEBHOOK_SECRET;
  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(webhookSecret ? { "X-Webhook-Secret": webhookSecret } : {}),
    },
    body: JSON.stringify({
      type: "chat_prospect_chaud",
      conversationId,
      qualification,
      budgetEstime: budgetEstime || null,
      timestamp: new Date().toISOString(),
    }),
  });
}

// Endpoint to collect prospect contact info
export async function PATCH(request: Request) {
  let body: { conversationId: string; visitorId: string; nom?: string; tel?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { conversationId, visitorId, nom, tel, email } = body;
  if (!conversationId || !visitorId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (nom) updates.prospectNom = nom.trim();
  if (tel) updates.prospectTel = tel.trim();
  if (email) updates.prospectEmail = email.trim();

  await db
    .update(schema.chatConversations)
    .set(updates)
    .where(and(
      eq(schema.chatConversations.id, conversationId),
      eq(schema.chatConversations.visitorId, visitorId),
    ));

  return NextResponse.json({ ok: true });
}
