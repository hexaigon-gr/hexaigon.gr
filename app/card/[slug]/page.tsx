import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  UserRoundPlus,
} from "lucide-react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { CardContactRow } from "@/components/cards/card-contact-row";
import { CardPortrait } from "@/components/cards/card-portrait";
import { CardQr } from "@/components/cards/card-qr";
import { CardCopyLink, CardShareButton } from "@/components/cards/card-share-button";
import { cardUrl, getAllCardSlugs, getPublicCard } from "@/lib/cards/data";
import { buildCardTheme } from "@/lib/cards/theme";
import { SOCIAL_PLATFORMS, type SocialPlatform } from "@/lib/cards/types";

interface CardPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Prerenders every active card at build time. Also where the slugs get
 * validated, so a duplicate or malformed one fails the build.
 *
 * `dynamicParams` is left at its default so an unknown slug still renders on
 * demand and hits `notFound()`, which gives the branded 404 in `not-found.tsx`
 * rather than the framework's bare one.
 */
export const generateStaticParams = () => getAllCardSlugs().map((slug) => ({ slug }));

/** Icons live here rather than in the config so the config stays serialisable. */
const SOCIAL_ICONS: Record<SocialPlatform, typeof Linkedin> = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
};

/** Adds a scheme to a bare domain so `href` is never treated as relative. */
const toAbsoluteUrl = (url: string) =>
  /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;

