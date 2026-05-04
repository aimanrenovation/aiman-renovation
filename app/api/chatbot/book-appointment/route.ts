import { NextResponse } from "next/server";
import { google } from "googleapis";
import { resend } from "@/lib/email";
import {
  validateName,
  validateEmailFormat,
  validatePhone,
  validateAddressString,
} from "@/lib/validation/devis";

export const dynamic = "force-dynamic";

const AIMAN_CALENDAR_ID = "primary";
const AIMAN_EMAIL = "contact@aiman-renovation.fr";
const FROM_EMAIL = "Aiman Renovation <devis@aiman-renovation.fr>";

// Slots available: Mon-Fri 8h-18h, Sat 9h-12h — step 1h
const SLOT_DURATION_MINUTES = 60;

const GENERIC_SUBJECTS = [
  "rdv",
  "test",
  "j'en sais rien",
  "je sais pas",
  "bonjour",
  "hello",
  "rien",
  "...",
  "???",
  "aaaa",
  "asdf",
];

/** Build an OAuth2 client from env vars */
function buildOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
}

/** Validate that a given ISO date+hour slot is within business hours */
function isValidSlot(dateStr: string, hour: number): boolean {
  const d = new Date(`${dateStr}T00:00:00+00:00`);
  if (isNaN(d.getTime())) return false;
  const weekdayLong = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    weekday: "long",
  }).format(new Date(`${dateStr}T12:00:00`));
  if (weekdayLong === "Sunday") return false;
  if (weekdayLong === "Saturday") return hour >= 9 && hour <= 11;
  return hour >= 8 && hour <= 17;
}

/** Sanitize string inputs */
function sanitize(val: string, maxLen = 200): string {
  return String(val)
    .replace(/<[^>]*>/g, "")
    .slice(0, maxLen)
    .trim();
}

/** Validate subject: min 10 chars, not generic */
function isValidSubject(raw: string): boolean {
  const v = raw.trim();
  if (v.length < 10) return false;
  if (GENERIC_SUBJECTS.some((g) => v.toLowerCase() === g)) return false;
  return true;
}

/** Validate all contact fields — returns first error or null */
function validateContactFields(body: {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address: string;
  addressValidated?: boolean;
  sujet?: string;
}): { field: string; code: string; detail: string } | null {
  const firstNameResult = validateName(body.firstName);
  if (!firstNameResult.ok)
    return {
      field: "firstName",
      code: firstNameResult.code,
      detail: "Prénom invalide.",
    };

  const lastNameResult = validateName(body.lastName);
  if (!lastNameResult.ok)
    return {
      field: "lastName",
      code: lastNameResult.code,
      detail: "Nom invalide.",
    };

  const phoneResult = validatePhone(body.telephone);
  if (!phoneResult.ok)
    return {
      field: "telephone",
      code: phoneResult.code,
      detail: "Téléphone invalide (FR/CH/DE/LU acceptés).",
    };

  const emailResult = validateEmailFormat(body.email);
  if (!emailResult.ok)
    return {
      field: "email",
      code: emailResult.code,
      detail: "Email invalide.",
    };

  const addressResult = validateAddressString(body.address);
  if (!addressResult.ok)
    return {
      field: "address",
      code: addressResult.code,
      detail: "Adresse incomplète (numéro + rue requis).",
    };

  if (!body.addressValidated) {
    return {
      field: "address",
      code: "address_not_geocoded",
      detail: "L'adresse doit être sélectionnée via l'autocomplete.",
    };
  }

  if (body.sujet && !isValidSubject(body.sujet)) {
    return {
      field: "sujet",
      code: "subject_too_short_or_generic",
      detail: "Sujet trop court ou générique (min. 10 caractères).",
    };
  }

  return null;
}

