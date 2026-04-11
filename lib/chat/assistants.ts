export const CHAT_ASSISTANTS = [
  { name: "Sophie", photo: "/chat/sophie.png" },
  { name: "Lucas", photo: "/chat/lucas.png" },
  { name: "Amira", photo: "/chat/amira.png" },
] as const;

export type ChatAssistant = (typeof CHAT_ASSISTANTS)[number];

/** Pick a consistent assistant for a visitor (deterministic from visitorId). */
export function getAssistant(visitorId: string): ChatAssistant {
  let hash = 0;
  for (let i = 0; i < visitorId.length; i++) {
    hash = ((hash << 5) - hash + visitorId.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % CHAT_ASSISTANTS.length;
  return CHAT_ASSISTANTS[idx];
}
