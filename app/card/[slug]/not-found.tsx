import { ArrowUpRight, ScanLine } from "lucide-react";

/**
 * Shown for an unknown slug and for a deactivated card.
 *
 * Deliberately does not say which of the two it is. A client whose card was
 * switched off should not have that broadcast to whoever tapped their tag.
 */
const CardNotFound = () => (
  <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden bg-[#07070b] px-6 text-center text-white">
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(58%_42%_at_50%_0%,rgb(59_130_246/0.18),transparent_72%)]"
      aria-hidden
    />

    <div className="relative flex flex-col items-center gap-8">
      <span className="card-hex flex size-16 items-center justify-center bg-white/5 text-white/40">
        <ScanLine className="size-6" aria-hidden />
      </span>

      <div className="space-y-3">
        <h1 className="font-display text-4xl leading-tight font-normal tracking-tight">
          This card is not available
        </h1>
        <p className="mx-auto max-w-sm text-[15px] leading-relaxed text-white/45">
          The link may have changed, or the card is no longer active. Check with
          the person who shared it.
        </p>
      </div>

      <a
        href="https://www.hexaigon.gr"
        className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-white/35 transition-colors duration-300 hover:text-white/70"
      >
        Get your own digital card
        <ArrowUpRight
          className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </a>
    </div>
  </main>
);

export default CardNotFound;
