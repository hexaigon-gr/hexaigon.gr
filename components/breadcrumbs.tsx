import { ChevronRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { Link } from "@/lib/i18n/navigation";
import { type BreadcrumbItem, breadcrumbSchema } from "@/lib/schema";

interface BreadcrumbsProps {
  locale: string;
  /** Ordered from the homepage down. The last entry is the current page. */
  trail: BreadcrumbItem[];
}

/**
 * Visible breadcrumbs plus the matching BreadcrumbList. Both matter: the markup
 * is what turns the URL in a search result into a readable path, and the links
 * are what give a deep page a route back up that a crawler can follow.
 */
export const Breadcrumbs = ({ locale, trail }: BreadcrumbsProps) => (
  <>
    <JsonLd data={breadcrumbSchema(locale, trail)} />
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        {trail.map(({ name, path }, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={path} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="text-foreground/80" aria-current="page">
                  {name}
                </span>
              ) : (
                <>
                  <Link href={path || "/"} className="hover:text-foreground transition-colors">
                    {name}
                  </Link>
                  <ChevronRight aria-hidden className="h-3 w-3 text-white/20" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  </>
);
