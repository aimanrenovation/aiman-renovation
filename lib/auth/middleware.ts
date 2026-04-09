import { NextResponse } from "next/server";
import type { AccessClaims, EmployeRole } from "./jwt";
import { getEmployeSession } from "./session";

export type AuthedHandler<Ctx = unknown> = (
  request: Request,
  ctx: Ctx,
  session: AccessClaims
) => Promise<Response> | Response;

/**
 * Wraps a Route Handler to require a valid access token cookie.
 * If `roles` is provided, the session role must be included.
 */
export function requireAuth<Ctx = unknown>(
  handler: AuthedHandler<Ctx>,
  roles?: EmployeRole[]
) {
  return async (request: Request, ctx: Ctx) => {
    const session = await getEmployeSession();
    if (!session) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }
    if (roles && !roles.includes(session.role)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return handler(request, ctx, session);
  };
}
