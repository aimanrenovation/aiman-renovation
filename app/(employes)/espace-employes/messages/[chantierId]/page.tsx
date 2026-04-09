import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";
import { ChatChantier } from "@/components/employes/chat-chantier";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ chantierId: string }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { chantierId } = await params;
  const { employe } = await requireActiveEmploye();

  const [chantier] = await db
    .select({ id: schema.chantiers.id, nom: schema.chantiers.nom })
    .from(schema.chantiers)
    .where(eq(schema.chantiers.id, chantierId))
    .limit(1);

  if (!chantier) notFound();

  const messages = await db
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

  // Serialize dates for client component
  const serialized = messages.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <ChatChantier
      chantierId={chantierId}
      chantierNom={chantier.nom}
      currentEmployeId={employe.id}
      initialMessages={serialized}
    />
  );
}
