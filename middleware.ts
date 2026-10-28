import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

/**
 * Locale detection, prefixing, and negotiation.
 * Auth / tenant guards will compose here in Module 6.
 */
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
