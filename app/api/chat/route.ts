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

  // Rate limit: max 30 messages per visitor per hour
  // (simple count check)

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

  // Build message history for Claude
  const history = (conversation.messages as Array<{role: string; content: string}>) || [];
  history.push({ role: "user", content: message.trim() });

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
