import { promises as dns } from "node:dns";
import mailchecker from "mailchecker";

import {
  validateName,
  validateEmailFormat,
  validatePhone,
  validateAddressString,
  type ValidationResult,
} from "./devis";

export type ServerCheckResult =
  | { ok: true }
  | { ok: false; field: string; code: string };

// --- Email server-side checks ---

export async function checkEmailServer(email: string): Promise<ServerCheckResult> {
  const fmt = validateEmailFormat(email);
  if (!fmt.ok) return { ok: false, field: "email", code: fmt.code };

  if (!mailchecker.isValid(email)) {
    return { ok: false, field: "email", code: "email_disposable" };
  }

  const domain = email.trim().split("@")[1];
  if (!domain) {
    return { ok: false, field: "email", code: "email_format" };
  }

  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return { ok: false, field: "email", code: "email_no_mx" };
    }
  } catch {
    // Some domains only have A records — fall back
    try {
      const a = await dns.resolve4(domain);
      if (!a || a.length === 0) {
        return { ok: false, field: "email", code: "email_no_mx" };
      }
    } catch {
      return { ok: false, field: "email", code: "email_no_mx" };
    }
  }

  return { ok: true };
}

// --- Aggregate validator for the whole contact form ---

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressValidated?: boolean;
}

export async function validateContactServer(
  c: ContactPayload,
): Promise<ServerCheckResult> {
  const checks: { field: string; result: ValidationResult }[] = [
    { field: "firstName", result: validateName(c.firstName) },
    { field: "lastName", result: validateName(c.lastName) },
    { field: "phone", result: validatePhone(c.phone) },
    { field: "address", result: validateAddressString(c.address) },
  ];
  for (const check of checks) {
    if (!check.result.ok) {
      return { ok: false, field: check.field, code: check.result.code };
    }
  }

  if (!c.addressValidated) {
    return { ok: false, field: "address", code: "address_not_geocoded" };
  }

  return checkEmailServer(c.email);
}

// --- Rate limiting (per IP, in-memory with TTL) ---
//
// Note: in-memory works because Vercel Functions reuse instances under
// Fluid Compute. Not perfect across regions but good enough for a small
// contact form. For stricter limits use Vercel KV / Edge Config.

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateBucket>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 3;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || existing.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_PER_WINDOW - 1 };
  }

  if (existing.count >= MAX_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  existing.count += 1;
  return { allowed: true, remaining: MAX_PER_WINDOW - existing.count };
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
