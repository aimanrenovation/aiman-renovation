export const rpName = "Aiman Équipe";
export const rpID = process.env.WEBAUTHN_RP_ID ?? "localhost";

// Accept both www and non-www origins (Safari iOS is strict on exact match)
const baseOrigin = (process.env.WEBAUTHN_ORIGIN ?? "http://localhost:3000").replace(/\/+$/, "");
export const expectedOrigins: string[] = [baseOrigin];
if (baseOrigin.includes("://www.")) {
  expectedOrigins.push(baseOrigin.replace("://www.", "://"));
} else if (baseOrigin.includes("://") && !baseOrigin.includes("://localhost")) {
  expectedOrigins.push(baseOrigin.replace("://", "://www."));
}
export const origin = baseOrigin;
