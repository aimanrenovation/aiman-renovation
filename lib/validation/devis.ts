import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

// Countries we accept (tri-frontière + Luxembourg)
const ACCEPTED_COUNTRIES: CountryCode[] = ["FR", "CH", "DE", "LU"];

export type ValidationResult = { ok: true } | { ok: false; code: string };

// --- Name (firstName / lastName) ---

export function validateName(raw: string): ValidationResult {
  const v = raw.trim();
  if (v.length < 2) return { ok: false, code: "name_too_short" };
  if (v.length > 50) return { ok: false, code: "name_too_long" };

  // Reject 4+ consecutive identical chars (aaaa, ----)
  if (/(.)\1{3,}/.test(v)) return { ok: false, code: "name_repeated" };

  // Reject if no vowel (random keyboard mash like "asdf", "qwer")
  // Allow accented vowels too
  const vowels = v.match(/[aeiouyàâäéèêëïîôöùûüÿAEIOUYÀÂÄÉÈÊËÏÎÔÖÙÛÜŸ]/g) || [];
  if (vowels.length < 2) return { ok: false, code: "name_no_vowels" };

  // Reject obvious test strings
  const lower = v.toLowerCase();
  if (["test", "asdf", "qwerty", "azerty", "abcd"].includes(lower)) {
    return { ok: false, code: "name_obvious_test" };
  }

  return { ok: true };
}

// --- Email (format only — MX/disposable check is server-side) ---

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateEmailFormat(raw: string): ValidationResult {
  const v = raw.trim().toLowerCase();
  if (v.length === 0) return { ok: false, code: "email_empty" };
  if (v.length > 254) return { ok: false, code: "email_too_long" };
  if (!EMAIL_REGEX.test(v)) return { ok: false, code: "email_format" };
  return { ok: true };
}

// --- Phone (libphonenumber-js, FR/CH/DE/LU) ---

export function validatePhone(raw: string): ValidationResult {
  const v = raw.trim();
  if (v.length === 0) return { ok: false, code: "phone_empty" };

  // Try parsing with each accepted country as default
  for (const country of ACCEPTED_COUNTRIES) {
    const parsed = parsePhoneNumberFromString(v, country);
    if (parsed && parsed.isValid() && ACCEPTED_COUNTRIES.includes(parsed.country!)) {
      return { ok: true };
    }
  }
  return { ok: false, code: "phone_invalid" };
}

export function formatPhone(raw: string): string | null {
  for (const country of ACCEPTED_COUNTRIES) {
    const parsed = parsePhoneNumberFromString(raw.trim(), country);
    if (parsed && parsed.isValid()) {
      return parsed.formatInternational();
    }
  }
  return null;
}

// --- Address ---
// Format-level validation only (Mapbox precision check happens via the
// autocomplete component which sets `addressValidated = true` on selection).

export function validateAddressString(raw: string): ValidationResult {
  const v = raw.trim();
  if (v.length === 0) return { ok: false, code: "address_empty" };
  if (v.length < 5) return { ok: false, code: "address_too_short" };
  // Must contain at least one digit (house number) and 2+ words
  const hasNumber = /\d/.test(v);
  const wordCount = v.split(/\s+/).filter(Boolean).length;
  if (!hasNumber) return { ok: false, code: "address_no_number" };
  if (wordCount < 2) return { ok: false, code: "address_too_simple" };
  return { ok: true };
}
