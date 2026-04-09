import { cookies } from "next/headers";
import { verifyAccessToken, type AccessClaims } from "./jwt";

export const ACCESS_COOKIE = "employe_at";
export const REFRESH_COOKIE = "employe_rt";

/**
 * Reads the access token cookie and returns the session claims, or null.
 * Safe to call from Server Components and Route Handlers.
 */
export async function getEmployeSession(): Promise<AccessClaims | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}
