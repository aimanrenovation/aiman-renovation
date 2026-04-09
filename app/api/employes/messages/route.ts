import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { dispatchJarvisEvent } from "@/lib/jarvis/webhook";

export const GET = requireAuth(async (request, _ctx, session) => {
  const url = new URL(request.url);
  const chantierId = url.searchParams.get("chantier_id");

  if (!chantierId) {
    return NextResponse.json({ error: "missing_chantier_id" }, { status: 400 });
  }

  const rows = await db
    .select({
      id: schema.messagesChantier.id,
      chantierId: schema.messagesChantier.chantierId,
      employeId: schema.messagesChantier.employeId,
      contenu: schema.messagesChantier.contenu,
      lu: schema.messagesChantier.lu,
      createdAt: schema.messagesChantier.createdAt,
      expediteurPrenom: schema.employes.firstname,
      expediteurNom: schema.employes.lastname,
    })
    .from(schema.messagesChantier)
    .innerJoin(schema.employes, eq(schema.messagesChantier.employeId, schema.employes.id))
    .where(eq(schema.messagesChantier.chantierId, chantierId))
    .orderBy(asc(schema.messagesChantier.createdAt));

  return NextResponse.json({ messages: rows });
});

interface MessageBody {
  chantier_id: string;
  contenu: string;
}

export const POST = requireAuth(async (request, _ctx, session) => {
  let body: MessageBody;
  try {
    body = (await request.json()) as MessageBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!body.chantier_id || !body.contenu?.trim()) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const [row] = await db
    .insert(schema.messagesChantier)
    .values({
      chantierId: body.chantier_id,
      employeId: session.sub,
      contenu: body.contenu.trim(),
    })
    .returning();

  const [chantier] = await db
    .select({ nom: schema.chantiers.nom })
    .from(schema.chantiers)
    .where(eq(schema.chantiers.id, body.chantier_id))
    .limit(1);

  dispatchJarvisEvent({
    type: "message.sent",
    employe_id: session.sub,
    chantier_id: body.chantier_id,
    chantier_nom: chantier?.nom,
    timestamp: row.createdAt.toISOString(),
    data: {
      message_id: row.id,
      contenu_preview: body.contenu.trim().slice(0, 100),
    },
  });

  return NextResponse.json({ ok: true, message: row });
});
