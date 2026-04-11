import { notifyJarvis } from "@/lib/jarvis-notify";

/**
 * Send a parrainage WhatsApp message.
 *
 * For now there is no real WhatsApp Business API integration.
 * The helper logs the message, dispatches a Jarvis webhook so the
 * notification pipeline can pick it up, and returns a stub result.
 */
export async function sendParrainageMessage(params: {
  phone: string;
  message: string;
  parrainageId: string;
}): Promise<{ sent: boolean; method: string }> {
  console.log(
    `[parrainage] WhatsApp to ${params.phone}: ${params.message.substring(0, 50)}...`,
  );

  // Dispatch to Jarvis so the event is tracked even without real WhatsApp
  await notifyJarvis({
    type: "parrainage_message_envoye" as never, // extend later
    parrainageId: params.parrainageId,
    phone: params.phone,
    message: params.message,
  });

  // TODO: integrate WhatsApp Business API (Twilio / Meta Cloud API)
  return { sent: true, method: "webhook" };
}
