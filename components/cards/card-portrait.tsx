interface CardPortraitProps {
  photoUrl?: string;
  fullName: string;
  /** Rendered size in px. Defaults to 124. */
  size?: number;
}

/** Initials for the fallback, at most two letters. */
const initialsOf = (fullName: string) =>
  fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";

/**
 * Hexagonal portrait.
 *
 * A hexagon rather than the default circle: it is the hexAIgon mark, so every
 * card carries a quiet signature of who built it, and it reads as considered
 * where a circular avatar reads as a template.
 *
 * Uses a plain `img` on purpose. `photo_url` is client-supplied and can point at
 * any host, so `next/image` would need every one of those hosts allowlisted in
 * `remotePatterns` and would hard-fail the page on an unlisted domain.
 */
export const CardPortrait = ({ photoUrl, fullName, size = 124 }: CardPortraitProps) => (
  <div className="card-portrait-glow relative" style={{ width: size, height: size }}>
    {/* Accent rim: a slightly larger hexagon behind, showing as a hairline.
        Deliberately the only shape behind the portrait. An offset "depth"
        hexagon was tried here and read as a rendering artifact at this size. */}
    <div className="card-hex card-rim absolute -inset-[2px]" aria-hidden />

    <div className="card-hex relative size-full overflow-hidden bg-[#07070b]">
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- see note above
        <img
          src={photoUrl}
          alt={fullName}
          width={124}
          height={124}
          // Above the fold and almost always the LCP element, so never lazy.
          loading="eager"
          decoding="sync"
          className="size-full object-cover"
        />
      ) : (
        <div className="card-portrait-fill card-glow-fg flex size-full items-center justify-center">
          <span className="font-display text-4xl font-normal tracking-tight">
            {initialsOf(fullName)}
          </span>
        </div>
      )}
    </div>
  </div>
);
