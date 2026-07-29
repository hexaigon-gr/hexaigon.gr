import createMiddleware from "next-intl/middleware";

import { routing } from "./lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // `card` is excluded alongside the framework paths. next-intl runs with
  // localePrefix "always", so letting it see /card/<slug> would redirect the
  // NFC and QR entry points to /el/card/<slug>. Client cards are sold on the
  // short unprefixed URL, and app/card/ carries its own root layout to serve it.
  matcher: "/((?!api|trpc|card|_next|_vercel|.*\\..*).*)",
};
