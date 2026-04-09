import { SignJWT, jwtVerify } from "jose";
import { createHash, randomBytes } from "node:crypto";

const ACCESS_TTL_SECONDS = 15 * 60; // 15 minutes
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const ISSUER = "aiman-employes";
const AUDIENCE = "aiman-employes-app";

export type EmployeRole = "employe" | "chef_chantier" | "patron";

export interface AccessClaims {
  sub: string; // employe id
  role: EmployeRole;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(employeId: string, role: EmployeRole): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(employeId)
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAccessToken(token: string): Promise<AccessClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (typeof payload.sub !== "string" || typeof payload.role !== "string") return null;
    return { sub: payload.sub, role: payload.role as EmployeRole };
  } catch {
    return null;
  }
}

/**
 * Generates an opaque refresh token and its SHA-256 hash for DB storage.
 * Store only the hash server-side; send the raw token to the client.
 */
export function generateRefreshToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  const hash = createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const ACCESS_TOKEN_TTL_SECONDS = ACCESS_TTL_SECONDS;
export const REFRESH_TOKEN_TTL_SECONDS = REFRESH_TTL_SECONDS;
