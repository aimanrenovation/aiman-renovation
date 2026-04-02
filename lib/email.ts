import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const DEVIS_FROM_EMAIL = "devis@aiman-renovation.fr";
export const DEVIS_RECIPIENT_EMAIL =
  process.env.DEVIS_RECIPIENT_EMAIL || "contact@aiman-renovation.fr";
