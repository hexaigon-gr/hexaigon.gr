import { NextResponse } from "next/server";

import { cardUrl, getAllCardSlugs, getPublicCard } from "@/lib/cards/data";
import { buildVCard, buildVCardFilename } from "@/lib/cards/vcard";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * Prerenders one vCard per active card at build time.
 *
 * Worth doing for more than latency: the photo download and base64 embed in
 * `buildVCard` then happens during the build instead of on the first tap, so a
 * slow or briefly unreachable image host cannot degrade a client's card.
 */
export const generateStaticParams = () => getAllCardSlugs().map((slug) => ({ slug }));

/**
 * Fully static, with no runtime fallback. Both settings are load-bearing, not
 * tidiness:
 *
 * `buildVCard` reads photos from `public/` with `process.cwd()`. If this route
 * can also run per request, Vercel's file tracer has to assume the handler might
 * read anything under that path and bundles the whole directory into the
 * function. `public/` here is 436 MB of project screenshots, which overran the
 * function size limit and failed the deploy outright.
 *
 * Every card is known at build time, so there is nothing for a runtime handler
 * to do. `dynamicParams: false` makes an unknown or deactivated slug 404 without
 * invoking anything, which is the same outcome the handler produced anyway.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

/**
 * Streams a vCard built from the card's entry in `lib/cards/data.ts`.
 *
 * Header choices, all of which decide whether the download actually works:
 *
 * - `text/vcard; charset=utf-8` is the registered type and the one iOS Safari
 *   and Android Chrome both hand to their Contacts app. The charset is not
 *   optional: without it Android decodes as Latin-1 and Greek names arrive as
 *   mojibake.
 * - `Content-Disposition: attachment` with a `.vcf` filename. Chrome on Android
 *   downloads by extension, so the filename matters more than the type there.
 * - Both `filename` and `filename*`. The plain parameter is ASCII-only per
 *   RFC 6266, and the RFC 5987 form carries the real name for clients that
 *   understand it. Sending only a raw UTF-8 `filename` makes some Android
 *   builds save the file as "download".
 * - An explicit `Content-Length`. iOS Safari has historically shown the
 *   "Contact" preview sheet unreliably without it.
 */
export const GET = async (_request: Request, { params }: RouteContext) => {
  const { slug } = await params;
  const card = getPublicCard(slug);

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const vcard = await buildVCard({ card, cardUrl: cardUrl(card.slug) });
  const body = Buffer.from(vcard, "utf8");

  const filename = buildVCardFilename(card);
  const encodedFilename = encodeURIComponent(`${card.fullName}.vcf`);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
      "Content-Length": String(body.length),
      "X-Content-Type-Options": "nosniff",
    },
  });
};
