"use client";

import { QRCodeSVG } from "qrcode.react";

interface CardQrProps {
  /** Absolute URL the QR code resolves to. */
  url: string;
  /** Module colour, already contrast-checked by `buildCardTheme`. */
  foreground: string;
}

/**
 * QR fallback for phones without NFC, or with it switched off.
 *
 * Sits on a solid white plate rather than the page's dark surface: scanners
 * expect dark modules on light, and inverted codes fail on a good share of
 * Android camera apps.
 */
export const CardQr = ({ url, foreground }: CardQrProps) => (
  <div className="rounded-2xl bg-white p-3 shadow-[0_8px_30px_rgb(0_0_0/0.5)]">
    <QRCodeSVG
      value={url}
      // Level H tolerates the most damage, which matters on a code that gets
      // printed onto stickers and reused on physical cards.
      level="H"
      size={132}
      marginSize={0}
      fgColor={foreground}
      bgColor="#ffffff"
      title="QR code linking to this digital business card"
    />
  </div>
);