export async function POST(request: Request) {
  // 1. Parse body
  let body: {
    firstName?: string;
    lastName?: string;
    // Legacy "nom" field kept for backwards-compat (e.g. direct API calls)
    nom?: string;
    email?: string;
    telephone?: string;
    address?: string;
    addressValidated?: boolean;
    addressLat?: number;
    addressLng?: number;
    date?: string; // YYYY-MM-DD
    heure?: number; // 8-17 integer
    sujet?: string;
    conversationId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Support legacy "nom" field — split on first space if firstName/lastName not provided
  let firstName = body.firstName?.trim() || "";
  let lastName = body.lastName?.trim() || "";
  if (!firstName && !lastName && body.nom) {
    const parts = body.nom.trim().split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || parts[0] || "";
  }

  const {
    email,
    telephone,
    address,
    addressValidated,
    addressLat,
    addressLng,
    date,
    heure,
    sujet,
    conversationId,
  } = body;

  // 2. Required fields presence check
  if (
    !firstName ||
    !lastName ||
    !email ||
    !telephone ||
    !address ||
    !date ||
    heure === undefined
  ) {
    return NextResponse.json(
      {
        error: "missing_fields",
        detail:
          "firstName, lastName, email, telephone, address, date et heure sont obligatoires",
      },
      { status: 400 },
    );
  }

  // 3. Validate all contact fields
  const contactError = validateContactFields({
    firstName,
    lastName,
    email: email.trim(),
    telephone: telephone.trim(),
    address: address.trim(),
    addressValidated,
    sujet,
  });
  if (contactError) {
    return NextResponse.json(
      {
        error: contactError.code,
        field: contactError.field,
        detail: contactError.detail,
      },
      { status: 400 },
    );
  }

  // 4. Sanitize
  const firstNameClean = sanitize(firstName, 50);
  const lastNameClean = sanitize(lastName, 50);
  const nomClean = `${firstNameClean} ${lastNameClean}`.trim();
  const emailClean = email.trim().toLowerCase();
  const telephoneClean = sanitize(telephone, 25).replace(/[^0-9+\s()-]/g, "");
  const addressClean = sanitize(address, 300);
  const sujetClean = sujet ? sanitize(sujet, 300) : "Rendez-vous rénovation";
  const dateClean = sanitize(date, 10);

  // 5. Date + slot validation
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateClean)) {
    return NextResponse.json(
      { error: "invalid_date_format", detail: "Format attendu: YYYY-MM-DD" },
      { status: 400 },
    );
  }

  const heureInt = Math.floor(Number(heure));
  if (isNaN(heureInt) || heureInt < 8 || heureInt > 17) {
    return NextResponse.json(
      { error: "invalid_heure", detail: "Heure doit être entre 8 et 17" },
      { status: 400 },
    );
  }

  if (!isValidSlot(dateClean, heureInt)) {
    return NextResponse.json(
      {
        error: "slot_unavailable",
        detail: "Ce créneau est en dehors des horaires d'ouverture",
      },
      { status: 400 },
    );
  }

  // 6. Build event times
  const startISO = `${dateClean}T${String(heureInt).padStart(2, "0")}:00:00`;
  const endISO = `${dateClean}T${String(heureInt + 1).padStart(2, "0")}:00:00`;

  // 7. Create Google Calendar event
  const oauth2 = buildOAuth2Client();

  let gcalEventId: string | null = null;
  let gcalEventLink: string | null = null;

  if (oauth2) {
    try {
      const calendar = google.calendar({ version: "v3", auth: oauth2 });

      // Check for conflicts
      const conflictsRes = await calendar.freebusy.query({
        requestBody: {
          timeMin: new Date(`${startISO}+01:00`).toISOString(),
          timeMax: new Date(`${endISO}+01:00`).toISOString(),
          timeZone: "Europe/Paris",
          items: [{ id: AIMAN_CALENDAR_ID }],
        },
      });

      const busy = conflictsRes.data.calendars?.[AIMAN_CALENDAR_ID]?.busy || [];
      if (busy.length > 0) {
        return NextResponse.json(
          {
            error: "slot_taken",
            detail: "Ce créneau est déjà pris. Choisissez un autre horaire.",
          },
          { status: 409 },
        );
      }

      // Build description including full address for Aiman on-site navigation
      const descriptionLines = [
        `Client : ${nomClean}`,
        `Email : ${emailClean}`,
        `Tél : ${telephoneClean}`,
        `Adresse chantier : ${addressClean}`,
        addressLat && addressLng
          ? `Coordonnées : ${addressLat.toFixed(6)}, ${addressLng.toFixed(6)}`
          : "",
        `Sujet : ${sujetClean}`,
        conversationId ? `Chat ID : ${conversationId}` : "",
      ].filter(Boolean);

      // Create event
      const event = await calendar.events.insert({
        calendarId: AIMAN_CALENDAR_ID,
        sendUpdates: "none",
        requestBody: {
          summary: `RDV Rénovation — ${nomClean}`,
          description: descriptionLines.join("\n"),
          location: addressClean,
          start: {
            dateTime: `${startISO}+01:00`,
            timeZone: "Europe/Paris",
          },
          end: {
            dateTime: `${endISO}+01:00`,
            timeZone: "Europe/Paris",
          },
          attendees: [{ email: emailClean, displayName: nomClean }],
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 60 * 24 }, // 24h before
              { method: "popup", minutes: 30 },
            ],
          },
        },
      });

      gcalEventId = event.data.id || null;
      gcalEventLink = event.data.htmlLink || null;
    } catch (err) {
      console.error("[book-appointment] GCal error:", err);
      // Non-blocking: continue even if GCal fails, fall through to email-only
    }
  }

  // 8. Format date for emails
  const dateFormatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(`${dateClean}T12:00:00`));

  const heureFormatted = `${String(heureInt).padStart(2, "0")}h00`;

  // 9. Send confirmation email to client
  const emailErrors: string[] = [];
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: emailClean,
      replyTo: AIMAN_EMAIL,
      subject: `Confirmation RDV — ${dateFormatted} à ${heureFormatted}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
          <div style="background:linear-gradient(135deg,#E50000,#B80000);padding:32px 24px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:24px;font-weight:700">AIMAN RENOVATION</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">Votre rendez-vous est confirmé ✓</p>
          </div>
          <div style="background:white;padding:32px 24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
            <p style="margin:0 0 16px">Bonjour <strong>${firstNameClean}</strong>,</p>
            <p style="margin:0 0 24px;color:#4b5563">Votre rendez-vous avec AIMAN RENOVATION a bien été enregistré.</p>
            <div style="background:#fef2f2;border-left:4px solid #E50000;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px">
              <p style="margin:0 0 8px;font-weight:600;color:#E50000">📅 Détails du rendez-vous</p>
              <p style="margin:0 0 4px"><strong>Date :</strong> ${dateFormatted}</p>
              <p style="margin:0 0 4px"><strong>Heure :</strong> ${heureFormatted}</p>
              <p style="margin:0 0 4px"><strong>Durée :</strong> 1 heure</p>
              <p style="margin:0 0 4px"><strong>Adresse :</strong> ${addressClean}</p>
              <p style="margin:0"><strong>Sujet :</strong> ${sujetClean}</p>
            </div>
            <p style="margin:0 0 24px;color:#4b5563">Nous vous contacterons la veille pour confirmer. En cas d'empêchement, appelez-nous au <strong>06 33 49 69 25</strong>.</p>
            <div style="border-top:1px solid #e5e7eb;padding-top:16px;margin-top:16px">
              <p style="margin:0;color:#9ca3af;font-size:13px">AIMAN RENOVATION · 11 rue de Bâle, 68300 Saint-Louis · 06 33 49 69 25</p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("[book-appointment] Client email error:", err);
    emailErrors.push("client_email_failed");
  }

  // 10. Notify Aiman
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: AIMAN_EMAIL,
      replyTo: emailClean,
      subject: `🗓️ Nouveau RDV — ${nomClean} · ${dateFormatted} ${heureFormatted}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#E50000;margin:0 0 16px">Nouveau rendez-vous via le chatbot</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#666;width:120px">Client</td><td style="padding:6px 0;font-weight:bold">${nomClean}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${emailClean}">${emailClean}</a></td></tr>
            <tr><td style="padding:6px 0;color:#666">Tél</td><td style="padding:6px 0"><a href="tel:${telephoneClean}">${telephoneClean}</a></td></tr>
            <tr><td style="padding:6px 0;color:#666">Adresse chantier</td><td style="padding:6px 0"><a href="https://maps.google.com/?q=${encodeURIComponent(addressClean)}">${addressClean}</a></td></tr>
            <tr><td style="padding:6px 0;color:#666">Date</td><td style="padding:6px 0;font-weight:bold">${dateFormatted} à ${heureFormatted}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Sujet</td><td style="padding:6px 0">${sujetClean}</td></tr>
            ${gcalEventLink ? `<tr><td style="padding:6px 0;color:#666">Google Cal</td><td style="padding:6px 0"><a href="${gcalEventLink}">Voir l'événement</a></td></tr>` : "<tr><td colspan='2' style='padding:6px 0;color:#f97316'>⚠️ Google Calendar non configuré — RDV enregistré par email uniquement</td></tr>"}
          </table>
          ${conversationId ? `<p style="margin:16px 0 0;color:#9ca3af;font-size:12px">Chat ID: ${conversationId}</p>` : ""}
        </div>
      `,
    });
  } catch (err) {
    console.error("[book-appointment] Aiman notification error:", err);
    emailErrors.push("aiman_notification_failed");
  }

  return NextResponse.json({
    ok: true,
    gcal: !!gcalEventId,
    gcalEventId,
    gcalEventLink,
    slot: { date: dateClean, heure: heureInt },
    emailErrors: emailErrors.length ? emailErrors : undefined,
  });
}

/** GET /api/chatbot/book-appointment?date=YYYY-MM-DD
 *  Returns available hourly slots for a given date */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  }

  // Business hours slots for the day
  const weekdayLong = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    weekday: "long",
  }).format(new Date(`${date}T12:00:00`));

  if (weekdayLong === "Sunday") {
    return NextResponse.json({ slots: [] });
  }

  const hourRange =
    weekdayLong === "Saturday"
      ? [9, 10, 11]
      : [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  const oauth2 = buildOAuth2Client();

  if (!oauth2) {
    // No GCal configured — return all business-hours slots as available
    return NextResponse.json({ slots: hourRange, gcal: false });
  }

  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2 });
    const timeMin = new Date(`${date}T07:00:00+01:00`).toISOString();
    const timeMax = new Date(`${date}T19:00:00+01:00`).toISOString();

    const busyRes = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: "Europe/Paris",
        items: [{ id: AIMAN_CALENDAR_ID }],
      },
    });

    const busySlots = busyRes.data.calendars?.[AIMAN_CALENDAR_ID]?.busy || [];

    const availableSlots = hourRange.filter((hour) => {
      const slotStart = new Date(
        `${date}T${String(hour).padStart(2, "0")}:00:00+01:00`,
      ).getTime();
      const slotEnd = slotStart + SLOT_DURATION_MINUTES * 60 * 1000;
      return !busySlots.some((b) => {
        const busyStart = new Date(b.start!).getTime();
        const busyEnd = new Date(b.end!).getTime();
        return slotStart < busyEnd && slotEnd > busyStart;
      });
    });

    return NextResponse.json({ slots: availableSlots, gcal: true });
  } catch (err: unknown) {
    const e = err as {
      message?: string;
      code?: number | string;
      errors?: unknown;
      status?: number;
    };
    console.error(
      "[GCal] freebusy error:",
      e.message,
      "code:",
      e.code,
      "status:",
      e.status,
      "errors:",
      JSON.stringify(e.errors),
    );
    // Fallback: return all slots if GCal query fails
    return NextResponse.json({
      slots: hourRange,
      gcal: false,
      error: "gcal_query_failed",
      debug_error: e.message,
      debug_code: e.code,
      debug_status: e.status,
    });
  }
}
