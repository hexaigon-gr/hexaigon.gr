"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";

export interface TypewriterLine {
  text: string;
  /** Element to render, so the name can stay an <h1>. Defaults to a <div>. */
  as?: "h1" | "h2" | "p" | "div";
  className?: string;
}

interface CardTypewriterProps {
  lines: TypewriterLine[];
  /** Milliseconds per character. */
  speed?: number;
  /** Pause before the first character. */
  startDelay?: number;
  /** Pause when moving from one line to the next. */
  lineDelay?: number;
  /** How long the cursor keeps blinking after the last character, before it goes. */
  lingerMs?: number;
}

/** useLayoutEffect warns during SSR; only the client needs it. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Types a sequence of lines one character at a time, with a single blinking
 * cursor that travels down the lines and vanishes once the last one finishes.
 *
 * Server-rendered fully typed. The complete text is always in the DOM as real,
 * un-hidden text — crawlers, no-JS visitors and screen readers get the whole
 * thing. Only the moving cursor and the not-yet-typed remainder are aria-hidden,
 * so assistive tech reads each line as one piece (no `aria-label`, which is
 * non-conforming on the <p>/<div> tags these lines can render as). On mount the
 * client rewinds to empty (before paint) and types it out, unless the visitor
 * prefers reduced motion, in which case it simply stays complete.
 */
export const CardTypewriter = ({
  lines,
  speed = 65,
  startDelay = 300,
  lineDelay = 420,
  lingerMs = 900,
}: CardTypewriterProps) => {
  const items = useMemo(
    () => lines.filter((line) => line.text.trim().length > 0),
    [lines],
  );

  const { total, starts, ends, boundaries } = useMemo(() => {
    const starts: number[] = [];
    const ends: number[] = [];
    let cum = 0;
    for (const line of items) {
      starts.push(cum);
      cum += line.text.length;
      ends.push(cum);
    }
    // Cumulative ends except the final one: the points where a line just finished
    // and we pause before starting the next.
    return { total: cum, starts, ends, boundaries: new Set(ends.slice(0, -1)) };
  }, [items]);

  // Seed fully typed so the server markup, and the pre-hydration paint, show the
  // complete text. Cursor hidden to match.
  const [typed, setTyped] = useState(total);
  const [cursorGone, setCursorGone] = useState(true);
  const [animate, setAnimate] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || total === 0) return;

    setTyped(0);
    setCursorGone(false);
    setAnimate(true);
  }, [total]);

  useEffect(() => {
    if (!animate) return;

    if (typed >= total) {
      const t = setTimeout(() => setCursorGone(true), lingerMs);
      return () => clearTimeout(t);
    }

    const delay =
      typed === 0 ? startDelay : boundaries.has(typed) ? lineDelay : speed;
    const t = setTimeout(() => setTyped((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [animate, typed, total, boundaries, speed, startDelay, lineDelay, lingerMs]);

  // Line currently being typed. -1 once everything is done.
  const activeIndex = items.findIndex((_, i) => typed >= starts[i] && typed < ends[i]);
  // During the post-finish linger the cursor rests at the end of the last line.
  // At an inter-line boundary it rests at the end of the line that just finished
  // for the length of the pause, then moves down as the next line starts.
  const cursorLine = cursorGone
    ? -1
    : activeIndex === -1
      ? items.length - 1
      : boundaries.has(typed)
        ? activeIndex - 1
        : activeIndex;

  return (
    <>
      {items.map((line, i) => {
        const Tag = line.as ?? "div";
        const localTyped = Math.max(0, Math.min(typed - starts[i], line.text.length));
        const shown = line.text.slice(0, localTyped);
        const rest = line.text.slice(localTyped);

        return (
          <Tag key={i} className={line.className}>
            {/* Real, readable text — the accessible copy. At rest this is the
                whole line; mid-animation it is what has been typed so far. */}
            <span>{shown}</span>
            {i === cursorLine && (
              <span aria-hidden className="animate-blink font-light">
                |
              </span>
            )}
            {/* Reserves the line's full width/height so nothing reflows while it
                types. Hidden from both sight and assistive tech mid-animation. */}
            {rest.length > 0 && (
              <span aria-hidden style={{ visibility: "hidden" }}>
                {rest}
              </span>
            )}
          </Tag>
        );
      })}
    </>
  );
};
