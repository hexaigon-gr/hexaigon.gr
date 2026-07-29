import "../globals.css";

import type { Metadata, Viewport } from "next";
import { Commissioner, EB_Garamond, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

/**
 * Second root layout, for the card routes only.
 *
 * Card pages sit outside `app/[locale]` so their URL stays
 * `hexaigon.gr/card/<slug>` with no locale prefix, which is what gets written
 * onto the NFC tag. They therefore cannot inherit the locale layout, and they
 * should not: a client's card is their page, so it deliberately drops the
 * hexAIgon navbar, footer, Meta Pixel and LocalBusiness schema.
 *
 * Kept intentionally thin. No SessionProvider or intl provider, because nothing
 * on a public card needs a session and all of its copy comes from the database.
 */

/**
 * All three faces carry Greek as well as Latin. Clients and their contacts are
 * mostly Greek, so a Latin-only display face would drop a name like
 * "Παπαδόπουλος" to a fallback and wreck the one element the page is built
 * around.
 */
const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin", "greek"],
  display: "swap",
});

/**
 * Old-style serif, used only for the name and headings. Chosen over the usual
 * display serifs (Cormorant, Playfair, Marcellus) because those are Latin-only
 * and would drop a Greek name to a system fallback.
 */
const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin", "greek"],
  weight: ["400", "500"],
  display: "swap",
});

/** Micro-labels: uppercase, widely tracked, the "annotation" layer. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "greek"],
  display: "swap",
});

export const metadata: Metadata = {
  // Cards are thin, near-identical pages, one per client. Indexing them at
  // scale would bloat the index of a domain that is otherwise SEO-tuned.
  // `follow` still passes link equity to the client's own site.
  robots: { index: false, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The page is opened by tapping a phone against a tag, so it is a mobile
  // surface first. Dark by default because every card renders on a dark base.
  colorScheme: "dark",
};

const CardRootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className="dark" suppressHydrationWarning>
    <body
      className={`${commissioner.variable} ${ebGaramond.variable} ${jetbrainsMono.variable} font-sans antialiased`}
    >
      {children}
    </body>
  </html>
);

export default CardRootLayout;
