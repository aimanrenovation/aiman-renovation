export const CHAT_ASSISTANTS = [
  { name: "Sophie", photo: "/chat/sophie.png", title: "Conseillère rénovation" },
  { name: "Lucas", photo: "/chat/lucas.png", title: "Chargé de projet" },
  { name: "Amira", photo: "/chat/amira.png", title: "Assistante commerciale" },
] as const;

export type ChatAssistant = (typeof CHAT_ASSISTANTS)[number];

/** Check if currently within business hours (Europe/Paris). */
export function isBusinessHours(): boolean {
  const now = new Date();
  const paris = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    hour: "numeric",
    hour12: false,
    weekday: "short",
  }).formatToParts(now);
  const hour = parseInt(paris.find((p) => p.type === "hour")?.value || "0", 10);
  const day = paris.find((p) => p.type === "weekday")?.value || "";
  if (day === "Sun") return false;
  if (day === "Sat") return hour >= 9 && hour < 13;
  return hour >= 8 && hour < 19;
}

/** Pick a consistent assistant for a visitor (deterministic from visitorId). */
export function getAssistant(visitorId: string): ChatAssistant {
  let hash = 0;
  for (let i = 0; i < visitorId.length; i++) {
    hash = ((hash << 5) - hash + visitorId.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % CHAT_ASSISTANTS.length;
  return CHAT_ASSISTANTS[idx];
}
