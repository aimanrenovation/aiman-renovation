import { NextResponse } from "next/server";
import { google } from "googleapis";
import { resend } from "@/lib/email";

export const dynamic = "force-dynamic";

const AIMAN_CALENDAR_ID = "primary";
const AIMAN_EMAIL = "contact@aiman-renovation.fr";
const FROM_EMAIL = "Aiman Renovation <devis@aiman-renovation.fr>";

// Slots available: Mon-Fri 8h-18h, Sat 9h-12h — step 1h
// Booked slots are checked against Google Calendar
const SLOT_DURATION_MINUTES = 60;

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
  // day-of-week in Paris (0=Sun ... 6=Sat)
  const parisDow = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Paris",
      weekday: "narrow",
    }).format(new Date(`${dateStr}T12:00:00`)) === "S"
      ? // crude trick — use numeric weekday
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Europe/Paris",
        })
          .formatToParts(new Date(`${dateStr}T12:00:00`))
          .find((p) => p.type === "weekday")?.value || "0"
      : "0",
    10,
  );
  // Better approach: use Intl weekday index via en-US long name
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

/** Validate email */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

export async function POST(request: Request) {
  // 1. Parse + validate body
  let body: {
    nom?: string;
    email?: string;
    telephone?: string;
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

  const { nom, email, telephone, date, heure, sujet, conversationId } = body;

  // Required fields validation
  if (!nom || !email || !date || heure === undefined) {
    return NextResponse.json(
      {
        error: "missing_fields",
        detail: "nom, email, date et heure sont obligatoires",
      },
      { status: 400 },
    );
  }

  const nomClean = sanitize(nom, 100);
  const emailClean = email.trim().toLowerCase();
  const telephoneClean = telephone
    ? sanitize(telephone, 20).replace(/[^0-9+\s()-]/g, "")
    : "";
  const sujetClean = sujet ? sanitize(sujet, 300) : "Rendez-vous rénovation";
  const dateClean = sanitize(date, 10);

  if (!isValidEmail(emailClean)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

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

  // 2. Build event times
  const startISO = `${dateClean}T${String(heureInt).padStart(2, "0")}:00:00`;
  const endISO = `${dateClean}T${String(heureInt + 1).padStart(2, "0")}:00:00`;

  // 3. Create Google Calendar event
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

      // Create event
      const event = await calendar.events.insert({
        calendarId: AIMAN_CALENDAR_ID,
        sendUpdates: "none",
        requestBody: {
          summary: `RDV Rénovation — ${nomClean}`,
          description: [
            `Client : ${nomClean}`,
            `Email : ${emailClean}`,
            telephoneClean ? `Tél : ${telephoneClean}` : "",
            `Sujet : ${sujetClean}`,
            conversationId ? `Chat ID : ${conversationId}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
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

  // 4. Format date for emails
  const dateFormatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(`${dateClean}T12:00:00`));

  const heureFormatted = `${String(heureInt).padStart(2, "0")}h00`;

  // 5. Send confirmation email to client
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
            <p style="margin:0 0 16px">Bonjour <strong>${nomClean}</strong>,</p>
            <p style="margin:0 0 24px;color:#4b5563">Votre rendez-vous avec AIMAN RENOVATION a bien été enregistré.</p>
            <div style="background:#fef2f2;border-left:4px solid #E50000;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px">
              <p style="margin:0 0 8px;font-weight:600;color:#E50000">📅 Détails du rendez-vous</p>
              <p style="margin:0 0 4px"><strong>Date :</strong> ${dateFormatted}</p>
              <p style="margin:0 0 4px"><strong>Heure :</strong> ${heureFormatted}</p>
              <p style="margin:0 0 4px"><strong>Durée :</strong> 1 heure</p>
              <p style="margin:0"><strong>Lieu :</strong> 11 rue de Bâle, 68300 Saint-Louis (ou sur votre chantier)</p>
            </div>
            ${sujetClean !== "Rendez-vous rénovation" ? `<p style="margin:0 0 16px;color:#4b5563"><strong>Sujet :</strong> ${sujetClean}</p>` : ""}
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

  // 6. Notify Aiman
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
            ${telephoneClean ? `<tr><td style="padding:6px 0;color:#666">Tél</td><td style="padding:6px 0"><a href="tel:${telephoneClean}">${telephoneClean}</a></td></tr>` : ""}
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
  } catch (err) {
    console.error("[book-appointment] freebusy error:", err);
    // Fallback: return all slots if GCal query fails
    return NextResponse.json({
      slots: hourRange,
      gcal: false,
      error: "gcal_query_failed",
    });
  }
}
