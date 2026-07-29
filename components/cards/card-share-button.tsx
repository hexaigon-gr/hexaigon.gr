"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useCallback, useState } from "react";

interface CardShareButtonProps {
  /** Absolute URL of this card. */
  url: string;
  fullName: string;
}

/**
 * Secondary action beside Save Contact: hands the card URL to the native share
 * sheet, falling back to the clipboard on desktop.
 *
 * Deliberately the only interactive extra on the page. Saving a contact is a
 * plain link to the vCard route, so the card's primary job still works with
 * JavaScript disabled.
 */
export const CardShareButton = ({ url, fullName }: CardShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    // navigator.share needs a user gesture and only exists over HTTPS, so the
    // clipboard fallback covers desktop and local development.
    if (navigator.share) {
      try {
        await navigator.share({ title: fullName, url });
        return;
      } catch {
        // Cancelling the share sheet rejects. Fall through to copying rather
        // than reporting an error the person caused on purpose.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked by permissions policy. Nothing useful to say.
    }
  }, [fullName, url]);

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this card"
      className="card-ghost-btn flex h-14 items-center justify-center gap-2 rounded-2xl px-5 font-mono text-[11px] uppercase tracking-[0.2em]"
    >
      {copied ? (
        <>
          <Check className="card-glow-fg size-4" aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Share2 className="size-4" aria-hidden />
          Share
        </>
      )}
    </button>
  );
};

/**
 * Compact copy-link row shown under the QR code, for someone reading the card
 * on a desktop where tapping a tag is not an option.
 */
export const CardCopyLink = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Nothing to do if the clipboard is unavailable.
    }
  }, [url]);

  // Strip the scheme so the visible URL stays short enough not to wrap.
  const label = url.replace(/^https?:\/\//, "");

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-white/40 transition-colors duration-300 hover:text-white/80"
    >
      {copied ? (
        <Check className="card-glow-fg size-3.5" aria-hidden />
      ) : (
        <Link2 className="size-3.5" aria-hidden />
      )}
      {copied ? "Link copied" : label}
    </button>
  );
};