/** Display form of a website, without the scheme or a trailing slash. */
const prettyUrl = (url: string) => url.replace(/^https?:\/\//i, "").replace(/\/$/, "");

export const generateMetadata = async ({ params }: CardPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const card = getPublicCard(slug);

  if (!card) return { title: "Card not found" };

  const role = [card.jobTitle, card.company].filter(Boolean).join(" at ");
  const title = role ? `${card.fullName} | ${role}` : card.fullName;
  const description = role
    ? `Save ${card.fullName} to your contacts. ${role}.`
    : `Save ${card.fullName} to your contacts.`;

  return {
    title,
    description,
    openGraph: {
      type: "profile",
      title,
      description,
      url: cardUrl(card.slug),
      images: card.photoUrl ? [{ url: card.photoUrl, alt: card.fullName }] : undefined,
    },
    twitter: {
      card: card.photoUrl ? "summary" : "summary_large_image",
      title,
      description,
    },
  };
};

/**
 * `themeColor` belongs to the viewport export, not metadata. It tints the
 * browser chrome on Android and in iOS Safari, so the client's accent reaches
 * past the page itself.
 */
export const generateViewport = async ({ params }: CardPageProps): Promise<Viewport> => {
  const { slug } = await params;
  const card = getPublicCard(slug);

  return { themeColor: card ? buildCardTheme(card.themeColor).accent : "#07070b" };
};

const CardPage = async ({ params }: CardPageProps) => {
  const { slug } = await params;
  const card = getPublicCard(slug);

  // Covers a wrong slug and a deactivated card alike. A client who stops paying
  // gets a 404 rather than a broken-looking page.
  if (!card) notFound();

  const theme = buildCardTheme(card.themeColor);
  const url = cardUrl(card.slug);
  const website = card.website ? toAbsoluteUrl(card.website) : null;

  const socials = SOCIAL_PLATFORMS.flatMap(({ key, label }) => {
    const href = card.socialLinks?.[key];
    return href ? [{ key, label, href, Icon: SOCIAL_ICONS[key] }] : [];
  });

  // Opens the native maps app on both platforms, so a client with a shop gets
  // directions straight from their card.
  const mapsUrl = card.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.address)}`
    : null;

  const hasContactRows = Boolean(card.phone || card.email || website || mapsUrl);

  return (
    <main
      style={theme.cssVars}
      className="card-grain relative min-h-dvh overflow-hidden bg-[#07070b] text-white"
    >
      {/* Backlight bleeding down from the top edge. */}
      <div className="card-leak pointer-events-none absolute inset-x-0 top-0 h-[420px]" aria-hidden />
      <div className="card-topline pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col px-6 pt-8 pb-12">
        {/* Header: client logo on the left, product mark on the right. */}
        <header className="card-rise flex items-center justify-between gap-4">
          {/* No text fallback when there is no logo: the company already appears
              under the name, and repeating it here read as a duplication. */}
          {card.companyLogoUrl ? (
            // Plain img: logo hosts are client-supplied, so next/image would
            // need every one of them in remotePatterns. See CardPortrait.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.companyLogoUrl}
              alt={card.company ?? "Company logo"}
              className="max-h-8 w-auto max-w-[9rem] object-contain"
              loading="eager"
            />
          ) : (
            <span aria-hidden />
          )}

          <span className="card-accent-fg shrink-0 font-mono text-[10px] uppercase tracking-[0.28em]">
            Digital Card
          </span>
        </header>

        {/* Identity block. */}
        <section className="mt-14">
          <div className="card-rise" style={{ animationDelay: "80ms" }}>
            <CardPortrait photoUrl={card.photoUrl} fullName={card.fullName} />
          </div>

          <h1
            className="card-rise mt-8 font-display text-[2.75rem] leading-[0.95] font-normal tracking-[-0.02em] text-white"
            style={{ animationDelay: "160ms" }}
          >
            {card.fullName}
          </h1>

          {(card.jobTitle || card.company) && (
            <div className="card-rise mt-4 space-y-1.5" style={{ animationDelay: "220ms" }}>
              {card.jobTitle && (
                <p className="text-[15px] leading-snug text-white/55">{card.jobTitle}</p>
              )}
              {card.company && (
                <p className="card-accent-fg font-mono text-[11px] uppercase tracking-[0.24em]">
                  {card.company}
                </p>
              )}
              {card.note && (
                <p className="pt-1 text-[13px] leading-relaxed text-white/40">{card.note}</p>
              )}
            </div>
          )}
        </section>

        {/* Hairline rule with a hexagon node, echoing the portrait shape. */}
        <div
          className="card-rise mt-9 flex items-center gap-3"
          style={{ animationDelay: "260ms" }}
          aria-hidden
        >
          <span className="h-px flex-1 bg-white/10" />
          <span className="card-hex card-tint-strong size-2" />
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Primary action. A plain link, so it works without JavaScript. */}
        <div
          className="card-rise mt-9 flex gap-3"
          style={{ animationDelay: "320ms" }}
        >
          <a
            href={`/api/card/${card.slug}/vcf`}
            className="card-cta card-sheen relative flex h-14 flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-2xl text-[15px] font-semibold tracking-tight"
          >
            <UserRoundPlus className="size-[18px]" aria-hidden />
            Save Contact
          </a>

          <CardShareButton url={url} fullName={card.fullName} />
        </div>

        {/* Contact list. */}
        {hasContactRows && (
          <section
            className="card-rise mt-8 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]"
            style={{ animationDelay: "380ms" }}
          >
            <div className="divide-y divide-white/6">
              {card.phone && (
                <CardContactRow
                  href={`tel:${card.phone.replace(/\s+/g, "")}`}
                  label="Phone"
                  value={card.phone}
                  icon={<Phone className="size-[18px]" aria-hidden />}
                />
              )}
              {card.email && (
                <CardContactRow
                  href={`mailto:${card.email}`}
                  label="Email"
                  value={card.email}
                  icon={<Mail className="size-[18px]" aria-hidden />}
                />
              )}
              {website && (
                <CardContactRow
                  href={website}
                  label="Website"
                  value={prettyUrl(website)}
                  icon={<Globe className="size-[18px]" aria-hidden />}
                  external
                />
              )}
              {mapsUrl && card.address && (
                <CardContactRow
                  href={mapsUrl}
                  label="Address"
                  value={card.address}
                  icon={<MapPin className="size-[18px]" aria-hidden />}
                  external
                />
              )}
            </div>
          </section>
        )}

        {/* Socials. */}
        {socials.length > 0 && (
          <section className="card-rise mt-8" style={{ animationDelay: "440ms" }}>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/30">
              Elsewhere
            </h2>
            <div className="mt-3 flex gap-3">
              {socials.map(({ key, label, href, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="card-tint card-edge card-accent-fg flex size-12 items-center justify-center rounded-xl border transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="size-5" aria-hidden />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* QR fallback, for a phone that cannot read the tag. */}
        <section
          className="card-rise mt-auto flex flex-col items-center gap-4 pt-14"
          style={{ animationDelay: "500ms" }}
        >
          <CardQr url={url} foreground={theme.qrForeground} />
          <CardCopyLink url={url} />
        </section>

        <footer className="card-rise mt-10 border-t border-white/6 pt-6" style={{ animationDelay: "560ms" }}>
          <a
            href="https://www.hexaigon.gr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/25 transition-colors duration-300 hover:text-white/50"
          >
            Powered by hexAIgon
          </a>
        </footer>
      </div>
    </main>
  );
};

export default CardPage;
