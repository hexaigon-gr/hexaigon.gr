import { getTranslations, setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { PROJECTS } from "@/lib/data/projects";
import { BasePageProps } from "@/types/page-props";

const ProjectsPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Portfolio");
  // Only projects whose screenshots have been captured (mockup generated)
  const projects = PROJECTS.filter((p) => p.mockupImage);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="border-t border-white/10 pt-6 mb-14">
            <p className="eyebrow mb-8">
              <span className="text-primary">{String(projects.length).padStart(2, "0")}</span>
              <span className="mx-2 text-white/20">/</span>
              {t("eyebrow")}
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              {t("allProjectsTitle")}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={(i % 2) * 100}>
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProjectsPage;
