import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { PROJECTS } from "@/lib/data/projects";
import { Link } from "@/lib/i18n/navigation";

const FEATURED_COUNT = 7;

export const PortfolioSection = async () => {
  const t = await getTranslations("Portfolio");
  const withMockups = PROJECTS.filter((p) => p.mockupImage);
  const featured = withMockups.slice(0, FEATURED_COUNT);
  const remaining = withMockups.length - featured.length;

  return (
    <section id="portfolio" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            index="03"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featured.map((project, i) => (
            <Reveal
              key={project.slug}
              delay={(i % 2) * 100}
              className={i === 0 ? "lg:col-span-2" : undefined}
            >
              <ProjectCard project={project} index={i} featured={i === 0} />
            </Reveal>
          ))}
        </div>

        {remaining > 0 && (
          <Reveal className="text-center mt-12">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 h-12 px-8 rounded-full border border-white/15 text-sm font-medium hover:bg-white/5 hover:border-white/30 transition-all duration-300"
            >
              {t("viewMore", { count: remaining })}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
};
