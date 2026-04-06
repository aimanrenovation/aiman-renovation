import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Next.js 16: middleware.ts is deprecated, use proxy.ts with named export `proxy`
export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
