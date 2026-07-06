import { cn } from "@/lib/general/utils";

interface SectionHeaderProps {
  /** Two-digit section index, e.g. "01" */
  index: string;
  /** Short mono label, e.g. "Services" */
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Editorial section header: hairline top rule, mono index + eyebrow,
 * large display title on the left, muted description on the right.
 */
export const SectionHeader = ({
  index,
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) => (
  <div className={cn("border-t border-white/10 pt-6 mb-14 sm:mb-16", className)}>
    <div className="flex items-baseline justify-between gap-4 mb-8">
      <span className="eyebrow">
        <span className="text-primary">{index}</span>
        <span className="mx-2 text-white/20">/</span>
        {eyebrow}
      </span>
      <span
        aria-hidden
        className="hidden sm:block font-mono text-[11px] text-white/15 select-none"
      >
        +
      </span>
    </div>
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-xl text-balance">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-sm md:text-right leading-relaxed">
          {description}
        </p>
      )}
    </div>
  </div>
);
