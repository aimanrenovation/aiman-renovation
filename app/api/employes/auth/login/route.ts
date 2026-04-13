import { and, eq, gte, sql as dsql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  generateRefreshToken,
  signAccessToken,
  type EmployeRole,
} from "@/lib/auth/jwt";
import { verifyPassword } from "@/lib/auth/password";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/session";

const MAX_FAILS = 5;
const WINDOW_MINUTES = 15;

/**
 * Extrait un fingerprint simplifié depuis un user-agent.
 * Retourne "device|browser" ex: "iPhone|Safari", "Mac|Chrome", "Windows|Firefox"
 * Ignore les versions pour éviter les faux positifs à chaque mise à jour.
 */
function deviceFingerprint(ua: string): string {
  const uaLower = ua.toLowerCase();

  // Device type
  let device = "unknown";
  if (uaLower.includes("iphone")) device = "iPhone";
  else if (uaLower.includes("ipad")) device = "iPad";
  else if (uaLower.includes("android") && uaLower.includes("mobile")) device = "Android";
  else if (uaLower.includes("android")) device = "Android-Tablet";
  else if (uaLower.includes("macintosh") || uaLower.includes("mac os")) device = "Mac";
  else if (uaLower.includes("windows")) device = "Windows";
  else if (uaLower.includes("linux")) device = "Linux";
  else if (uaLower.includes("cros")) device = "ChromeOS";

  // Browser (check specific browsers before generic ones)
  let browser = "unknown";
  if (uaLower.includes("edg/") || uaLower.includes("edga/")) browser = "Edge";
  else if (uaLower.includes("opr/") || uaLower.includes("opera")) browser = "Opera";
  else if (uaLower.includes("samsungbrowser")) browser = "Samsung";
  else if (uaLower.includes("firefox") || uaLower.includes("fxios")) browser = "Firefox";
  else if (uaLower.includes("crios")) browser = "Chrome";
  else if (uaLower.includes("chrome") && !uaLower.includes("chromium")) browser = "Chrome";
  else if (uaLower.includes("safari") && !uaLower.includes("chrome")) browser = "Safari";
  else if (uaLower.includes("chromium")) browser = "Chromium";

  return `${device}|${browser}`;
}

async function notifyPatronNewDevice(
  employe: { firstname: string; lastname: string; email: string },
  ua: string | null,
  ip: string | null,
) {
  const webhookUrl = process.env.EMPLOYES_WEBHOOK_URL;
  const webhookSecret = process.env.EMPLOYES_WEBHOOK_SECRET;
  if (!webhookUrl) return;
  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(webhookSecret ? { "X-Webhook-Secret": webhookSecret } : {}),
    },
    body: JSON.stringify({
      type: "new_device_login",
      employe: `${employe.firstname} ${employe.lastname}`,
      email: employe.email,
      ip,
      userAgent: ua,
      timestamp: new Date().toISOString(),
    }),
  });
}

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  // Rate limit
  const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const fails = await db
    .select({ n: dsql<number>`count(*)::int` })
    .from(schema.loginAttempts)
    .where(
      and(
        eq(schema.loginAttempts.identifier, email),
        eq(schema.loginAttempts.success, false),
        gte(schema.loginAttempts.attemptedAt, since)
      )
    );
  if ((fails[0]?.n ?? 0) >= MAX_FAILS) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const [employe] = await db
    .select()
    .from(schema.employes)
    .where(eq(schema.employes.email, email))
    .limit(1);

  const recordAttempt = async (success: boolean) => {
    await db.insert(schema.loginAttempts).values({
      identifier: email,
      ip,
      success,
    });
  };

  const logLogin = async (employeId: string | null, success: boolean, isNewDevice: boolean) => {
    await db.insert(schema.loginLogs).values({
      employeId,
      email,
      ip,
      userAgent,
      success,
      newDevice: isNewDevice,
    });
  };

  if (!employe || !employe.actif) {
    await recordAttempt(false);
    await logLogin(null, false, false);
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, employe.passwordHash);
  if (!ok) {
    await recordAttempt(false);
    await logLogin(employe.id, false, false);
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await recordAttempt(true);

  // Detect new device: compare simplified fingerprint (device type + browser)
  // instead of exact user-agent (too volatile — changes with every browser update)
  let isNewDevice = false;
  if (userAgent) {
    const fingerprint = deviceFingerprint(userAgent);
    const previousAgents = await db
      .select({ userAgent: schema.loginLogs.userAgent })
      .from(schema.loginLogs)
      .where(
        and(
          eq(schema.loginLogs.employeId, employe.id),
          eq(schema.loginLogs.success, true),
        )
      );
    const knownFingerprints = new Set(
      previousAgents
        .map((r) => r.userAgent ? deviceFingerprint(r.userAgent) : null)
        .filter(Boolean)
    );
    isNewDevice = knownFingerprints.size > 0 && !knownFingerprints.has(fingerprint);
  }

  await logLogin(employe.id, true, isNewDevice);

  // Alert patron if new device detected
  if (isNewDevice) {
    notifyPatronNewDevice(employe, userAgent, ip).catch(() => {});
  }

  // Issue tokens
  const accessToken = await signAccessToken(employe.id, employe.role as EmployeRole);
  const refresh = generateRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  await db.insert(schema.employesSessions).values({
    employeId: employe.id,
    refreshTokenHash: refresh.hash,
    ip,
    userAgent,
    expiresAt,
  });

  const response = NextResponse.json({
    ok: true,
    employe: {
      id: employe.id,
      firstname: employe.firstname,
      lastname: employe.lastname,
      email: employe.email,
      role: employe.role,
      cguAccepted: !!employe.cguAcceptedAt,
      passwordMustChange: employe.passwordMustChange,
    },
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
  });

  response.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });
  response.cookies.set(REFRESH_COOKIE, refresh.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/employes/auth",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });

  return response;
}
