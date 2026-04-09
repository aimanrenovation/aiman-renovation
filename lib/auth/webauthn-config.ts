export const rpName = "Aiman Équipe";
export const rpID = process.env.WEBAUTHN_RP_ID ?? "localhost";
// Strip trailing slash — Safari iOS is strict on exact origin match
export const origin = (process.env.WEBAUTHN_ORIGIN ?? "http://localhost:3000").replace(/\/+$/, "");
