import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/general/utils";

interface CardContactRowProps {
  href: string;
  /** Mono micro-label, e.g. "Phone". */
  label: string;
  /** The value itself, e.g. the number. */
  value: string;
  icon: ReactNode;
  /** Set for outbound web links so they open in a new tab. */
  external?: boolean;
}

/**
 * One row of the contact list.
 *
 * A hairline-separated list rather than a grid of icon bubbles: the bubble grid
 * is the visual signature of free link-in-bio pages, and this is a product
 * clients pay for. The list also shows the actual number and address, which is
 * what someone wants to see before tapping.
 */
export const CardContactRow = ({
  href,
  label,
  value,
  icon,
  external = false,
}: CardContactRowProps) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className="card-row group flex items-center gap-4 px-4 py-3.5"
  >
    <span className="card-tint card-accent-fg flex size-10 shrink-0 items-center justify-center rounded-xl">
      {icon}
    </span>

    <span className="min-w-0 flex-1">
      <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
        {label}
      </span>
      {/* Wraps rather than truncates: a long email or address is information
          someone is reading off the card, so hiding its tail is the wrong trade.
          Long values also step down a size, which keeps a 35-character email on
          one line instead of breaking it mid-domain. */}
      <span
        className={cn(
          "block wrap-break-word text-white/90",
          value.length > 28 ? "text-[13.5px]" : "text-[15px]",
        )}
      >
        {value}
      </span>
    </span>

    <ChevronRight
      className="size-4 shrink-0 text-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white/50"
      aria-hidden
    />
  </a>
);
