import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { SERVICES, servicePath } from "@/lib/data/services";
import { pick } from "@/lib/i18n/localized";
import { Link } from "@/lib/i18n/navigation";
import { itemListSchema } from "@/lib/schema";
import { buildAlternates } from "@/lib/seo";
import { BasePageProps } from "@/types/page-props";

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicePage" });

  return {
    title: t("hubMetaTitle"),
    description: t("hubMetaDescription"),
    alternates: buildAlternates(locale, "/services"),
    openGraph: {
      title: t("hubMetaTitle"),
      description: t("hubMetaDescription"),
    },
  };
};

/**
 * The hub exists so the nine service pages form a cluster with one obvious
 * entry point, rather than nine orphans hanging off the footer.
 */
const ServicesHubPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ServicePage");
  const tServices = await getTranslations("Services");

  return (
    <>
      <Navbar />
      <JsonLd
        data={itemListSchema(
          locale,
          SERVICES.map((service) => ({
            name: pick(service.h1, locale),
            path: servicePath(service, locale),
          }))
        )}
      />
      <main className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <Breadcrumbs
            locale={locale}
            trail={[
              { name: t("home"), path: "" },
              { name: t("hubTitle"), path: "/services" },
            ]}
          />

          <div className="border-t border-white/10 pt-6 mb-14">
            <p className="eyebrow mb-8">
              <span className="text-primary">
                {String(SERVICES.length).padStart(2, "0")}
              </span>
              <span className="mx-2 text-white/20">/</span>
              {t("hubEyebrow")}
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl text-balance">
              {t("hubTitle")}
            </h1>
            <p className="text-muted-foreground max-w-2xl mt-6 leading-relaxed">
              {t("hubDescription")}
            </p>
          </div>

          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10">
              {SERVICES.map((service, i) => {
                const Icon = service.icon;

                return (
                  <Link
                    key={service.key}
                    href={servicePath(service, locale)}
                    className="group relative bg-background p-8 sm:p-10 hover:bg-[oklch(0.11_0.01_250)] transition-colors duration-500"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="inline-flex p-3 rounded-xl border border-white/10 text-primary group-hover:border-primary/40 transition-all duration-500">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs text-white/20 group-hover:text-primary/70 transition-colors duration-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-3 tracking-tight">
                      {pick(service.h1, locale)}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tServices(`${service.key}.description` as "websites.description")}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 group-hover:text-primary transition-colors">
                      {tServices("viewService")}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </Reveal>

          <Reveal className="mt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
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
            </Link>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ServicesHubPage;
