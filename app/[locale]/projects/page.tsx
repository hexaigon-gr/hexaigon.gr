import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SHOWCASE_PROJECTS } from "@/lib/data/projects";
import { itemListSchema } from "@/lib/schema";
import { buildAlternates } from "@/lib/seo";
import { BasePageProps } from "@/types/page-props";

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("projectsTitle"),
    description: t("projectsDescription"),
    alternates: buildAlternates(locale, "/projects"),
    openGraph: {
      title: t("projectsTitle"),
      description: t("projectsDescription"),
    },
    twitter: {
      title: t("projectsTitle"),
      description: t("projectsDescription"),
    },
  };
};

const ProjectsPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Portfolio");
  const tService = await getTranslations("ServicePage");
  const projects = SHOWCASE_PROJECTS;

  return (
    <>
      <Navbar />
      <JsonLd
        data={itemListSchema(
          locale,
          projects.map((project) => ({
            name: project.title,
            path: `/projects/${project.slug}`,
          }))
        )}
      />
      <main className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <Breadcrumbs
            locale={locale}
            trail={[
              { name: tService("home"), path: "" },
              { name: t("caseStudies"), path: "/projects" },
            ]}
          />
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
