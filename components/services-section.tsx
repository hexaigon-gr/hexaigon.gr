import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { servicePath,SERVICES } from "@/lib/data/services";
import { Link } from "@/lib/i18n/navigation";

/**
 * Nine cards, three per row, each linking to its own landing page. The links
 * are the point: they put every service page one click from the homepage, which
 * is how a crawler finds them and how the keyword pages inherit any authority
 * the homepage has.
 */
export const ServicesSection = async () => {
  const t = await getTranslations("Services");
  const locale = await getLocale();

  return (
    <section id="services" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            index="01"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>

        {/* Shared-hairline grid: one border system, engineering-table style */}
        <Reveal delay={100}>
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
                    <div className="inline-flex p-3 rounded-xl border border-white/10 text-primary group-hover:border-primary/40 group-hover:shadow-[0_0_24px_-6px] group-hover:shadow-primary/40 transition-all duration-500">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-white/20 group-hover:text-primary/70 transition-colors duration-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 tracking-tight">
                    {t(`${service.key}.title` as "websites.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${service.key}.description` as "websites.description")}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 group-hover:text-primary transition-colors">
                    {t("viewService")}
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
