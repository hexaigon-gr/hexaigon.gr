import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { getProjectBySlug, SHOWCASE_PROJECTS } from "@/lib/data/projects";
import { getServicesByKeys, servicePath } from "@/lib/data/services";
import { pick } from "@/lib/i18n/localized";
import { Link } from "@/lib/i18n/navigation";
import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";
import { caseStudySchema } from "@/lib/schema";
import { buildAlternates } from "@/lib/seo";

interface CaseStudyPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const generateStaticParams = () =>
  SUPPORTED_LOCALES.flatMap((locale) =>
    SHOWCASE_PROJECTS.map((project) => ({ locale, slug: project.slug }))
  );

export const generateMetadata = async ({
  params,
}: CaseStudyPageProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.title} — ${pick(project.category, locale)}`;
  const description = pick(project.summary, locale);
  const image = project.mockupImage ?? project.desktopImage ?? project.mobileImage;

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/projects/${project.slug}`),
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: image, alt: title }],
    },
    twitter: { title, description, images: [image] },
  };
};

/**
 * One indexable page per project. Every card in the portfolio used to link
 * straight out to the client's domain, so twenty-one real builds produced
 * nothing a search engine could rank for us. This is that content.
 */
const CaseStudyPage = async ({ params }: CaseStudyPageProps) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProjectBySlug(slug);
  if (!project || !project.mockupImage) notFound();

  const t = await getTranslations("CaseStudy");
  const tServices = await getTranslations("ServicePage");
  const tPortfolio = await getTranslations("Portfolio");

  const category = pick(project.category, locale);
  const services = getServicesByKeys(project.serviceKeys);
  const cover = project.mockupImage ?? project.desktopImage ?? project.mobileImage;
  const isLive = project.live !== false;
  const moreProjects = SHOWCASE_PROJECTS.filter(
    (entry) => entry.slug !== project.slug
  ).slice(0, 2);

  return (
    <>
      <Navbar />
      <JsonLd
        data={caseStudySchema({
          locale,
          title: project.title,
          description: pick(project.summary, locale),
          path: `/projects/${project.slug}`,
          image: cover,
          clientUrl: isLive ? project.url : undefined,
          category,
        })}
      />

      <main className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <Breadcrumbs
            locale={locale}
            trail={[
              { name: tServices("home"), path: "" },
              { name: tPortfolio("caseStudies"), path: "/projects" },
              { name: project.title, path: `/projects/${project.slug}` },
            ]}
          />

          {/* Hero */}
          <header className="border-t border-white/10 pt-6 mb-12">
            <p className="eyebrow mb-8">{t("eyebrow")}</p>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-balance">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground mt-4">
              {services.length > 0
                ? t("lead", {
                    service: pick(services[0].h1, locale),
                    category: category.toLowerCase(),
                  })
                : category}
              {project.location && (
                <span className="text-muted-foreground/60">
                  {" — "}
                  {pick(project.location, locale)}
                </span>
              )}
            </p>
          </header>

          <Reveal className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={cover}
              alt={`${project.title} — ${category}`}
              fill
              priority
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="object-cover"
            />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-start mt-16">
            <div>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {pick(project.summary, locale)}
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-14 mb-6">
                {t("whatWeBuilt")}
              </h2>
              <ul className="space-y-4">
                {pick(project.highlights, locale).map((highlight) => (
                  <li key={highlight} className="flex gap-3 leading-relaxed">
                    <Check className="h-4 w-4 shrink-0 mt-1.5 text-primary" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facts */}
            <Reveal delay={100}>
              <aside className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 lg:sticky lg:top-28 space-y-6">
                <div>
                  <p className="eyebrow mb-2">{t("sector")}</p>
                  <p className="text-sm">{category}</p>
                </div>
                {project.location && (
                  <div>
                    <p className="eyebrow mb-2">{t("location")}</p>
                    <p className="text-sm">{pick(project.location, locale)}</p>
                  </div>
                )}
                {services.length > 0 && (
                  <div>
                    <p className="eyebrow mb-3">{t("relatedServices")}</p>
                    <div className="flex flex-wrap gap-2">
                      {services.map((service) => (
                        <Link
                          key={service.key}
                          href={servicePath(service, locale)}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:border-white/30 transition-colors"
                        >
                          <service.icon className="h-3 w-3 text-primary/70" />
                          {pick(service.h1, locale)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {isLive ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-full items-center justify-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all duration-300"
                  >
                    {t("visit")}
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground/70 leading-relaxed">
                    {t("offline")}
                  </p>
                )}
              </aside>
            </Reveal>
          </div>

          {/* More work */}
          <section className="mt-24">
            <div className="border-t border-white/10 pt-6 mb-10 flex items-baseline justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t("moreProjects")}
              </h2>
              <Link
                href="/projects"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {tPortfolio("viewAll")}
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {moreProjects.map((entry, i) => (
                <Reveal key={entry.slug} delay={(i % 2) * 100}>
                  <ProjectCard project={entry} index={i} />
                </Reveal>
              ))}
            </div>
          </section>

          {/* Closing CTA */}
          <Reveal className="mt-24 rounded-2xl border border-white/10 bg-white/[0.02] p-10 sm:p-14 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-balance">
              {t("ctaTitle")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              {t("ctaDescription")}
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-[0_0_32px_-8px] shadow-primary/60 hover:brightness-110 transition-all duration-300"
            >
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CaseStudyPage;
