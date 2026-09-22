import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqAccordion } from "@/components/faq-accordion";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { getProjectsByService } from "@/lib/data/projects";
import { getServiceBySlug, SERVICES, servicePath, servicePaths } from "@/lib/data/services";
import { pick } from "@/lib/i18n/localized";
import { Link } from "@/lib/i18n/navigation";
import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { buildAlternatesFor } from "@/lib/seo";

interface ServicePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/**
 * Both locales are enumerated here rather than read from the parent params, so
 * each locale is paired with the slug it actually owns — /el gets the Greek
 * slug, /en the English one.
 */
export const generateStaticParams = () =>
  SUPPORTED_LOCALES.flatMap((locale) =>
    SERVICES.map((service) => ({ locale, slug: service.slug[locale] }))
  );

export const generateMetadata = async ({
  params,
}: ServicePageProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug, locale);
  if (!service) return {};

  const title = pick(service.metaTitle, locale);
  const description = pick(service.metaDescription, locale);

  return {
    title,
    description,
    alternates: buildAlternatesFor(locale, servicePaths(service)),
    openGraph: { title, description, type: "website" },
    twitter: { title, description },
  };
};

const ServicePage = async ({ params }: ServicePageProps) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = getServiceBySlug(slug, locale);
  if (!service) notFound();

  const t = await getTranslations("ServicePage");
  const path = servicePath(service, locale);
  const heading = pick(service.h1, locale);
  const faq = service.faq.map(({ question, answer }) => ({
    question: pick(question, locale),
    answer: pick(answer, locale),
  }));
  const relatedProjects = getProjectsByService(service.key, 2);
  const otherServices = SERVICES.filter((entry) => entry.key !== service.key);

  return (
    <>
      <Navbar />
      <JsonLd
        data={serviceSchema({
          locale,
          name: heading,
          description: pick(service.metaDescription, locale),
          path,
        })}
      />
      <JsonLd data={faqSchema(faq)} />

      <main className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <Breadcrumbs
            locale={locale}
            trail={[
              { name: t("home"), path: "" },
              { name: t("hubTitle"), path: "/services" },
              { name: heading, path },
            ]}
          />

          {/* Hero */}
          <header className="border-t border-white/10 pt-6 mb-20">
            <p className="eyebrow mb-8">
              <span className="text-primary">
                {String(SERVICES.indexOf(service) + 1).padStart(2, "0")}
              </span>
              <span className="mx-2 text-white/20">/</span>
              {t("eyebrow")}
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl text-balance">
              {heading}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mt-6 leading-relaxed">
              {pick(service.intro, locale)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                href="/#contact"
                className="group inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-[0_0_32px_-8px] shadow-primary/60 hover:brightness-110 transition-all duration-300"
              >
                {t("cta")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full border border-white/15 text-sm font-medium hover:bg-white/5 hover:border-white/30 transition-all duration-300"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </header>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
            <div className="space-y-12">
              {service.sections.map((section) => (
                <Reveal key={pick(section.heading, locale)}>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 text-balance">
                    {pick(section.heading, locale)}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {pick(section.body, locale)}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Deliverables */}
            <Reveal delay={100}>
              <aside className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 lg:sticky lg:top-28">
                <p className="eyebrow mb-6">{t("includes")}</p>
                <ul className="space-y-4">
                  {pick(service.deliverables, locale).map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </Reveal>
          </div>

          {/* Proof */}
          {relatedProjects.length > 0 && (
            <section className="mt-24">
              <div className="border-t border-white/10 pt-6 mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {t("relatedProjects")}
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {relatedProjects.map((project, i) => (
                  <Reveal key={project.slug} delay={(i % 2) * 100}>
                    <ProjectCard project={project} index={i} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="mt-24">
            <div className="border-t border-white/10 pt-6 mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t("faqTitle")}
              </h2>
            </div>
            <FaqAccordion items={faq} />
          </section>

          {/* Cluster links */}
          <section className="mt-24">
            <div className="border-t border-white/10 pt-6 mb-8">
              <h2 className="text-lg font-semibold tracking-tight">
                {t("otherServices")}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {otherServices.map((entry) => (
                <Link
                  key={entry.key}
                  href={servicePath(entry, locale)}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:border-white/30 transition-colors"
                >
                  <entry.icon className="h-3.5 w-3.5 text-primary/70" />
                  {pick(entry.h1, locale)}
                </Link>
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

export default ServicePage;
