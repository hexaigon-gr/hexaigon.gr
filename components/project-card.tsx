import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { getLocale } from "next-intl/server";

import { type Project } from "@/lib/data/projects";
import { cn } from "@/lib/general/utils";
import { pick } from "@/lib/i18n/localized";
import { Link } from "@/lib/i18n/navigation";

interface ProjectCardProps {
  project: Project;
  index: number;
  /** Featured cards span both grid columns on large screens */
  featured?: boolean;
}

/**
 * Links to our own case study rather than straight out to the client's domain.
 * Twenty-one outbound links from the homepage handed every bit of authority to
 * other domains and left nothing of ours for Google to index; the case study
 * keeps the visit here first and carries the outbound link itself.
 */
export const ProjectCard = async ({ project, index, featured = false }: ProjectCardProps) => {
  const locale = await getLocale();
  const cover = project.mockupImage ?? project.desktopImage ?? project.mobileImage;
  const category = pick(project.category, locale);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/30 transition-colors duration-500",
        featured && "lg:col-span-2"
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={cover}
          alt={`${project.title} — ${category}`}
          fill
          sizes={
            featured
              ? "(min-width: 1280px) 1152px, 100vw"
              : "(min-width: 1024px) 566px, 100vw"
          }
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
        {/* Legibility gradient for the info bar */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 via-40% to-transparent" />

        <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] text-white/70 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className={cn("font-semibold tracking-tight text-white", featured ? "text-xl sm:text-2xl" : "text-lg")}>
            {project.title}
          </h3>
          <p className="text-sm text-white/60 mt-0.5 truncate">
            {pick(project.description, locale)}
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm text-white/80 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground group-hover:rotate-45 transition-all duration-300">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
};
