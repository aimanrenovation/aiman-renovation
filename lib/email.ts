import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export const DEVIS_FROM_EMAIL = "Aiman Renovation <onboarding@resend.dev>";
export const DEVIS_RECIPIENT_EMAIL =
  process.env.DEVIS_RECIPIENT_EMAIL || "contact@aiman-renovation.fr";
